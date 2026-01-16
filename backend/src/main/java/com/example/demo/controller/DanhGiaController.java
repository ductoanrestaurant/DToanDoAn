package com.example.demo.controller;

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


    @GetMapping("/my-reviews")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<DanhGia>> getMyReviews(@AuthenticationPrincipal Jwt jwt) {
        String userEmail = jwt.getSubject();
        Integer maTaiKhoan = khachHangService.findMaTaiKhoanByEmail(userEmail);
        if (maTaiKhoan == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(danhGiaService.getByMaTaiKhoan(maTaiKhoan));
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> create(@RequestBody DanhGia danhGia, @AuthenticationPrincipal Jwt jwt) {

        String userEmail = jwt.getSubject();
        Integer loggedInUserMaTaiKhoan = khachHangService.findMaTaiKhoanByEmail(userEmail);

        if (loggedInUserMaTaiKhoan == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token không hợp lệ hoặc người dùng không tồn tại.");
        }


        Integer maTaiKhoanFromRequest = danhGia.getId().getMaTaiKhoan();


        if (!loggedInUserMaTaiKhoan.equals(maTaiKhoanFromRequest)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Bạn không có quyền tạo đánh giá cho người dùng khác.");
        }


        DanhGia savedDanhGia = danhGiaService.save(danhGia);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedDanhGia);
    }
}
