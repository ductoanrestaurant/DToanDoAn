package com.example.demo.repository;

import com.example.demo.entity.TonKho;
import com.example.demo.entity.TonKhoId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TonKhoRepository extends JpaRepository<TonKho, TonKhoId> {
    @Query("SELECT t FROM TonKho t WHERE t.id.idRestaurant = :idRestaurant")
    List<TonKho> findByIdRestaurant(Integer idRestaurant);
    
    @Query("SELECT t FROM TonKho t WHERE t.id.maNguyenLieu = :maNguyenLieu")
    List<TonKho> findByMaNguyenLieu(Integer maNguyenLieu);
}

