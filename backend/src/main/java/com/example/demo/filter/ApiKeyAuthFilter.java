package com.example.demo.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class ApiKeyAuthFilter extends OncePerRequestFilter {

    @Value("${nhanVien.api.key}")
    private String correctApiKey;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Lấy API Key từ header của yêu cầu
        String requestApiKey = request.getHeader("X-API-Key");

        // CHỈ HÀNH ĐỘNG KHI CÓ HEADER X-API-Key
        if (requestApiKey != null) {
            // Nếu có header, tiến hành kiểm tra
            if (requestApiKey.trim().equals(correctApiKey.trim())) {
                // Nếu key hợp lệ, tạo một đối tượng Authentication và đặt nó vào SecurityContext
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        "posClient", // tên của client
                        null, // credentials - không cần mật khẩu
                        AuthorityUtils.createAuthorityList("ROLE_THU_NGAN") // gán một vai trò giả định
                );
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } else {
                // Nếu key không hợp lệ, từ chối ngay lập tức
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("API Key không hợp lệ");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}
