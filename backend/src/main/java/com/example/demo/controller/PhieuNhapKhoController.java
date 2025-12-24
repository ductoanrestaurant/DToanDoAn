package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.PhieuNhapKho;
import com.example.demo.service.PhieuNhapKhoService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/phieu-nhap-kho")
@CrossOrigin("*")
public class PhieuNhapKhoController {

    @Autowired
    private PhieuNhapKhoService phieuNhapKhoService;

    @GetMapping
    public List<PhieuNhapKho> getAll() {
        return phieuNhapKhoService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PhieuNhapKho> getById(@PathVariable Integer id) {
        return phieuNhapKhoService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public PhieuNhapKho create(@RequestBody PhieuNhapKho phieuNhapKho) {
        return phieuNhapKhoService.save(phieuNhapKho);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PhieuNhapKho> update(@PathVariable Integer id, @RequestBody PhieuNhapKho phieuNhapKhoDetails) {
        return phieuNhapKhoService.getById(id).map(phieuNhapKho -> {
            phieuNhapKho.setNhaCungCap(phieuNhapKhoDetails.getNhaCungCap());
            phieuNhapKho.setMaNhanVien(phieuNhapKhoDetails.getMaNhanVien());
            phieuNhapKho.setNgayNhap(phieuNhapKhoDetails.getNgayNhap());
            phieuNhapKho.setTongTien(phieuNhapKhoDetails.getTongTien());
            phieuNhapKho.setGhiChu(phieuNhapKhoDetails.getGhiChu());
            phieuNhapKho.setIdRestaurant(phieuNhapKhoDetails.getIdRestaurant());
            return ResponseEntity.ok(phieuNhapKhoService.save(phieuNhapKho));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        phieuNhapKhoService.delete(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/restaurant/{idRestaurant}")
    public List<PhieuNhapKho> getByIdRestaurant(@PathVariable Integer idRestaurant) {
        return phieuNhapKhoService.getByIdRestaurant(idRestaurant);
    }

    @GetMapping("/ngay-nhap/{ngayNhap}")
    public List<PhieuNhapKho> getByNgayNhap(@PathVariable String ngayNhap) {
        return phieuNhapKhoService.getByNgayNhap(LocalDate.parse(ngayNhap));
    }
}

