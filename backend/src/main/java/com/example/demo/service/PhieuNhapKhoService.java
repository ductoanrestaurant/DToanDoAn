package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.time.LocalDate;

import com.example.demo.entity.PhieuNhapKho;
import com.example.demo.repository.PhieuNhapKhoRepository;

@Service
public class PhieuNhapKhoService {

    @Autowired
    private PhieuNhapKhoRepository phieuNhapKhoRepository;

    public List<PhieuNhapKho> getAll() {
        return phieuNhapKhoRepository.findAll();
    }

    public Optional<PhieuNhapKho> getById(Integer id) {
        return phieuNhapKhoRepository.findById(id);
    }

    public PhieuNhapKho save(PhieuNhapKho phieuNhapKho) {
        return phieuNhapKhoRepository.save(phieuNhapKho);
    }

    public void delete(Integer id) {
        phieuNhapKhoRepository.deleteById(id);
    }

    public List<PhieuNhapKho> getByIdRestaurant(Integer idRestaurant) {
        return phieuNhapKhoRepository.findByIdRestaurant(idRestaurant);
    }

    public List<PhieuNhapKho> getByNgayNhap(LocalDate ngayNhap) {
        return phieuNhapKhoRepository.findByNgayNhap(ngayNhap);
    }

    public List<PhieuNhapKho> getByMaNhanVien(Integer maNhanVien) {
        return phieuNhapKhoRepository.findByMaNhanVien(maNhanVien);
    }
}

