package com.example.demo.repository;

import com.example.demo.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Integer> {
    // Tìm kiếm nhà hàng theo trạng thái
    List<Restaurant> findByStatus(String status);
    
    // Tìm kiếm nhà hàng con theo parentId
    List<Restaurant> findByParentId(Integer parentId);
    
    // Tìm kiếm theo tên
    List<Restaurant> findByTenContainingIgnoreCase(String ten);
}

