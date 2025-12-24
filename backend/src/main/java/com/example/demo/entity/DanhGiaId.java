package com.example.demo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class DanhGiaId implements Serializable {

    @Column(name = "MATAIKHOAN")
    private Integer maTaiKhoan;

    @Column(name = "MASANPHAM")
    private Integer maSanPham;

    public DanhGiaId() {
    }

    public DanhGiaId(Integer maTaiKhoan, Integer maSanPham) {
        this.maTaiKhoan = maTaiKhoan;
        this.maSanPham = maSanPham;
    }

    public Integer getMaTaiKhoan() {
        return maTaiKhoan;
    }

    public void setMaTaiKhoan(Integer maTaiKhoan) {
        this.maTaiKhoan = maTaiKhoan;
    }

    public Integer getMaSanPham() {
        return maSanPham;
    }

    public void setMaSanPham(Integer maSanPham) {
        this.maSanPham = maSanPham;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DanhGiaId danhGiaId = (DanhGiaId) o;
        return Objects.equals(maTaiKhoan, danhGiaId.maTaiKhoan) &&
               Objects.equals(maSanPham, danhGiaId.maSanPham);
    }

    @Override
    public int hashCode() {
        return Objects.hash(maTaiKhoan, maSanPham);
    }
}

