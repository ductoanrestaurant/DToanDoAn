package com.example.demo.controller;

import com.example.demo.controller.request.NhapHangRequest;
import com.example.demo.service.PhieuNhapKhoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/nhap-hang")
@CrossOrigin("*")
public class PhieuNhapKhoController {

    @Autowired
    private PhieuNhapKhoService phieuNhapKhoService;

    @GetMapping
    @PreAuthorize("hasAnyRole('QUAN_LY', 'THU_NGAN')")
    public ResponseEntity<List<?>> getAll(@RequestParam(required = false, defaultValue = "1") Integer idRestaurant) {
        return ResponseEntity.ok(phieuNhapKhoService.getAll(idRestaurant));
    }

    @GetMapping("/{maPhieuNhap}")
    @PreAuthorize("hasAnyRole('QUAN_LY', 'THU_NGAN')")
    public ResponseEntity<?> getDetail(@PathVariable Integer maPhieuNhap) {
        return phieuNhapKhoService.getDetail(maPhieuNhap)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('QUAN_LY')")
    public ResponseEntity<?> nhapHang(@RequestBody NhapHangRequest request) {
        try {
            phieuNhapKhoService.nhapHang(request);
            return ResponseEntity.ok().body("Nhập hàng thành công!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi nhập hàng: " + e.getMessage());
        }
    }
}
