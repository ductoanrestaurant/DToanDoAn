package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "PHIEUNHAPKHO")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PhieuNhapKho {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MAPHIEUNHAP")
    private Integer maPhieuNhap;

    @Column(name = "NHACUNGCAP", length = 100)
    private String nhaCungCap;

    @Column(name = "MANHANVIEN")
    private Integer maNhanVien;

    @Column(name = "NGAYNHAP")
    private LocalDate ngayNhap;

    @Column(name = "TONGTIEN")
    private Double tongTien;

    @Column(name = "GHICHU", columnDefinition = "TEXT")
    private String ghiChu;

    @Column(name = "ID_RESTAURANT")
    private Integer idRestaurant;
}

