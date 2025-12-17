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
}