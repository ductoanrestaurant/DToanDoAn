package com.example.demo.controller.request;

import java.math.BigDecimal;
import java.util.Date;

public class ChiTietNhapRequest {
    private Integer maNguyenLieu;
    private BigDecimal soLuongNhap;
    private BigDecimal giaNhap;
    private Date ngayHetHan;

    public Integer getMaNguyenLieu() { return maNguyenLieu; }
    public void setMaNguyenLieu(Integer maNguyenLieu) { this.maNguyenLieu = maNguyenLieu; }

    public BigDecimal getSoLuongNhap() { return soLuongNhap; }
    public void setSoLuongNhap(BigDecimal soLuongNhap) { this.soLuongNhap = soLuongNhap; }

    public BigDecimal getGiaNhap() { return giaNhap; }
    public void setGiaNhap(BigDecimal giaNhap) { this.giaNhap = giaNhap; }

    public Date getNgayHetHan() { return ngayHetHan; }
    public void setNgayHetHan(Date ngayHetHan) { this.ngayHetHan = ngayHetHan; }
}
