//package com.example.demo.entity;
//
//import jakarta.persistence.*;
//import lombok.*;
//import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
//
//@Entity
//@Table(name = "LISTIMAGE")
//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
//public class ListImage {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "ID_ANH")
//    private Integer idAnh;
//
//    @Column(name = "URL_ANH", length = 200)
//    private String urlAnh;
//
//    @ManyToOne
//    @JoinColumn(name = "MASANPHAM", referencedColumnName = "MASANPHAM")
//    @JsonIgnoreProperties({"danhSachAnh"}) // Ngăn chặn vòng lặp khi serialize JSON
//    private SanPham sanPham;
//
//    public String getUrlAnh() {
//        // Lưu ý: Thay "192.168.1.5" bằng IP máy tính của bạn (Dùng lệnh ipconfig để xem)
//        String baseUrl = "http://10.6.61.18:8080/uploads/";
//        return baseUrl + this.urlAnh;
//    }
//}


package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "LISTIMAGE")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ListImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_ANH")
    @JsonIgnore // Ẩn idAnh trong JSON trả về
    private Integer idAnh;

    @Column(name = "URL_ANH", length = 200)
    private String urlAnh; // Trả về giá trị thô từ DB: "trasua1.jpg"

    @ManyToOne
    @JoinColumn(name = "MASANPHAM", referencedColumnName = "MASANPHAM")
    @JsonIgnore // Ẩn đối tượng sanPham bên trong ảnh để tránh vòng lặp và làm gọn JSON
    private SanPham sanPham;

    // XÓA BỎ HÀM getUrlAnh() cũ đã viết ở đây
}