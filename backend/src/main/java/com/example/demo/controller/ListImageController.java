package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.ListImage;
import com.example.demo.service.ListImageService;

import java.util.List;

@RestController
@RequestMapping("/api/list-image")
@CrossOrigin("*")
public class ListImageController {

    @Autowired
    private ListImageService listImageService;

    @GetMapping
    public List<ListImage> getAll() {
        return listImageService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ListImage> getById(@PathVariable Integer id) {
        return listImageService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ListImage create(@RequestBody ListImage listImage) {
        return listImageService.save(listImage);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ListImage> update(@PathVariable Integer id, @RequestBody ListImage listImageDetails) {
        return listImageService.getById(id).map(listImage -> {
            listImage.setUrlAnh(listImageDetails.getUrlAnh());
            listImage.setSanPham(listImageDetails.getSanPham());
            return ResponseEntity.ok(listImageService.save(listImage));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        listImageService.delete(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/san-pham/{maSanPham}")
    public List<ListImage> getByMaSanPham(@PathVariable Integer maSanPham) {
        return listImageService.getByMaSanPham(maSanPham);
    }
}

