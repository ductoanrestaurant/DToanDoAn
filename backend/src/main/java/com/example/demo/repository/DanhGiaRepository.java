package com.example.demo.repository;

import com.example.demo.entity.DanhGia;
import com.example.demo.entity.DanhGiaId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DanhGiaRepository extends JpaRepository<DanhGia, DanhGiaId> {
    @Query("SELECT d FROM DanhGia d WHERE d.id.maSanPham = :maSanPham")
    List<DanhGia> findByMaSanPham(Integer maSanPham);
    
    @Query("SELECT d FROM DanhGia d WHERE d.id.maTaiKhoan = :maTaiKhoan")
    List<DanhGia> findByMaTaiKhoan(Integer maTaiKhoan);
}

