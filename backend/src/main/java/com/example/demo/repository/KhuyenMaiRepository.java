package com.example.demo.repository;

import com.example.demo.entity.KhuyenMai;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.time.LocalDate;

@Repository
public interface KhuyenMaiRepository extends JpaRepository<KhuyenMai, Integer> {
    List<KhuyenMai> findByMaSanPham(Integer maSanPham);
    List<KhuyenMai> findByTrangThai(String trangThai);
    List<KhuyenMai> findByNgayBatDauLessThanEqualAndNgayKetThucGreaterThanEqual(LocalDate date1, LocalDate date2);
}

