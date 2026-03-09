package com.example.demo.controller;

import com.example.demo.entity.CongThuc;
import com.example.demo.service.CongThucService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cong-thuc")
public class CongThucController {

    @Autowired
    private CongThucService congThucService;

    @GetMapping("/san-pham/{maSanPham}")
    public ResponseEntity<List<CongThuc>> getCongThucBySanPham(@PathVariable("maSanPham") Integer maSanPham) {
        List<CongThuc> congThucList = congThucService.getCongThucByMaSanPham(maSanPham);
        return new ResponseEntity<>(congThucList, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<CongThuc> createCongThuc(@RequestBody CongThuc congThuc) {
        CongThuc newCongThuc = congThucService.createCongThuc(congThuc);
        return new ResponseEntity<>(newCongThuc, HttpStatus.CREATED);
    }

    @PutMapping("/{maSanPham}/{maNguyenLieu}")
    public ResponseEntity<CongThuc> updateCongThuc(@PathVariable("maSanPham") Integer maSanPham,
                                                   @PathVariable("maNguyenLieu") Integer maNguyenLieu,
                                                   @RequestBody CongThuc congThucDetails) {
        CongThuc updatedCongThuc = congThucService.updateCongThuc(maSanPham, maNguyenLieu, congThucDetails);
        if (updatedCongThuc != null) {
            return new ResponseEntity<>(updatedCongThuc, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{maSanPham}/{maNguyenLieu}")
    public ResponseEntity<HttpStatus> deleteCongThuc(@PathVariable("maSanPham") Integer maSanPham,
                                                     @PathVariable("maNguyenLieu") Integer maNguyenLieu) {
        try {
            congThucService.deleteCongThuc(maSanPham, maNguyenLieu);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
