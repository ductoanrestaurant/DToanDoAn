package com.example.demo.controller;

// Sử dụng record cho DTO đơn giản, ngắn gọn
public record LoginRequest(String email, String password, String clientType) {
}
