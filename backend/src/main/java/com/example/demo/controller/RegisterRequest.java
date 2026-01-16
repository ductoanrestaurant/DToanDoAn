package com.example.demo.controller;


public record RegisterRequest(
    String hoTen,
    String email,
    String password,
    String sdt,
    String diachi
) {}
