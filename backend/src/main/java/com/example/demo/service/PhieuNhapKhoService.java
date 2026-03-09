package com.example.demo.service;

import com.example.demo.controller.request.NhapHangRequest;
import com.example.demo.entity.ChiTietPhieuNhap;
import com.example.demo.entity.NguyenLieu;
import com.example.demo.entity.PhieuNhapKho;
import com.example.demo.entity.ChiTietPhieuNhapId;
import com.example.demo.repository.ChiTietPhieuNhapRepository;
import com.example.demo.repository.NguyenLieuRepository;
import com.example.demo.repository.PhieuNhapKhoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class PhieuNhapKhoService {

    @Autowired
    private PhieuNhapKhoRepository phieuNhapKhoRepository;

    @Autowired
    private ChiTietPhieuNhapRepository chiTietPhieuNhapRepository;

    @Autowired
    private NguyenLieuRepository nguyenLieuRepository;

    @Transactional
    public void nhapHang(NhapHangRequest request) {
        // 1. Find the NguyenLieu to be updated
        NguyenLieu nguyenLieu = nguyenLieuRepository.findById(request.getMaNguyenLieu())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nguyên liệu với mã: " + request.getMaNguyenLieu()));

        // 2. Create and save PhieuNhapKho
        PhieuNhapKho phieuNhapKho = new PhieuNhapKho();
        phieuNhapKho.setNhaCungCap(request.getNhaCungCap());
        phieuNhapKho.setMaNhanVien(request.getMaNhanVien());
        phieuNhapKho.setGhiChu(request.getGhiChu());
        phieuNhapKho.setTongTien(request.getGiaNhap().multiply(request.getSoLuongNhap()));
        // Assuming restaurant ID 1 for now
        phieuNhapKho.setIdRestaurant(1);
        PhieuNhapKho savedPhieuNhapKho = phieuNhapKhoRepository.save(phieuNhapKho);

        // 3. Create and save ChiTietPhieuNhap
        ChiTietPhieuNhap chiTiet = new ChiTietPhieuNhap();
        ChiTietPhieuNhapId chiTietId = new ChiTietPhieuNhapId(savedPhieuNhapKho.getMaPhieuNhap(), nguyenLieu.getMaNguyenLieu());
        chiTiet.setId(chiTietId);
        chiTiet.setSoLuongNhap(request.getSoLuongNhap());
        chiTiet.setGiaNhap(request.getGiaNhap());
        chiTiet.setNgayHetHan(request.getNgayHetHan());
        chiTietPhieuNhapRepository.save(chiTiet);

        // 4. Update the quantity in NguyenLieu
        BigDecimal currentSoLuong = nguyenLieu.getSoLuong() != null ? nguyenLieu.getSoLuong() : BigDecimal.ZERO;
        nguyenLieu.setSoLuong(currentSoLuong.add(request.getSoLuongNhap()));
        nguyenLieuRepository.save(nguyenLieu);
    }
}
