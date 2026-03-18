package com.example.demo.service;

import com.example.demo.dto.YeuCauDonRequest;
import com.example.demo.entity.ChiTietYeuCauDon;
import com.example.demo.entity.ChiTietYeuCauDonId;
import com.example.demo.entity.YeuCauDon;
import com.example.demo.entity.YeuCauDonId;
import com.example.demo.repository.ChiTietYeuCauDonRepository;
import com.example.demo.repository.YeuCauDonRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class YeuCauDonService {

    @Autowired
    private YeuCauDonRepository yeuCauDonRepository;

    @Autowired
    private ChiTietYeuCauDonService chiTietYeuCauDonService;

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
        // Kiểm tra trùng lịch khi lưu (cho trường hợp update)
        if (yeuCauDon.getMaBan() != null && yeuCauDon.getGioSuDung() != null && yeuCauDon.getId() != null) {
            Integer idRestaurant = yeuCauDon.getId().getIdRestaurant();
            boolean isAvailable = isTableAvailableAtTimeExcludingOrder(
                idRestaurant,
                yeuCauDon.getMaBan(),
                yeuCauDon.getGioSuDung(),
                yeuCauDon.getId()
            );
            
            if (!isAvailable) {
                throw new IllegalStateException(
                    "Bàn số " + yeuCauDon.getMaBan() + 
                    " đã được đặt vào thời gian " + yeuCauDon.getGioSuDung() + 
                    ". Vui lòng chọn bàn khác hoặc thời gian khác."
                );
            }
        }
        return yeuCauDonRepository.save(yeuCauDon);
    }

    /**
     * Lưu trực tiếp vào repository mà KHÔNG kiểm tra xung đột bàn/giờ.
     * Dùng khi cập nhật thông tin thanh toán.
     */
    public YeuCauDon saveDirectly(YeuCauDon yeuCauDon) {
        return yeuCauDonRepository.save(yeuCauDon);
    }

    @Transactional
    public YeuCauDon createYeuCauDon(YeuCauDonRequest request) {
        YeuCauDon yeuCauDon = request.getYeuCauDon();
        List<ChiTietYeuCauDon> chiTietList = request.getChiTietYeuCauDon();

        // 1. Lấy idRestaurant từ yêu cầu
        Integer idRestaurant = yeuCauDon.getId().getIdRestaurant();

        // 2. KIỂM TRA TRÙNG LỊCH NẾU CÓ MÃ BÀN VÀ THỜI GIAN SỬ DỤNG
        if (yeuCauDon.getMaBan() != null && yeuCauDon.getGioSuDung() != null) {
            boolean isAvailable = isTableAvailableAtTime(
                idRestaurant, 
                yeuCauDon.getMaBan(), 
                yeuCauDon.getGioSuDung()
            );
            
            if (!isAvailable) {
                throw new IllegalStateException(
                    "Bàn số " + yeuCauDon.getMaBan() + 
                    " đã được đặt vào thời gian " + yeuCauDon.getGioSuDung() + 
                    ". Vui lòng chọn bàn khác hoặc thời gian khác."
                );
            }
        }

        // 3. Tạo mã đơn hàng mới
        Integer maxMaDonHang = yeuCauDonRepository.findMaxMaDonHangByIdRestaurant(idRestaurant).orElse(0);
        Integer newMaDonHang = maxMaDonHang + 1;

        // 3. Thiết lập ID và ngày tạo cho YeuCauDon
        YeuCauDonId yeuCauDonId = new YeuCauDonId(newMaDonHang, idRestaurant);
        yeuCauDon.setId(yeuCauDonId);
        yeuCauDon.setNgayTaoDon(LocalDateTime.now());

        // 4. Lưu YeuCauDon để lấy được ID
        YeuCauDon savedYeuCauDon = yeuCauDonRepository.save(yeuCauDon);

        // 5. Thiết lập ID cho từng ChiTietYeuCauDon và lưu chúng
        for (ChiTietYeuCauDon chiTiet : chiTietList) {
            ChiTietYeuCauDonId chiTietId = new ChiTietYeuCauDonId(
                newMaDonHang,
                idRestaurant,
                chiTiet.getId().getMaSanPham()
            );
            chiTiet.setId(chiTietId);
            chiTiet.setTrangThai("chờ xác nhận");
            chiTiet.setUpdateTrangThaiAt(LocalDateTime.now());
        }
        chiTietYeuCauDonService.saveAll(chiTietList);

        return savedYeuCauDon;
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

    public List<ChiTietYeuCauDon> getChiTietByRestaurant(Integer idRestaurant) {
        List<YeuCauDon> yeuCauDons = yeuCauDonRepository.findByIdRestaurant(idRestaurant);
        return yeuCauDons.stream()
                .flatMap(yeuCauDon -> yeuCauDon.getChiTietYeuCauDons().stream())
                .collect(Collectors.toList());
    }

    public List<YeuCauDon> getByMaTaiKhoan(Integer maTaiKhoan) {
        return yeuCauDonRepository.findByMaTaiKhoan(maTaiKhoan);
    }

    public List<YeuCauDon> getByTrangThaiThanhToan(String trangThai) {
        return yeuCauDonRepository.findByTrangThaiThanhToan(trangThai);
    }

    public List<Map<String, Object>> getMonthlyOrderCounts(int year) {
        return yeuCauDonRepository.countOrdersByMonth(year);
    }

    public List<Map<String, Object>> getDailyOrderCounts() {
        return yeuCauDonRepository.countOrdersByDay();
    }

    /**
     * Kiểm tra xem bàn có khả dụng tại thời điểm yêu cầu không
     * Mỗi đơn sử dụng bàn trong 2 giờ (từ gioSuDung đến gioSuDung + 2h)
     * 
     * @param idRestaurant ID nhà hàng
     * @param maBan Mã bàn
     * @param gioSuDung Thời gian bắt đầu sử dụng bàn
     * @return true nếu bàn khả dụng, false nếu đã có đơn trùng lịch
     */
    public boolean isTableAvailableAtTime(Integer idRestaurant, Integer maBan, LocalDateTime gioSuDung) {
        // Tính thời gian kết thúc (2 giờ sau thời gian bắt đầu)
        LocalDateTime gioKetThuc = gioSuDung.plusHours(2);
        
        // Tìm các đơn có thể trùng lịch: các đơn có gioSuDung trong khoảng [gioSuDung - 2h, gioSuDung + 2h]
        // Vì mỗi đơn dùng 2h, nên nếu đơn cũ bắt đầu trong khoảng này có thể trùng
        LocalDateTime startCheck = gioSuDung.minusHours(2);
        LocalDateTime endCheck = gioSuDung.plusHours(2);
        
        List<YeuCauDon> potentialOverlappingOrders = yeuCauDonRepository
                .findByBanAndGioSuDungBetween(idRestaurant, maBan, startCheck, endCheck);
        
        // Kiểm tra từng đơn xem có thực sự trùng không
        for (YeuCauDon don : potentialOverlappingOrders) {
            LocalDateTime donStart = don.getGioSuDung();
            LocalDateTime donEnd = donStart.plusHours(2);
            
            // Hai khoảng thời gian trùng nhau nếu:
            // donStart < gioKetThuc AND donEnd > gioSuDung
            if (donStart.isBefore(gioKetThuc) && donEnd.isAfter(gioSuDung)) {
                return false; // Bàn không khả dụng - đã có đơn trùng lịch
            }
        }
        
        return true; // Bàn khả dụng
    }

    /**
     * Kiểm tra xem bàn có khả dụng tại thời điểm yêu cầu không (loại trừ một đơn hàng cụ thể)
     * Dùng cho trường hợp update đơn hàng - cần loại trừ chính đơn hàng đó ra khỏi danh sách kiểm tra
     * 
     * @param idRestaurant ID nhà hàng
     * @param maBan Mã bàn
     * @param gioSuDung Thời gian bắt đầu sử dụng bàn
     * @param excludeOrderId ID đơn hàng cần loại trừ (đơn hàng đang được update)
     * @return true nếu bàn khả dụng, false nếu đã có đơn trùng lịch
     */
    public boolean isTableAvailableAtTimeExcludingOrder(
            Integer idRestaurant, 
            Integer maBan, 
            LocalDateTime gioSuDung,
            YeuCauDonId excludeOrderId) {
        // Tính thời gian kết thúc (2 giờ sau thời gian bắt đầu)
        LocalDateTime gioKetThuc = gioSuDung.plusHours(2);
        
        // Tìm các đơn có thể trùng lịch
        LocalDateTime startCheck = gioSuDung.minusHours(2);
        LocalDateTime endCheck = gioSuDung.plusHours(2);
        
        List<YeuCauDon> potentialOverlappingOrders = yeuCauDonRepository
                .findByBanAndGioSuDungBetween(idRestaurant, maBan, startCheck, endCheck);
        
        // Kiểm tra từng đơn xem có thực sự trùng không (loại trừ đơn đang được update)
        for (YeuCauDon don : potentialOverlappingOrders) {
            // Bỏ qua đơn hàng đang được update
            if (don.getId().equals(excludeOrderId)) {
                continue;
            }
            
            LocalDateTime donStart = don.getGioSuDung();
            LocalDateTime donEnd = donStart.plusHours(2);
            
            // Hai khoảng thời gian trùng nhau nếu:
            // donStart < gioKetThuc AND donEnd > gioSuDung
            if (donStart.isBefore(gioKetThuc) && donEnd.isAfter(gioSuDung)) {
                return false; // Bàn không khả dụng - đã có đơn trùng lịch
            }
        }
        
        return true; // Bàn khả dụng
    }

    public List<Map<String, Object>> getDoanhThuTheoThang(){
        List<Map<String, Object>> rawStats = yeuCauDonRepository.getDoanhThuTheoThang();
        return rawStats;
    }

    public List<Map<String, Object>> getDoanhThuTheoNgay() {
        return yeuCauDonRepository.getDoanhThuTheoNgay();
    }


    public Long getTongDonHomNay() {
        return yeuCauDonRepository.tongDonHomNay();
    }

    public Long getTongDonThangNay(){
        return yeuCauDonRepository.tongDonThangNay();
    }

}
