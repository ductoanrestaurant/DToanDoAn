package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

import com.example.demo.entity.TonKho;
import com.example.demo.entity.TonKhoId;
import com.example.demo.repository.TonKhoRepository;

@Service
public class TonKhoService {

    @Autowired
    private TonKhoRepository tonKhoRepository;

    public List<TonKho> getAll() {
        return tonKhoRepository.findAll();
    }

    public Optional<TonKho> getById(TonKhoId id) {
        return tonKhoRepository.findById(id);
    }

    public Optional<TonKho> getById(Integer maNguyenLieu, Integer idRestaurant) {
        TonKhoId tonKhoId = new TonKhoId(maNguyenLieu, idRestaurant);
        return tonKhoRepository.findById(tonKhoId);
    }

    public TonKho save(TonKho tonKho) {
        return tonKhoRepository.save(tonKho);
    }

    public void delete(TonKhoId id) {
        tonKhoRepository.deleteById(id);
    }

    public void delete(Integer maNguyenLieu, Integer idRestaurant) {
        TonKhoId tonKhoId = new TonKhoId(maNguyenLieu, idRestaurant);
        tonKhoRepository.deleteById(tonKhoId);
    }

    public List<TonKho> getByIdRestaurant(Integer idRestaurant) {
        return tonKhoRepository.findByIdRestaurant(idRestaurant);
    }

    public List<TonKho> getByMaNguyenLieu(Integer maNguyenLieu) {
        return tonKhoRepository.findByMaNguyenLieu(maNguyenLieu);
    }
}

