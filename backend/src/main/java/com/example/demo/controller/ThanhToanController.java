package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.ThanhToan;
import com.example.demo.service.ThanhToanService;

import java.util.List;

@RestController
@RequestMapping("/api/thanh-toan")
@CrossOrigin("*")
public class ThanhToanController {

    @Autowired
    private ThanhToanService thanhToanService;

    @GetMapping
    public List<ThanhToan> getAll() {
        return thanhToanService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ThanhToan> getById(@PathVariable Integer id) {
        return thanhToanService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ThanhToan create(@RequestBody ThanhToan thanhToan) {
        return thanhToanService.save(thanhToan);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ThanhToan> update(@PathVariable Integer id, @RequestBody ThanhToan thanhToanDetails) {
        return thanhToanService.getById(id).map(thanhToan -> {
            thanhToan.setKieuThanhToan(thanhToanDetails.getKieuThanhToan());
            return ResponseEntity.ok(thanhToanService.save(thanhToan));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        thanhToanService.delete(id);
        return ResponseEntity.ok().build();
    }
}

