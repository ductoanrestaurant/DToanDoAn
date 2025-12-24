package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;

@Entity
@Table(name = "DANHGIA")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DanhGia {

    @EmbeddedId
    private DanhGiaId id;

    @Column(name = "NOIDUNG", columnDefinition = "TEXT")
    private String noiDung;

    @Column(name = "SOSAO")
    private Integer soSao;

    @Column(name = "NGAYDANHGIA")
    private LocalDateTime ngayDanhGia;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MATAIKHOAN", referencedColumnName = "MATAIKHOAN", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private KhachHang khachHang;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MASANPHAM", referencedColumnName = "MASANPHAM", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private SanPham sanPham;
}

