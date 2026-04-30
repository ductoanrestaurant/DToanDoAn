package com.example.demo.controller;

import com.example.demo.entity.ListImage;
import com.example.demo.repository.ListImageRepository;
import com.example.demo.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * API migration ảnh từ local storage lên Cloudinary.
 * Chỉ cần chạy 1 lần sau khi deploy lên cloud.
 *
 * POST /api/admin/migrate-images
 */
@RestController
@RequestMapping("/api/admin")
public class ImageMigrationController {

    private final ListImageRepository listImageRepository;
    private final CloudinaryService cloudinaryService;

    @Value("${app.upload.dir:./image-dir}")
    private String uploadDir;

    public ImageMigrationController(ListImageRepository listImageRepository,
                                    CloudinaryService cloudinaryService) {
        this.listImageRepository = listImageRepository;
        this.cloudinaryService = cloudinaryService;
    }

    /**
     * Migrate tất cả ảnh đang lưu dạng tên file (chưa có "http") lên Cloudinary.
     * API này idempotent: chạy lại nhiều lần vẫn an toàn.
     */
    @PostMapping("/migrate-images")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> migrateImages() {
        if (!cloudinaryService.isEnabled()) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Cloudinary chưa được cấu hình. Hãy set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET."
            ));
        }

        List<ListImage> allImages = listImageRepository.findAll();

        List<String> migrated = new ArrayList<>();
        List<String> skipped  = new ArrayList<>();
        List<String> failed   = new ArrayList<>();

        for (ListImage image : allImages) {
            String urlAnh = image.getUrlAnh();

            // Bỏ qua ảnh đã là URL Cloudinary
            if (urlAnh != null && (urlAnh.startsWith("http://") || urlAnh.startsWith("https://"))) {
                skipped.add(urlAnh);
                continue;
            }

            // Tìm file local
            File localFile = Paths.get(uploadDir, urlAnh).toFile();
            if (!localFile.exists()) {
                failed.add(urlAnh + " (file not found in " + uploadDir + ")");
                continue;
            }

            try {
                // Upload lên Cloudinary
                String cloudinaryUrl = cloudinaryService.uploadLocalFile(localFile);

                // Cập nhật DB
                image.setUrlAnh(cloudinaryUrl);
                listImageRepository.save(image);

                migrated.add(urlAnh + " → " + cloudinaryUrl);
                System.out.println("✅ Migrated: " + urlAnh + " → " + cloudinaryUrl);

            } catch (Exception e) {
                failed.add(urlAnh + " (error: " + e.getMessage() + ")");
                System.err.println("❌ Failed to migrate: " + urlAnh + " — " + e.getMessage());
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("message", "Migration hoàn tất!");
        result.put("migrated_count", migrated.size());
        result.put("skipped_count", skipped.size());
        result.put("failed_count", failed.size());
        result.put("migrated", migrated);
        result.put("skipped", skipped);
        result.put("failed", failed);

        return ResponseEntity.ok(result);
    }

    /**
     * Kiểm tra trạng thái: bao nhiêu ảnh local, bao nhiêu đã trên Cloudinary.
     * GET /api/admin/migrate-images/status
     */
    @GetMapping("/migrate-images/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> migrationStatus() {
        List<ListImage> allImages = listImageRepository.findAll();

        long cloudinaryCount = allImages.stream()
                .filter(img -> img.getUrlAnh() != null &&
                        (img.getUrlAnh().startsWith("http://") || img.getUrlAnh().startsWith("https://")))
                .count();

        long localCount = allImages.size() - cloudinaryCount;

        return ResponseEntity.ok(Map.of(
            "total", allImages.size(),
            "on_cloudinary", cloudinaryCount,
            "still_local", localCount,
            "cloudinary_enabled", cloudinaryService.isEnabled(),
            "ready_to_migrate", cloudinaryService.isEnabled() && localCount > 0
        ));
    }
}
