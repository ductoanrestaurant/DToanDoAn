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
import java.util.stream.Collectors;

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
     * Lấy danh sách các bàn có thể đặt tại một thời điểm cụ thể.
     * Một bàn được coi là "có sẵn" nếu nó đang hoạt động (trangThai=false) và
     * không có đơn đặt nào có giờ sử dụng nằm trong khoảng (+/- 2 giờ) so với thời gian yêu cầu.
     * @param idRestaurant ID của nhà hàng
     * @param gioSuDung Thời gian khách muốn đặt bàn
     * @return Danh sách các bàn hợp lệ
     */
    public List<Ban> getAvailableTablesByTime(Integer idRestaurant, LocalDateTime gioSuDung) {
        // 1. Xác định "khung thời gian xung đột"
        LocalDateTime startTime = gioSuDung.minusHours(2);
        LocalDateTime endTime = gioSuDung.plusHours(2);

        // 2. Lấy danh sách ID của các bàn đã bận trong khung thời gian đó
        // (Giả sử đơn hàng đã hủy không chiếm chỗ, điều này được xử lý trong query của repository)
        List<Integer> maBanDaBan = yeuCauDonRepository.findMaBanByRestaurantAndGioSuDungBetween(idRestaurant, startTime, endTime);

        // 3. Lấy tất cả các bàn đang hoạt động của nhà hàng
        List<Ban> tatCaBanHoatDong = banRepository.findById_IdRestaurantOrderByMaBanAsc(idRestaurant)
                .stream()
                .filter(ban -> Boolean.FALSE.equals(ban.getTrangThai())) // Chỉ lấy bàn có trạng thái false (đang hoạt động)
                .collect(Collectors.toList());

        // 4. Lọc và trả về những bàn không nằm trong danh sách đã bận
        return tatCaBanHoatDong.stream()
                .filter(ban -> !maBanDaBan.contains(ban.getId().getMaBan()))
                .collect(Collectors.toList());
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
