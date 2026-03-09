package com.example.demo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "giamgia")
public class GiamGia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_giamgia")
    private Integer idGiamGia;

    @Column(name = "code", unique = true, nullable = false)
    private String code;

    @Column(name = "giatri", nullable = false)
    private Double giaTri;

    @Column(name = "mo_ta")
    private String moTa;

    @Column(name = "url_anh")
    private String urlAnh;

    // Getters and Setters
    public Integer getIdGiamGia() {
        return idGiamGia;
    }

    public void setIdGiamGia(Integer idGiamGia) {
        this.idGiamGia = idGiamGia;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Double getGiaTri() {
        return giaTri;
    }

    public void setGiaTri(Double giaTri) {
        this.giaTri = giaTri;
    }

    public String getMoTa() {
        return moTa;
    }

    public void setMoTa(String moTa) {
        this.moTa = moTa;
    }

    public String getUrlAnh() {
        return urlAnh;
    }

    public void setUrlAnh(String urlAnh) {
        this.urlAnh = urlAnh;
    }
}
