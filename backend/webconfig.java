@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Khi App gọi: http://192.168.1.5:8080/uploads/trasua1.jpg
        // Server sẽ tìm trong: C:/Project/Restaurant/images/trasua1.jpg
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:D:/DoAnTotNghiep/demo1/backend/image-dir");
    }

}