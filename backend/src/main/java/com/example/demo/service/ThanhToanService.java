package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

import com.example.demo.entity.ThanhToan;
import com.example.demo.repository.ThanhToanRepository;

@Service
public class ThanhToanService {

    @Autowired
    private ThanhToanRepository thanhToanRepository;

    public List<ThanhToan> getAll() {
        return thanhToanRepository.findAll();
    }

    public Optional<ThanhToan> getById(Integer id) {
        return thanhToanRepository.findById(id);
    }

    public ThanhToan save(ThanhToan thanhToan) {
        return thanhToanRepository.save(thanhToan);
    }

    public void delete(Integer id) {
        thanhToanRepository.deleteById(id);
    }
}

