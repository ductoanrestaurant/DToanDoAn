package com.example.demo.service;

import com.example.demo.entity.CongThuc;
import com.example.demo.repository.CongThucRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CongThucService {

    @Autowired
    private CongThucRepository congThucRepository;

    public List<CongThuc> getCongThucByMaSanPham(Integer maSanPham) {
        return congThucRepository.findByMaSanPham(maSanPham);
    }

    public CongThuc createCongThuc(CongThuc congThuc) {
        return congThucRepository.save(congThuc);
    }

    public CongThuc updateCongThuc(Integer maSanPham, Integer maNguyenLieu, CongThuc congThucDetails) {
        CongThuc congThuc = congThucRepository.findByMaSanPhamAndMaNguyenLieu(maSanPham, maNguyenLieu);
        if (congThuc != null) {
            congThuc.setSlNguyenLieu(congThucDetails.getSlNguyenLieu());
            return congThucRepository.save(congThuc);
        }
        return null;
    }

    public void deleteCongThuc(Integer maSanPham, Integer maNguyenLieu) {
        CongThuc congThuc = congThucRepository.findByMaSanPhamAndMaNguyenLieu(maSanPham, maNguyenLieu);
        if (congThuc != null) {
            congThucRepository.delete(congThuc);
        }
    }
}
