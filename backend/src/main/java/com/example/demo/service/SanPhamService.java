package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
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
import com.example.demo.entity.CongThuc;
import com.example.demo.entity.NguyenLieu;
import com.example.demo.dto.SanPhamMenuDTO;
import com.example.demo.repository.SanPhamRepository;
import com.example.demo.repository.ListImageRepository;
import com.example.demo.repository.DanhMucRepository;
import com.example.demo.repository.CongThucRepository;
import com.example.demo.repository.NguyenLieuRepository;

@Service
public class SanPhamService {

    @Autowired
    private SanPhamRepository sanPhamRepository;

    @Autowired
    private ListImageRepository listImageRepository;

    @Autowired
    private DanhMucRepository danhMucRepository;

    @Autowired
    private CongThucRepository congThucRepository;

    @Autowired
    private NguyenLieuRepository nguyenLieuRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Value("${app.upload.dir:./image-dir}")
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

    /**
     * Lấy danh sách sản phẩm kèm số phần tối đa có thể chế biến (dựa trên tồn kho nguyên liệu).
     * maxServings = MIN(nguyenLieu.soLuong / congThuc.slNguyenLieu) cho tất cả nguyên liệu của món.
     * Nếu món không có công thức → maxServings = 999 (không giới hạn).
     */
    public List<SanPhamMenuDTO> getAllWithMaxServings() {
        List<SanPham> allProducts = sanPhamRepository.findAll();
        List<SanPhamMenuDTO> result = new ArrayList<>();

        for (SanPham sp : allProducts) {
            SanPhamMenuDTO dto = new SanPhamMenuDTO();
            dto.setMaSanPham(sp.getMaSanPham());
            dto.setTenSanPham(sp.getTenSanPham());
            dto.setMoTa(sp.getMoTa());
            dto.setGia(sp.getGia());
            dto.setDanhMuc(sp.getDanhMuc());
            dto.setDanhSachAnh(sp.getDanhSachAnh());

            // Tính maxServings dựa trên công thức và tồn kho
            List<CongThuc> congThucList = congThucRepository.findByMaSanPham(sp.getMaSanPham());

            if (congThucList == null || congThucList.isEmpty()) {
                // Không có công thức → không giới hạn
                dto.setMaxServings(999);
            } else {
                int minServings = Integer.MAX_VALUE;

                for (CongThuc ct : congThucList) {
                    if (ct.getSlNguyenLieu() == null || ct.getSlNguyenLieu().compareTo(BigDecimal.ZERO) <= 0) {
                        continue; // Bỏ qua nguyên liệu có định lượng = 0
                    }

                    NguyenLieu nl = nguyenLieuRepository.findById(ct.getMaNguyenLieu()).orElse(null);

                    if (nl == null || nl.getSoLuong() == null) {
                        minServings = 0; // Nguyên liệu không tồn tại hoặc chưa có tồn kho
                        break;
                    }

                    // Số phần có thể chế biến từ nguyên liệu này = tồn kho / định lượng 1 phần
                    int servingsFromThis = nl.getSoLuong()
                            .divide(ct.getSlNguyenLieu(), 0, RoundingMode.FLOOR)
                            .intValue();

                    minServings = Math.min(minServings, servingsFromThis);
                }

                dto.setMaxServings(minServings == Integer.MAX_VALUE ? 999 : minServings);
            }

            result.add(dto);
        }

        return result;
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

        String imageUrl;

        if (cloudinaryService.isEnabled()) {
            // ☁️ Upload lên Cloudinary — lưu full URL
            imageUrl = cloudinaryService.uploadFile(file);
            System.out.println("✅ Image uploaded to Cloudinary: " + imageUrl);
        } else {
            // 💾 Fallback: lưu file local
            String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
            if (originalFilename.contains("..")) {
                throw new IOException("Invalid path sequence: " + originalFilename);
            }
            Path targetLocation = this.imageStorageLocation.resolve(originalFilename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            imageUrl = originalFilename; // Lưu tên file vào DB
            System.out.println("💾 Image saved locally: " + imageUrl);
        }

        ListImage newImage = new ListImage();
        newImage.setUrlAnh(imageUrl);
        newImage.setSanPham(sanPham);

        if (sanPham.getDanhSachAnh() == null) {
            sanPham.setDanhSachAnh(new ArrayList<>());
        }
        sanPham.getDanhSachAnh().add(newImage);
        sanPhamRepository.save(sanPham);

        return newImage;
    }
}
