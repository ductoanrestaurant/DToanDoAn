package com.example.demo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class YeuCauDonId implements Serializable {

    @Column(name = "MADONHANG")
    private Integer maDonHang;

    @Column(name = "ID_RESTAURANT")
    private Integer idRestaurant;

    public YeuCauDonId() {
    }

    public YeuCauDonId(Integer maDonHang, Integer idRestaurant) {
        this.maDonHang = maDonHang;
        this.idRestaurant = idRestaurant;
    }

    public Integer getMaDonHang() {
        return maDonHang;
    }

    public void setMaDonHang(Integer maDonHang) {
        this.maDonHang = maDonHang;
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
        YeuCauDonId that = (YeuCauDonId) o;
        return Objects.equals(maDonHang, that.maDonHang) &&
               Objects.equals(idRestaurant, that.idRestaurant);
    }

    @Override
    public int hashCode() {
        return Objects.hash(maDonHang, idRestaurant);
    }
}

