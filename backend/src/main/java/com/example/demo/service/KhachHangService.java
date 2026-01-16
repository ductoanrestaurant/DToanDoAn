package com.example.demo.service;

import com.example.demo.controller.RegisterRequest;
import com.example.demo.entity.KhachHang;
import com.example.demo.repository.KhachHangRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class KhachHangService {

    private final KhachHangRepository khachHangRepository;
    private final PasswordEncoder passwordEncoder;

    public KhachHangService(KhachHangRepository khachHangRepository, PasswordEncoder passwordEncoder) {
        this.khachHangRepository = khachHangRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public KhachHang register(RegisterRequest request) {
        if (khachHangRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email đã tồn tại");
        }

        KhachHang newKhachHang = new KhachHang();
        newKhachHang.setHoTen(request.hoTen());
        newKhachHang.setEmail(request.email());
        newKhachHang.setMatKhau(passwordEncoder.encode(request.password())); // Mã hóa mật khẩu
        newKhachHang.setSdt(request.sdt());
        newKhachHang.setDiachi(request.diachi());
        // Set default values for other fields if necessary
        // newKhachHang.setIdRestaurant(1); 

        return khachHangRepository.save(newKhachHang);
    }

    @Transactional(readOnly = true)
    public Optional<KhachHang> findByEmail(String email) {
        return khachHangRepository.findByEmail(email);
    }

    @Transactional(readOnly = true)
    public List<KhachHang> layTatCaKhachHang() {
        return khachHangRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<KhachHang> layTheoId(Integer id) {
        return khachHangRepository.findById(id);
    }

    @Transactional
    public KhachHang luuKhachHang(KhachHang khachHang) {
        return khachHangRepository.save(khachHang);
    }

    @Transactional
    public void xoaKhachHang(Integer id) {
        khachHangRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public boolean kiemTraEmailTonTai(String email) {
        return khachHangRepository.existsByEmail(email);
    }

    @Transactional(readOnly = true)
    public boolean kiemTraSdtTonTai(String sdt) {
        return khachHangRepository.existsBySdt(sdt);
    }

    @Transactional(readOnly = true)
    public Integer findMaTaiKhoanByEmail(String email) {
        return khachHangRepository.findByEmail(email)
                .map(KhachHang::getMaTaiKhoan)
                .orElse(null);
    }
}
