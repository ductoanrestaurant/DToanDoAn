package com.example.demo.repository;

import com.example.demo.entity.Ban;
import com.example.demo.entity.BanId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BanRepository extends JpaRepository<Ban, BanId> {
    // JpaRepository đã cung cấp sẵn các hàm: findAll(), findById(), save(), deleteById()
    
    // Tìm tất cả bàn theo id_restaurant, sắp xếp theo mã bàn
    @Query("SELECT b FROM Ban b WHERE b.id.idRestaurant = :idRestaurant ORDER BY b.id.maBan ASC")
    List<Ban> findById_IdRestaurantOrderByMaBanAsc(Integer idRestaurant);
    
    // Tìm tất cả bàn, sắp xếp theo mã bàn
    @Query("SELECT b FROM Ban b ORDER BY b.id.maBan ASC")
    List<Ban> findAllOrderByMaBanAsc();

    // Tìm giá trị maBan lớn nhất cho một idRestaurant
    @Query("SELECT MAX(b.id.maBan) FROM Ban b WHERE b.id.idRestaurant = :idRestaurant")
    Integer findMaxMaBanByIdRestaurant(@Param("idRestaurant") Integer idRestaurant);

    // Thêm hàm tìm bàn theo trạng thái
    List<Ban> findByTrangThai(boolean trangThai);

    @Query("SELECT b FROM Ban b WHERE b.id.idRestaurant = :idRestaurant AND b.id.maBan IN :maBanList ORDER BY b.id.maBan ASC")
    List<Ban> findByIdRestaurantAndMaBanIn(@Param("idRestaurant") Integer idRestaurant, @Param("maBanList") List<Integer> maBanList);
}
