package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;

@Entity
@Table(name = "YEUTHICH")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class YeuThich {

    @EmbeddedId
    private YeuThichId id;

    @Column(name = "NGAYTHEM")
    private LocalDateTime ngayThem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MATAIKHOAN", referencedColumnName = "MATAIKHOAN", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private KhachHang khachHang;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MASANPHAM", referencedColumnName = "MASANPHAM", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private SanPham sanPham;
}

