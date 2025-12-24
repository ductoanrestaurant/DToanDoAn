package com.example.demo.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "khachhang")

public class KhachHang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mataikhoan")
    private Integer maTaiKhoan;

    @Column(name = "matkhau")
    private String matKhau;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "sdt")
    private String sdt;

    @Column(name = "hoten")
    private String hoTen;
    
    @Column(name = "avatar")
    private String avatar;
    
    @Column(name = "diachi")
    private String diachi;

    @Column(name = "number_log")
    private Integer numberLog;

    @Column(name = "first_log")
    private LocalDateTime firstLog;

    public Integer getMaTaiKhoan() {
        return maTaiKhoan;
    }

    public void setMaTaiKhoan(Integer maTaiKhoan) {
        this.maTaiKhoan = maTaiKhoan;
    }

    public String getMatKhau() {
        return matKhau;
    }

    public void setMatKhau(String matKhau) {
        this.matKhau = matKhau;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSdt() {
        return sdt;
    }

    public void setSdt(String sdt) {
        this.sdt = sdt;
    }

    public String getHoTen() {
        return hoTen;
    }

    public void setHoTen(String hoTen) {
        this.hoTen = hoTen;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getDiachi() {
        return diachi;
    }

    public void setDiachi(String diachi) {
        this.diachi = diachi;
    }

    public Integer getNumberLog() {
        return numberLog;
    }

    public void setNumberLog(Integer numberLog) {
        this.numberLog = numberLog;
    }

    public LocalDateTime getFirstLog() {
        return firstLog;
    }

    public void setFirstLog(LocalDateTime firstLog) {
        this.firstLog = firstLog;
    }
}
