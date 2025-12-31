package com.example.demo.controller;

import com.example.demo.entity.KhachHang;
import com.example.demo.service.KhachHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

import java.util.Map;

@RestController
@RequestMapping("/api/khach-hang")
@CrossOrigin(origins = "*")
public class KhachHangController {

    @Autowired
    private KhachHangService khachHangService;

    @GetMapping
    public List<KhachHang> getAll() {
        return khachHangService.layTatCaKhachHang();
    }

    @GetMapping("/{id}")
    public ResponseEntity<KhachHang> getById(@PathVariable Integer id) {
        return khachHangService.layTheoId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody KhachHang khachHang) {
        if (khachHangService.kiemTraEmailTonTai(khachHang.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email này đã được sử dụng."));
        }
        // You should add a similar check for the phone number here before saving
        try {
            return ResponseEntity.ok(khachHangService.luuKhachHang(khachHang));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Lỗi khi đăng ký: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<KhachHang> update(@PathVariable Integer id, @RequestBody KhachHang details) {
        return khachHangService.layTheoId(id).map(kh -> {
            kh.setHoTen(details.getHoTen());
            kh.setEmail(details.getEmail());
            kh.setSdt(details.getSdt());
            kh.setDiachi(details.getDiachi());
            kh.setAvatar(details.getAvatar());
            return ResponseEntity.ok(khachHangService.luuKhachHang(kh));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (khachHangService.layTheoId(id).isPresent()) {
            khachHangService.xoaKhachHang(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestParam String email) {
        boolean exists = khachHangService.kiemTraEmailTonTai(email);
        HashMap<String, Object> response = new HashMap<>();
        response.put("exists", exists);
        response.put("message", exists ? "Email đã tồn tại" : "Email hợp lệ");
        return ResponseEntity.ok(response);
    }

    // Add this new endpoint to check for phone number
    @GetMapping("/check-phone")
    public ResponseEntity<?> checkPhone(@RequestParam("sdt") String phoneNumber) {
        // You will need to implement kiemTraSdtTonTai in your KhachHangService
        boolean exists = khachHangService.kiemTraSdtTonTai(phoneNumber);
        HashMap<String, Object> response = new HashMap<>();
        response.put("exists", exists);
        response.put("message", exists ? "Số điện thoại đã tồn tại" : "Số điện thoại hợp lệ");
        return ResponseEntity.ok(response);
    }
}
