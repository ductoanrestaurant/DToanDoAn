# Hệ thống Quản lý Nhà hàng Đức Toàn

Đây là dự án tốt nghiệp xây dựng một hệ thống quản lý toàn diện cho nhà hàng, bao gồm ba thành phần chính:
1.  **Backend (Server):** Xử lý logic nghiệp vụ, quản lý dữ liệu và cung cấp API cho các client.
2.  **Web Admin:** Giao diện quản trị trên nền tảng web dành cho quản lý và nhân viên.
3.  **Mobile App:** Ứng dụng di động cho khách hàng và một số chức năng cho nhân viên.

---

## 🚀 Các thành phần chính

*   **`mobile`**: Một ứng dụng di động React Native (Expo) cho phép khách hàng xem thực đơn, đặt hàng và cho phép nhân viên (Quản lý, Thu ngân) thực hiện các tác vụ nhanh.
*   **`webadmin`**: Giao diện web bằng Next.js giúp nhà hàng quản lý các nghiệp vụ của nhà hàng theo quyền của tải khoản.
*   **`Backend`**: Cung cấp các APi cho cả mobile và webadmin, CSDL được lưu trên PostgreSql và được đóng gói trên Docker

---

## ✨ Tính năng nổi bật

### Chung
- **Xác thực & Phân quyền:** Hệ thống sử dụng JWT (JSON Web Tokens) để xác thực. Quyền truy cập được phân chia rõ ràng theo vai trò người dùng (`KHACH_HANG`, `QUAN_LY`, `THU_NGAN`, `BEP`).
- **Phân quyền theo Client:** Giới hạn quyền truy cập vào ứng dụng Web và Mobile tùy theo vai trò.

### Ứng dụng Di động (`mobile`)
- Dành cho **Khách hàng**, **Quản lý**, và **Thu ngân**.
- Khách hàng có thể đăng nhập, xem thông tin, đặt món.
- Nhân viên (Quản lý, Thu ngân) có thể đăng nhập để thực hiện các nghiệp vụ nhanh (ví dụ: quản lý đơn hàng).

### Trang Web Admin (`webadmin`)
- Dành cho **Quản lý**, **Thu ngân**, và **Bếp**.
- Quản lý nhân viên (thêm, sửa, reset mật khẩu).
- Quản lý sản phẩm, danh mục.
- Quản lý bàn.
- Quản lý kho, phiếu nhập.
- Và nhiều tính năng quản trị khác.

---

## 📸 Screenshots

### Ứng dụng Di động (`mobile`)
<h4 align="center">------ Luồng khách hàng sử dụng app ------</h4>
<p align="center">
  <img src="Screenshots/image.png" width="20%" />
  <img src="Screenshots/image-1.png" width="20%" /> 
  <img src="Screenshots/image-2.png" width="20%" />
  <img src="Screenshots/image-3.png" width="20%" />
  <img src="Screenshots/image-4.png" width="20%" />
  <img src="Screenshots/image-5.png" width="20%" />
  <img src="Screenshots/image-6.png" width="20%" />
  <img src="Screenshots/image-7.png" width="20%" />
  <img src="Screenshots/image-8.png" width="20%" />
  <img src="Screenshots/image-9.png" width="20%" />
</p>

<h4 align="center">------ Luồng nhân viên sử dụng app ------</h4>
<p align="center">
  <img src="Screenshots/image-10.png" width="20%" />
  <img src="Screenshots/image-12.png" width="20%" />
  <img src="Screenshots/image-13.png" width="20%" />
  <img src="Screenshots/image-14.png" width="20%" />
  <img src="Screenshots/image-15.png" width="20%" />
  <img src="Screenshots/image-16.png" width="20%" />
</p>

### Trang Web Admin (`webadmin`)
<h4 align="center">------ Luồng sử dụng webadmin ------</h4>
<p align="center">
<img src="Screenshots/image-17.png" width="48%" />
<img src="Screenshots/image-18.png" width="48%" />
<img src="Screenshots/image-19.png" width="48%" />
<img src="Screenshots/image-20.png" width="48%" />
<img src="Screenshots/image-21.png" width="48%" /> 
<img src="Screenshots/image-22.png" width="48%" />
<img src="Screenshots/image-23.png" width="48%" />
<img src="Screenshots/image-24.png" width="48%" />
<img src="Screenshots/image-25.png" width="48%" />
<img src="Screenshots/image-26.png" width="48%" />
<img src="Screenshots/image-27.png" width="48%" />
<img src="Screenshots/image-28.png" width="48%" />
<img src="Screenshots/image-29.png" width="48%" />
</p>
---


## 🛠️ Công nghệ sử dụng

| Component      | Technologies                                 |
|----------------|----------------------------------------------|
| **Backend**    | `Java`, `Spring Boot`, `Spring Security`, `JPA`, `JWT`, `Maven` |
| **Web Admin**  | `Next.js`, `React`, `TypeScript`, `Tailwind CSS` |
| **Mobile App** | `React Native`, `Expo`, `TypeScript`         |
| **Database**   |`PostgreSQL`      |

---

## 📂 Cấu trúc thư mục

```
/demo1
├── backend/         # Source code của server Spring Boot
├── webadmin/        # Source code của trang quản trị Next.js
└── mobile/            # Source code của ứng dụng di động React Native
```

---

## ⚙️ Hướng dẫn Cài đặt và Chạy dự án

### 1. Backend
```bash
# 1. Mở project backend bằng IntelliJ IDEA

# 2. Cấu hình cơ sở dữ liệu
#    - Mở tệp `src/main/resources/application.properties`
#    - Cập nhật các thông tin sau cho phù hợp với môi trường của bạn:
#      spring.datasource.url=jdbc:postgresql://localhost:5432/your_database_name
#      spring.datasource.username=your_username
#      spring.datasource.password=your_password
#    *Mẹo: Nếu có sẵn Docker, chạy lệnh `docker-compose up -d` để khởi động DB nhanh chóng.

# 3. Chạy ứng dụng
#    - Chạy file DemoApplication.java hoặc sử dụng Maven
./mvnw spring-boot:run
```
Server sẽ khởi động tại `http://localhost:8080`.

### 2. Web Admin
```bash
# 1. Di chuyển vào thư mục webadmin
cd webadmin

# 2. Cài đặt các gói phụ thuộc
npm install

# 3. Khởi chạy server development
npm run dev
```
Trang quản trị sẽ có sẵn tại `http://localhost:3000`.

### 3. Mobile App
```bash
# 1. Di chuyển vào thư mục mobile
cd mobile

# 2. Cài đặt các gói phụ thuộc
npm install

# 3. Khởi chạy Expo
npx expo start
```
- Một tab mới sẽ mở trong trình duyệt của bạn.
- Dùng ứng dụng **Expo Go** trên điện thoại và quét mã QR để chạy ứng dụng.

---

## 👥 Phân quyền vai trò

| Vai trò       | Ứng dụng Mobile | Trang Web Admin | Mô tả                                         |
|--------------|:---------------:|:---------------:|-----------------------------------------------|
| `KHACH_HANG` |        ✅        |        ❌        | Khách hàng, nhân viên sử dụng app để đặt món. |
| `QUAN_LY`    |        ✅        |        ✅        | Quản lý, có quyền cao nhất.                   |
| `THU_NGAN`   |        ✅        |        ✅        | Nhân viên thu ngân.                           |
| `BEP`        |        ❌        |        ✅        | Nhân viên bếp, quản lý đơn hàng.              |

