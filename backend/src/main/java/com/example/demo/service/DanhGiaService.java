package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

import com.example.demo.entity.DanhGia;
import com.example.demo.entity.DanhGiaId;
import com.example.demo.repository.DanhGiaRepository;

@Service
public class DanhGiaService {

    @Autowired
    private DanhGiaRepository danhGiaRepository;

    public List<DanhGia> getAll() {
        return danhGiaRepository.findAll();
    }

    public Optional<DanhGia> getById(DanhGiaId id) {
        return danhGiaRepository.findById(id);
    }

    public Optional<DanhGia> getById(Integer maTaiKhoan, Integer maSanPham) {
        DanhGiaId danhGiaId = new DanhGiaId(maTaiKhoan, maSanPham);
        return danhGiaRepository.findById(danhGiaId);
    }

    public DanhGia save(DanhGia danhGia) {
        return danhGiaRepository.save(danhGia);
    }

    public void delete(DanhGiaId id) {
        danhGiaRepository.deleteById(id);
    }

    public void delete(Integer maTaiKhoan, Integer maSanPham) {
        DanhGiaId danhGiaId = new DanhGiaId(maTaiKhoan, maSanPham);
        danhGiaRepository.deleteById(danhGiaId);
    }

    public List<DanhGia> getByMaSanPham(Integer maSanPham) {
        return danhGiaRepository.findByMaSanPham(maSanPham);
    }

    public List<DanhGia> getByMaTaiKhoan(Integer maTaiKhoan) {
        return danhGiaRepository.findByMaTaiKhoan(maTaiKhoan);
    }
}

