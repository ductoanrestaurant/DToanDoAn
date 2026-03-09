package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.entity.GiamGia;
import com.example.demo.service.GiamGiaService;

import java.io.IOException;
import java.util.List;
import java.util.Map;

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
    @PreAuthorize("hasRole('QUAN_LY')")
    public GiamGia create(@RequestBody GiamGia giamGia) {
        return giamGiaService.save(giamGia);
    }

    @PostMapping("/{id}/upload-image")
    @PreAuthorize("hasRole('QUAN_LY')")
    public ResponseEntity<?> uploadImageForGiamGia(
            @PathVariable Integer id,
            @RequestParam("file") MultipartFile file) {
        try {
            GiamGia updatedGiamGia = giamGiaService.uploadImageForGiamGia(id, file);
            return ResponseEntity.ok(updatedGiamGia);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(Map.of("message", "Could not upload the file: " + e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('QUAN_LY')")
    public ResponseEntity<GiamGia> update(@PathVariable Integer id, @RequestBody GiamGia giamGiaDetails) {
        return giamGiaService.getById(id).map(existingGiamGia -> {
            giamGiaDetails.setIdGiamGia(id);
            GiamGia updatedGiamGia = giamGiaService.save(giamGiaDetails);
            return ResponseEntity.ok(updatedGiamGia);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('QUAN_LY')")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        giamGiaService.delete(id);
        return ResponseEntity.ok().build();
    }
}
