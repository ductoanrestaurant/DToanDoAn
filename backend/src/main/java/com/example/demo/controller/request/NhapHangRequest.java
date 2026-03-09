package com.example.demo.controller.request;

import java.math.BigDecimal;
import java.util.Date;

public class NhapHangRequest {
    private Integer maNguyenLieu;
    private BigDecimal soLuongNhap;
    private BigDecimal giaNhap;
    private Date ngayHetHan;
    private String nhaCungCap;
    private String ghiChu;
    private Integer maNhanVien; // ID of the employee performing the import

    // Getters and Setters
    public Integer getMaNguyenLieu() {
        return maNguyenLieu;
    }

    public void setMaNguyenLieu(Integer maNguyenLieu) {
        this.maNguyenLieu = maNguyenLieu;
    }

    public BigDecimal getSoLuongNhap() {
        return soLuongNhap;
    }

    public void setSoLuongNhap(BigDecimal soLuongNhap) {
        this.soLuongNhap = soLuongNhap;
    }

    public BigDecimal getGiaNhap() {
        return giaNhap;
    }

    public void setGiaNhap(BigDecimal giaNhap) {
        this.giaNhap = giaNhap;
    }

    public Date getNgayHetHan() {
        return ngayHetHan;
    }

    public void setNgayHetHan(Date ngayHetHan) {
        this.ngayHetHan = ngayHetHan;
    }

    public String getNhaCungCap() {
        return nhaCungCap;
    }

    public void setNhaCungCap(String nhaCungCap) {
        this.nhaCungCap = nhaCungCap;
    }

    public String getGhiChu() {
        return ghiChu;
    }

    public void setGhiChu(String ghiChu) {
        this.ghiChu = ghiChu;
    }

    public Integer getMaNhanVien() {
        return maNhanVien;
    }

    public void setMaNhanVien(Integer maNhanVien) {
        this.maNhanVien = maNhanVien;
    }
}
