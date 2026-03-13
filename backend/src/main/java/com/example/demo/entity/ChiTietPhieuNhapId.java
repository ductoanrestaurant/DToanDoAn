package com.example.demo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class ChiTietPhieuNhapId implements Serializable {

    @Column(name = "maphieunhap")
    private Integer maPhieuNhap;

    @Column(name = "manguyenlieu")
    private Integer maNguyenLieu;

    public ChiTietPhieuNhapId() {}

    public ChiTietPhieuNhapId(Integer maPhieuNhap, Integer maNguyenLieu) {
        this.maPhieuNhap = maPhieuNhap;
        this.maNguyenLieu = maNguyenLieu;
    }

    public Integer getMaPhieuNhap() { return maPhieuNhap; }
    public void setMaPhieuNhap(Integer maPhieuNhap) { this.maPhieuNhap = maPhieuNhap; }
    public Integer getMaNguyenLieu() { return maNguyenLieu; }
    public void setMaNguyenLieu(Integer maNguyenLieu) { this.maNguyenLieu = maNguyenLieu; }

    // equals and hashCode
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
