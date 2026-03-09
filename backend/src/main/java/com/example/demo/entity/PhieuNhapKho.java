package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime; // Sử dụng để khớp với 'timestamp with time zone'

@Entity
@Table(name = "phieunhapkho", schema = "public")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PhieuNhapKho {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mapieunhap") // Postgres thường dùng tên viết thường
    private Integer maPhieuNhap;

    @Column(name = "nhacungcap", length = 100)
    private String nhaCungCap;

    @Column(name = "manhanvien")
    private Integer maNhanVien;

    // Chuyển từ LocalDate sang OffsetDateTime để nhận đủ cả ngày và giờ
    // Khớp với kiểu 'timestamp with time zone' trong ảnh image_4c745e.png
    @Column(name = "ngaynhap")
    private OffsetDateTime ngayNhap;

    @Column(name = "tongtien", precision = 19, scale = 4)
    private BigDecimal tongTien;

    @Column(name = "ghichu", columnDefinition = "TEXT")
    private String ghiChu;

    @Column(name = "id_restaurant")
    private Integer idRestaurant;
}