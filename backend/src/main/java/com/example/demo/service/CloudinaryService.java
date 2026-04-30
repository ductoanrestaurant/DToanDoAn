package com.example.demo.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;
    private final boolean enabled;

    public CloudinaryService(
            @Value("${cloudinary.cloud-name:}") String cloudName,
            @Value("${cloudinary.api-key:}") String apiKey,
            @Value("${cloudinary.api-secret:}") String apiSecret) {

        this.enabled = !cloudName.isEmpty() && !apiKey.isEmpty() && !apiSecret.isEmpty();

        if (this.enabled) {
            this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                    "cloud_name", cloudName,
                    "api_key",    apiKey,
                    "api_secret", apiSecret,
                    "secure",     true
            ));
            System.out.println("✅ Cloudinary initialized for cloud: " + cloudName);
        } else {
            this.cloudinary = null;
            System.out.println("⚠️  Cloudinary NOT configured — images will be stored locally.");
        }
    }

    public boolean isEnabled() {
        return enabled;
    }

    /**
     * Upload file từ MultipartFile lên Cloudinary.
     * @return URL công khai của ảnh trên Cloudinary
     */
    public String uploadFile(MultipartFile file) throws IOException {
        if (!enabled) throw new IllegalStateException("Cloudinary is not configured.");

        Map<?, ?> result = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                "folder", "duc-toan-restaurant",
                "resource_type", "auto"
        ));
        return (String) result.get("secure_url");
    }

    /**
     * Upload file từ đường dẫn local lên Cloudinary (dùng cho migration).
     * @return URL công khai của ảnh trên Cloudinary
     */
    public String uploadLocalFile(File file) throws IOException {
        if (!enabled) throw new IllegalStateException("Cloudinary is not configured.");

        Map<?, ?> result = cloudinary.uploader().upload(file, ObjectUtils.asMap(
                "folder", "duc-toan-restaurant",
                "resource_type", "auto"
        ));
        return (String) result.get("secure_url");
    }

    /**
     * Xóa ảnh trên Cloudinary theo public_id (lấy từ URL).
     */
    public void deleteFile(String publicId) throws IOException {
        if (!enabled) return;
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }
}
