package com.example.demo.controller;

import com.example.demo.entity.Ban;
import com.example.demo.service.BanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ban")
@CrossOrigin(origins = "*")
public class BanController {

    @Autowired
    private BanService banService;

    // 1. Lấy toàn bộ danh sách bàn
    @GetMapping
    public List<Ban> getAll() {
        return banService.layTatCaBan();
    }

    // 2. Lấy danh sách bàn theo restaurant
    @GetMapping("/restaurant/{idRestaurant}")
    public List<Ban> getByRestaurant(@PathVariable Integer idRestaurant) {
        return banService.layBanTheoRestaurant(idRestaurant);
    }

    // 3. Lấy chi tiết 1 bàn theo ID (composite key)
    @GetMapping("/{maBan}/{idRestaurant}")
    public ResponseEntity<Ban> getById(
            @PathVariable Integer maBan,
            @PathVariable Integer idRestaurant) {
        return banService.layTheoId(maBan, idRestaurant)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 4. Thêm mới bàn
    @PostMapping
    public Ban create(@RequestBody Ban ban) {
        return banService.luuBan(ban);
    }

    // 5. Cập nhật thông tin bàn
    @PutMapping("/{maBan}/{idRestaurant}")
    public ResponseEntity<Ban> update(
            @PathVariable Integer maBan,
            @PathVariable Integer idRestaurant,
            @RequestBody Ban details) {
        return banService.layTheoId(maBan, idRestaurant).map(ban -> {
            ban.setTenBan(details.getTenBan());
            ban.setSucChua(details.getSucChua());
            ban.setTrangThai(details.getTrangThai());
            return ResponseEntity.ok(banService.luuBan(ban));
        }).orElse(ResponseEntity.notFound().build());
    }

    // 6. Xóa bàn
    @DeleteMapping("/{maBan}/{idRestaurant}")
    public ResponseEntity<Void> delete(
            @PathVariable Integer maBan,
            @PathVariable Integer idRestaurant) {
        if (banService.layTheoId(maBan, idRestaurant).isPresent()) {
            banService.xoaBan(maBan, idRestaurant);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}

