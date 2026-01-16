package com.example.demo.repository;

import com.example.demo.entity.YeuCauDon;
import com.example.demo.entity.YeuCauDonId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface YeuCauDonRepository extends JpaRepository<YeuCauDon, YeuCauDonId> {
    @Query("SELECT y FROM YeuCauDon y WHERE y.id.idRestaurant = :idRestaurant")
    List<YeuCauDon> findByIdRestaurant(Integer idRestaurant);

    @Query("SELECT y FROM YeuCauDon y WHERE y.maTaiKhoan = :maTaiKhoan")
    List<YeuCauDon> findByMaTaiKhoan(Integer maTaiKhoan);

    @Query("SELECT y FROM YeuCauDon y WHERE y.trangThaiThanhToan = :trangThai")
    List<YeuCauDon> findByTrangThaiThanhToan(String trangThai);

    @Query("SELECT MAX(y.id.maDonHang) FROM YeuCauDon y WHERE y.id.idRestaurant = :idRestaurant")
    Optional<Integer> findMaxMaDonHangByIdRestaurant(@Param("idRestaurant") Integer idRestaurant);
}
