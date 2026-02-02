package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.NguyenLieu;
import com.example.demo.service.NguyenLieuService;

import java.util.List;

@RestController
@RequestMapping("/api/nguyen-lieu")
@CrossOrigin("*")
public class NguyenLieuController {

    @Autowired
    private NguyenLieuService nguyenLieuService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public List<NguyenLieu> getAll() {
        return nguyenLieuService.getAll();
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
        return nguyenLieuService.save(nguyenLieu);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('QUAN_LY')")
    public ResponseEntity<NguyenLieu> update(@PathVariable Integer id, @RequestBody NguyenLieu nguyenLieuDetails) {
        return nguyenLieuService.getById(id).map(nguyenLieu -> {
            nguyenLieu.setTenNguyenLieu(nguyenLieuDetails.getTenNguyenLieu());
            nguyenLieu.setDonViTinh(nguyenLieuDetails.getDonViTinh());
            nguyenLieu.setMoTa(nguyenLieuDetails.getMoTa());
            nguyenLieu.setXuatXu(nguyenLieuDetails.getXuatXu());
            nguyenLieu.setGiaMua(nguyenLieuDetails.getGiaMua());
            nguyenLieu.setTrangThai(nguyenLieuDetails.getTrangThai());
            nguyenLieu.setRestaurant(nguyenLieuDetails.getRestaurant());
            return ResponseEntity.ok(nguyenLieuService.save(nguyenLieu));
        }).orElse(ResponseEntity.notFound().build());
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

