package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

import com.example.demo.entity.SanPham;
import com.example.demo.repository.SanPhamRepository;

@Service
public class SanPhamService {

    @Autowired
    private SanPhamRepository sanPhamRepository;

    public List<SanPham> getAll() {
        return sanPhamRepository.findAll();
    }

    public Optional<SanPham> getById(Integer id) {
        return sanPhamRepository.findById(id);
    }

    public SanPham save(SanPham sanPham) {
        return sanPhamRepository.save(sanPham);
    }

    public void delete(Integer id) {
        sanPhamRepository.deleteById(id);
    }

    public List<SanPham> getByDanhMuc(Integer maDanhMuc) {
        return sanPhamRepository.findByDanhMucMaDanhMuc(maDanhMuc);
    }
}