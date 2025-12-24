package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

import com.example.demo.entity.ListImage;
import com.example.demo.repository.ListImageRepository;

@Service
public class ListImageService {

    @Autowired
    private ListImageRepository listImageRepository;

    public List<ListImage> getAll() {
        return listImageRepository.findAll();
    }

    public Optional<ListImage> getById(Integer id) {
        return listImageRepository.findById(id);
    }

    public ListImage save(ListImage listImage) {
        return listImageRepository.save(listImage);
    }

    public void delete(Integer id) {
        listImageRepository.deleteById(id);
    }

    public List<ListImage> getByMaSanPham(Integer maSanPham) {
        return listImageRepository.findBySanPhamMaSanPham(maSanPham);
    }
}

