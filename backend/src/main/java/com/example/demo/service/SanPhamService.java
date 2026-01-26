package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import jakarta.transaction.Transactional;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.ArrayList; // Import ArrayList

import com.example.demo.entity.SanPham;
import com.example.demo.entity.ListImage;
import com.example.demo.entity.DanhMuc; // Import DanhMuc
import com.example.demo.repository.SanPhamRepository;
import com.example.demo.repository.ListImageRepository;
import com.example.demo.repository.DanhMucRepository; // Import DanhMucRepository

@Service
public class SanPhamService {

    @Autowired
    private SanPhamRepository sanPhamRepository;

    @Autowired
    private ListImageRepository listImageRepository;

    @Autowired
    private DanhMucRepository danhMucRepository; // Autowire DanhMucRepository

    private final Path imageStorageLocation = Paths.get("D:/DoAnTotNghiep/demo1/backend/image-dir").toAbsolutePath().normalize();

    public SanPhamService() {
        try {
            Files.createDirectories(this.imageStorageLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", e);
        }
    }

    public List<SanPham> getAll() {
        return sanPhamRepository.findAll();
    }

    public Optional<SanPham> getById(Integer id) {
        return sanPhamRepository.findById(id);
    }

    @Transactional
    public SanPham save(SanPham sanPham) {
        // Handle DanhMuc relationship
        if (sanPham.getDanhMuc() != null && sanPham.getDanhMuc().getMaDanhMuc() != null) {
            DanhMuc managedDanhMuc = danhMucRepository.findById(sanPham.getDanhMuc().getMaDanhMuc())
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + sanPham.getDanhMuc().getMaDanhMuc()));
            sanPham.setDanhMuc(managedDanhMuc);
        } else {
            throw new RuntimeException("Product must have a category.");
        }

        // Initialize danhSachAnh if it's null to prevent NullPointerException later
        if (sanPham.getDanhSachAnh() == null) {
            sanPham.setDanhSachAnh(new ArrayList<>());
        }

        return sanPhamRepository.save(sanPham);
    }

    public void delete(Integer id) {
        sanPhamRepository.deleteById(id);
    }

    public List<SanPham> getByDanhMuc(Integer maDanhMuc) {
        return sanPhamRepository.findByDanhMucMaDanhMuc(maDanhMuc);
    }

    @Transactional
    public ListImage uploadImageForSanPham(Integer maSanPham, MultipartFile file) throws IOException {
        SanPham sanPham = sanPhamRepository.findById(maSanPham)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + maSanPham));

        String originalFilename = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

        Path targetLocation = this.imageStorageLocation.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), targetLocation);

        ListImage newImage = new ListImage();
        newImage.setUrlAnh(uniqueFilename);
        newImage.setSanPham(sanPham);

        // Ensure danhSachAnh is initialized before adding
        if (sanPham.getDanhSachAnh() == null) {
            sanPham.setDanhSachAnh(new ArrayList<>());
        }
        sanPham.getDanhSachAnh().add(newImage);
        sanPhamRepository.save(sanPham);

        return newImage;
    }
}
