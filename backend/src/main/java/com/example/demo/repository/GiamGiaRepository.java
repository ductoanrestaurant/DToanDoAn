package com.example.demo.repository;

import com.example.demo.entity.GiamGia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface GiamGiaRepository extends JpaRepository<GiamGia, Integer> {
    Optional<GiamGia> findByCode(String code);
}

