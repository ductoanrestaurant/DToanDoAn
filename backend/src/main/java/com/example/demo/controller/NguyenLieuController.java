package com.example.demo.controller;

import com.example.demo.entity.NguyenLieu;
import com.example.demo.entity.Restaurant;
import com.example.demo.repository.ChiTietPhieuNhapRepository;
import com.example.demo.service.NguyenLieuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/nguyen-lieu")
@CrossOrigin("*")
public class NguyenLieuController {

    @Autowired
    private NguyenLieuService nguyenLieuService;

    @Autowired
    private ChiTietPhieuNhapRepository chiTietPhieuNhapRepository;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public List<Map<String, Object>> getAll() {
        List<NguyenLieu> list = nguyenLieuService.getAll();
        List<Map<String, Object>> result = new ArrayList<>();
        for (NguyenLieu nl : list) {
            Map<String, Object> item = new HashMap<>();
            item.put("maNguyenLieu", nl.getMaNguyenLieu());
            item.put("tenNguyenLieu", nl.getTenNguyenLieu());
            item.put("donViTinh", nl.getDonViTinh());
            item.put("moTa", nl.getMoTa());
            item.put("xuatXu", nl.getXuatXu());
            item.put("trangThai", nl.getTrangThai());
            item.put("soLuong", nl.getSoLuong());
            item.put("updatedAt", nl.getUpdatedAt());
            // Lấy ngày hết hạn gần nhất từ chitietphieunhap
            java.util.Date ngayHetHan = chiTietPhieuNhapRepository
                    .findNearestExpiryByMaNguyenLieu(nl.getMaNguyenLieu());
            item.put("ngayHetHan", ngayHetHan);
            result.add(item);
        }
        return result;
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<NguyenLieu> getById(@PathVariable Integer id) {
        return nguyenLieuService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('QUAN_LY')")
    public NguyenLieu create(@RequestBody NguyenLieu nguyenLieu) {
        // Set default values for new nguyenlieu to prevent nulls
        Restaurant defaultRestaurant = new Restaurant();
        defaultRestaurant.setIdRestaurant(1); // Assuming default restaurant ID is 1.
        nguyenLieu.setRestaurant(defaultRestaurant);
        
        nguyenLieu.setSoLuong(nguyenLieu.getSoLuong());
        nguyenLieu.setTrangThai("Còn hàng"); // Default status
        
        return nguyenLieuService.save(nguyenLieu);
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<NguyenLieu> update(@PathVariable Integer id, @RequestBody NguyenLieu nguyenLieuDetails) {
        // Find the existing entity from the database
        Optional<NguyenLieu> optionalNguyenLieu = nguyenLieuService.getById(id);
        if (!optionalNguyenLieu.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        NguyenLieu existingNguyenLieu = optionalNguyenLieu.get();

        // Only update the fields that are sent from the frontend form
        existingNguyenLieu.setTenNguyenLieu(nguyenLieuDetails.getTenNguyenLieu());
        existingNguyenLieu.setDonViTinh(nguyenLieuDetails.getDonViTinh());
        existingNguyenLieu.setMoTa(nguyenLieuDetails.getMoTa());
        existingNguyenLieu.setXuatXu(nguyenLieuDetails.getXuatXu());
        existingNguyenLieu.setSoLuong(nguyenLieuDetails.getSoLuong());

        NguyenLieu updatedNguyenLieu = nguyenLieuService.save(existingNguyenLieu);
        return ResponseEntity.ok(updatedNguyenLieu);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('QUAN_LY')")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        nguyenLieuService.delete(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/restaurant/{idRestaurant}")
    @PreAuthorize("isAuthenticated()")
    public List<NguyenLieu> getByRestaurant(@PathVariable Integer idRestaurant) {
        return nguyenLieuService.getByRestaurant(idRestaurant);
    }

    @GetMapping("/trang-thai/{trangThai}")
    @PreAuthorize("isAuthenticated()")
    public List<NguyenLieu> getByTrangThai(@PathVariable String trangThai) {
        return nguyenLieuService.getByTrangThai(trangThai);
    }
}
