package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.SanPham;
import com.example.demo.service.SanPhamService; 

import java.util.List;

@RestController
@RequestMapping("/api/san-pham")
@CrossOrigin("*")
public class SanPhamController {

    @Autowired
    private SanPhamService sanPhamService;


    @GetMapping
    public List<SanPham> getAll() {
        return sanPhamService.getAll();
    }


    @GetMapping("/{id}")
    public ResponseEntity<SanPham> getById(@PathVariable Integer id) {
        return sanPhamService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @PostMapping
    @PreAuthorize("hasRole('QUAN_LY')")
    public SanPham create(@RequestBody SanPham sanPham) {
        return sanPhamService.save(sanPham);
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasRole('QUAN_LY')")
    public ResponseEntity<SanPham> update(@PathVariable Integer id, @RequestBody SanPham sanPhamDetails) {
        return sanPhamService.getById(id).map(sanPham -> {
            sanPham.setTenSanPham(sanPhamDetails.getTenSanPham());
            sanPham.setMoTa(sanPhamDetails.getMoTa());
            sanPham.setGia(sanPhamDetails.getGia());
            sanPham.setDanhMuc(sanPhamDetails.getDanhMuc());
            return ResponseEntity.ok(sanPhamService.save(sanPham));
        }).orElse(ResponseEntity.notFound().build());
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('QUAN_LY')")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        sanPhamService.delete(id);
        return ResponseEntity.ok().build();
    }


    @GetMapping("/danh-muc/{maDanhMuc}")
    public List<SanPham> getByDanhMuc(@PathVariable Integer maDanhMuc) {
        return sanPhamService.getByDanhMuc(maDanhMuc);
    }
}
