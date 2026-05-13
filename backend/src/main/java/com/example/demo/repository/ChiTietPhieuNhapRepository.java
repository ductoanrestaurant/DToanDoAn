package com.example.demo.repository;

import com.example.demo.entity.ChiTietPhieuNhap;
import com.example.demo.entity.ChiTietPhieuNhapId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface ChiTietPhieuNhapRepository extends JpaRepository<ChiTietPhieuNhap, ChiTietPhieuNhapId> {
    List<ChiTietPhieuNhap> findById_MaPhieuNhap(Integer maPhieuNhap);

    // Lấy ngày hết hạn gần nhất (sắp xảy ra) cho từng nguyên liệu
    @Query(value = "SELECT MIN(ngayhethan) FROM chitietphieunhap WHERE manguyenlieu = :maNguyenLieu AND ngayhethan IS NOT NULL", nativeQuery = true)
    Date findNearestExpiryByMaNguyenLieu(@Param("maNguyenLieu") Integer maNguyenLieu);
}
