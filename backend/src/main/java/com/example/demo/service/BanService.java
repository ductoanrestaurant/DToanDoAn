package com.example.demo.service;

import com.example.demo.entity.Ban;
import com.example.demo.entity.BanId;
import com.example.demo.repository.BanRepository;
import com.example.demo.repository.YeuCauDonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BanService {

    @Autowired
    private BanRepository banRepository;

    @Autowired
    private YeuCauDonRepository yeuCauDonRepository;

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

    /**
     * Lấy danh sách bàn đang hoạt động (không ngưng sử dụng) và không bị trùng lịch
     * với slot thời gian 2 giờ tính từ gioSuDung mong muốn.
     */
    public List<Ban> layBanHopLeTheoThoiGian(Integer idRestaurant, LocalDateTime gioSuDung) {
         // Lấy tất cả bàn của nhà hàng, chỉ giữ bàn không bị khóa/ngưng hoạt động (trangThai = false)
         List<Ban> allActiveTables = banRepository.findById_IdRestaurantOrderByMaBanAsc(idRestaurant)
                 .stream()
                 .filter(ban -> Boolean.FALSE.equals(ban.getTrangThai()))
                 .toList();

         // Xác định khoảng thời gian "nhạy cảm" quanh gioSuDung (2 giờ trước và 2 giờ sau)
         LocalDateTime start = gioSuDung.minusHours(2);
         LocalDateTime end = gioSuDung.plusHours(2);

         // Giữ lại những bàn không có bất kỳ đơn hàng nào trong khoảng thời gian trên
         return allActiveTables.stream()
                 .filter(ban -> {
                     Integer maBan = ban.getId().getMaBan();
                     return yeuCauDonRepository
                             .findByBanAndGioSuDungBetween(idRestaurant, maBan, start, end)
                             .isEmpty();
                 })
                 .toList();
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
