package com.example.demo.service;

import com.example.demo.controller.request.NhapHangRequest;
import com.example.demo.entity.ChiTietPhieuNhap;
import com.example.demo.entity.ChiTietPhieuNhapId;
import com.example.demo.entity.NguyenLieu;
import com.example.demo.entity.NhanVien;
import com.example.demo.entity.NhanVienId;
import com.example.demo.entity.PhieuNhapKho;
import com.example.demo.repository.ChiTietPhieuNhapRepository;
import com.example.demo.repository.NguyenLieuRepository;
import com.example.demo.repository.NhanVienRepository;
import com.example.demo.repository.PhieuNhapKhoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class PhieuNhapKhoService {

    @Autowired
    private PhieuNhapKhoRepository phieuNhapKhoRepository;

    @Autowired
    private ChiTietPhieuNhapRepository chiTietPhieuNhapRepository;

    @Autowired
    private NguyenLieuRepository nguyenLieuRepository;

    @Autowired
    private NhanVienRepository nhanVienRepository;
    public List<PhieuNhapKho> getAll(Integer idRestaurant) {
        if (idRestaurant == null) idRestaurant = 1;
        return phieuNhapKhoRepository.findByIdRestaurantOrderByNgayNhapDesc(idRestaurant);
    }

    public Optional<Map<String, Object>> getDetail(Integer maPhieuNhap) {
        return phieuNhapKhoRepository.findById(maPhieuNhap).map(phieu -> {
            Map<String, Object> result = new HashMap<>();
            result.put("maPhieuNhap", phieu.getMaPhieuNhap());
            result.put("nhaCungCap", phieu.getNhaCungCap());
            result.put("maNhanVien", phieu.getMaNhanVien());
            if (phieu.getMaNhanVien() != null && phieu.getIdRestaurant() != null) {
                NhanVienId nvId = new NhanVienId(phieu.getMaNhanVien(), phieu.getIdRestaurant());
                nhanVienRepository.findById(nvId).ifPresent(nv -> {
                    result.put("tenNhanVien", nv.getTenNhanVien());
                    result.put("emailNhanVien", nv.getEmail());
                });
            }
            result.put("ngayNhap", phieu.getNgayNhap());
            result.put("tongTien", phieu.getTongTien());
            result.put("ghiChu", phieu.getGhiChu());
            result.put("idRestaurant", phieu.getIdRestaurant());

            List<ChiTietPhieuNhap> chiTiets = chiTietPhieuNhapRepository.findById_MaPhieuNhap(maPhieuNhap);
            List<Map<String, Object>> chiTietList = new ArrayList<>();
            for (ChiTietPhieuNhap ct : chiTiets) {
                Map<String, Object> item = new HashMap<>();
                item.put("maNguyenLieu", ct.getId().getMaNguyenLieu());
                item.put("soLuongNhap", ct.getSoLuongNhap());
                item.put("giaNhap", ct.getGiaNhap());
                item.put("ngayHetHan", ct.getNgayHetHan());
                item.put("thanhTien", ct.getSoLuongNhap().multiply(ct.getGiaNhap()));
                nguyenLieuRepository.findById(ct.getId().getMaNguyenLieu()).ifPresent(nl -> {
                    item.put("tenNguyenLieu", nl.getTenNguyenLieu());
                    item.put("donViTinh", nl.getDonViTinh());
                });
                chiTietList.add(item);
            }
            result.put("chiTiet", chiTietList);
            return result;
        });
    }

    @Transactional
    public void nhapHang(NhapHangRequest request) {
        // 0. Lấy thông tin nhân viên hiện tại từ SecurityContext (email trong JWT)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Người dùng chưa đăng nhập");
        }

        String email = authentication.getName();
        NhanVien nhanVien = nhanVienRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên với email: " + email));

        Integer maNhanVien = nhanVien.getId().getMaNhanVien();
        Integer idRestaurant = nhanVien.getId().getIdRestaurant();

        // 1. Find the NguyenLieu to be updated
        NguyenLieu nguyenLieu = nguyenLieuRepository.findById(request.getMaNguyenLieu())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nguyên liệu với mã: " + request.getMaNguyenLieu()));

        // 2. Create and save PhieuNhapKho
        PhieuNhapKho phieuNhapKho = new PhieuNhapKho();
        phieuNhapKho.setNhaCungCap(request.getNhaCungCap());
        phieuNhapKho.setMaNhanVien(maNhanVien);
        phieuNhapKho.setGhiChu(request.getGhiChu());
        phieuNhapKho.setNgayNhap(OffsetDateTime.now());
        phieuNhapKho.setTongTien(request.getGiaNhap().multiply(request.getSoLuongNhap()));
        phieuNhapKho.setIdRestaurant(idRestaurant);
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
