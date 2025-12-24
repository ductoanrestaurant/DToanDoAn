package com.example.demo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class NhanVienId implements Serializable {

    @Column(name = "MANHANVIEN")
    private Integer maNhanVien;

    @Column(name = "ID_RESTAURANT")
    private Integer idRestaurant;

    public NhanVienId() {
    }

    public NhanVienId(Integer maNhanVien, Integer idRestaurant) {
        this.maNhanVien = maNhanVien;
        this.idRestaurant = idRestaurant;
    }

    public Integer getMaNhanVien() {
        return maNhanVien;
    }

    public void setMaNhanVien(Integer maNhanVien) {
        this.maNhanVien = maNhanVien;
    }

    public Integer getIdRestaurant() {
        return idRestaurant;
    }

    public void setIdRestaurant(Integer idRestaurant) {
        this.idRestaurant = idRestaurant;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        NhanVienId that = (NhanVienId) o;
        return Objects.equals(maNhanVien, that.maNhanVien) &&
               Objects.equals(idRestaurant, that.idRestaurant);
    }

    @Override
    public int hashCode() {
        return Objects.hash(maNhanVien, idRestaurant);
    }
}

