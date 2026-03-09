package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.math.BigDecimal;
import java.time.OffsetDateTime; // Sử dụng kiểu thời gian chuẩn cho TIMESTAMPTZ

@Entity
@Table(name = "nguyenlieu", schema = "public")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NguyenLieu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "manguyenlieu")
    private Integer maNguyenLieu;

    @Column(name = "tennguyenlieu", length = 50)
    private String tenNguyenLieu;

    @Column(name = "donvitinh", length = 50)
    private String donViTinh;

    @Column(name = "mota", columnDefinition = "TEXT")
    private String moTa;

    @Column(name = "xuatxu", length = 50)
    private String xuatXu;

    @Column(name = "trangthai", length = 50)
    private String trangThai;

    @Column(name = "soluong", precision = 19, scale = 4)
    private BigDecimal soLuong;


    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_restaurant")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Restaurant restaurant;

}