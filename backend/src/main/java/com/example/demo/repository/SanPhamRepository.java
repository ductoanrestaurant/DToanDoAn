package com.example.demo.repository;

import com.example.demo.entity.SanPham;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SanPhamRepository extends JpaRepository<SanPham, Integer> {
    // Tìm kiếm sản phẩm theo danh mục
    List<SanPham> findByDanhMucMaDanhMuc(Integer maDanhMuc);
    
    // Tìm kiếm theo tên sản phẩm
    List<SanPham> findByTenSanPhamContainingIgnoreCase(String ten);
}