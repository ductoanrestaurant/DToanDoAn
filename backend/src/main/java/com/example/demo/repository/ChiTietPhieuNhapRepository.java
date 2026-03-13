package com.example.demo.repository;

import com.example.demo.entity.ChiTietPhieuNhap;
import com.example.demo.entity.ChiTietPhieuNhapId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChiTietPhieuNhapRepository extends JpaRepository<ChiTietPhieuNhap, ChiTietPhieuNhapId> {
    List<ChiTietPhieuNhap> findById_MaPhieuNhap(Integer maPhieuNhap);
}
