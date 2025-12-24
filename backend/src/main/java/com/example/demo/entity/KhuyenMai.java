package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "KHUYENMAI")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class KhuyenMai {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_KHUYENMAI")
    private Integer idKhuyenMai;

    @Column(name = "MAKHUYENMAI")
    private Integer maKhuyenMai;

    @Column(name = "GIATRI")
    private Double giaTri;

    @Column(name = "NGAYBATDAU")
    private LocalDate ngayBatDau;

    @Column(name = "NGAYKETTHUC")
    private LocalDate ngayKetThuc;

    @Column(name = "TRANGTHAI", length = 50)
    private String trangThai;

    @Column(name = "MASANPHAM")
    private Integer maSanPham;
}

