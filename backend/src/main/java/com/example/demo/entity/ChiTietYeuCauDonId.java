package com.example.demo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChiTietYeuCauDonId implements Serializable {

    @Column(name = "MADONHANG")
    private Integer maDonHang;

    @Column(name = "ID_RESTAURANT")
    private Integer idRestaurant;

    @Column(name = "MASANPHAM")
    private Integer maSanPham;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ChiTietYeuCauDonId that = (ChiTietYeuCauDonId) o;
        return Objects.equals(maDonHang, that.maDonHang) &&
               Objects.equals(idRestaurant, that.idRestaurant) &&
               Objects.equals(maSanPham, that.maSanPham);
    }

    @Override
    public int hashCode() {
        return Objects.hash(maDonHang, idRestaurant, maSanPham);
    }
}
