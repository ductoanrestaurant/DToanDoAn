package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

import com.example.demo.entity.NhanVien;
import com.example.demo.entity.NhanVienId;
import com.example.demo.repository.NhanVienRepository;

@Service
public class NhanVienService {

    @Autowired
    private NhanVienRepository nhanVienRepository;

    public List<NhanVien> getAll() {
        return nhanVienRepository.findAll();
    }

    public Optional<NhanVien> getById(NhanVienId id) {
        return nhanVienRepository.findById(id);
    }

    public Optional<NhanVien> getById(Integer maNhanVien, Integer idRestaurant) {
        NhanVienId nhanVienId = new NhanVienId(maNhanVien, idRestaurant);
        return nhanVienRepository.findById(nhanVienId);
    }

    public NhanVien save(NhanVien nhanVien) {
        return nhanVienRepository.save(nhanVien);
    }

    public void delete(NhanVienId id) {
        nhanVienRepository.deleteById(id);
    }

    public void delete(Integer maNhanVien, Integer idRestaurant) {
        NhanVienId nhanVienId = new NhanVienId(maNhanVien, idRestaurant);
        nhanVienRepository.deleteById(nhanVienId);
    }

    public List<NhanVien> getByIdRestaurant(Integer idRestaurant) {
        return nhanVienRepository.findByIdRestaurant(idRestaurant);
    }

    public List<NhanVien> getByMaVaiTro(Integer maVaiTro) {
        return nhanVienRepository.findByMaVaiTro(maVaiTro);
    }
}

