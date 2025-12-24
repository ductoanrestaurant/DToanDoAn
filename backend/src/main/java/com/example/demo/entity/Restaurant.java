package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;

@Entity
@Table(name = "RESTAURANT")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Restaurant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_RESTAURANT")
    private Integer idRestaurant;

    @Column(name = "TEN", length = 100)
    private String ten;

    @Column(name = "SDT", length = 10)
    private String sdt;

    @Column(name = "DIACHI", length = 200)
    private String diaChi;

    @Column(name = "MOTA", columnDefinition = "TEXT")
    private String moTa;

    @Column(name = "STATUS", length = 50)
    private String status;

    @Column(name = "PARENT_ID")
    private Integer parentId;

    // Self-referencing relationship for parent restaurant
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PARENT_ID", insertable = false, updatable = false)
    @JsonIgnore
    private Restaurant parent;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Restaurant> children;
}

