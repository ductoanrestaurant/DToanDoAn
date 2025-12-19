package com.example.demo.controller;

import com.example.demo.entity.KhachHang;
import com.example.demo.service.KhachHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/api/khach-hang")
// Quan trọng: Cho phép React Native/Frontend truy cập API
@CrossOrigin(origins = "*") 
public class KhachHangController {

    @Autowired
    private KhachHangService khachHangService;

    // 1. Lấy toàn bộ danh sách
    @GetMapping
    public List<KhachHang> getAll() {
        return khachHangService.layTatCaKhachHang();
    }

    // 2. Lấy chi tiết 1 khách hàng theo ID
    @GetMapping("/{id}")
    public ResponseEntity<KhachHang> getById(@PathVariable Integer id) {
        return khachHangService.layTheoId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. Thêm mới khách hàng (Đăng ký)
    @PostMapping
    public KhachHang create(@RequestBody KhachHang khachHang) {
        return khachHangService.luuKhachHang(khachHang);
    }

    // 4. Cập nhật thông tin khách hàng
    @PutMapping("/{id}")
    public ResponseEntity<KhachHang> update(@PathVariable Integer id, @RequestBody KhachHang details) {
        return khachHangService.layTheoId(id).map(kh -> {
            kh.setHoTen(details.getHoTen());
            kh.setEmail(details.getEmail());
            kh.setSdt(details.getSdt());
            kh.setDiachi(details.getDiachi());
            kh.setAvatar(details.getAvatar());
            // Cập nhật các trường khác nếu cần
            return ResponseEntity.ok(khachHangService.luuKhachHang(kh));
        }).orElse(ResponseEntity.notFound().build());
    }

    // 5. Xóa khách hàng
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (khachHangService.layTheoId(id).isPresent()) {
            khachHangService.xoaKhachHang(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // 6. Kiểm tra email tồn tại
    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestParam String email) {
        // Gọi thông qua instance service đã được tiêm (injected)
        boolean exists = khachHangService.kiemTraEmailTonTai(email);
    
        HashMap<String, Object> response = new HashMap<>();
        response.put("exists", exists);
        response.put("message", exists ? "Email đã tồn tại" : "Email hợp lệ");
    
        return ResponseEntity.ok(response);
    }
}