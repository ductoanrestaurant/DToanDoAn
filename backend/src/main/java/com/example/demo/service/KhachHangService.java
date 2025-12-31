package com.example.demo.service;

import com.example.demo.entity.KhachHang;
import com.example.demo.repository.KhachHangRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class KhachHangService {

    @Autowired
    private KhachHangRepository khachHangRepository;

    public List<KhachHang> layTatCaKhachHang() {
        return khachHangRepository.findAll();
    }

    public Optional<KhachHang> layTheoId(Integer id) {
        return khachHangRepository.findById(id);
    }

    public KhachHang luuKhachHang(KhachHang kh) {
        return khachHangRepository.save(kh);
    }

    public void xoaKhachHang(Integer id) {
        khachHangRepository.deleteById(id);
    }

    public void registerNewCustomer(KhachHang kh) {
        if (khachHangRepository.existsByEmail(kh.getEmail())) {
            throw new RuntimeException("Email này đã được đăng ký hệ thống!");
        }
        // You should also check for the phone number here
        if (khachHangRepository.existsBySdt(kh.getSdt())) {
            throw new RuntimeException("Số điện thoại này đã được đăng ký!");
        }
        khachHangRepository.save(kh);
    }

    public boolean kiemTraEmailTonTai(String email) {
        return khachHangRepository.existsByEmail(email);
    }

    public boolean kiemTraSdtTonTai(String sdt) {
        return khachHangRepository.existsBySdt(sdt);
    }
}
