package com.example.demo.controller;

import com.example.demo.dto.ChatRequest;
import com.example.demo.dto.ChatResponse;
import com.example.demo.entity.KhachHang; // Sửa đường dẫn import
import com.example.demo.repository.KhachHangRepository;
import com.example.demo.service.GeminiService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Optional;

@RestController
@RequestMapping("/api/chat/gemini")
public class ChatbotController {

    private final GeminiService geminiService;
    private final KhachHangRepository khachHangRepository;

    public ChatbotController(GeminiService geminiService, KhachHangRepository khachHangRepository) {
        this.geminiService = geminiService;
        this.khachHangRepository = khachHangRepository;
    }

    @PostMapping
    public Mono<ChatResponse> chat(@RequestBody ChatRequest request, Authentication authentication) {

        StringBuilder promptBuilder = new StringBuilder();
        promptBuilder.append("Bạn là trợ lý ảo chuyên nghiệp của nhà hàng 'Đức Toàn Restaurant'. ");
        promptBuilder.append("Nhiệm vụ: Hỗ trợ đặt bàn, tư vấn món ăn. ");

        if (authentication != null && authentication.isAuthenticated()) {
            String username = authentication.getName();

            // Giả sử username trong token chính là email của khách hàng
            Optional<KhachHang> khachHangOpt = khachHangRepository.findByEmail(username);

            if (khachHangOpt.isPresent()) {
                KhachHang kh = khachHangOpt.get();

                promptBuilder.append("\n\nTHÔNG TIN KHÁCH HÀNG ĐANG CHAT:");
                promptBuilder.append("\n- Tên khách: ").append(kh.getHoTen());
                promptBuilder.append("\n- Số điện thoại: ").append(kh.getSdt());
                promptBuilder.append("\n- Email: ").append(kh.getEmail());

                promptBuilder.append("\n\nQUY TẮC QUAN TRỌNG:");
                promptBuilder.append("\n1. Hãy chào khách bằng tên thật của họ (Ví dụ: 'Chào anh Toàn').");
                promptBuilder.append("\n2. Khi khách đặt bàn, HÃY TỰ ĐỘNG DÙNG SĐT VÀ TÊN Ở TRÊN để điền vào đơn, KHÔNG được hỏi lại 'tên bạn là gì' hay 'sđt của bạn là gì' nữa.");
            }
        }

        promptBuilder.append("\n\nKhách hỏi: ").append(request.message());

        String fullPrompt = promptBuilder.toString();
        System.out.println("DEBUG PROMPT: " + fullPrompt);

        return geminiService.generateResponse(fullPrompt);
    }
}
