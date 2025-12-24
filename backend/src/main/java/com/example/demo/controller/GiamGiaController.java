package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.GiamGia;
import com.example.demo.service.GiamGiaService;

import java.util.List;

@RestController
@RequestMapping("/api/giam-gia")
@CrossOrigin("*")
public class GiamGiaController {

    @Autowired
    private GiamGiaService giamGiaService;

    @GetMapping
    public List<GiamGia> getAll() {
        return giamGiaService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<GiamGia> getById(@PathVariable Integer id) {
        return giamGiaService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<GiamGia> getByCode(@PathVariable String code) {
        return giamGiaService.getByCode(code)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public GiamGia create(@RequestBody GiamGia giamGia) {
        return giamGiaService.save(giamGia);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GiamGia> update(@PathVariable Integer id, @RequestBody GiamGia giamGiaDetails) {
        return giamGiaService.getById(id).map(giamGia -> {
            giamGia.setCode(giamGiaDetails.getCode());
            giamGia.setGiaTri(giamGiaDetails.getGiaTri());
            giamGia.setMoTa(giamGiaDetails.getMoTa());
            return ResponseEntity.ok(giamGiaService.save(giamGia));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        giamGiaService.delete(id);
        return ResponseEntity.ok().build();
    }
}

