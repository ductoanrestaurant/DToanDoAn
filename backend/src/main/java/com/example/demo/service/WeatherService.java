package com.example.demo.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
public class WeatherService {

    private final WebClient webClient;
    private final String apiKey;
    private final String city;

    public WeatherService(WebClient.Builder webClientBuilder,
                          @Value("${weather.api.key:}") String apiKey,
                          @Value("${weather.city:Hanoi}") String city) {
        this.webClient = webClientBuilder.baseUrl("https://api.openweathermap.org").build();
        this.apiKey = apiKey;
        this.city = city;
    }

    /**
     * Lấy thông tin thời tiết hiện tại dưới dạng text mô tả.
     * Nếu API key chưa cấu hình hoặc lỗi, trả về chuỗi rỗng (chatbot vẫn hoạt động bình thường).
     */
    public String getCurrentWeatherDescription() {
        if (apiKey == null || apiKey.isEmpty()) {
            return "";
        }

        try {
            Map<String, Object> response = webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/data/2.5/weather")
                            .queryParam("q", city)
                            .queryParam("appid", apiKey)
                            .queryParam("units", "metric")    // Độ C
                            .queryParam("lang", "vi")         // Tiếng Việt
                            .build())
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response == null) return "";

            // Parse nhiệt độ
            Map<String, Object> main = (Map<String, Object>) response.get("main");
            double temp = ((Number) main.get("temp")).doubleValue();
            double feelsLike = ((Number) main.get("feels_like")).doubleValue();
            int humidity = ((Number) main.get("humidity")).intValue();

            // Parse mô tả thời tiết
            List<Map<String, Object>> weatherList = (List<Map<String, Object>>) response.get("weather");
            String description = (String) weatherList.get(0).get("description");

            return String.format(
                    "Thời tiết hiện tại tại %s: %s, nhiệt độ %.0f°C (cảm giác như %.0f°C), độ ẩm %d%%",
                    city, description, temp, feelsLike, humidity
            );

        } catch (Exception e) {
            System.err.println("Error fetching weather: " + e.getMessage());
            return "";
        }
    }
}
