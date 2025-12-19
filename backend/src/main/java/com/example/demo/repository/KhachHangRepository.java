package com.example.demo.repository;

import com.example.demo.entity.KhachHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface KhachHangRepository extends JpaRepository<KhachHang, Integer> {
    // JpaRepository đã cung cấp sẵn các hàm: findAll(), findById(), save(), deleteById()

    // 1. Kiểm tra sự tồn tại (Trả về true/false)
    boolean existsByEmail(String email);

    // 2. Tìm khách hàng theo email (Trả về đối tượng) - Phù hợp cho chức năng Đăng nhập
    Optional<KhachHang> findByEmail(String email);
}