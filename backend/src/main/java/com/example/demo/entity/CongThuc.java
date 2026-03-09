package com.example.demo.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "congthuc")
@IdClass(CongThucId.class)
public class CongThuc {

    @Id
    @Column(name = "masanpham")
    private Integer maSanPham;

    @Id
    @Column(name = "manguyenlieu")
    private Integer maNguyenLieu;

    @Column(name = "slnguyenlieu")
    private BigDecimal slNguyenLieu;

    // Getters and Setters

    public Integer getMaSanPham() {
        return maSanPham;
    }

    public void setMaSanPham(Integer maSanPham) {
        this.maSanPham = maSanPham;
    }

    public Integer getMaNguyenLieu() {
        return maNguyenLieu;
    }

    public void setMaNguyenLieu(Integer maNguyenLieu) {
        this.maNguyenLieu = maNguyenLieu;
    }

    public BigDecimal getSlNguyenLieu() {
        return slNguyenLieu;
    }

    public void setSlNguyenLieu(BigDecimal slNguyenLieu) {
        this.slNguyenLieu = slNguyenLieu;
    }
}
