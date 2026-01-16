package com.example.demo.repository;

import com.example.demo.entity.ChiTietYeuCauDon;
import com.example.demo.entity.ChiTietYeuCauDonId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChiTietYeuCauDonRepository extends JpaRepository<ChiTietYeuCauDon, ChiTietYeuCauDonId> {
}
