package com.example.demo.service;

import com.example.demo.entity.ChiTietYeuCauDon;
import com.example.demo.entity.ChiTietYeuCauDonId;
import com.example.demo.repository.ChiTietYeuCauDonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.ArrayList;
import com.example.demo.dto.TopSanPhamDTO;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import java.math.BigDecimal;
import com.example.demo.entity.CongThuc;
import com.example.demo.entity.NguyenLieu;
import com.example.demo.repository.CongThucRepository;
import com.example.demo.repository.NguyenLieuRepository;

@Service
public class ChiTietYeuCauDonService {

    @Autowired
    private ChiTietYeuCauDonRepository chiTietYeuCauDonRepository;

    @Autowired
    private CongThucRepository congThucRepository;

    @Autowired
    private NguyenLieuRepository nguyenLieuRepository;

    public List<ChiTietYeuCauDon> saveAll(List<ChiTietYeuCauDon> chiTietYeuCauDons) {
        return chiTietYeuCauDonRepository.saveAll(chiTietYeuCauDons);
    }

    @Transactional
    public Optional<ChiTietYeuCauDon> updateTrangThai(
            Integer maDonHang,
            Integer idRestaurant,
            Integer maSanPham,
            String newTrangThai) {
        ChiTietYeuCauDonId id = new ChiTietYeuCauDonId(maDonHang, idRestaurant, maSanPham);
        Optional<ChiTietYeuCauDon> optionalChiTiet = chiTietYeuCauDonRepository.findById(id);

        if (optionalChiTiet.isPresent()) {
            ChiTietYeuCauDon chiTiet = optionalChiTiet.get();
            String trangThaiCu = chiTiet.getTrangThai();
            
            chiTiet.setTrangThai(newTrangThai);
            chiTiet.setUpdateTrangThaiAt(LocalDateTime.now());
            chiTietYeuCauDonRepository.save(chiTiet);
            
            // Tự động trừ kho (định lượng) khi món ăn chuyển sang trạng thái "hoàn thành"
            if ("hoàn thành".equalsIgnoreCase(newTrangThai) && 
                !"hoàn thành".equalsIgnoreCase(trangThaiCu)) {
                truKhoChoMonAn(maSanPham, chiTiet.getSoLuong(), idRestaurant);
            }
            
            return Optional.of(chiTiet);
        } else {
            return Optional.empty();
        }
    }

    private void truKhoChoMonAn(Integer maSanPham, Integer soLuongMon, Integer idRestaurant) {
        // Lấy danh sách nguyên liệu và định lượng của món ăn này
        List<CongThuc> congThucList = congThucRepository.findByMaSanPham(maSanPham);
        
        // Duyệt qua từng công thức
        for (CongThuc congThuc : congThucList) {
            Integer maNguyenLieu = congThuc.getMaNguyenLieu();
            
            // Tìm nguyên liệu trong kho
            NguyenLieu nguyenLieu = nguyenLieuRepository.findById(maNguyenLieu).orElse(null);
            
            if (nguyenLieu != null && nguyenLieu.getSoLuong() != null) {
                // Tính toán số lượng cần trừ = Định lượng 1 món * Số lượng khách gọi
                BigDecimal soLuongCanTru = congThuc.getSlNguyenLieu().multiply(new BigDecimal(soLuongMon));
                
                // Trừ đi và cập nhật
                BigDecimal soLuongMoi = nguyenLieu.getSoLuong().subtract(soLuongCanTru);
                
                // Đảm bảo không bị âm kho
                if (soLuongMoi.compareTo(BigDecimal.ZERO) < 0) {
                    soLuongMoi = BigDecimal.ZERO; 
                }
                
                nguyenLieu.setSoLuong(soLuongMoi);
                nguyenLieuRepository.save(nguyenLieu);
            }
        }
    }

    public List<TopSanPhamDTO> getTop5SanPhamBanChay() {
        Pageable topFive = PageRequest.of(0, 5);
        List<Object[]> results = chiTietYeuCauDonRepository.findTopSanPham(topFive);
        List<TopSanPhamDTO> topSanPhamList = new ArrayList<>();
        
        for (Object[] result : results) {
            Integer maSanPham = (Integer) result[0];
            String tenSanPham = (String) result[1];
            Long soLuotBan = ((Number) result[2]).longValue();
            Double saoDanhGia = ((Number) result[3]).doubleValue();
            
            topSanPhamList.add(new TopSanPhamDTO(maSanPham, tenSanPham, soLuotBan, saoDanhGia));
        }
        
        return topSanPhamList;
    }
}
