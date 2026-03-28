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

    public ChatbotController(GeminiService geminiService, KhachHangRepository khachHangRepository,
            SanPhamRepository sanPhamRepository, YeuCauDonRepository yeuCauDonRepository,
            ChiTietYeuCauDonRepository chiTietYeuCauDonRepository, BanRepository banRepository,
            GeminiChatHistoryService geminiChatHistoryService) {
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

        String userId = (authentication != null && authentication.isAuthenticated())
                ? authentication.getName()
                : "anonymous";

        // 1. Lay danh sach san pham tu DB
        List<SanPham> danhSachSanPham = sanPhamRepository.findAll();
        String danhSachMonAn = danhSachSanPham.stream()
                .map(sp -> sp.getTenSanPham() + " (ID: " + sp.getMaSanPham() + ", Giá: " + sp.getGia().intValue() + "đ)")
                .collect(Collectors.joining(", "));

        StringBuilder promptBuilder = new StringBuilder();
        promptBuilder.append("Bạn là trợ lý ảo chuyên nghiệp của nhà hàng 'Đức Toàn Restaurant'. ");
        promptBuilder.append("Nhiệm vụ: Hỗ trợ đặt bàn, tư vấn món ăn và xác nhận đơn hàng với khách.");

        promptBuilder.append("\n\nQUY TẮC CỰC KỲ QUAN TRỌNG:");
        promptBuilder.append("\n1. CHỈ ĐƯỢC PHÉP tư vấn về món ăn có trong danh sách sau. TUYỆT ĐỐI KHÔNG bịa ra món khác.");
        promptBuilder.append("\n2. DANH SÁCH MÓN ĂN (kèm ID và giá): ").append(danhSachMonAn);
        promptBuilder.append("\n3. Nếu khách hỏi món không có trong danh sách: 'Xin lỗi, nhà hàng không có món đó. Có thể gợi ý [1-2 món trong danh sách].'");
        promptBuilder.append("\n4. LUÔN trả lời bằng ngôn ngữ tự nhiên, thân thiện. TUYỆT ĐỐI KHÔNG xuất ra JSON hay code block — TRỪ quy tắc 5.");

        promptBuilder.append("\n\nQUY TRÌNH ĐẶT BÀN:");
        promptBuilder.append("\nKhi khách muốn đặt bàn, thu thập ĐỦ 3 thông tin sau trước khi xác nhận:");
        promptBuilder.append("\n  A. Số lượng người (nếu thiếu → hỏi: 'Anh/chị sẽ có bao nhiêu người ạ?')");
        promptBuilder.append("\n  B. Giờ đến (nếu thiếu → hỏi: 'Anh/chị muốn đến lúc mấy giờ ạ?')");
        promptBuilder.append("\n  C. Món ăn và số lượng (nếu thiếu → hỏi: 'Anh/chị muốn đặt trước món gì không? Nhà hàng có: [liệt kê 3-5 món nổi bật kèm giá]')");
        promptBuilder.append("\nChỉ khi đủ A+B+C mới tổng kết và hỏi: 'Anh/chị xác nhận đặt bàn không ạ?'");
        promptBuilder.append("\nHỏi TỪNG CÂU MỘT nếu còn thiếu thông tin, không hỏi dồn.");

        promptBuilder.append("\n\nQUY TẮC 5 — CHỈ ÁP DỤNG KHI KHÁCH XÁC NHẬN:");
        promptBuilder.append("\nNếu khách nói 'xác nhận'/'đồng ý'/'ok'/'được'/'đặt đi' SAU KHI đã có đủ A+B+C,");
        promptBuilder.append("\nHÃY TRẢ LỜI ĐÚNG MỘT CHUỖI JSON (không kèm bất kỳ text nào), theo cấu trúc:");
        promptBuilder.append("\n{\"action\":\"CREATE_ORDER\",\"soNguoi\":<số>,\"gioSuDung\":\"<YYYY-MM-DDTHH:MM:SS>\",\"items\":[{\"maSanPham\":<ID>,\"soLuong\":<số>}]}");
        promptBuilder.append("\nNgày hôm nay: ").append(java.time.LocalDate.now());

        if (authentication != null && authentication.isAuthenticated()) {
            Optional<KhachHang> khachHangOpt = khachHangRepository.findByEmail(authentication.getName());
            if (khachHangOpt.isPresent()) {
                KhachHang kh = khachHangOpt.get();
                promptBuilder.append("\n\nTHÔNG TIN KHÁCH ĐANG CHAT:");
                promptBuilder.append("\n- Tên: ").append(kh.getHoTen());
                promptBuilder.append("\n- SĐT: ").append(kh.getSdt());
                promptBuilder.append("\n- Email: ").append(kh.getEmail());
                promptBuilder.append("\nChào khách bằng tên thật. Tự động dùng tên và SĐT khi đặt bàn, KHÔNG hỏi lại.");
            }
        }

        // Lay lich su TRUOC khi luu tin nhan moi
        String history = geminiChatHistoryService.getHistoryAsText(userId);
        if (!history.isEmpty()) {
            promptBuilder.append("\n\nLỊCH SỬ TRÒ CHUYỆN (để nhớ ngữ cảnh):\n").append(history);
        }

        promptBuilder.append("\n\nKhách hỏi: ").append(request.message());
        geminiChatHistoryService.addMessage(userId, "user", request.message());

        String fullPrompt = promptBuilder.toString();
        System.out.println("DEBUG PROMPT: " + fullPrompt);

        return geminiService.generateResponse(fullPrompt)
                .flatMap(chatResponse -> {
                    String responseText = chatResponse.reply().trim();

                    if (responseText.startsWith("{") && responseText.contains("\"action\":\"CREATE_ORDER\"")) {
                        return createOrderFromJson(responseText, authentication, userId);
                    } else {
                        geminiChatHistoryService.addMessage(userId, "assistant", responseText);
                        return Mono.just(chatResponse);
                    }
                });
    }

    private Mono<ChatResponse> createOrderFromJson(String json, Authentication authentication, String userId) {
        try {
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            com.fasterxml.jackson.databind.JsonNode root = mapper.readTree(json);

            int soNguoi = root.path("soNguoi").asInt(1);
            String gioSuDungStr = root.path("gioSuDung").asText("");
            com.fasterxml.jackson.databind.JsonNode itemsNode = root.path("items");

            // Parse gio su dung
            LocalDateTime gioSuDung;
            try {
                gioSuDung = LocalDateTime.parse(gioSuDungStr);
            } catch (Exception e) {
                gioSuDung = LocalDateTime.now().plusHours(1);
            }

            // Kiem tra dang nhap
            if (authentication == null || !authentication.isAuthenticated()) {
                return Mono.just(new ChatResponse("Xin lỗi, bạn cần đăng nhập để đặt bàn."));
            }

            Optional<KhachHang> khachHangOpt = khachHangRepository.findByEmail(authentication.getName());
            if (khachHangOpt.isEmpty()) {
                return Mono.just(new ChatResponse("Xin lỗi, không tìm thấy thông tin tài khoản của bạn."));
            }
            KhachHang khachHang = khachHangOpt.get();

            // Tim ban trong
            List<Ban> availableTables = banRepository.findByTrangThai(false);
            if (availableTables.isEmpty()) {
                return Mono.just(new ChatResponse("Xin lỗi, hiện nhà hàng đã hết bàn trống. Vui lòng liên hệ trực tiếp với nhà hàng."));
            }
            Ban ban = availableTables.get(0);

            // Tao YeuCauDon
            int maDonHang = generateOrderId();
            YeuCauDon yeuCauDon = new YeuCauDon();
            yeuCauDon.setId(new YeuCauDonId(maDonHang, 1));
            yeuCauDon.setMaTaiKhoan(khachHang.getMaTaiKhoan());
            yeuCauDon.setNgayTaoDon(LocalDateTime.now());
            yeuCauDon.setGioSuDung(gioSuDung);
            yeuCauDon.setMaBan(ban.getId().getMaBan());
            yeuCauDon.setTrangThaiThanhToan("Chưa thanh toán");
            yeuCauDon.setIdThanhToan(1); // Mac dinh: tien mat
            yeuCauDon.setGhiChu("Số khách: " + soNguoi);
            yeuCauDon.setTongTien(0.0);
            yeuCauDon.setChiTietYeuCauDons(new ArrayList<>());
            yeuCauDonRepository.save(yeuCauDon);

            // Tao chi tiet mon an
            double tongTien = 0.0;
            List<String> danhSachMonDat = new ArrayList<>();

            if (itemsNode != null && itemsNode.isArray()) {
                for (com.fasterxml.jackson.databind.JsonNode item : itemsNode) {
                    int maSanPham = item.path("maSanPham").asInt();
                    int soLuong = item.path("soLuong").asInt(1);
                    if (soLuong <= 0) continue;

                    Optional<SanPham> spOpt = sanPhamRepository.findById(maSanPham);
                    if (spOpt.isEmpty()) continue;

                    SanPham sp = spOpt.get();
                    float gia = sp.getGia().floatValue();

                    ChiTietYeuCauDon chiTiet = new ChiTietYeuCauDon();
                    chiTiet.setId(new ChiTietYeuCauDonId(maDonHang, 1, maSanPham));
                    chiTiet.setSoLuong(soLuong);
                    chiTiet.setGia(gia);
                    chiTiet.setTrangThai("Chờ xử lý");
                    chiTietYeuCauDonRepository.save(chiTiet);

                    tongTien += (double) gia * soLuong;
                    danhSachMonDat.add(sp.getTenSanPham() + " x" + soLuong);
                }
            }

            // Cap nhat tong tien va ban
            yeuCauDon.setTongTien(tongTien);
            yeuCauDonRepository.save(yeuCauDon);
            ban.setTrangThai(true);
            banRepository.save(ban);

            // Reset lich su sau khi dat xong
            geminiChatHistoryService.clearHistory(userId);

            String monDat = danhSachMonDat.isEmpty() ? "Chưa chọn món" : String.join(", ", danhSachMonDat);
            String confirmMsg =
                "✅ Đặt bàn thành công!\n\n" +
                "📋 Thông tin đơn:\n" +
                "• Mã đơn: #" + maDonHang + "\n" +
                "• Bàn số: " + ban.getId().getMaBan() + "\n" +
                "• Số khách: " + soNguoi + " người\n" +
                "• Giờ đến: " + gioSuDung.toLocalTime() + "\n" +
                "• Món đã đặt: " + monDat + "\n" +
                "• Tạm tính: " + String.format("%,.0f", tongTien) + "đ\n\n" +
                "Cảm ơn anh/chị đã tin tưởng Đức Toàn Restaurant! 🙏";

            geminiChatHistoryService.addMessage(userId, "assistant", confirmMsg);
            return Mono.just(new ChatResponse(confirmMsg));

        } catch (Exception e) {
            System.err.println("Error creating order from chatbot: " + e.getMessage());
            e.printStackTrace();
            return Mono.just(new ChatResponse("Xin lỗi, đã có lỗi khi tạo đơn hàng. Vui lòng thử lại hoặc liên hệ trực tiếp nhà hàng."));
        }
    }

    private int generateOrderId() {
        return (int) (Math.random() * 900000) + 100000;
    }
}
