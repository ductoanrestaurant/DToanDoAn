package com.example.demo.controller;

import com.example.demo.dto.YeuCauDonRequest;
import com.example.demo.entity.YeuCauDon;
import com.example.demo.service.YeuCauDonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/yeu-cau-don")
@PreAuthorize("hasAnyRole('QUAN_LY', 'THU_NGAN')")
@CrossOrigin("*")
public class YeuCauDonController {

    @Autowired
    private YeuCauDonService yeuCauDonService;

    @GetMapping
    public List<YeuCauDon> getAll() {
        return yeuCauDonService.getAll();
    }

    @GetMapping("/{maDonHang}/{idRestaurant}")
    public ResponseEntity<YeuCauDon> getById(
            @PathVariable Integer maDonHang,
            @PathVariable Integer idRestaurant) {
        return yeuCauDonService.getById(maDonHang, idRestaurant)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<YeuCauDon> create(@RequestBody YeuCauDonRequest yeuCauDonRequest) {
        try {
            YeuCauDon newYeuCauDon = yeuCauDonService.createYeuCauDon(yeuCauDonRequest);
            return new ResponseEntity<>(newYeuCauDon, HttpStatus.CREATED);
        } catch (Exception e) {

            System.err.println("Error creating order: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @PutMapping("/{maDonHang}/{idRestaurant}")
    public ResponseEntity<YeuCauDon> update(
            @PathVariable Integer maDonHang,
            @PathVariable Integer idRestaurant,
            @RequestBody YeuCauDon yeuCauDonDetails) {
        return yeuCauDonService.getById(maDonHang, idRestaurant).map(yeuCauDon -> {
            yeuCauDon.setTrangThaiThanhToan(yeuCauDonDetails.getTrangThaiThanhToan());
            yeuCauDon.setThoiGianThanhToan(yeuCauDonDetails.getThoiGianThanhToan());
            yeuCauDon.setGhiChu(yeuCauDonDetails.getGhiChu());
            yeuCauDon.setIdGiamGia(yeuCauDonDetails.getIdGiamGia());
            yeuCauDon.setMaBan(yeuCauDonDetails.getMaBan());
            yeuCauDon.setMaNhanVien(yeuCauDonDetails.getMaNhanVien());
            yeuCauDon.setGioSuDung(yeuCauDonDetails.getGioSuDung());
            yeuCauDon.setIdThanhToan(yeuCauDonDetails.getIdThanhToan());
            return ResponseEntity.ok(yeuCauDonService.save(yeuCauDon));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{maDonHang}/{idRestaurant}")
    public ResponseEntity<Void> delete(
            @PathVariable Integer maDonHang,
            @PathVariable Integer idRestaurant) {
        yeuCauDonService.delete(maDonHang, idRestaurant);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/restaurant/{idRestaurant}")
    public List<YeuCauDon> getByIdRestaurant(@PathVariable Integer idRestaurant) {
        return yeuCauDonService.getByIdRestaurant(idRestaurant);
    }

    @GetMapping("/khach-hang/{maTaiKhoan}")
    public List<YeuCauDon> getByMaTaiKhoan(@PathVariable Integer maTaiKhoan) {
        return yeuCauDonService.getByMaTaiKhoan(maTaiKhoan);
    }

    @GetMapping("/trang-thai/{trangThai}")
    public List<YeuCauDon> getByTrangThaiThanhToan(@PathVariable String trangThai) {
        return yeuCauDonService.getByTrangThaiThanhToan(trangThai);
    }
}
