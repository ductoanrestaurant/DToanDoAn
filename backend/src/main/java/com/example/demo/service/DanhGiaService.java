package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

import com.example.demo.entity.ChiTietYeuCauDon;
import com.example.demo.entity.DanhGia;
import com.example.demo.entity.DanhGiaId;
import com.example.demo.repository.ChiTietYeuCauDonRepository;
import com.example.demo.repository.DanhGiaRepository;

@Service
public class DanhGiaService {

    @Autowired
    private DanhGiaRepository danhGiaRepository;

    @Autowired
    private ChiTietYeuCauDonRepository chiTietYeuCauDonRepository;

    public List<DanhGia> getAll() {
        return danhGiaRepository.findAll();
    }

    public Optional<DanhGia> getById(DanhGiaId id) {
        return danhGiaRepository.findById(id);
    }

    public Optional<DanhGia> getById(Integer maTaiKhoan, Integer maSanPham) {
        return danhGiaRepository.findById(new DanhGiaId(maTaiKhoan, maSanPham));
    }

    public DanhGia save(DanhGia danhGia) {
        return danhGiaRepository.save(danhGia);
    }

    public void delete(DanhGiaId id) {
        danhGiaRepository.deleteById(id);
    }

    public void delete(Integer maTaiKhoan, Integer maSanPham) {
        danhGiaRepository.deleteById(new DanhGiaId(maTaiKhoan, maSanPham));
    }

    public List<DanhGia> getByMaSanPham(Integer maSanPham) {
        return danhGiaRepository.findByMaSanPham(maSanPham);
    }

    public List<DanhGia> getByMaTaiKhoan(Integer maTaiKhoan) {
        return danhGiaRepository.findByMaTaiKhoan(maTaiKhoan);
    }

    /**
     * Lấy tất cả sản phẩm mà khách hàng đã dùng (trangThai='hoàn thành')
     * nhưng chưa đánh giá — dùng cho trang tổng hợp "cần đánh giá".
     */
    public List<ChiTietYeuCauDon> getSanPhamChuaDanhGia(Integer maTaiKhoan) {
        return chiTietYeuCauDonRepository.findChuaDanhGiaByKhachHang(maTaiKhoan);
    }

    /**
     * Lấy sản phẩm cần đánh giá trong một đơn hàng cụ thể.
     */
    public List<ChiTietYeuCauDon> getSanPhamChuaDanhGiaByDon(
            Integer maDonHang, Integer idRestaurant, Integer maTaiKhoan) {
        return chiTietYeuCauDonRepository.findChuaDanhGiaByDon(maDonHang, idRestaurant, maTaiKhoan);
    }

    /**
     * Lấy TẤT CẢ sản phẩm hoàn thành trong đơn (kể cả đã đánh giá).
     * Mobile dùng để hiện danh sách đầy đủ, tự mark disabled.
     */
    public List<ChiTietYeuCauDon> getAllHoanThanhByDon(Integer maDonHang, Integer idRestaurant) {
        return chiTietYeuCauDonRepository.findHoanThanhByDon(maDonHang, idRestaurant);
    }
}
