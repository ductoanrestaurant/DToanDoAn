package com.example.demo.repository;

import com.example.demo.entity.PhieuNhapKho;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.time.LocalDate;

@Repository
public interface PhieuNhapKhoRepository extends JpaRepository<PhieuNhapKho, Integer> {
    List<PhieuNhapKho> findByIdRestaurant(Integer idRestaurant);
    List<PhieuNhapKho> findByNgayNhap(LocalDate ngayNhap);
    List<PhieuNhapKho> findByMaNhanVien(Integer maNhanVien);
}

