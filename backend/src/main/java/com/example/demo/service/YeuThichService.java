package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

import com.example.demo.entity.YeuThich;
import com.example.demo.entity.YeuThichId;
import com.example.demo.repository.YeuThichRepository;

@Service
public class YeuThichService {

    @Autowired
    private YeuThichRepository yeuThichRepository;

    public List<YeuThich> getAll() {
        return yeuThichRepository.findAll();
    }

    public Optional<YeuThich> getById(YeuThichId id) {
        return yeuThichRepository.findById(id);
    }

    public Optional<YeuThich> getById(Integer maTaiKhoan, Integer maSanPham) {
        YeuThichId yeuThichId = new YeuThichId(maTaiKhoan, maSanPham);
        return yeuThichRepository.findById(yeuThichId);
    }

    public YeuThich save(YeuThich yeuThich) {
        return yeuThichRepository.save(yeuThich);
    }

    public void delete(YeuThichId id) {
        yeuThichRepository.deleteById(id);
    }

    public void delete(Integer maTaiKhoan, Integer maSanPham) {
        YeuThichId yeuThichId = new YeuThichId(maTaiKhoan, maSanPham);
        yeuThichRepository.deleteById(yeuThichId);
    }

    public List<YeuThich> getByMaTaiKhoan(Integer maTaiKhoan) {
        return yeuThichRepository.findByMaTaiKhoan(maTaiKhoan);
    }

    public List<YeuThich> getByMaSanPham(Integer maSanPham) {
        return yeuThichRepository.findByMaSanPham(maSanPham);
    }
}

