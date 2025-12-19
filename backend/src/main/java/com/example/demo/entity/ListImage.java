package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "LISTIMAGE")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ListImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_ANH")
    private Integer idAnh;

    @Column(name = "URL_ANH", length = 200)
    private String urlAnh;

    @ManyToOne
    @JoinColumn(name = "MASANPHAM", referencedColumnName = "MASANPHAM")
    @JsonIgnoreProperties({"danhSachAnh"}) // Ngăn chặn vòng lặp khi serialize JSON
    private SanPham sanPham;
}