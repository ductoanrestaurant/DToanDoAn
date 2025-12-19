package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;

@Entity
@Table(name = "DANHMUC")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DanhMuc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MADANHMUC")
    private Integer maDanhMuc;

    @Column(name = "TENDANHMUC", length = 100)
    private String tenDanhMuc;

    @Column(name = "ANH", length = 200)
    private String anh;

    @Column(name = "TRANGTHAI", length = 20)
    private String trangThai;

    // Một danh mục có nhiều sản phẩm
    @OneToMany(mappedBy = "danhMuc", cascade = CascadeType.ALL)
    @JsonIgnore // Ngăn chặn vòng lặp khi serialize JSON
    private List<SanPham> sanPhams;
}