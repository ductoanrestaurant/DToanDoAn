package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.DanhMuc;
import com.example.demo.service.DanhMucService;

import java.util.List;

@RestController
@RequestMapping("/api/danh-muc")
@CrossOrigin("*")
public class DanhMucController {

    @Autowired
    private DanhMucService danhMucService;

    // Lấy danh sách tất cả danh mục
    @GetMapping
    public List<DanhMuc> getAll() {
        return danhMucService.getAll();
    }

    // Lấy chi tiết một danh mục theo ID
    @GetMapping("/{id}")
    public ResponseEntity<DanhMuc> getById(@PathVariable Integer id) {
        return danhMucService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Thêm mới danh mục
    @PostMapping
    public DanhMuc create(@RequestBody DanhMuc danhMuc) {
        return danhMucService.save(danhMuc);
    }

    // Cập nhật danh mục
    @PutMapping("/{id}")
    public ResponseEntity<DanhMuc> update(@PathVariable Integer id, @RequestBody DanhMuc danhMucDetails) {
        return danhMucService.getById(id).map(danhMuc -> {
            danhMuc.setTenDanhMuc(danhMucDetails.getTenDanhMuc());
            danhMuc.setAnh(danhMucDetails.getAnh());
            danhMuc.setTrangThai(danhMucDetails.getTrangThai());
            return ResponseEntity.ok(danhMucService.save(danhMuc));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Xóa danh mục
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        danhMucService.delete(id);
        return ResponseEntity.ok().build();
    }

    // Lấy danh mục theo trạng thái
    @GetMapping("/trang-thai/{trangThai}")
    public List<DanhMuc> getByTrangThai(@PathVariable String trangThai) {
        return danhMucService.getByTrangThai(trangThai);
    }
}

