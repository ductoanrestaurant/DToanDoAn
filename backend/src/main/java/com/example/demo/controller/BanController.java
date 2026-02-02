package com.example.demo.controller;

import com.example.demo.entity.Ban;
import com.example.demo.service.BanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ban")
@CrossOrigin(origins = "*")
public class BanController {

    @Autowired
    private BanService banService;

    // getall danh sách bàn - login
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public List<Ban> getAll() {
        return banService.layTatCaBan();
    }

    // getall danh sach ban by restaurant - login
    @GetMapping("/restaurant/{idRestaurant}")
    @PreAuthorize("isAuthenticated()")
    public List<Ban> getByRestaurant(@PathVariable Integer idRestaurant) {
        return banService.layBanTheoRestaurant(idRestaurant);
    }

    // get chi tiet thong tin ban by ID - login
    @GetMapping("/{maBan}/{idRestaurant}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Ban> getById(
            @PathVariable Integer maBan,
            @PathVariable Integer idRestaurant) {
        return banService.layTheoId(maBan, idRestaurant)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // add new ban
    @PostMapping
    @PreAuthorize("hasRole('QUAN_LY')")
    public Ban create(@RequestBody Ban ban) {
        return banService.luuBan(ban);
    }

    // update info ban
    @PutMapping("/{maBan}/{idRestaurant}")
    @PreAuthorize("hasAnyRole('QUAN_LY','NHAN_VIEN')")
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

    // delete ban
    @DeleteMapping("/{maBan}/{idRestaurant}")
    @PreAuthorize("hasRole('QUAN_LY')")
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
