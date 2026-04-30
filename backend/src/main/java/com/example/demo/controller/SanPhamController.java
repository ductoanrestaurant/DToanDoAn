package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.entity.SanPham;
import com.example.demo.entity.ListImage;
import com.example.demo.service.SanPhamService;
import com.example.demo.service.WeatherService;
import com.example.demo.dto.SanPhamMenuDTO;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/san-pham")
@CrossOrigin("*")
public class SanPhamController {

    @Autowired
    private SanPhamService sanPhamService;

    @Autowired
    private WeatherService weatherService;


    @GetMapping
    public List<SanPham> getAll() {
        return sanPhamService.getAll();
    }

    // API lấy menu kèm số phần tối đa (dựa trên tồn kho nguyên liệu)
    @GetMapping("/menu")
    public List<SanPhamMenuDTO> getMenu() {
        return sanPhamService.getAllWithMaxServings();
    }

    // API gợi ý món theo thời tiết hiện tại
    @GetMapping("/goi-y-thoi-tiet")
    public ResponseEntity<Map<String, Object>> goiYTheoThoiTiet() {
        String weatherDesc = weatherService.getCurrentWeatherDescription();
        List<SanPham> allMonAn = sanPhamService.getAll();

        // Phân tích thời tiết để xác định loại
        String weatherType;
        String suggestion;
        String icon;
        List<String> keywords;

        String desc = weatherDesc.toLowerCase();
        // Lấy nhiệt độ từ mô tả nếu có
        double temp = 27; // mặc định
        try {
            java.util.regex.Matcher m = java.util.regex.Pattern.compile("nhiệt độ (\\d+)").matcher(desc);
            if (m.find()) temp = Double.parseDouble(m.group(1));
        } catch (Exception ignored) {}

        if (desc.contains("mưa") || desc.contains("rain") || desc.contains("drizzle")) {
            weatherType = "rainy";
            suggestion = "Trời đang mưa, hãy thưởng thức món ăn ấm nóng nhé! 🌧️";
            icon = "rainy";
            keywords = List.of("phở", "súp", "lẩu", "cháo", "bún", "nóng", "ấm");
        } else if (temp >= 33) {
            weatherType = "hot";
            suggestion = "Trời nóng " + (int)temp + "°C, giải nhiệt ngay với đồ uống mát lạnh! ☀️";
            icon = "sunny";
            keywords = List.of("trà", "sinh tố", "nước", "kem", "đá", "lạnh", "mát", "nước ép");
        } else if (temp <= 20) {
            weatherType = "cold";
            suggestion = "Trời se lạnh " + (int)temp + "°C, thích hợp để thưởng thức món ấm nóng! 🌤️";
            icon = "partly-sunny";
            keywords = List.of("phở", "súp", "lẩu", "cháo", "nóng", "ấm", "bún");
        } else {
            weatherType = "normal";
            suggestion = "Thời tiết dễ chịu " + (int)temp + "°C, thưởng thức bất cứ món nào bạn thích! 😊";
            icon = "partly-sunny";
            keywords = List.of(); // tất cả món
        }

        // Lọc món phù hợp
        List<SanPham> goiY;
        if (keywords.isEmpty()) {
            // Thời tiết bình thường → trả về top theo số lượng ảnh (món nổi bật)
            goiY = allMonAn.stream()
                    .filter(sp -> sp.getDanhSachAnh() != null && !sp.getDanhSachAnh().isEmpty())
                    .limit(10)
                    .collect(Collectors.toList());
        } else {
            // Lọc theo từ khóa tên món hoặc danh mục
            final List<String> kw = keywords;
            goiY = allMonAn.stream()
                    .filter(sp -> {
                        String tenMon = (sp.getTenSanPham() == null ? "" : sp.getTenSanPham().toLowerCase());
                        String tenDanhMuc = (sp.getDanhMuc() == null || sp.getDanhMuc().getTenDanhMuc() == null)
                                ? "" : sp.getDanhMuc().getTenDanhMuc().toLowerCase();
                        return kw.stream().anyMatch(k -> tenMon.contains(k) || tenDanhMuc.contains(k));
                    })
                    .collect(Collectors.toList());

            // Nếu không tìm thấy món khớp, trả về tất cả (fallback)
            if (goiY.isEmpty()) {
                goiY = allMonAn.stream().limit(8).collect(Collectors.toList());
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("weatherDescription", weatherDesc.isEmpty() ? "Không có dữ liệu thời tiết" : weatherDesc);
        result.put("weatherType", weatherType);
        result.put("suggestion", suggestion);
        result.put("icon", icon);
        result.put("temperature", (int)temp);
        result.put("monGoiY", goiY);
        result.put("total", goiY.size());

        return ResponseEntity.ok(result);
    }


    @GetMapping("/{id}")
    public ResponseEntity<SanPham> getById(@PathVariable Integer id) {
        return sanPhamService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('QUAN_LY')")
    public SanPham create(@RequestBody SanPham sanPham) {
        return sanPhamService.save(sanPham);
    }

    // New API endpoint for uploading images
    @PostMapping("/{maSanPham}/upload-image")
    @PreAuthorize("hasRole('QUAN_LY')")
    public ResponseEntity<?> uploadImageForSanPham(
            @PathVariable Integer maSanPham,
            @RequestParam("file") MultipartFile file) {
        try {
            ListImage uploadedImage = sanPhamService.uploadImageForSanPham(maSanPham, file);
            return ResponseEntity.ok(uploadedImage);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(Map.of("message", "Could not upload the file: " + e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(Map.of("message", e.getMessage()));
        }
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasRole('QUAN_LY')")
    public ResponseEntity<SanPham> update(@PathVariable Integer id, @RequestBody SanPham sanPhamDetails) {
        return sanPhamService.getById(id).map(sanPham -> {
            sanPham.setTenSanPham(sanPhamDetails.getTenSanPham());
            sanPham.setMoTa(sanPhamDetails.getMoTa());
            sanPham.setGia(sanPhamDetails.getGia());
            sanPham.setDanhMuc(sanPhamDetails.getDanhMuc());
            
            // Correctly handle the update of the image list
            if (sanPhamDetails.getDanhSachAnh() != null) {
                // Clear the existing managed collection
                sanPham.getDanhSachAnh().clear();
                // Add the new items from the request, setting the back-reference
                for (ListImage img : sanPhamDetails.getDanhSachAnh()) {
                    img.setSanPham(sanPham); // This is crucial for the relationship
                    sanPham.getDanhSachAnh().add(img);
                }
            }

            return ResponseEntity.ok(sanPhamService.save(sanPham));
        }).orElse(ResponseEntity.notFound().build());
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('QUAN_LY')")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        sanPhamService.delete(id);
        return ResponseEntity.ok().build();
    }


    @GetMapping("/danh-muc/{maDanhMuc}")
    public List<SanPham> getByDanhMuc(@PathVariable Integer maDanhMuc) {
        return sanPhamService.getByDanhMuc(maDanhMuc);
    }
}
