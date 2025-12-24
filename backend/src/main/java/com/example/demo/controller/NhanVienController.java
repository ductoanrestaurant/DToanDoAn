package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.NhanVien;
import com.example.demo.service.NhanVienService;

import java.util.List;

@RestController
@RequestMapping("/api/nhan-vien")
@CrossOrigin("*")
public class NhanVienController {

    @Autowired
    private NhanVienService nhanVienService;

    @GetMapping
    public List<NhanVien> getAll() {
        return nhanVienService.getAll();
    }

    @GetMapping("/{maNhanVien}/{idRestaurant}")
    public ResponseEntity<NhanVien> getById(
            @PathVariable Integer maNhanVien,
            @PathVariable Integer idRestaurant) {
        return nhanVienService.getById(maNhanVien, idRestaurant)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public NhanVien create(@RequestBody NhanVien nhanVien) {
        return nhanVienService.save(nhanVien);
    }

    @PutMapping("/{maNhanVien}/{idRestaurant}")
    public ResponseEntity<NhanVien> update(
            @PathVariable Integer maNhanVien,
            @PathVariable Integer idRestaurant,
            @RequestBody NhanVien nhanVienDetails) {
        return nhanVienService.getById(maNhanVien, idRestaurant).map(nhanVien -> {
            nhanVien.setTenNhanVien(nhanVienDetails.getTenNhanVien());
            nhanVien.setEmail(nhanVienDetails.getEmail());
            nhanVien.setPassword(nhanVienDetails.getPassword());
            nhanVien.setMoTa(nhanVienDetails.getMoTa());
            nhanVien.setNumberLog(nhanVienDetails.getNumberLog());
            nhanVien.setFirstLog(nhanVienDetails.getFirstLog());
            nhanVien.setMaVaiTro(nhanVienDetails.getMaVaiTro());
            return ResponseEntity.ok(nhanVienService.save(nhanVien));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{maNhanVien}/{idRestaurant}")
    public ResponseEntity<Void> delete(
            @PathVariable Integer maNhanVien,
            @PathVariable Integer idRestaurant) {
        nhanVienService.delete(maNhanVien, idRestaurant);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/restaurant/{idRestaurant}")
    public List<NhanVien> getByIdRestaurant(@PathVariable Integer idRestaurant) {
        return nhanVienService.getByIdRestaurant(idRestaurant);
    }

    @GetMapping("/vai-tro/{maVaiTro}")
    public List<NhanVien> getByMaVaiTro(@PathVariable Integer maVaiTro) {
        return nhanVienService.getByMaVaiTro(maVaiTro);
    }
}

