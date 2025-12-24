package com.example.demo.repository;

import com.example.demo.entity.YeuThich;
import com.example.demo.entity.YeuThichId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface YeuThichRepository extends JpaRepository<YeuThich, YeuThichId> {
    @Query("SELECT y FROM YeuThich y WHERE y.id.maTaiKhoan = :maTaiKhoan")
    List<YeuThich> findByMaTaiKhoan(Integer maTaiKhoan);
    
    @Query("SELECT y FROM YeuThich y WHERE y.id.maSanPham = :maSanPham")
    List<YeuThich> findByMaSanPham(Integer maSanPham);
}

