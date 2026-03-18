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
import java.util.ArrayList;
import com.example.demo.dto.TopSanPhamDTO;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

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
            String newTrangThai) {
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

    public List<TopSanPhamDTO> getTop5SanPhamBanChay() {
        Pageable topFive = PageRequest.of(0, 5);
        List<Object[]> results = chiTietYeuCauDonRepository.findTopSanPham(topFive);
        List<TopSanPhamDTO> topSanPhamList = new ArrayList<>();
        
        for (Object[] result : results) {
            Integer maSanPham = (Integer) result[0];
            String tenSanPham = (String) result[1];
            Long soLuotBan = ((Number) result[2]).longValue();
            Double saoDanhGia = ((Number) result[3]).doubleValue();
            
            topSanPhamList.add(new TopSanPhamDTO(maSanPham, tenSanPham, soLuotBan, saoDanhGia));
        }
        
        return topSanPhamList;
    }
}
