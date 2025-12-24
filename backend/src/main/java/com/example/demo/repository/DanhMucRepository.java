package com.example.demo.repository;

import com.example.demo.entity.DanhMuc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DanhMucRepository extends JpaRepository<DanhMuc, Integer> {
    // Tìm kiếm danh mục theo trạng thái
    List<DanhMuc> findByTrangThai(String trangThai);
    
    // Tìm kiếm theo tên danh mục
    List<DanhMuc> findByTenDanhMucContainingIgnoreCase(String ten);
}

