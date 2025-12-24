package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "GIAMGIA")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GiamGia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_GIAMGIA")
    private Integer idGiamGia;

    @Column(name = "CODE", length = 20, unique = true)
    private String code;

    @Column(name = "GIATRI")
    private Double giaTri;

    @Column(name = "MOTA", columnDefinition = "TEXT")
    private String moTa;
}

