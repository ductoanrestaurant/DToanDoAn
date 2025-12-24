package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

import com.example.demo.entity.GiamGia;
import com.example.demo.repository.GiamGiaRepository;

@Service
public class GiamGiaService {

    @Autowired
    private GiamGiaRepository giamGiaRepository;

    public List<GiamGia> getAll() {
        return giamGiaRepository.findAll();
    }

    public Optional<GiamGia> getById(Integer id) {
        return giamGiaRepository.findById(id);
    }

    public Optional<GiamGia> getByCode(String code) {
        return giamGiaRepository.findByCode(code);
    }

    public GiamGia save(GiamGia giamGia) {
        return giamGiaRepository.save(giamGia);
    }

    public void delete(Integer id) {
        giamGiaRepository.deleteById(id);
    }
}

