package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "YEUCAUDON")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class YeuCauDon {

    @EmbeddedId
    private YeuCauDonId id;

    @Column(name = "TRANGTHAITHANHTOAN", length = 50)
    private String trangThaiThanhToan;

    @Column(name = "THOIGIANTHANHTOAN")
    private LocalDateTime thoiGianThanhToan;

    @Column(name = "NGAYTAODON")
    private LocalDateTime ngayTaoDon;

    @Column(name = "TONGTIEN")
    private Double tongTien;

    @Column(name = "MATAIKHOAN")
    private Integer maTaiKhoan;

    @Column(name = "ID_THANHTOAN")
    private Integer idThanhToan;

    @Column(name = "GHICHU", columnDefinition = "TEXT")
    private String ghiChu;

    @Column(name = "ID_GIAMGIA")
    private Integer idGiamGia;

    @Column(name = "MABAN")
    private Integer maBan;

    @Column(name = "MANHANVIEN")
    private Integer maNhanVien;

    @Column(name = "GIOSUDUNG")
    private LocalDateTime gioSuDung;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
        @JoinColumn(name = "MANHANVIEN", referencedColumnName = "MANHANVIEN", insertable = false, updatable = false),
        @JoinColumn(name = "ID_RESTAURANT", referencedColumnName = "ID_RESTAURANT", insertable = false, updatable = false)
    })
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private NhanVien nhanVien;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MATAIKHOAN", referencedColumnName = "MATAIKHOAN", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private KhachHang khachHang;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_THANHTOAN", referencedColumnName = "ID_THANHTOAN", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private ThanhToan thanhToan;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_GIAMGIA", referencedColumnName = "ID_GIAMGIA", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private GiamGia giamGia;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "MADONHANG", referencedColumnName = "MADONHANG", insertable = false, updatable = false),
            @JoinColumn(name = "ID_RESTAURANT", referencedColumnName = "ID_RESTAURANT", insertable = false, updatable = false)
    })
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private List<ChiTietYeuCauDon> chiTietYeuCauDons;
}
