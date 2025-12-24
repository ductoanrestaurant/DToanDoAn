package com.example.demo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class TonKhoId implements Serializable {

    @Column(name = "MANGUYENLIEU")
    private Integer maNguyenLieu;

    @Column(name = "ID_RESTAURANT")
    private Integer idRestaurant;

    public TonKhoId() {
    }

    public TonKhoId(Integer maNguyenLieu, Integer idRestaurant) {
        this.maNguyenLieu = maNguyenLieu;
        this.idRestaurant = idRestaurant;
    }

    public Integer getMaNguyenLieu() {
        return maNguyenLieu;
    }

    public void setMaNguyenLieu(Integer maNguyenLieu) {
        this.maNguyenLieu = maNguyenLieu;
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
        TonKhoId tonKhoId = (TonKhoId) o;
        return Objects.equals(maNguyenLieu, tonKhoId.maNguyenLieu) &&
               Objects.equals(idRestaurant, tonKhoId.idRestaurant);
    }

    @Override
    public int hashCode() {
        return Objects.hash(maNguyenLieu, idRestaurant);
    }
}

