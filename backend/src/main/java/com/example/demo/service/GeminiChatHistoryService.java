package com.example.demo.service;

import com.example.demo.entity.GeminiChatMessage;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class GeminiChatHistoryService {
    private final Map<String, List<GeminiChatMessage>> chatHistory = new ConcurrentHashMap<>();

    // Thêm tin nhắn vào lịch sử
    public void addMessage(String userId, String role, String content) {
        chatHistory.computeIfAbsent(userId, k -> new ArrayList<>()).add(new GeminiChatMessage(role, content));

        // Giới hạn bộ nhớ: Chỉ nhớ 20 câu gần nhất để tránh lỗi quá dài (Token limit)
        List<GeminiChatMessage> history = chatHistory.get(userId);
        if (history.size() > 20) {
            history.subList(0, history.size() - 20).clear();
        }
    }

    // Lấy chuỗi lịch sử để nhét vào Prompt
    public String getHistoryAsText(String userId) {
        List<GeminiChatMessage> history = chatHistory.get(userId);
        if (history == null || history.isEmpty()) return "";

        return history.stream()
                .map(msg -> (msg.getRole().equals("user") ? "Khách hàng: " : "Bot: ") + msg.getContent())
                .collect(Collectors.joining("\n"));
    }

    // Xóa lịch sử (khi khách muốn reset)
    public void clearHistory(String userId) {
        chatHistory.remove(userId);
    }
}


