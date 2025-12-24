package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "THANHTOAN")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ThanhToan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_THANHTOAN")
    private Integer idThanhToan;

    @Column(name = "KIEUTHANHTOAN", length = 50)
    private String kieuThanhToan;
}

