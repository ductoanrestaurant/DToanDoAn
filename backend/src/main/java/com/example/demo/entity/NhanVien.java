package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDate;

@Entity
@Table(name = "NHANVIEN")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NhanVien {

    @EmbeddedId
    private NhanVienId id;

    @Column(name = "TENNHANVIEN", length = 50)
    private String tenNhanVien;

    @Column(name = "EMAIL", length = 50)
    private String email;

    @Column(name = "PASSWORD", length = 255)
    private String password;

    @Column(name = "MOTA", columnDefinition = "TEXT")
    private String moTa;

    @Column(name = "NUMBER_LOG")
    private Integer numberLog;

    @Column(name = "FIRST_LOG")
    private LocalDate firstLog;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MAVAITRO", referencedColumnName = "MAVAITRO", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private VaiTro vaiTro;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_RESTAURANT", referencedColumnName = "ID_RESTAURANT", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Restaurant restaurant;

    @Column(name = "MAVAITRO")
    private Integer maVaiTro;

    @Column(name = "TRANGTHAI")
    private Boolean trangthai;
}
