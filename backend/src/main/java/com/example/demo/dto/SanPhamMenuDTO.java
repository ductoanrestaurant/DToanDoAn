package com.example.demo.dto;

import com.example.demo.entity.DanhMuc;
import com.example.demo.entity.ListImage;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SanPhamMenuDTO {
    private Integer maSanPham;
    private String tenSanPham;
    private String moTa;
    private Double gia;
    private DanhMuc danhMuc;
    private List<ListImage> danhSachAnh;
    private Integer maxServings; // Số phần tối đa có thể chế biến dựa trên tồn kho
}
