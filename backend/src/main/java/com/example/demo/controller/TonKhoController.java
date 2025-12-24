package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.TonKho;
import com.example.demo.service.TonKhoService;

import java.util.List;

@RestController
@RequestMapping("/api/ton-kho")
@CrossOrigin("*")
public class TonKhoController {

    @Autowired
    private TonKhoService tonKhoService;

    @GetMapping
    public List<TonKho> getAll() {
        return tonKhoService.getAll();
    }

    @GetMapping("/{maNguyenLieu}/{idRestaurant}")
    public ResponseEntity<TonKho> getById(
            @PathVariable Integer maNguyenLieu,
            @PathVariable Integer idRestaurant) {
        return tonKhoService.getById(maNguyenLieu, idRestaurant)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public TonKho create(@RequestBody TonKho tonKho) {
        return tonKhoService.save(tonKho);
    }

    @PutMapping("/{maNguyenLieu}/{idRestaurant}")
    public ResponseEntity<TonKho> update(
            @PathVariable Integer maNguyenLieu,
            @PathVariable Integer idRestaurant,
            @RequestBody TonKho tonKhoDetails) {
        return tonKhoService.getById(maNguyenLieu, idRestaurant).map(tonKho -> {
            tonKho.setSoLuongHienTai(tonKhoDetails.getSoLuongHienTai());
            tonKho.setThoiGianUpdate(tonKhoDetails.getThoiGianUpdate());
            return ResponseEntity.ok(tonKhoService.save(tonKho));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{maNguyenLieu}/{idRestaurant}")
    public ResponseEntity<Void> delete(
            @PathVariable Integer maNguyenLieu,
            @PathVariable Integer idRestaurant) {
        tonKhoService.delete(maNguyenLieu, idRestaurant);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/restaurant/{idRestaurant}")
    public List<TonKho> getByIdRestaurant(@PathVariable Integer idRestaurant) {
        return tonKhoService.getByIdRestaurant(idRestaurant);
    }

    @GetMapping("/nguyen-lieu/{maNguyenLieu}")
    public List<TonKho> getByMaNguyenLieu(@PathVariable Integer maNguyenLieu) {
        return tonKhoService.getByMaNguyenLieu(maNguyenLieu);
    }
}

