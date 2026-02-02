package com.example.demo.entity;

public class GeminiChatMessage {


        private String role; // "user" hoặc "model"
        private String content;

        public GeminiChatMessage(String role, String content) {
            this.role = role;
            this.content = content;
        }
        // Getter & Setter
        public String getRole() { return role; }
        public String getContent() { return content; }

}
