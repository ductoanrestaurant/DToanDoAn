package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

import com.example.demo.entity.NhanVien;
import com.example.demo.entity.NhanVienId;
import com.example.demo.repository.NhanVienRepository;

@Service
public class NhanVienService {

    @Autowired
    private NhanVienRepository nhanVienRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // Inject PasswordEncoder

    public List<NhanVien> getAll() {
        return nhanVienRepository.findAll();
    }

    public Optional<NhanVien> getById(NhanVienId id) {
        return nhanVienRepository.findById(id);
    }

    public Optional<NhanVien> getById(Integer maNhanVien, Integer idRestaurant) {
        NhanVienId nhanVienId = new NhanVienId(maNhanVien, idRestaurant);
        return nhanVienRepository.findById(nhanVienId);
    }

    public Optional<NhanVien> findByEmail(String email) {
        return nhanVienRepository.findByEmail(email);
    }


    public NhanVien save(NhanVien nhanVien) {
        if (nhanVien.getPassword() != null && !nhanVien.getPassword().startsWith("$2a$")) {
            nhanVien.setPassword(passwordEncoder.encode(nhanVien.getPassword()));
        }
        if (nhanVien.getTrangthai() == null) {
            nhanVien.setTrangthai(true);
        }
        return nhanVienRepository.save(nhanVien);
    }

    public Optional<NhanVien> updateStatus(Integer maNhanVien, Integer idRestaurant, Boolean trangthai) {
        NhanVienId nhanVienId = new NhanVienId(maNhanVien, idRestaurant);
        return nhanVienRepository.findById(nhanVienId).map(nhanVien -> {
            nhanVien.setTrangthai(trangthai);
            return nhanVienRepository.save(nhanVien);
        });
    }

    public void delete(Integer maNhanVien, Integer idRestaurant) {
        NhanVienId nhanVienId = new NhanVienId(maNhanVien, idRestaurant);
        nhanVienRepository.findById(nhanVienId).ifPresent(nhanVien -> {
            nhanVien.setTrangthai(false);
            nhanVienRepository.save(nhanVien);
        });
    }

    public List<NhanVien> getByIdRestaurant(Integer idRestaurant) {
        return nhanVienRepository.findByIdRestaurant(idRestaurant);
    }

    public List<NhanVien> getByMaVaiTro(Integer maVaiTro) {
        return nhanVienRepository.findByMaVaiTro(maVaiTro);
    }
}
