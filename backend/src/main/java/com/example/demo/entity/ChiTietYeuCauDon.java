package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "CHITIETYEUCAU")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChiTietYeuCauDon {

    @EmbeddedId
    private ChiTietYeuCauDonId id;

    @Column(name = "SOLUONG")
    private Integer soLuong;

    @Column(name = "GIA")
    private Float gia;

    @Column(name = "TRANGTHAI")
    private String trangThai;

    @Column(name = "update_trang_thai_at")
    private LocalDateTime updateTrangThaiAt;


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "MASANPHAM", referencedColumnName = "MASANPHAM", insertable = false, updatable = false)
    private SanPham sanPham;

}
