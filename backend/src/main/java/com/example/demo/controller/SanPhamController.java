package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.entity.SanPham;
import com.example.demo.entity.ListImage; // Import ListImage
import com.example.demo.service.SanPhamService; 
import com.example.demo.dto.SanPhamMenuDTO;

import java.io.IOException; // Import IOException
import java.util.List;
import java.util.Map; // Import Map

@RestController
@RequestMapping("/api/san-pham")
@CrossOrigin("*")
public class SanPhamController {

    @Autowired
    private SanPhamService sanPhamService;


    @GetMapping
    public List<SanPham> getAll() {
        return sanPhamService.getAll();
    }

    // API lấy menu kèm số phần tối đa (dựa trên tồn kho nguyên liệu)
    @GetMapping("/menu")
    public List<SanPhamMenuDTO> getMenu() {
        return sanPhamService.getAllWithMaxServings();
    }


    @GetMapping("/{id}")
    public ResponseEntity<SanPham> getById(@PathVariable Integer id) {
        return sanPhamService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('QUAN_LY')")
    public SanPham create(@RequestBody SanPham sanPham) {
        return sanPhamService.save(sanPham);
    }

    // New API endpoint for uploading images
    @PostMapping("/{maSanPham}/upload-image")
    @PreAuthorize("hasRole('QUAN_LY')")
    public ResponseEntity<?> uploadImageForSanPham(
            @PathVariable Integer maSanPham,
            @RequestParam("file") MultipartFile file) {
        try {
            ListImage uploadedImage = sanPhamService.uploadImageForSanPham(maSanPham, file);
            return ResponseEntity.ok(uploadedImage);
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
    public ResponseEntity<SanPham> update(@PathVariable Integer id, @RequestBody SanPham sanPhamDetails) {
        return sanPhamService.getById(id).map(sanPham -> {
            sanPham.setTenSanPham(sanPhamDetails.getTenSanPham());
            sanPham.setMoTa(sanPhamDetails.getMoTa());
            sanPham.setGia(sanPhamDetails.getGia());
            sanPham.setDanhMuc(sanPhamDetails.getDanhMuc());
            
            // Correctly handle the update of the image list
            if (sanPhamDetails.getDanhSachAnh() != null) {
                // Clear the existing managed collection
                sanPham.getDanhSachAnh().clear();
                // Add the new items from the request, setting the back-reference
                for (ListImage img : sanPhamDetails.getDanhSachAnh()) {
                    img.setSanPham(sanPham); // This is crucial for the relationship
                    sanPham.getDanhSachAnh().add(img);
                }
            }

            return ResponseEntity.ok(sanPhamService.save(sanPham));
        }).orElse(ResponseEntity.notFound().build());
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('QUAN_LY')")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        sanPhamService.delete(id);
        return ResponseEntity.ok().build();
    }


    @GetMapping("/danh-muc/{maDanhMuc}")
    public List<SanPham> getByDanhMuc(@PathVariable Integer maDanhMuc) {
        return sanPhamService.getByDanhMuc(maDanhMuc);
    }
}
