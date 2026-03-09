package com.example.demo.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "chitietphieunhap")
public class ChiTietPhieuNhap {

    @EmbeddedId
    private ChiTietPhieuNhapId id;

    @Column(name = "soluongnhap", precision = 19, scale = 4)
    private BigDecimal soLuongNhap;

    @Column(name = "gianhap", precision = 19, scale = 4)
    private BigDecimal giaNhap;

    @Column(name = "ngayhethan")
    @Temporal(TemporalType.DATE)
    private Date ngayHetHan;

    // Getters and Setters
    public ChiTietPhieuNhapId getId() {
        return id;
    }

    public void setId(ChiTietPhieuNhapId id) {
        this.id = id;
    }

    public BigDecimal getSoLuongNhap() {
        return soLuongNhap;
    }

    public void setSoLuongNhap(BigDecimal soLuongNhap) {
        this.soLuongNhap = soLuongNhap;
    }

    public BigDecimal getGiaNhap() {
        return giaNhap;
    }

    public void setGiaNhap(BigDecimal giaNhap) {
        this.giaNhap = giaNhap;
    }

    public Date getNgayHetHan() {
        return ngayHetHan;
    }

    public void setNgayHetHan(Date ngayHetHan) {
        this.ngayHetHan = ngayHetHan;
    }
}
