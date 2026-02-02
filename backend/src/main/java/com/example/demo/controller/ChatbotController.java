package com.example.demo.controller;

import com.example.demo.dto.ChatRequest;
import com.example.demo.dto.ChatResponse;
import com.example.demo.entity.*;
import com.example.demo.repository.*;
import com.example.demo.service.GeminiChatHistoryService;
import com.example.demo.service.GeminiService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat/gemini")
public class ChatbotController {

    private final GeminiService geminiService;
    private final KhachHangRepository khachHangRepository;
    private final SanPhamRepository sanPhamRepository;
    private final YeuCauDonRepository yeuCauDonRepository;
    private final ChiTietYeuCauDonRepository chiTietYeuCauDonRepository;
    private final BanRepository banRepository;

    private final GeminiChatHistoryService geminiChatHistoryService;


    public ChatbotController(GeminiService geminiService, KhachHangRepository khachHangRepository, SanPhamRepository sanPhamRepository, YeuCauDonRepository yeuCauDonRepository, ChiTietYeuCauDonRepository chiTietYeuCauDonRepository, BanRepository banRepository, GeminiChatHistoryService geminiChatHistoryService) {
        this.geminiService = geminiService;
        this.khachHangRepository = khachHangRepository;
        this.sanPhamRepository = sanPhamRepository;
        this.yeuCauDonRepository = yeuCauDonRepository;
        this.chiTietYeuCauDonRepository = chiTietYeuCauDonRepository;
        this.banRepository = banRepository;
        this.geminiChatHistoryService = geminiChatHistoryService;
    }

    @PostMapping
    public Mono<ChatResponse> chat(@RequestBody ChatRequest request, Authentication authentication) {

        // 1. Fetch all products from the database
        List<SanPham> danhSachSanPham = sanPhamRepository.findAll();
        String danhSachMonAn = danhSachSanPham.stream()
                .map(sp -> sp.getTenSanPham() + " (ID: " + sp.getMaSanPham() + ")")
                .collect(Collectors.joining(", "));

        StringBuilder promptBuilder = new StringBuilder();
        promptBuilder.append("Bạn là trợ lý ảo chuyên nghiệp của nhà hàng 'Đức Toàn Restaurant'. ");
        promptBuilder.append("Nhiệm vụ: Hỗ trợ đặt bàn, tư vấn món ăn và TẠO ĐƠN HÀNG. ");

        // 2. Add the strict rule and the list of dishes to the prompt
        promptBuilder.append("\n\nQUY TẮC CỰC KỲ QUAN TRỌNG:");
        promptBuilder.append("\n1. CHỈ ĐƯỢC PHÉP tư vấn, gợi ý, và nói về những món ăn có trong danh sách sau đây. TUYỆT ĐỐI KHÔNG được bịa ra món khác.");
        promptBuilder.append("\n2. DANH SÁCH MÓN ĂN CỦA NHÀ HÀNG: ").append(danhSachMonAn);
        promptBuilder.append("\n3. Nếu khách hỏi món không có trong danh sách, hãy trả lời là 'Xin lỗi, nhà hàng hiện không có món [tên món khách hỏi]. Tuy nhiên, nhà hàng có những món đặc sắc khác như [gợi ý 1, 2 món trong danh sách].'");
//        promptBuilder.append("\n4. KHI KHÁCH HÀNG YÊU CẦU ĐẶT BÀN VÀ MÓN ĂN, hãy phân tích chi tiết yêu cầu của họ và trả lời bằng một chuỗi JSON duy nhất, không có bất kỳ văn bản nào khác. JSON phải có cấu trúc sau: {\"action\": \"CREATE_ORDER\", \"order\": {\"customerName\": \"<tên khách>\", \"customerPhone\": \"<SĐT khách>\", \"numGuests\": <số người>, \"reservationTime\": \"<YYYY-MM-DDTHH:MM:SS>\", \"notes\": \"<ghi chú nếu có>\", \"items\": [{\"productId\": <ID sản phẩm>, \"quantity\": <số lượng>}, ...]}}");
        promptBuilder.append("\n5. Nếu không thể xác định được thông tin nào, hãy đặt giá trị đó là null trong JSON.");
        promptBuilder.append("\n6. Nếu khách chỉ hỏi thông tin chung, hãy trả lời bình thường, không sử dụng JSON.");


        if (authentication != null && authentication.isAuthenticated()) {
            String username = authentication.getName();
            Optional<KhachHang> khachHangOpt = khachHangRepository.findByEmail(username);

            if (khachHangOpt.isPresent()) {
                KhachHang kh = khachHangOpt.get();
                promptBuilder.append("\n\nTHÔNG TIN KHÁCH HÀNG ĐANG CHAT:");
                promptBuilder.append("\n- Tên khách: ").append(kh.getHoTen());
                promptBuilder.append("\n- Số điện thoại: ").append(kh.getSdt());
                promptBuilder.append("\n- Email: ").append(kh.getEmail());

                promptBuilder.append("\n\nQUY TẮC BỔ SUNG KHI BIẾT THÔNG TIN KHÁCH:");
                promptBuilder.append("\n- Hãy chào khách bằng tên thật của họ (Ví dụ: 'Chào anh Toàn').");
                promptBuilder.append("\n- Khi khách đặt bàn, HÃY TỰ ĐỘNG DÙNG SĐT VÀ TÊN Ở TRÊN để điền vào đơn, KHÔNG được hỏi lại 'tên bạn là gì' hay 'sđt của bạn là gì' nữa.");
            }
        }

        promptBuilder.append("\n\nKhách hỏi: ").append(request.message());

        String fullPrompt = promptBuilder.toString();
        System.out.println("DEBUG PROMPT: " + fullPrompt);

        return geminiService.generateResponse(fullPrompt)
                .flatMap(chatResponse -> {
                    // Logic to process the response from Gemini
                    // This is a simplified example. You'll need a robust JSON parser.
                    String responseText = chatResponse.reply();
                    if (responseText.trim().startsWith("{\"action\": \"CREATE_ORDER\"")) {
                        // It's an order creation request
                        return createOrderFromGeminiResponse(responseText, authentication)
                                .map(ChatResponse::new); // Convert the confirmation message to ChatResponse
                    } else {
                        // It's a normal chat response
                        return Mono.just(chatResponse);
                    }
                });
    }

    private Mono<String> createOrderFromGeminiResponse(String jsonResponse, Authentication authentication) {
        // Here you would parse the JSON and create the order
        // This is a placeholder for the actual implementation
        // You would need a JSON parsing library like Jackson or Gson
        // For simplicity, we'll just return a confirmation message.

        // 1. Find an available table
        List<Ban> availableTables = banRepository.findByTrangThai(false);
        if (availableTables.isEmpty()) {
            return Mono.just("Xin lỗi, hiện tại đã hết bàn trống. Vui lòng quay lại sau.");
        }
        Ban ban = availableTables.get(0); // Take the first available table

        // 2. Get customer info
        KhachHang khachHang = null;
        if (authentication != null && authentication.isAuthenticated()) {
            String username = authentication.getName();
            Optional<KhachHang> khachHangOpt = khachHangRepository.findByEmail(username);
            if (khachHangOpt.isPresent()) {
                khachHang = khachHangOpt.get();
            }
        }
        if (khachHang == null) {
            return Mono.just("Xin lỗi, tôi không thể tạo đơn hàng vì không tìm thấy thông tin của bạn.");
        }

        // 3. Create YeuCauDon
        YeuCauDon yeuCauDon = new YeuCauDon();
        YeuCauDonId yeuCauDonId = new YeuCauDonId();
        yeuCauDonId.setMaDonHang(generateRandomOrderId()); // You need a way to generate unique IDs
        yeuCauDonId.setIdRestaurant(1); // Assuming a fixed restaurant ID
        yeuCauDon.setId(yeuCauDonId);
        yeuCauDon.setMaTaiKhoan(khachHang.getMaTaiKhoan());
        yeuCauDon.setNgayTaoDon(LocalDateTime.now());
        yeuCauDon.setGioSuDung(LocalDateTime.now().plusHours(2)); // Placeholder, parse from JSON
        yeuCauDon.setMaBan(ban.getId().getMaBan());
        yeuCauDon.setTrangThaiThanhToan("Chưa thanh toán");
        yeuCauDon.setTongTien(0.0); // Will be calculated later

        // 4. Create ChiTietYeuCauDon (parse items from JSON)
        // This part is complex and requires a proper JSON parser and logic to extract items
        // For now, we'll create a dummy list
        List<ChiTietYeuCauDon> chiTietList = new ArrayList<>();
        // ... parsing logic here ...

        yeuCauDon.setChiTietYeuCauDons(chiTietList);

        // 5. Save to DB
        yeuCauDonRepository.save(yeuCauDon);
        ban.setTrangThai(true);
        banRepository.save(ban);


        return Mono.just("Đã xác nhận! Đơn hàng của bạn đã được tạo thành công với mã đơn hàng " + yeuCauDon.getId().getMaDonHang() + ". Bàn số " + ban.getId().getMaBan() + " đã được đặt cho bạn.");
    }

    private int generateRandomOrderId() {
        // A simple random ID generator for demonstration
        return (int) (Math.random() * 100000);
    }
}
