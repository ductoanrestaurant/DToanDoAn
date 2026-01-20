package com.example.demo.controller;

import com.example.demo.entity.KhachHang;
import com.example.demo.service.KhachHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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




    @PutMapping("/{id}")
    @PreAuthorize("hasRole('QUAN_LY')")
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
    @PreAuthorize("hasRole('QUAN_LY')")
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


    @GetMapping("/check-phone")
    public ResponseEntity<?> checkPhone(@RequestParam("sdt") String phoneNumber) {
        boolean exists = khachHangService.kiemTraSdtTonTai(phoneNumber);
        HashMap<String, Object> response = new HashMap<>();
        response.put("exists", exists);
        response.put("message", exists ? "Số điện thoại đã tồn tại" : "Số điện thoại hợp lệ");
        return ResponseEntity.ok(response);
    }
}
