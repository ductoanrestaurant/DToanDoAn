package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.NhanVien;
import com.example.demo.service.NhanVienService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/nhan-vien")
@CrossOrigin("*")
public class NhanVienController {

    @Autowired
    private NhanVienService nhanVienService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public List<NhanVien> getAll() {
        return nhanVienService.getAll();
    }

    @GetMapping("/{maNhanVien}/{idRestaurant}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<NhanVien> getById(
            @PathVariable Integer maNhanVien,
            @PathVariable Integer idRestaurant) {
        return nhanVienService.getById(maNhanVien, idRestaurant)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('QUAN_LY')")
    public NhanVien create(@RequestBody NhanVien nhanVien) {
        return nhanVienService.save(nhanVien);
    }

    @PutMapping("/{maNhanVien}/{idRestaurant}")
    @PreAuthorize("hasAnyRole('QUAN_LY','NHAN_VIEN')")
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

    @PutMapping("/{maNhanVien}/{idRestaurant}/status")
    @PreAuthorize("hasRole('QUAN_LY')")
    public ResponseEntity<NhanVien> updateStatus(
            @PathVariable Integer maNhanVien,
            @PathVariable Integer idRestaurant,
            @RequestBody Map<String, Boolean> status) {
        return nhanVienService.updateStatus(maNhanVien, idRestaurant, status.get("trangthai"))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{maNhanVien}/{idRestaurant}")
    @PreAuthorize("hasRole('QUAN_LY')")
    public ResponseEntity<Void> delete(
            @PathVariable Integer maNhanVien,
            @PathVariable Integer idRestaurant) {
        nhanVienService.delete(maNhanVien, idRestaurant);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/restaurant/{idRestaurant}")
    @PreAuthorize("isAuthenticated()")
    public List<NhanVien> getByIdRestaurant(@PathVariable Integer idRestaurant) {
        return nhanVienService.getByIdRestaurant(idRestaurant);
    }

    @GetMapping("/vai-tro/{maVaiTro}")
    @PreAuthorize("isAuthenticated()")
    public List<NhanVien> getByMaVaiTro(@PathVariable Integer maVaiTro) {
        return nhanVienService.getByMaVaiTro(maVaiTro);
    }
}
