package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.KhuyenMai;
import com.example.demo.service.KhuyenMaiService;

import java.util.List;

@RestController
@RequestMapping("/api/khuyen-mai")
@CrossOrigin("*")
public class KhuyenMaiController {

    @Autowired
    private KhuyenMaiService khuyenMaiService;

    @GetMapping
    public List<KhuyenMai> getAll() {
        return khuyenMaiService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<KhuyenMai> getById(@PathVariable Integer id) {
        return khuyenMaiService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('QUAN_LY')")
    public KhuyenMai create(@RequestBody KhuyenMai khuyenMai) {
        return khuyenMaiService.save(khuyenMai);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('QUAN_LY')")
    public ResponseEntity<KhuyenMai> update(@PathVariable Integer id, @RequestBody KhuyenMai khuyenMaiDetails) {
        return khuyenMaiService.getById(id).map(khuyenMai -> {
            khuyenMai.setMaKhuyenMai(khuyenMaiDetails.getMaKhuyenMai());
            khuyenMai.setGiaTri(khuyenMaiDetails.getGiaTri());
            khuyenMai.setNgayBatDau(khuyenMaiDetails.getNgayBatDau());
            khuyenMai.setNgayKetThuc(khuyenMaiDetails.getNgayKetThuc());
            khuyenMai.setTrangThai(khuyenMaiDetails.getTrangThai());
            khuyenMai.setMaSanPham(khuyenMaiDetails.getMaSanPham());
            return ResponseEntity.ok(khuyenMaiService.save(khuyenMai));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('QUAN_LY')")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        khuyenMaiService.delete(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/san-pham/{maSanPham}")
    public List<KhuyenMai> getByMaSanPham(@PathVariable Integer maSanPham) {
        return khuyenMaiService.getByMaSanPham(maSanPham);
    }

    @GetMapping("/trang-thai/{trangThai}")
    public List<KhuyenMai> getByTrangThai(@PathVariable String trangThai) {
        return khuyenMaiService.getByTrangThai(trangThai);
    }
}

