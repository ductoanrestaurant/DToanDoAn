package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.DanhGia;
import com.example.demo.service.DanhGiaService;

import java.util.List;

@RestController
@RequestMapping("/api/danh-gia")
@CrossOrigin("*")
public class DanhGiaController {

    @Autowired
    private DanhGiaService danhGiaService;

    @GetMapping
    public List<DanhGia> getAll() {
        return danhGiaService.getAll();
    }

    @GetMapping("/{maTaiKhoan}/{maSanPham}")
    public ResponseEntity<DanhGia> getById(
            @PathVariable Integer maTaiKhoan,
            @PathVariable Integer maSanPham) {
        return danhGiaService.getById(maTaiKhoan, maSanPham)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public DanhGia create(@RequestBody DanhGia danhGia) {
        return danhGiaService.save(danhGia);
    }

    @PutMapping("/{maTaiKhoan}/{maSanPham}")
    public ResponseEntity<DanhGia> update(
            @PathVariable Integer maTaiKhoan,
            @PathVariable Integer maSanPham,
            @RequestBody DanhGia danhGiaDetails) {
        return danhGiaService.getById(maTaiKhoan, maSanPham).map(danhGia -> {
            danhGia.setNoiDung(danhGiaDetails.getNoiDung());
            danhGia.setSoSao(danhGiaDetails.getSoSao());
            danhGia.setNgayDanhGia(danhGiaDetails.getNgayDanhGia());
            return ResponseEntity.ok(danhGiaService.save(danhGia));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{maTaiKhoan}/{maSanPham}")
    public ResponseEntity<Void> delete(
            @PathVariable Integer maTaiKhoan,
            @PathVariable Integer maSanPham) {
        danhGiaService.delete(maTaiKhoan, maSanPham);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/san-pham/{maSanPham}")
    public List<DanhGia> getByMaSanPham(@PathVariable Integer maSanPham) {
        return danhGiaService.getByMaSanPham(maSanPham);
    }

    @GetMapping("/khach-hang/{maTaiKhoan}")
    public List<DanhGia> getByMaTaiKhoan(@PathVariable Integer maTaiKhoan) {
        return danhGiaService.getByMaTaiKhoan(maTaiKhoan);
    }
}

