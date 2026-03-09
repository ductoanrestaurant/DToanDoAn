package com.example.demo.repository;

import com.example.demo.entity.CongThuc;
import com.example.demo.entity.CongThucId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CongThucRepository extends JpaRepository<CongThuc, CongThucId> {

    List<CongThuc> findByMaSanPham(Integer maSanPham);

    CongThuc findByMaSanPhamAndMaNguyenLieu(Integer maSanPham, Integer maNguyenLieu);
}
