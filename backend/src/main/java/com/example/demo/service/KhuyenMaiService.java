package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

import com.example.demo.entity.KhuyenMai;
import com.example.demo.repository.KhuyenMaiRepository;

@Service
public class KhuyenMaiService {

    @Autowired
    private KhuyenMaiRepository khuyenMaiRepository;

    public List<KhuyenMai> getAll() {
        return khuyenMaiRepository.findAll();
    }

    public Optional<KhuyenMai> getById(Integer id) {
        return khuyenMaiRepository.findById(id);
    }

    public KhuyenMai save(KhuyenMai khuyenMai) {
        return khuyenMaiRepository.save(khuyenMai);
    }

    public void delete(Integer id) {
        khuyenMaiRepository.deleteById(id);
    }

    public List<KhuyenMai> getByMaSanPham(Integer maSanPham) {
        return khuyenMaiRepository.findByMaSanPham(maSanPham);
    }

    public List<KhuyenMai> getByTrangThai(String trangThai) {
        return khuyenMaiRepository.findByTrangThai(trangThai);
    }
}

