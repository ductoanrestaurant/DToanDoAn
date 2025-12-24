package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

import com.example.demo.entity.VaiTro;
import com.example.demo.repository.VaiTroRepository;

@Service
public class VaiTroService {

    @Autowired
    private VaiTroRepository vaiTroRepository;

    public List<VaiTro> getAll() {
        return vaiTroRepository.findAll();
    }

    public Optional<VaiTro> getById(Integer id) {
        return vaiTroRepository.findById(id);
    }

    public VaiTro save(VaiTro vaiTro) {
        return vaiTroRepository.save(vaiTro);
    }

    public void delete(Integer id) {
        vaiTroRepository.deleteById(id);
    }
}

