package com.example.demo.service;

import com.example.demo.controller.RegisterRequest;
import com.example.demo.entity.KhachHang;
import com.example.demo.repository.KhachHangRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class KhachHangService {

    private final KhachHangRepository khachHangRepository;
    private final PasswordEncoder passwordEncoder;

    public KhachHangService(KhachHangRepository khachHangRepository, PasswordEncoder passwordEncoder) {
        this.khachHangRepository = khachHangRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public KhachHang register(RegisterRequest request) {
        if (khachHangRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email đã tồn tại");
        }

        KhachHang newKhachHang = new KhachHang();
        newKhachHang.setHoTen(request.hoTen());
        newKhachHang.setEmail(request.email());
        newKhachHang.setMatKhau(passwordEncoder.encode(request.password())); // Mã hóa mật khẩu
        newKhachHang.setSdt(request.sdt());
        newKhachHang.setDiachi(request.diachi());
        newKhachHang.setDiemTichLuy(0.0); // Khởi tạo điểm tích lũy
        // Set default values for other fields if necessary
        // newKhachHang.setIdRestaurant(1); 

        return khachHangRepository.save(newKhachHang);
    }

    @Transactional(readOnly = true)
    public Optional<KhachHang> findByEmail(String email) {
        return khachHangRepository.findByEmail(email);
    }

    @Transactional(readOnly = true)
    public Optional<KhachHang> findBySdt(String sdt) {
        return khachHangRepository.findBySdt(sdt);
    }

    @Transactional(readOnly = true)
    public List<KhachHang> layTatCaKhachHang() {
        return khachHangRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<KhachHang> layTheoId(Integer id) {
        return khachHangRepository.findById(id);
    }

    @Transactional
    public KhachHang luuKhachHang(KhachHang khachHang) {
        // Áp dụng cho khách hàng mới tạo từ NvOrder
        if (khachHang.getMaTaiKhoan() == null) {
            // Nếu email rỗng, tạo email mặc định từ SĐT để tránh lỗi not-null
            if (khachHang.getEmail() == null || khachHang.getEmail().isEmpty()) {
                khachHang.setEmail(khachHang.getSdt() + "@default.com");
            }
            // Nếu mật khẩu rỗng, đặt mật khẩu mặc định
            if (khachHang.getMatKhau() == null || khachHang.getMatKhau().isEmpty()) {
                khachHang.setMatKhau(passwordEncoder.encode("123456"));
            }
        } else if (khachHang.getMatKhau() != null && !khachHang.getMatKhau().isEmpty()) {
             // Logic này dành cho việc cập nhật hoặc đăng ký thông thường, nơi mật khẩu được gửi đến
             // Cần kiểm tra xem mật khẩu đã được mã hóa chưa trước khi mã hóa lại
             // (Giả sử mật khẩu thô được gửi từ client)
             // Để đơn giản, chúng ta có thể mã hóa lại, nhưng cách tốt hơn là có DTO riêng.
             // Ví dụ này mã hóa lại nếu nó chưa được mã hóa.
             try {
                passwordEncoder.upgradeEncoding(khachHang.getMatKhau());
             } catch (IllegalArgumentException e) {
                // Mật khẩu chưa được mã hóa, tiến hành mã hóa
                khachHang.setMatKhau(passwordEncoder.encode(khachHang.getMatKhau()));
             }
        }
        return khachHangRepository.save(khachHang);
    }

    @Transactional
    public void xoaKhachHang(Integer id) {
        khachHangRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public boolean kiemTraEmailTonTai(String email) {
        return khachHangRepository.existsByEmail(email);
    }

    @Transactional(readOnly = true)
    public boolean kiemTraSdtTonTai(String sdt) {
        return khachHangRepository.existsBySdt(sdt);
    }

    @Transactional(readOnly = true)
    public Integer findMaTaiKhoanByEmail(String email) {
        return khachHangRepository.findByEmail(email)
                .map(KhachHang::getMaTaiKhoan)
                .orElse(null);
    }

    @Transactional
    public boolean changePassword(Integer maTaiKhoan, String oldPassword, String newPassword) {
        KhachHang khachHang = khachHangRepository.findById(maTaiKhoan)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy khách hàng."));

        if (!passwordEncoder.matches(oldPassword, khachHang.getMatKhau())) {
            // Mật khẩu cũ không khớp
            return false;
        }

        // Mật khẩu cũ khớp, mã hóa và cập nhật mật khẩu mới
        khachHang.setMatKhau(passwordEncoder.encode(newPassword));
        khachHangRepository.save(khachHang);
        return true;
    }

    @Transactional
    public KhachHang updateEmail(Integer maTaiKhoan, String newEmail) {
        // 1. Check if the new email already exists for another user
        Optional<KhachHang> existingCustomerWithEmail = khachHangRepository.findByEmail(newEmail);
        if (existingCustomerWithEmail.isPresent() && !existingCustomerWithEmail.get().getMaTaiKhoan().equals(maTaiKhoan)) {
            throw new IllegalArgumentException("Email đã được sử dụng bởi một tài khoản khác.");
        }

        // 2. Find the customer to update
        KhachHang khachHang = khachHangRepository.findById(maTaiKhoan)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy khách hàng với mã: " + maTaiKhoan));

        // 3. Update the email and save
        khachHang.setEmail(newEmail);
        return khachHangRepository.save(khachHang);
    }


    // --- Các phương thức cho điểm tích lũy ---

    @Transactional(readOnly = true)
    public Double getDiemTichLuy(Integer maTaiKhoan) {
        return khachHangRepository.findById(maTaiKhoan)
                .map(KhachHang::getDiemTichLuy)
                .orElse(0.0);
    }

    @Transactional
    public KhachHang congDiem(Integer maTaiKhoan, Double soDiem) {
        KhachHang khachHang = khachHangRepository.findById(maTaiKhoan)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy khách hàng với mã: " + maTaiKhoan));
        
        Double diemHienTai = khachHang.getDiemTichLuy() != null ? khachHang.getDiemTichLuy() : 0.0;
        khachHang.setDiemTichLuy(diemHienTai + soDiem);
        
        return khachHangRepository.save(khachHang);
    }

    @Transactional
    public KhachHang truDiem(Integer maTaiKhoan, Double soDiem) {
        KhachHang khachHang = khachHangRepository.findById(maTaiKhoan)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy khách hàng với mã: " + maTaiKhoan));

        Double diemHienTai = khachHang.getDiemTichLuy() != null ? khachHang.getDiemTichLuy() : 0.0;
        if (diemHienTai < soDiem) {
            throw new IllegalArgumentException("Điểm tích lũy không đủ.");
        }
        
        khachHang.setDiemTichLuy(diemHienTai - soDiem);
        
        return khachHangRepository.save(khachHang);
    }
}
