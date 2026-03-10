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

         // Tính thời gian kết thúc của đơn mới (2 giờ sau thời gian bắt đầu)
         LocalDateTime gioKetThuc = gioSuDung.plusHours(2);
         
         // Tìm các đơn có thể trùng lịch: các đơn có gioSuDung trong khoảng [gioSuDung - 2h, gioSuDung + 2h]
         // Vì mỗi đơn dùng 2h, nên nếu đơn cũ bắt đầu trong khoảng này có thể trùng
         LocalDateTime startCheck = gioSuDung.minusHours(2);
         LocalDateTime endCheck = gioSuDung.plusHours(2);

         // Lọc những bàn không có đơn trùng lịch
         return allActiveTables.stream()
                 .filter(ban -> {
                     Integer maBan = ban.getId().getMaBan();
                     
                     // Tìm các đơn có thể trùng lịch
                     List<com.example.demo.entity.YeuCauDon> potentialOverlappingOrders = 
                             yeuCauDonRepository.findByBanAndGioSuDungBetween(idRestaurant, maBan, startCheck, endCheck);
                     
                     // Kiểm tra từng đơn xem có thực sự trùng không
                     for (com.example.demo.entity.YeuCauDon don : potentialOverlappingOrders) {
                         LocalDateTime donStart = don.getGioSuDung();
                         LocalDateTime donEnd = donStart.plusHours(2);
                         
                         // Hai khoảng thời gian trùng nhau nếu:
                         // donStart < gioKetThuc AND donEnd > gioSuDung
                         if (donStart.isBefore(gioKetThuc) && donEnd.isAfter(gioSuDung)) {
                             return false; // Bàn không khả dụng - đã có đơn trùng lịch
                         }
                     }
                     
                     return true; // Bàn khả dụng
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
