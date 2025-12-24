package com.example.demo.repository;

import com.example.demo.entity.NguyenLieu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NguyenLieuRepository extends JpaRepository<NguyenLieu, Integer> {
    List<NguyenLieu> findByRestaurantIdRestaurant(Integer idRestaurant);
    List<NguyenLieu> findByTrangThai(String trangThai);
}

