package com.example.demo.entity;

import java.io.Serializable;
import java.util.Objects;

public class CongThucId implements Serializable {

    private Integer maSanPham;
    private Integer maNguyenLieu;

    public CongThucId() {
    }

    public CongThucId(Integer maSanPham, Integer maNguyenLieu) {
        this.maSanPham = maSanPham;
        this.maNguyenLieu = maNguyenLieu;
    }

    // Getters, Setters, equals, and hashCode methods

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CongThucId that = (CongThucId) o;
        return Objects.equals(maSanPham, that.maSanPham) &&
                Objects.equals(maNguyenLieu, that.maNguyenLieu);
    }

    @Override
    public int hashCode() {
        return Objects.hash(maSanPham, maNguyenLieu);
    }
}
