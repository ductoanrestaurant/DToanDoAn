package com.example.demo.controller;

import com.example.demo.dto.YeuCauDonRequest;
import com.example.demo.entity.ChiTietYeuCauDon;
import com.example.demo.entity.YeuCauDon;
import com.example.demo.service.ChiTietYeuCauDonService;
import com.example.demo.service.YeuCauDonService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/yeu-cau-don")
@Slf4j
@CrossOrigin("*")
public class YeuCauDonController {

    @Autowired
    private YeuCauDonService yeuCauDonService;

    @Autowired
    private ChiTietYeuCauDonService chiTietYeuCauDonService;

    @GetMapping
    @PreAuthorize("hasAnyRole('QUAN_LY', 'THU_NGAN')")
    public List<YeuCauDon> getAll() {
        return yeuCauDonService.getAll();
    }

    @GetMapping("/stats/orders-by-month")
    @PreAuthorize("hasAnyRole('QUAN_LY', 'THU_NGAN')")
    public ResponseEntity<List<Map<String, Object>>> getOrdersByMonth(
            @RequestParam(value = "year", required = false) Integer year) {
        int queryYear = (year == null) ? Year.now().getValue() : year;
        List<Map<String, Object>> stats = yeuCauDonService.getMonthlyOrderCounts(queryYear);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/stats/orders-by-day")
    @PreAuthorize("hasAnyRole('QUAN_LY', 'THU_NGAN')")
    public ResponseEntity<List<Map<String, Object>>> getOrdersByDay() {
        try {
            List<Map<String, Object>> stats = yeuCauDonService.getDailyOrderCounts();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("Lỗi khi lấy số lượng đơn hàng theo ngày: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{maDonHang}/{idRestaurant}")
    @PreAuthorize("hasAnyRole('KHACH_HANG', 'QUAN_LY', 'THU_NGAN')")
    public ResponseEntity<YeuCauDon> getById(
            @PathVariable Integer maDonHang,
            @PathVariable Integer idRestaurant) {
        return yeuCauDonService.getById(maDonHang, idRestaurant)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('KHACH_HANG', 'QUAN_LY', 'THU_NGAN')")
    public ResponseEntity<?> create(@RequestBody YeuCauDonRequest yeuCauDonRequest) {
        try {
            YeuCauDon newYeuCauDon = yeuCauDonService.createYeuCauDon(yeuCauDonRequest);
            return new ResponseEntity<>(newYeuCauDon, HttpStatus.CREATED);
        } catch (IllegalStateException e) {
            // Lỗi do trùng lịch hoặc bàn không khả dụng
            System.err.println("Table conflict: " + e.getMessage());
            return new ResponseEntity<>(
                    Map.of("error", e.getMessage()),
                    HttpStatus.CONFLICT);
        } catch (Exception e) {
            System.err.println("Error creating order: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(
                    Map.of("error", "Có lỗi xảy ra khi tạo đơn hàng: " + e.getMessage()),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{maDonHang}/{idRestaurant}")
    @PreAuthorize("hasAnyRole('KHACH_HANG','QUAN_LY', 'THU_NGAN')")
    public ResponseEntity<?> update(
            @PathVariable Integer maDonHang,
            @PathVariable Integer idRestaurant,
            @RequestBody YeuCauDon yeuCauDonDetails) {
        return yeuCauDonService.getById(maDonHang, idRestaurant).map(yeuCauDon -> {
            try {
                yeuCauDon.setTrangThaiThanhToan(yeuCauDonDetails.getTrangThaiThanhToan());

                // Nếu trạng thái mới là "đã thanh toán", cập nhật thời gian thanh toán là thời
                // gian hiện tại của server
                if ("đã thanh toán".equalsIgnoreCase(yeuCauDonDetails.getTrangThaiThanhToan())) {
                    yeuCauDon.setThoiGianThanhToan(LocalDateTime.now());
                }

                yeuCauDon.setGhiChu(yeuCauDonDetails.getGhiChu());
                yeuCauDon.setIdGiamGia(yeuCauDonDetails.getIdGiamGia());
                yeuCauDon.setMaBan(yeuCauDonDetails.getMaBan());
                yeuCauDon.setMaNhanVien(yeuCauDonDetails.getMaNhanVien());
                yeuCauDon.setGioSuDung(yeuCauDonDetails.getGioSuDung());
                yeuCauDon.setIdThanhToan(yeuCauDonDetails.getIdThanhToan());
                return ResponseEntity.ok(yeuCauDonService.save(yeuCauDon));
            } catch (IllegalStateException e) {
                // Lỗi do trùng lịch hoặc bàn không khả dụng
                System.err.println("Table conflict on update: " + e.getMessage());
                return new ResponseEntity<>(
                        Map.of("error", e.getMessage()),
                        HttpStatus.CONFLICT);
            } catch (Exception e) {
                System.err.println("Error updating order: " + e.getMessage());
                e.printStackTrace();
                return new ResponseEntity<>(
                        Map.of("error", "Có lỗi xảy ra khi cập nhật đơn hàng: " + e.getMessage()),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }).orElse(ResponseEntity.notFound().build());
    }

    /**
     * PATCH endpoint chỉ cập nhật thông tin thanh toán (trangThaiThanhToan, idThanhToan).
     * KHÔNG kiểm tra xung đột bàn/giờ để tránh lỗi 409 khi thanh toán.
     */
    @PatchMapping("/{maDonHang}/{idRestaurant}/thanh-toan")
    @PreAuthorize("hasAnyRole('KHACH_HANG','QUAN_LY', 'THU_NGAN')")
    public ResponseEntity<?> updateThanhToan(
            @PathVariable Integer maDonHang,
            @PathVariable Integer idRestaurant,
            @RequestBody Map<String, Object> body) {
        return yeuCauDonService.getById(maDonHang, idRestaurant).map(yeuCauDon -> {
            try {
                if (body.containsKey("trangThaiThanhToan")) {
                    yeuCauDon.setTrangThaiThanhToan((String) body.get("trangThaiThanhToan"));
                }
                if ("đã thanh toán".equalsIgnoreCase(yeuCauDon.getTrangThaiThanhToan())) {
                    yeuCauDon.setThoiGianThanhToan(LocalDateTime.now());
                }
                if (body.containsKey("idThanhToan") && body.get("idThanhToan") != null) {
                    yeuCauDon.setIdThanhToan(((Number) body.get("idThanhToan")).intValue());
                }
                // Lưu trực tiếp qua repository, KHÔNG qua save() để tránh check bàn
                return ResponseEntity.ok(yeuCauDonService.saveDirectly(yeuCauDon));
            } catch (Exception e) {
                log.error("Error updating payment info: {}", e.getMessage(), e);
                return new ResponseEntity<>(
                        Map.of("error", "Có lỗi xảy ra khi cập nhật thanh toán: " + e.getMessage()),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{maDonHang}/{idRestaurant}")
    @PreAuthorize("hasAnyRole('KHACH_HANG','QUAN_LY', 'THU_NGAN')")
    public ResponseEntity<Void> delete(
            @PathVariable Integer maDonHang,
            @PathVariable Integer idRestaurant) {
        yeuCauDonService.delete(maDonHang, idRestaurant);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/restaurant/{idRestaurant}")
    @PreAuthorize("hasAnyRole('QUAN_LY', 'THU_NGAN')")
    public List<YeuCauDon> getByIdRestaurant(@PathVariable Integer idRestaurant) {
        return yeuCauDonService.getByIdRestaurant(idRestaurant);
    }

    @GetMapping("/chi-tiet/restaurant/{idRestaurant}")
    @PreAuthorize("hasAnyRole('QUAN_LY', 'THU_NGAN', 'BEP')")
    public List<ChiTietYeuCauDon> getChiTietByRestaurant(@PathVariable Integer idRestaurant) {
        return yeuCauDonService.getChiTietByRestaurant(idRestaurant);
    }

    @GetMapping("/khach-hang/{maTaiKhoan}")
    @PreAuthorize("hasAnyRole('KHACH_HANG' ,'QUAN_LY', 'THU_NGAN')")
    public List<YeuCauDon> getByMaTaiKhoan(@PathVariable Integer maTaiKhoan) {
        return yeuCauDonService.getByMaTaiKhoan(maTaiKhoan);
    }

    @GetMapping("/trang-thai/{trangThai}")
    @PreAuthorize("hasAnyRole('QUAN_LY', 'THU_NGAN')")
    public List<YeuCauDon> getByTrangThaiThanhToan(@PathVariable String trangThai) {
        return yeuCauDonService.getByTrangThaiThanhToan(trangThai);
    }

    @PutMapping("/chi-tiet/trang-thai")
    @PreAuthorize("hasAnyRole('KHACH_HANG', 'QUAN_LY', 'BEP', 'THU_NGAN')")
    public ResponseEntity<ChiTietYeuCauDon> updateChiTietTrangThai(
            @RequestParam Integer maDonHang,
            @RequestParam Integer idRestaurant,
            @RequestParam Integer maSanPham,
            @RequestBody Map<String, String> body) {
        String newTrangThai = body.get("trangThai");
        if (newTrangThai == null) {
            return ResponseEntity.badRequest().build();
        }

        return chiTietYeuCauDonService.updateTrangThai(maDonHang, idRestaurant, maSanPham, newTrangThai)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/doanh-thu-thang")
    @PreAuthorize("hasAnyRole('QUAN_LY', 'THU_NGAN')")
    public ResponseEntity<List<Map<String, Object>>> getDoanhThuTheoThang() {
        try{
            List<Map<String, Object>> stats = yeuCauDonService.getDoanhThuTheoThang();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.internalServerError().build();
    }

    @GetMapping("/doanh-thu-ngay")
    @PreAuthorize("hasAnyRole('QUAN_LY', 'THU_NGAN')")
    public ResponseEntity<List<Map<String, Object>>> getDoanhThuTheoNgay() {
        try {
            List<Map<String, Object>> stats = yeuCauDonService.getDoanhThuTheoNgay();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.internalServerError().build();
    }

    @GetMapping("/tong-don-hom-nay")
    @PreAuthorize("hasAnyRole('QUAN_LY', 'THU_NGAN')")
    public ResponseEntity<Long> getTongDonHomNay() {
        log.info("Yêu cầu lấy tổng số đơn hàng của ngày hôm nay."); // Ghi log khi có người gọi API

        try {
            Long stats = yeuCauDonService.getTongDonHomNay();
            Long result = (stats != null) ? stats : 0L;

            log.info("Lấy dữ liệu thành công: {} đơn hàng.", result);
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            // 3. Ghi log lỗi kèm theo nội dung lỗi e
            log.error("Lỗi nghiêm trọng khi truy vấn tổng đơn hôm nay: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/tong-don-thang-nay")
    @PreAuthorize("hasAnyRole('QUAN_LY', 'THU_NGAN')")
    public ResponseEntity<Long> getTongDonThangNay() {
        log.info("Yêu cầu lấy tổng số đơn hàng của tháng hôm nay.");

        try{
            Long stats = yeuCauDonService.getTongDonThangNay();
            Long result = (stats != null) ? stats : 0L;

            log.info("Lấy dữ liệu thành công: {} đơn hàng.", result);
            return ResponseEntity.ok(result);

        } catch (Exception e){
            log.error("Lỗi nghiêm trọng khi truy vấn tổng đơn hôm nay: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }


    @GetMapping("/top-san-pham")
    @PreAuthorize("hasAnyRole('QUAN_LY', 'THU_NGAN')")
    public ResponseEntity<List<com.example.demo.dto.TopSanPhamDTO>> getTop5SanPhamBanChay() {
        try {
            return ResponseEntity.ok(chiTietYeuCauDonService.getTop5SanPhamBanChay());
        } catch (Exception e) {
            log.error("Lỗi khi lấy top 5 sản phẩm bán chạy: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

}
