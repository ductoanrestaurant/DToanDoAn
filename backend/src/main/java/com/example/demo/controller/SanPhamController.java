package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.SanPham;
import com.example.demo.service.SanPhamService; 

import java.util.List;

@RestController
@RequestMapping("/api/san-pham")
@CrossOrigin("*") // Cho phép gọi API từ Frontend khác domain
public class SanPhamController {

    @Autowired
    private SanPhamService sanPhamService;

    // Lấy danh sách tất cả sản phẩm
    @GetMapping
    public List<SanPham> getAll() {
        return sanPhamService.getAll();
    }

    // Lấy chi tiết một sản phẩm theo ID
    @GetMapping("/{id}")
    public ResponseEntity<SanPham> getById(@PathVariable Integer id) {
        return sanPhamService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Thêm mới sản phẩm
    @PostMapping
    public SanPham create(@RequestBody SanPham sanPham) {
        return sanPhamService.save(sanPham);
    }

    // Cập nhật sản phẩm
    @PutMapping("/{id}")
    public ResponseEntity<SanPham> update(@PathVariable Integer id, @RequestBody SanPham sanPhamDetails) {
        return sanPhamService.getById(id).map(sanPham -> {
            sanPham.setTenSanPham(sanPhamDetails.getTenSanPham());
            sanPham.setMoTa(sanPhamDetails.getMoTa());
            sanPham.setGia(sanPhamDetails.getGia());
            sanPham.setDanhMuc(sanPhamDetails.getDanhMuc());
            return ResponseEntity.ok(sanPhamService.save(sanPham));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Xóa sản phẩm
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        sanPhamService.delete(id);
        return ResponseEntity.ok().build();
    }

    // Lấy sản phẩm theo mã danh mục
    @GetMapping("/danh-muc/{maDanhMuc}")
    public List<SanPham> getByDanhMuc(@PathVariable Integer maDanhMuc) {
        return sanPhamService.getByDanhMuc(maDanhMuc);
    }
}
