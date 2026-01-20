package com.example.demo.service;

import com.example.demo.entity.NhanVien;
import com.example.demo.repository.NhanVienRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Slf4j

@Service
public class NhanVienDetailsServiceImpl implements UserDetailsService {

    private final NhanVienRepository nhanVienRepository;

    public NhanVienDetailsServiceImpl(NhanVienRepository nhanVienRepository) {
        this.nhanVienRepository = nhanVienRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.info("--- ĐANG TÌM KIẾM TRONG BẢNG NHAN VIEN CHO USER: " + username);
        NhanVien nhanVien = nhanVienRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy nhân viên với email: " + username));

        String roleName = nhanVien.getVaiTro().getTenVaiTro().toUpperCase();
        log.info("--- TÌM THẤY NHAN VIEN: " + username + ", GÁN QUYỀN" + roleName);
        return new User(
                nhanVien.getEmail(),
                nhanVien.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + roleName))
        );
    }
}
