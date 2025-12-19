package com.example.demo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class BanId implements Serializable {

    @Column(name = "maban")
    private Integer maBan;

    @Column(name = "id_restaurant")
    private Integer idRestaurant;

    public BanId() {
    }

    public BanId(Integer maBan, Integer idRestaurant) {
        this.maBan = maBan;
        this.idRestaurant = idRestaurant;
    }

    public Integer getMaBan() {
        return maBan;
    }

    public void setMaBan(Integer maBan) {
        this.maBan = maBan;
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
        BanId banId = (BanId) o;
        return Objects.equals(maBan, banId.maBan) &&
               Objects.equals(idRestaurant, banId.idRestaurant);
    }

    @Override
    public int hashCode() {
        return Objects.hash(maBan, idRestaurant);
    }
}

