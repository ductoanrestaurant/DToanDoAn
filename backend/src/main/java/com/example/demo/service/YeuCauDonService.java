package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

import com.example.demo.entity.YeuCauDon;
import com.example.demo.entity.YeuCauDonId;
import com.example.demo.repository.YeuCauDonRepository;

@Service
public class YeuCauDonService {

    @Autowired
    private YeuCauDonRepository yeuCauDonRepository;

    public List<YeuCauDon> getAll() {
        return yeuCauDonRepository.findAll();
    }

    public Optional<YeuCauDon> getById(YeuCauDonId id) {
        return yeuCauDonRepository.findById(id);
    }

    public Optional<YeuCauDon> getById(Integer maDonHang, Integer idRestaurant) {
        YeuCauDonId yeuCauDonId = new YeuCauDonId(maDonHang, idRestaurant);
        return yeuCauDonRepository.findById(yeuCauDonId);
    }

    public YeuCauDon save(YeuCauDon yeuCauDon) {
        return yeuCauDonRepository.save(yeuCauDon);
    }

    public void delete(YeuCauDonId id) {
        yeuCauDonRepository.deleteById(id);
    }

    public void delete(Integer maDonHang, Integer idRestaurant) {
        YeuCauDonId yeuCauDonId = new YeuCauDonId(maDonHang, idRestaurant);
        yeuCauDonRepository.deleteById(yeuCauDonId);
    }

    public List<YeuCauDon> getByIdRestaurant(Integer idRestaurant) {
        return yeuCauDonRepository.findByIdRestaurant(idRestaurant);
    }

    public List<YeuCauDon> getByMaTaiKhoan(Integer maTaiKhoan) {
        return yeuCauDonRepository.findByMaTaiKhoan(maTaiKhoan);
    }

    public List<YeuCauDon> getByTrangThaiThanhToan(String trangThai) {
        return yeuCauDonRepository.findByTrangThaiThanhToan(trangThai);
    }
}

