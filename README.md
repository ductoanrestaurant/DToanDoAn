# Hệ thống Quản lý Nhà hàng Đức Toàn

Đây là dự án tốt nghiệp xây dựng một hệ thống quản lý toàn diện cho nhà hàng, bao gồm ba thành phần chính:
1.  **Backend (Server):** Xử lý logic nghiệp vụ, quản lý dữ liệu và cung cấp API cho các client.
2.  **Web Admin:** Giao diện quản trị trên nền tảng web dành cho quản lý và nhân viên.
3.  **Mobile App:** Ứng dụng di động cho khách hàng và một số chức năng cho nhân viên.

---

## 🚀 Các thành phần chính

*   **`backend`**: Một ứng dụng Spring Boot (Java) chịu trách nhiệm xử lý tất cả các yêu cầu, xác thực người dùng, và tương tác với cơ sở dữ liệu.
*   **`webadmin`**: Một ứng dụng Next.js (React) cung cấp giao diện quản trị cho phép quản lý các khía cạnh của nhà hàng như nhân viên, thực đơn, kho, v.v.
*   **`DucToanRestaurant`**: Một ứng dụng di động React Native (Expo) cho phép khách hàng xem thực đơn, đặt hàng và cho phép nhân viên (Quản lý, Thu ngân) thực hiện các tác vụ nhanh.

---

## ✨ Tính năng nổi bật

### Chung
- **Xác thực & Phân quyền:** Hệ thống sử dụng JWT (JSON Web Tokens) để xác thực. Quyền truy cập được phân chia rõ ràng theo vai trò người dùng (`KHACH_HANG`, `QUAN_LY`, `THU_NGAN`, `BEP`).
- **Phân quyền theo Client:** Giới hạn quyền truy cập vào ứng dụng Web và Mobile tùy theo vai trò.

### Ứng dụng Di động (`DucToanRestaurant`)
- Dành cho **Khách hàng**, **Quản lý**, và **Thu ngân**.
- Khách hàng có thể đăng nhập, xem thông tin, đặt món.
- Nhân viên có thể đăng nhập để thực hiện các nghiệp vụ nhanh (ví dụ: quản lý đơn hàng).

### Trang Web Admin (`webadmin`)
- Dành cho **Quản lý**, **Thu ngân**, và **Bếp**.
- Quản lý nhân viên (thêm, sửa, reset mật khẩu).
- Quản lý sản phẩm, danh mục.
- Quản lý bàn.
- Quản lý kho, phiếu nhập.
- Và nhiều tính năng quản trị khác.

---

## 📸 Screenshots

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
└── DucToanRestaurant/ # Source code của ứng dụng di động React Native
```

---

## ⚙️ Hướng dẫn Cài đặt và Chạy dự án

### 1. Backend
```bash
# 1. Mở project backend bằng IntelliJ IDEA

# 2. Cấu hình cơ sở dữ liệu
#    - Mở tệp `src/main/resources/application.properties`
#    - Cập nhật các thông tin sau cho phù hợp với môi trường của bạn:
#      spring.datasource.url=jdbc:mysql://localhost:3306/your_database_name
#      spring.datasource.username=your_username
#      spring.datasource.password=your_password

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
# 1. Di chuyển vào thư mục DucToanRestaurant
cd DucToanRestaurant

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

