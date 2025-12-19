package com.example.demo.entity;
import jakarta.persistence.*;
import lombok.*;
import java.util.List; 

@Entity
@Table(name = "SANPHAM")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SanPham {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MASANPHAM")
    private Integer maSanPham;

    @Column(name = "TENSANPHAM", length = 100)
    private String tenSanPham;

    @Column(name = "MOTA", columnDefinition = "TEXT")
    private String moTa;

    @Column(name = "GIA")
    private Double gia;

    // Liên kết với bảng DanhMuc (Khóa ngoại MADANHMUC)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "MADANHMUC", referencedColumnName = "MADANHMUC")
    private DanhMuc danhMuc;

    // Thêm vào bên trong class SanPham
    @OneToMany(mappedBy = "sanPham", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ListImage> danhSachAnh;

}