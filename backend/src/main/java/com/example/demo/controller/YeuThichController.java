package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.YeuThich;
import com.example.demo.service.YeuThichService;

import java.util.List;

@RestController
@RequestMapping("/api/yeu-thich")
@CrossOrigin("*")
public class YeuThichController {

    @Autowired
    private YeuThichService yeuThichService;

    @GetMapping
    public List<YeuThich> getAll() {
        return yeuThichService.getAll();
    }

    @GetMapping("/{maTaiKhoan}/{maSanPham}")
    public ResponseEntity<YeuThich> getById(
            @PathVariable Integer maTaiKhoan,
            @PathVariable Integer maSanPham) {
        return yeuThichService.getById(maTaiKhoan, maSanPham)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public YeuThich create(@RequestBody YeuThich yeuThich) {
        return yeuThichService.save(yeuThich);
    }

    @DeleteMapping("/{maTaiKhoan}/{maSanPham}")
    public ResponseEntity<Void> delete(
            @PathVariable Integer maTaiKhoan,
            @PathVariable Integer maSanPham) {
        yeuThichService.delete(maTaiKhoan, maSanPham);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/khach-hang/{maTaiKhoan}")
    public List<YeuThich> getByMaTaiKhoan(@PathVariable Integer maTaiKhoan) {
        return yeuThichService.getByMaTaiKhoan(maTaiKhoan);
    }

    @GetMapping("/san-pham/{maSanPham}")
    public List<YeuThich> getByMaSanPham(@PathVariable Integer maSanPham) {
        return yeuThichService.getByMaSanPham(maSanPham);
    }
}

