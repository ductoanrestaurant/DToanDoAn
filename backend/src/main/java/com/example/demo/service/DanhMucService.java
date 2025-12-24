package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

import com.example.demo.entity.DanhMuc;
import com.example.demo.repository.DanhMucRepository;

@Service
public class DanhMucService {

    @Autowired
    private DanhMucRepository danhMucRepository;

    public List<DanhMuc> getAll() {
        return danhMucRepository.findAll();
    }

    public Optional<DanhMuc> getById(Integer id) {
        return danhMucRepository.findById(id);
    }

    public DanhMuc save(DanhMuc danhMuc) {
        return danhMucRepository.save(danhMuc);
    }

    public void delete(Integer id) {
        danhMucRepository.deleteById(id);
    }

    public List<DanhMuc> getByTrangThai(String trangThai) {
        return danhMucRepository.findByTrangThai(trangThai);
    }

    public List<DanhMuc> searchByTen(String ten) {
        return danhMucRepository.findByTenDanhMucContainingIgnoreCase(ten);
    }
}

