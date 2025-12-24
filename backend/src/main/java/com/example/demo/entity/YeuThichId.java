package com.example.demo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class YeuThichId implements Serializable {

    @Column(name = "MATAIKHOAN")
    private Integer maTaiKhoan;

    @Column(name = "MASANPHAM")
    private Integer maSanPham;

    public YeuThichId() {
    }

    public YeuThichId(Integer maTaiKhoan, Integer maSanPham) {
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
        YeuThichId yeuThichId = (YeuThichId) o;
        return Objects.equals(maTaiKhoan, yeuThichId.maTaiKhoan) &&
               Objects.equals(maSanPham, yeuThichId.maSanPham);
    }

    @Override
    public int hashCode() {
        return Objects.hash(maTaiKhoan, maSanPham);
    }
}

