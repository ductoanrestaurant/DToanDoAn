package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TopSanPhamDTO {
    private Integer maSanPham;
    private String tenSanPham;
    private Long soLuotBan;
    private Double saoDanhGia;
}
