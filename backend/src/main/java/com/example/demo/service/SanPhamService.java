package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.ArrayList;

import com.example.demo.entity.SanPham;
import com.example.demo.entity.ListImage;
import com.example.demo.entity.DanhMuc;
import com.example.demo.repository.SanPhamRepository;
import com.example.demo.repository.ListImageRepository;
import com.example.demo.repository.DanhMucRepository;

@Service
public class SanPhamService {

    @Autowired
    private SanPhamRepository sanPhamRepository;

    @Autowired
    private ListImageRepository listImageRepository;

    @Autowired
    private DanhMucRepository danhMucRepository;

    @Value("${app.upload.dir:/uploads/images}")
    private String uploadDir;

    private Path imageStorageLocation;

    @PostConstruct
    public void init() {
        this.imageStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
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
        if (sanPham.getDanhMuc() != null && sanPham.getDanhMuc().getMaDanhMuc() != null) {
            DanhMuc managedDanhMuc = danhMucRepository.findById(sanPham.getDanhMuc().getMaDanhMuc())
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + sanPham.getDanhMuc().getMaDanhMuc()));
            sanPham.setDanhMuc(managedDanhMuc);
        } else {
            throw new RuntimeException("Product must have a category.");
        }

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

        // Get the original filename and clean it
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());

        // Check if the file's name contains invalid characters
        if (originalFilename.contains("..")) {
            throw new IOException("Sorry! Filename contains invalid path sequence " + originalFilename);
        }

        // Copy file to the target location (Replacing existing file with the same name)
        Path targetLocation = this.imageStorageLocation.resolve(originalFilename);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        ListImage newImage = new ListImage();
        newImage.setUrlAnh(originalFilename); // Save the original filename to the database
        newImage.setSanPham(sanPham);

        if (sanPham.getDanhSachAnh() == null) {
            sanPham.setDanhSachAnh(new ArrayList<>());
        }
        sanPham.getDanhSachAnh().add(newImage);
        sanPhamRepository.save(sanPham);

        return newImage;
    }
}
