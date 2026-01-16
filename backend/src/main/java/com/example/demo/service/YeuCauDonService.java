package com.example.demo.service;

import com.example.demo.dto.YeuCauDonRequest;
import com.example.demo.entity.ChiTietYeuCauDon;
import com.example.demo.entity.ChiTietYeuCauDonId;
import com.example.demo.entity.YeuCauDon;
import com.example.demo.entity.YeuCauDonId;
import com.example.demo.repository.YeuCauDonRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class YeuCauDonService {

    @Autowired
    private YeuCauDonRepository yeuCauDonRepository;

    @Autowired
    private ChiTietYeuCauDonService chiTietYeuCauDonService;

    public List<YeuCauDon> getAll() {
        return yeuCauDonRepository.findAll();
    }

    public Optional<YeuCauDon> getById(YeuCauDonId id) {
        return yeuCauDonRepository.findById(id);
    }

    public Optional<YeuCauDon> getById(Integer maDonHang, Integer idRestaurant) {
        YeuCauDonId yeuCauDonId = new YeuCauDonId(maDonHang, idRestaurant);
        return yeuCauDonRepository.findById(yeuCauDonId);
    }

    public YeuCauDon save(YeuCauDon yeuCauDon) {
        return yeuCauDonRepository.save(yeuCauDon);
    }

    @Transactional
    public YeuCauDon createYeuCauDon(YeuCauDonRequest request) {
        YeuCauDon yeuCauDon = request.getYeuCauDon();
        List<ChiTietYeuCauDon> chiTietList = request.getChiTietYeuCauDon();

        // 1. Lấy idRestaurant từ yêu cầu
        Integer idRestaurant = yeuCauDon.getId().getIdRestaurant();

        // 2. Tạo mã đơn hàng mới
        Integer maxMaDonHang = yeuCauDonRepository.findMaxMaDonHangByIdRestaurant(idRestaurant).orElse(0);
        Integer newMaDonHang = maxMaDonHang + 1;

        // 3. Thiết lập ID và ngày tạo cho YeuCauDon
        YeuCauDonId yeuCauDonId = new YeuCauDonId(newMaDonHang, idRestaurant);
        yeuCauDon.setId(yeuCauDonId);
        yeuCauDon.setNgayTaoDon(LocalDateTime.now());

        // 4. Lưu YeuCauDon để lấy được ID
        YeuCauDon savedYeuCauDon = yeuCauDonRepository.save(yeuCauDon);

        // 5. Thiết lập ID cho từng ChiTietYeuCauDon và lưu chúng
        for (ChiTietYeuCauDon chiTiet : chiTietList) {
            ChiTietYeuCauDonId chiTietId = new ChiTietYeuCauDonId(
                newMaDonHang,
                idRestaurant,
                chiTiet.getId().getMaSanPham()
            );
            chiTiet.setId(chiTietId);
        }
        chiTietYeuCauDonService.saveAll(chiTietList);

        return savedYeuCauDon;
    }


    public void delete(YeuCauDonId id) {
        yeuCauDonRepository.deleteById(id);
    }

    public void delete(Integer maDonHang, Integer idRestaurant) {
        YeuCauDonId yeuCauDonId = new YeuCauDonId(maDonHang, idRestaurant);
        yeuCauDonRepository.deleteById(yeuCauDonId);
    }

    public List<YeuCauDon> getByIdRestaurant(Integer idRestaurant) {
        return yeuCauDonRepository.findByIdRestaurant(idRestaurant);
    }

    public List<YeuCauDon> getByMaTaiKhoan(Integer maTaiKhoan) {
        return yeuCauDonRepository.findByMaTaiKhoan(maTaiKhoan);
    }

    public List<YeuCauDon> getByTrangThaiThanhToan(String trangThai) {
        return yeuCauDonRepository.findByTrangThaiThanhToan(trangThai);
    }
}
