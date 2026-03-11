package com.example.demo.repository;

import com.example.demo.entity.ChiTietYeuCauDon;
import com.example.demo.entity.ChiTietYeuCauDonId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChiTietYeuCauDonRepository extends JpaRepository<ChiTietYeuCauDon, ChiTietYeuCauDonId> {
    @Query("SELECT c.id.maDonHang FROM ChiTietYeuCauDon c WHERE c.trangThai IN ('hoàn thành', 'Đã hủy')")
    List<Integer> findMaDonHangByTrangThaiNot();
}
