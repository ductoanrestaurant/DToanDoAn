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

// DTO for Change Password Request
class ChangePasswordRequest {
    private Integer maTaiKhoan;
    private String oldPassword;
    private String newPassword;

    // Getters and Setters
    public Integer getMaTaiKhoan() { return maTaiKhoan; }
    public void setMaTaiKhoan(Integer maTaiKhoan) { this.maTaiKhoan = maTaiKhoan; }
    public String getOldPassword() { return oldPassword; }
    public void setOldPassword(String oldPassword) { this.oldPassword = oldPassword; }
    public String getNewPassword() { return newPassword; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
}


@RestController
@RequestMapping("/api/khach-hang")
@CrossOrigin(origins = "*")
public class KhachHangController {

    @Autowired
    private KhachHangService khachHangService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public List<KhachHang> getAll() {
        return khachHangService.layTatCaKhachHang();
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<KhachHang> getById(@PathVariable Integer id) {
        return khachHangService.layTheoId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/sdt/{sdt}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<KhachHang> getBySdt(@PathVariable String sdt) {
        return khachHangService.findBySdt(sdt)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<KhachHang> create(@RequestBody RegisterRequest request) {
        try {
            KhachHang savedKhachHang = khachHangService.register(request);
            return ResponseEntity.ok(savedKhachHang);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
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

    @PutMapping("/change-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        try {
            boolean success = khachHangService.changePassword(
                request.getMaTaiKhoan(),
                request.getOldPassword(),
                request.getNewPassword()
            );

            if (success) {
                return ResponseEntity.ok().body(Map.of("message", "Đổi mật khẩu thành công."));
            } else {
                return ResponseEntity.status(401).body(Map.of("error", "Mật khẩu hiện tại không đúng."));
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/email")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateEmail(@PathVariable Integer id, @RequestBody Map<String, String> request) {
        String newEmail = request.get("email");
        if (newEmail == null || newEmail.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email không được để trống."));
        }

        try {
            KhachHang updatedKhachHang = khachHangService.updateEmail(id, newEmail);
            return ResponseEntity.ok(updatedKhachHang);
        } catch (IllegalArgumentException e) {
            // Check for specific error messages from the service
            if (e.getMessage().contains("Email đã được sử dụng")) {
                return ResponseEntity.status(409).body(Map.of("error", e.getMessage())); // 409 Conflict
            }
            return ResponseEntity.notFound().build(); // Or another appropriate error
        }
    }


    // --- API cho điểm tích lũy ---

    @GetMapping("/{id}/diem")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Double>> getDiemTichLuy(@PathVariable Integer id) {
        Double diem = khachHangService.getDiemTichLuy(id);
        Map<String, Double> response = new HashMap<>();
        response.put("diemTichLuy", diem);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/cong-diem")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<KhachHang> congDiem(@PathVariable Integer id, @RequestBody Map<String, Double> request) {
        Double soDiem = request.get("diem");
        if (soDiem == null || soDiem <= 0) {
            return ResponseEntity.badRequest().build();
        }
        try {
            KhachHang updatedKhachHang = khachHangService.congDiem(id, soDiem);
            return ResponseEntity.ok(updatedKhachHang);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/tru-diem")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<KhachHang> truDiem(@PathVariable Integer id, @RequestBody Map<String, Double> request) {
        Double soDiem = request.get("diem");
        if (soDiem == null || soDiem <= 0) {
            return ResponseEntity.badRequest().build();
        }
        try {
            KhachHang updatedKhachHang = khachHangService.truDiem(id, soDiem);
            return ResponseEntity.ok(updatedKhachHang);
        } catch (IllegalArgumentException e) {
            if (e.getMessage().contains("không đủ")) {
                return ResponseEntity.badRequest().body(null);
            }
            return ResponseEntity.notFound().build();
        }
    }
}
