package com.example.demo.controller;

import com.example.demo.entity.KhachHang;
import com.example.demo.entity.NhanVien;
import com.example.demo.service.JwtService;
import com.example.demo.service.KhachHangService;
import com.example.demo.service.NhanVienService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@Slf4j
public class AuthController {

    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final KhachHangService khachHangService;
    private final NhanVienService nhanVienService;

    public AuthController(JwtService jwtService, AuthenticationManager authenticationManager, KhachHangService khachHangService, NhanVienService nhanVienService) {
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.khachHangService = khachHangService;
        this.nhanVienService = nhanVienService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.email(), loginRequest.password())
        );

        String token = jwtService.generateToken(authentication);

        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("");

        String clientType = loginRequest.clientType();

        if ("KHACH_HANG".equals(role)) {
            if (!"app".equalsIgnoreCase(clientType)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Khách hàng chỉ được phép đăng nhập vào ứng dụng di động."));
            }
            KhachHang khachHang = khachHangService.findByEmail(loginRequest.email())
                    .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng với email: " + loginRequest.email()));
            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "maTaiKhoan", khachHang.getMaTaiKhoan(),
                    "tenKhachHang", khachHang.getHoTen(),
                    "role", "KHACH_HANG"
            ));
        } else {
            NhanVien nhanVien = nhanVienService.findByEmail(loginRequest.email())
                    .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy nhân viên với email: " + loginRequest.email()));
            String nhanVienRole = nhanVien.getVaiTro().getTenVaiTro();

            if ("app".equalsIgnoreCase(clientType)) {
                if (!"QUAN_LY".equals(nhanVienRole) && !"THU_NGAN".equals(nhanVienRole)) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Vai trò của bạn không được phép đăng nhập vào ứng dụng di động."));
                }
            } else if ("web".equalsIgnoreCase(clientType)) {
                if (!"QUAN_LY".equals(nhanVienRole) && !"THU_NGAN".equals(nhanVienRole) && !"BEP".equals(nhanVienRole)) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Vai trò của bạn không được phép đăng nhập vào ứng dụng web."));
                }
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "Loại client không hợp lệ."));
            }

            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "maNhanVien", nhanVien.getId().getMaNhanVien(),
                    "tenNhanVien", nhanVien.getTenNhanVien(),
                    "role", nhanVienRole
            ));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        try {
            KhachHang registeredUser = khachHangService.register(registerRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Đăng ký thành công cho email: " + registeredUser.getEmail()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Đã có lỗi xảy ra trong quá trình đăng ký."));
        }
    }
}
