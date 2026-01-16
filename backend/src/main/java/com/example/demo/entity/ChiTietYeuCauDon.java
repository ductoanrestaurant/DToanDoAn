package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    private Double gia;

    @Column(name = "TRANGTHAI")
    private String trangThai;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "MASANPHAM", referencedColumnName = "MASANPHAM", insertable = false, updatable = false)
    private SanPham sanPham;

}
