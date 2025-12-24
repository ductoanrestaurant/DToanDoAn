package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

import com.example.demo.entity.NguyenLieu;
import com.example.demo.repository.NguyenLieuRepository;

@Service
public class NguyenLieuService {

    @Autowired
    private NguyenLieuRepository nguyenLieuRepository;

    public List<NguyenLieu> getAll() {
        return nguyenLieuRepository.findAll();
    }

    public Optional<NguyenLieu> getById(Integer id) {
        return nguyenLieuRepository.findById(id);
    }

    public NguyenLieu save(NguyenLieu nguyenLieu) {
        return nguyenLieuRepository.save(nguyenLieu);
    }

    public void delete(Integer id) {
        nguyenLieuRepository.deleteById(id);
    }

    public List<NguyenLieu> getByRestaurant(Integer idRestaurant) {
        return nguyenLieuRepository.findByRestaurantIdRestaurant(idRestaurant);
    }

    public List<NguyenLieu> getByTrangThai(String trangThai) {
        return nguyenLieuRepository.findByTrangThai(trangThai);
    }
}

