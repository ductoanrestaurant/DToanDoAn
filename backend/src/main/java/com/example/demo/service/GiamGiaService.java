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

import com.example.demo.entity.GiamGia;
import com.example.demo.repository.GiamGiaRepository;

@Service
public class GiamGiaService {

    @Autowired
    private GiamGiaRepository giamGiaRepository;

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

    public List<GiamGia> getAll() {
        return giamGiaRepository.findAll();
    }

    public Optional<GiamGia> getById(Integer id) {
        return giamGiaRepository.findById(id);
    }

    public Optional<GiamGia> getByCode(String code) {
        return giamGiaRepository.findByCode(code);
    }

    public GiamGia save(GiamGia giamGia) {
        return giamGiaRepository.save(giamGia);
    }

    public void delete(Integer id) {
        giamGiaRepository.deleteById(id);
    }

    @Transactional
    public GiamGia uploadImageForGiamGia(Integer idGiamGia, MultipartFile file) throws IOException {
        GiamGia giamGia = giamGiaRepository.findById(idGiamGia)
                .orElseThrow(() -> new RuntimeException("Discount not found with id: " + idGiamGia));

        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());

        if (originalFilename.contains("..")) {
            throw new IOException("Sorry! Filename contains invalid path sequence " + originalFilename);
        }

        Path targetLocation = this.imageStorageLocation.resolve(originalFilename);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        giamGia.setUrlAnh(originalFilename);
        return giamGiaRepository.save(giamGia);
    }
}
