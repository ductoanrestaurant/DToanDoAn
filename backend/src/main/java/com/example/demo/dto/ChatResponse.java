package com.example.demo.dto;

public record ChatResponse(String reply, String action, String data) {
    // Convenience constructor for plain chat messages
    public ChatResponse(String reply) {
        this(reply, null, null);
    }
}