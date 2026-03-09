package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.example.demo.entity.NhanVien;
import com.example.demo.entity.NhanVienId;
import com.example.demo.repository.NhanVienRepository;

@Service
public class NhanVienService {

    @Autowired
    private NhanVienRepository nhanVienRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

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

    public NhanVien createNhanVien(Map<String, Object> employeeData) {
        NhanVien nhanVien = new NhanVien();

        // Extract data from the map
        String tenNhanVien = (String) employeeData.get("tenNhanVien");
        String email = (String) employeeData.get("email");
        String password = (String) employeeData.get("password");
        Integer maVaiTro = (Integer) employeeData.get("maVaiTro");
        Integer idRestaurant = (Integer) employeeData.get("idRestaurant");

        if (idRestaurant == null) {
            throw new IllegalArgumentException("idRestaurant must not be null for a new employee");
        }

        // Generate the new composite ID
        Integer maxMaNhanVien = nhanVienRepository.findMaxMaNhanVienByIdRestaurant(idRestaurant).orElse(0);
        NhanVienId newId = new NhanVienId(maxMaNhanVien + 1, idRestaurant);
        
        nhanVien.setId(newId);
        nhanVien.setTenNhanVien(tenNhanVien);
        nhanVien.setEmail(email);
        nhanVien.setPassword(password); // Password will be encoded in the save method
        nhanVien.setMaVaiTro(maVaiTro);
        
        return this.save(nhanVien);
    }

    public NhanVien save(NhanVien nhanVien) {
        // Encode password if it's new or has been changed
        if (nhanVien.getPassword() != null && !nhanVien.getPassword().startsWith("$2a$")) {
            nhanVien.setPassword(passwordEncoder.encode(nhanVien.getPassword()));
        }
        // Set default status for new employees
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
