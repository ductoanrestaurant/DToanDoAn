package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.VaiTro;
import com.example.demo.service.VaiTroService;

import java.util.List;

@RestController
@RequestMapping("/api/vai-tro")
@PreAuthorize("hasRole('QUAN_LY')")
@CrossOrigin("*")
public class VaiTroController {

    @Autowired
    private VaiTroService vaiTroService;

    @GetMapping
    public List<VaiTro> getAll() {
        return vaiTroService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<VaiTro> getById(@PathVariable Integer id) {
        return vaiTroService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public VaiTro create(@RequestBody VaiTro vaiTro) {
        return vaiTroService.save(vaiTro);
    }

    @PutMapping("/{id}")
    public ResponseEntity<VaiTro> update(@PathVariable Integer id, @RequestBody VaiTro vaiTroDetails) {
        return vaiTroService.getById(id).map(vaiTro -> {
            vaiTro.setTenVaiTro(vaiTroDetails.getTenVaiTro());
            vaiTro.setMoTa(vaiTroDetails.getMoTa());
            return ResponseEntity.ok(vaiTroService.save(vaiTro));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        vaiTroService.delete(id);
        return ResponseEntity.ok().build();
    }
}

