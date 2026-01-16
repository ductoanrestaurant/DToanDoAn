package com.example.demo.service;

import com.example.demo.entity.ChiTietYeuCauDon;
import com.example.demo.repository.ChiTietYeuCauDonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChiTietYeuCauDonService {

    @Autowired
    private ChiTietYeuCauDonRepository chiTietYeuCauDonRepository;

    public List<ChiTietYeuCauDon> saveAll(List<ChiTietYeuCauDon> chiTietYeuCauDons) {
        return chiTietYeuCauDonRepository.saveAll(chiTietYeuCauDons);
    }
}
