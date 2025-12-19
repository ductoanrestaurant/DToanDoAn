package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "ban")
public class Ban {

    @EmbeddedId
    private BanId id;

    @Column(name = "tenban", length = 50)
    private String tenBan;

    @Column(name = "succhua")
    private Integer sucChua;

    @Column(name = "trangthai")
    private Boolean trangThai;

    public Ban() {
    }

    public BanId getId() {
        return id;
    }

    public void setId(BanId id) {
        this.id = id;
    }

    public String getTenBan() {
        return tenBan;
    }

    public void setTenBan(String tenBan) {
        this.tenBan = tenBan;
    }

    public Integer getSucChua() {
        return sucChua;
    }

    public void setSucChua(Integer sucChua) {
        this.sucChua = sucChua;
    }

    public Boolean getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(Boolean trangThai) {
        this.trangThai = trangThai;
    }
}

