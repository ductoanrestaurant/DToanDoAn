package com.example.demo.entity;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class ChiTietPhieuNhapId implements Serializable {

    private Integer maPhieuNhap;
    private Integer maNguyenLieu;

    public ChiTietPhieuNhapId() {}

    public ChiTietPhieuNhapId(Integer maPhieuNhap, Integer maNguyenLieu) {
        this.maPhieuNhap = maPhieuNhap;
        this.maNguyenLieu = maNguyenLieu;
    }

    // Getters, Setters, equals, and hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ChiTietPhieuNhapId that = (ChiTietPhieuNhapId) o;
        return Objects.equals(maPhieuNhap, that.maPhieuNhap) &&
                Objects.equals(maNguyenLieu, that.maNguyenLieu);
    }

    @Override
    public int hashCode() {
        return Objects.hash(maPhieuNhap, maNguyenLieu);
    }
}
