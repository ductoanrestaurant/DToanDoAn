package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "TONKHO")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TonKho {

    @EmbeddedId
    private TonKhoId id;

    @Column(name = "SOLUONGHIENTAI")
    private BigDecimal soLuongHienTai;

    @Column(name = "THOIGIANUPDATE")
    private LocalDateTime thoiGianUpdate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MANGUYENLIEU", referencedColumnName = "MANGUYENLIEU", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private NguyenLieu nguyenLieu;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_RESTAURANT", referencedColumnName = "ID_RESTAURANT", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Restaurant restaurant;
}

