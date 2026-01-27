package com.example.demo.service;

import com.example.demo.entity.Ban;
import com.example.demo.entity.BanId;
import com.example.demo.repository.BanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BanService {

    @Autowired
    private BanRepository banRepository;

    public List<Ban> layTatCaBan() {
        return banRepository.findAllOrderByMaBanAsc();
    }

    public Optional<Ban> layTheoId(BanId id) {
        return banRepository.findById(id);
    }

    public Optional<Ban> layTheoId(Integer maBan, Integer idRestaurant) {
        BanId banId = new BanId(maBan, idRestaurant);
        return banRepository.findById(banId);
    }

    public List<Ban> layBanTheoRestaurant(Integer idRestaurant) {
        return banRepository.findById_IdRestaurantOrderByMaBanAsc(idRestaurant);
    }

    public Ban luuBan(Ban ban) {
        BanId id = ban.getId();
        // Nếu là bàn mới (maBan chưa có), thì tự động tạo mã bàn mới
        if (id.getMaBan() == null) {
            Integer maxMaBan = banRepository.findMaxMaBanByIdRestaurant(id.getIdRestaurant());
            int newMaBan = (maxMaBan == null) ? 1 : maxMaBan + 1;
            id.setMaBan(newMaBan);
        }
        return banRepository.save(ban);
    }

    public void xoaBan(BanId id) {
        banRepository.deleteById(id);
    }

    public void xoaBan(Integer maBan, Integer idRestaurant) {
        BanId banId = new BanId(maBan, idRestaurant);
        banRepository.deleteById(banId);
    }
}
