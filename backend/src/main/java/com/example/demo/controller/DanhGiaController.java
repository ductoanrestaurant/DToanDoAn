package com.example.demo.controller;

import com.example.demo.entity.ChiTietYeuCauDon;
import com.example.demo.entity.DanhGia;
import com.example.demo.service.DanhGiaService;
import com.example.demo.service.KhachHangService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/danh-gia")
@CrossOrigin("*")
public class DanhGiaController {

    private final DanhGiaService danhGiaService;
    private final KhachHangService khachHangService;

    public DanhGiaController(DanhGiaService danhGiaService, KhachHangService khachHangService) {
        this.danhGiaService = danhGiaService;
        this.khachHangService = khachHangService;
    }

    // ── Public ────────────────────────────────────────────────────────────

    @GetMapping
    @PreAuthorize("permitAll()")
    public List<DanhGia> getAll() {
        return danhGiaService.getAll();
    }

    @GetMapping("/{maTaiKhoan}/{maSanPham}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<DanhGia> getById(
            @PathVariable Integer maTaiKhoan,
            @PathVariable Integer maSanPham) {
        return danhGiaService.getById(maTaiKhoan, maSanPham)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/san-pham/{maSanPham}")
    @PreAuthorize("permitAll()")
    public List<DanhGia> getByMaSanPham(@PathVariable Integer maSanPham) {
        return danhGiaService.getByMaSanPham(maSanPham);
    }

    // ── Khách hàng (USER) ─────────────────────────────────────────────────

    /** Lấy tất cả đánh giá của tôi */
    @GetMapping("/my-reviews")
    @PreAuthorize("hasRole('KHACH_HANG')")
    public ResponseEntity<List<DanhGia>> getMyReviews(@AuthenticationPrincipal Jwt jwt) {
        Integer maTaiKhoan = resolveMaTaiKhoan(jwt);
        if (maTaiKhoan == null)
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok(danhGiaService.getByMaTaiKhoan(maTaiKhoan));
    }

    /**
     * Lấy danh sách sản phẩm mà tôi đã dùng (trangThai='hoàn thành')
     * nhưng chưa đánh giá — dùng để hiện nút "Đánh giá" trên app.
     */
    @GetMapping("/can-danh-gia")
    @PreAuthorize("hasRole('KHACH_HANG')")
    public ResponseEntity<List<ChiTietYeuCauDon>> getSanPhamCanDanhGia(
            @AuthenticationPrincipal Jwt jwt) {
        Integer maTaiKhoan = resolveMaTaiKhoan(jwt);
        if (maTaiKhoan == null)
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok(danhGiaService.getSanPhamChuaDanhGia(maTaiKhoan));
    }

    /**
     * Lấy sản phẩm cần đánh giá trong một đơn hàng cụ thể.
     * Dùng khi khách bấm nút "Đánh giá" từ một đơn hàng cụ thể.
     *
     * GET /api/danh-gia/can-danh-gia/{maDonHang}/{idRestaurant}
     */
    @GetMapping("/can-danh-gia/{maDonHang}/{idRestaurant}")
    @PreAuthorize("hasRole('KHACH_HANG')")
    public ResponseEntity<List<ChiTietYeuCauDon>> getSanPhamCanDanhGiaByDon(
            @PathVariable Integer maDonHang,
            @PathVariable Integer idRestaurant,
            @AuthenticationPrincipal Jwt jwt) {
        Integer maTaiKhoan = resolveMaTaiKhoan(jwt);
        if (maTaiKhoan == null)
            return ResponseEntity.notFound().build();
        List<ChiTietYeuCauDon> result = danhGiaService.getSanPhamChuaDanhGiaByDon(maDonHang, idRestaurant, maTaiKhoan);
        return ResponseEntity.ok(result);
    }

    /**
     * Lấy TẤT CẢ sản phẩm hoàn thành trong đơn (kể cả đã đánh giá rồi).
     * Mobile dùng endpoint này để hiện danh sách đầy đủ,
     * đồng thời fetch /my-reviews để biết món nào đã được đánh giá → hiện disabled.
     *
     * GET /api/danh-gia/san-pham-hoan-thanh/{maDonHang}/{idRestaurant}
     */
    @GetMapping("/san-pham-hoan-thanh/{maDonHang}/{idRestaurant}")
    @PreAuthorize("hasRole('KHACH_HANG')")
    public ResponseEntity<List<ChiTietYeuCauDon>> getAllHoanThanhByDon(
            @PathVariable Integer maDonHang,
            @PathVariable Integer idRestaurant) {
        List<ChiTietYeuCauDon> result = danhGiaService.getAllHoanThanhByDon(maDonHang, idRestaurant);
        return ResponseEntity.ok(result);
    }


    /** Gửi đánh giá mới */
    @PostMapping
    @PreAuthorize("hasRole('KHACH_HANG')")
    public ResponseEntity<?> create(
            @RequestBody DanhGia danhGia,
            @AuthenticationPrincipal Jwt jwt) {

        Integer loggedInMaTaiKhoan = resolveMaTaiKhoan(jwt);
        if (loggedInMaTaiKhoan == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Token không hợp lệ hoặc người dùng không tồn tại.");
        }

        if (!loggedInMaTaiKhoan.equals(danhGia.getId().getMaTaiKhoan())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Bạn không có quyền tạo đánh giá cho người dùng khác.");
        }

        DanhGia saved = danhGiaService.save(danhGia);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // ── Helper ────────────────────────────────────────────────────────────

    private Integer resolveMaTaiKhoan(Jwt jwt) {
        String email = jwt.getSubject();
        return khachHangService.findMaTaiKhoanByEmail(email);
    }
}
