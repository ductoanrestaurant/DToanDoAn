package com.example.demo.config;

import com.example.demo.filter.ApiKeyAuthFilter;
import com.example.demo.service.NhanVienDetailsServiceImpl;
import com.example.demo.service.UserDetailsServiceImpl;
import com.nimbusds.jose.jwk.source.ImmutableSecret;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@Slf4j
public class SecurityConfig {

    @Value("${jwt.secret}")
    private String secretKeyString;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, ApiKeyAuthFilter apiKeyAuthFilter) throws Exception {
        http
                .cors(Customizer.withDefaults()) // Bật CORS với cấu hình mặc định (sẽ dùng Bean ở dưới)
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(apiKeyAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(authorize -> authorize
                        // .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // Không cần dòng này nữa khi dùng cors(Customizer.withDefaults())
                        .requestMatchers("/api/admin/**").hasRole("QUAN_LY")
                        .requestMatchers("/api/cashier/**").hasAnyRole("QUAN_LY", "THU_NGAN")
                        .requestMatchers("/api/orders/**", "/api/my-profile/**").hasRole("USER")
                        .requestMatchers("/api/yeu-cau-don/**").hasAnyRole("USER", "POS_CLIENT", "QUAN_LY", "THU_NGAN", "BEP")
                        .requestMatchers("/uploads/**").permitAll()
                        .requestMatchers("/api/khach-hang/**", "/api/san-pham/**", "/api/restaurant/**", "/api/danh-gia/**").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()))
                );
        return http.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        grantedAuthoritiesConverter.setAuthoritiesClaimName("scope");
        grantedAuthoritiesConverter.setAuthorityPrefix("");

        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);
        return jwtAuthenticationConverter;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            DaoAuthenticationProvider khachHangAuthenticationProvider,
            DaoAuthenticationProvider nhanVienAuthenticationProvider) {
        return new ProviderManager(Arrays.asList(khachHangAuthenticationProvider, nhanVienAuthenticationProvider));
    }

    @Bean
    public DaoAuthenticationProvider khachHangAuthenticationProvider(UserDetailsServiceImpl userDetailsService, PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }

    @Bean
    public DaoAuthenticationProvider nhanVienAuthenticationProvider(NhanVienDetailsServiceImpl nhanVienDetailsService, PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(nhanVienDetailsService);
        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecretKey secretKey() {
        return new SecretKeySpec(secretKeyString.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
    }

    @Bean
    public JwtDecoder jwtDecoder(SecretKey secretKey) {
        return NimbusJwtDecoder.withSecretKey(secretKey).macAlgorithm(MacAlgorithm.HS256).build();
    }

    @Bean
    public JwtEncoder jwtEncoder(SecretKey secretKey) {
        return new NimbusJwtEncoder(new ImmutableSecret<>(secretKey));
    }
}
