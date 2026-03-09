package com.example.demo.service;

import com.example.demo.entity.ChiTietYeuCauDon;
import com.example.demo.entity.ChiTietYeuCauDonId;
import com.example.demo.repository.ChiTietYeuCauDonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ChiTietYeuCauDonService {

    @Autowired
    private ChiTietYeuCauDonRepository chiTietYeuCauDonRepository;

    public List<ChiTietYeuCauDon> saveAll(List<ChiTietYeuCauDon> chiTietYeuCauDons) {
        return chiTietYeuCauDonRepository.saveAll(chiTietYeuCauDons);
    }

    @Transactional
    public Optional<ChiTietYeuCauDon> updateTrangThai(
            Integer maDonHang,
            Integer idRestaurant,
            Integer maSanPham,
            String newTrangThai
    ) {
        ChiTietYeuCauDonId id = new ChiTietYeuCauDonId(maDonHang, idRestaurant, maSanPham);
        Optional<ChiTietYeuCauDon> optionalChiTiet = chiTietYeuCauDonRepository.findById(id);

        if (optionalChiTiet.isPresent()) {
            ChiTietYeuCauDon chiTiet = optionalChiTiet.get();
            chiTiet.setTrangThai(newTrangThai);
            chiTiet.setUpdateTrangThaiAt(LocalDateTime.now());
            chiTietYeuCauDonRepository.save(chiTiet);
            return Optional.of(chiTiet);
        } else {
            return Optional.empty();
        }
    }
}
