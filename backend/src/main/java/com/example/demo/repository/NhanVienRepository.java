package com.example.demo.repository;

import com.example.demo.entity.NhanVien;
import com.example.demo.entity.NhanVienId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface NhanVienRepository extends JpaRepository<NhanVien, NhanVienId> {
    @Query("SELECT n FROM NhanVien n WHERE n.id.idRestaurant = :idRestaurant")
    List<NhanVien> findByIdRestaurant(Integer idRestaurant);
    
    @Query("SELECT n FROM NhanVien n WHERE n.maVaiTro = :maVaiTro")
    List<NhanVien> findByMaVaiTro(Integer maVaiTro);

    Optional<NhanVien> findByEmail(String email);

    List<NhanVien> findByTrangthai(Boolean trangthai);
}
