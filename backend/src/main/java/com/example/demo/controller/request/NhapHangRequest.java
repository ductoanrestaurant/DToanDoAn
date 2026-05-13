package com.example.demo.controller.request;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

public class NhapHangRequest {
    // Thông tin chung của phiếu
    private String nhaCungCap;
    private String ghiChu;

    // Danh sách nguyên liệu (hỗ trợ nhập nhiều nguyên liệu 1 lần)
    private List<ChiTietNhapRequest> chiTiets;

    // --- Giữ backward compatible với form 1 nguyên liệu cũ ---
    private Integer maNguyenLieu;
    private BigDecimal soLuongNhap;
    private BigDecimal giaNhap;
    private Date ngayHetHan;
    private Integer maNhanVien;

    // Getters & Setters
    public String getNhaCungCap() { return nhaCungCap; }
    public void setNhaCungCap(String nhaCungCap) { this.nhaCungCap = nhaCungCap; }

    public String getGhiChu() { return ghiChu; }
    public void setGhiChu(String ghiChu) { this.ghiChu = ghiChu; }

    public List<ChiTietNhapRequest> getChiTiets() { return chiTiets; }
    public void setChiTiets(List<ChiTietNhapRequest> chiTiets) { this.chiTiets = chiTiets; }

    public Integer getMaNguyenLieu() { return maNguyenLieu; }
    public void setMaNguyenLieu(Integer maNguyenLieu) { this.maNguyenLieu = maNguyenLieu; }

    public BigDecimal getSoLuongNhap() { return soLuongNhap; }
    public void setSoLuongNhap(BigDecimal soLuongNhap) { this.soLuongNhap = soLuongNhap; }

    public BigDecimal getGiaNhap() { return giaNhap; }
    public void setGiaNhap(BigDecimal giaNhap) { this.giaNhap = giaNhap; }

    public Date getNgayHetHan() { return ngayHetHan; }
    public void setNgayHetHan(Date ngayHetHan) { this.ngayHetHan = ngayHetHan; }

    public Integer getMaNhanVien() { return maNhanVien; }
    public void setMaNhanVien(Integer maNhanVien) { this.maNhanVien = maNhanVien; }
}
