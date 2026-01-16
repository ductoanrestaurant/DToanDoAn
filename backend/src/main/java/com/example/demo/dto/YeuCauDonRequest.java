package com.example.demo.dto;

import com.example.demo.entity.ChiTietYeuCauDon;
import com.example.demo.entity.YeuCauDon;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class YeuCauDonRequest {
    private YeuCauDon yeuCauDon;
    private List<ChiTietYeuCauDon> chiTietYeuCauDon;
}
