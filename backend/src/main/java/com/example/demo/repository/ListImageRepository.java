package com.example.demo.repository;

import com.example.demo.entity.ListImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ListImageRepository extends JpaRepository<ListImage, Integer> {
    List<ListImage> findBySanPhamMaSanPham(Integer maSanPham);
}

