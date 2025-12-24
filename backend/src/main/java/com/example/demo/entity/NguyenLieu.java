package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "NGUYENLIEU")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NguyenLieu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MANGUYENLIEU")
    private Integer maNguyenLieu;

    @Column(name = "TENNGUYENLIEU", length = 50)
    private String tenNguyenLieu;

    @Column(name = "DONVITINH", length = 50)
    private String donViTinh;

    @Column(name = "MOTA", columnDefinition = "TEXT")
    private String moTa;

    @Column(name = "XUATXU", length = 50)
    private String xuatXu;

    @Column(name = "GIAMUA")
    private Double giaMua;

    @Column(name = "TRANGTHAI", length = 50)
    private String trangThai;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_RESTAURANT", referencedColumnName = "ID_RESTAURANT")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Restaurant restaurant;
}

