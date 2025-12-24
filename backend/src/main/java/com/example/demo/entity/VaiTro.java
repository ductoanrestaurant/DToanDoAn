package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "VAITRO")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VaiTro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MAVAITRO")
    private Integer maVaiTro;

    @Column(name = "TENVAITRO", length = 50)
    private String tenVaiTro;

    @Column(name = "MOTA", columnDefinition = "TEXT")
    private String moTa;
}

