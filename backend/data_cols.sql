--
-- PostgreSQL database dump
--

\restrict tURdd92N3NmLHjiTrh9tTZscrdpgZ5iIfmsDFqXCnrcq5T58XcOUe4rm1zDZnjc

-- Dumped from database version 15.17 (Debian 15.17-1.pgdg13+1)
-- Dumped by pg_dump version 15.17 (Debian 15.17-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: restaurant; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.restaurant (id_restaurant, ten, sdt, diachi, mota, status, parent_id, bank_id, account_no, template, account_name, content, img) VALUES (1, 'Nhà hàng Trung Tâm', '0901234567', '123 Quận 1', 'Chi nhánh chính', 'Hoạt động', NULL, 'BIDV', '6868686868688', 'compact', 'NGUYEN DUC TOAN', 'thanh toán', 'restaurant1.jpg');
INSERT INTO public.restaurant (id_restaurant, ten, sdt, diachi, mota, status, parent_id, bank_id, account_no, template, account_name, content, img) VALUES (2, 'Nhà hàng Chi Nhánh 2', '0909876543', '456 Quận 5', 'Chi nhánh 2', 'Hoạt động', NULL, 'MB', '6868686868688', 'compact', 'NGUYEN DUC TOAN', 'thanh toán', 'restaurant2.jpg');
INSERT INTO public.restaurant (id_restaurant, ten, sdt, diachi, mota, status, parent_id, bank_id, account_no, template, account_name, content, img) VALUES (3, 'Nhà hàng Chi Nhánh 1', '0909090922', '35, Tu Hoàng, Xã Xuân Phương, Huyện Nam Từ Liêm, Hà Nội', 'Chi Nhánh 1', 'Hoạt động', 1, 'MB', '6868686868688', 'compact', 'NGUYEN DUC TOAN', 'thanh toan', 'restaurant3.jpg');


--
-- Data for Name: ban; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.ban (maban, id_restaurant, tenban, succhua, trangthai) VALUES (3, 1, 'Bàn 3', 2, false);
INSERT INTO public.ban (maban, id_restaurant, tenban, succhua, trangthai) VALUES (8, 1, 'Bàn 8', 6, false);
INSERT INTO public.ban (maban, id_restaurant, tenban, succhua, trangthai) VALUES (13, 1, 'Bàn 13', 8, false);
INSERT INTO public.ban (maban, id_restaurant, tenban, succhua, trangthai) VALUES (1, 1, 'Bàn 1', 6, true);
INSERT INTO public.ban (maban, id_restaurant, tenban, succhua, trangthai) VALUES (15, 1, 'Bàn 15', 4, true);
INSERT INTO public.ban (maban, id_restaurant, tenban, succhua, trangthai) VALUES (2, 1, 'Bàn 2', 2, false);
INSERT INTO public.ban (maban, id_restaurant, tenban, succhua, trangthai) VALUES (4, 1, 'Bàn 4', 6, false);
INSERT INTO public.ban (maban, id_restaurant, tenban, succhua, trangthai) VALUES (6, 1, 'Bàn 6', 10, false);
INSERT INTO public.ban (maban, id_restaurant, tenban, succhua, trangthai) VALUES (7, 1, 'Bàn 7', 10, false);
INSERT INTO public.ban (maban, id_restaurant, tenban, succhua, trangthai) VALUES (9, 1, 'Bàn 9', 2, false);
INSERT INTO public.ban (maban, id_restaurant, tenban, succhua, trangthai) VALUES (10, 1, 'Bàn 10', 2, false);
INSERT INTO public.ban (maban, id_restaurant, tenban, succhua, trangthai) VALUES (14, 1, 'bàn 14', 10, false);
INSERT INTO public.ban (maban, id_restaurant, tenban, succhua, trangthai) VALUES (11, 1, 'Bàn 11', 10, false);
INSERT INTO public.ban (maban, id_restaurant, tenban, succhua, trangthai) VALUES (12, 1, 'bàn 12', 2, false);
INSERT INTO public.ban (maban, id_restaurant, tenban, succhua, trangthai) VALUES (5, 1, 'Bàn 5', 8, true);


--
-- Data for Name: nguyenlieu; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.nguyenlieu (manguyenlieu, id_restaurant, tennguyenlieu, donvitinh, mota, xuatxu, trangthai, soluong, updated_at) VALUES (9, 1, 'Ức gà Fillet', 'Kg', 'Làm Salad', 'CP Việt Nam', 'Còn hàng', 25.0000, '2026-02-06 02:59:34.249006+00');
INSERT INTO public.nguyenlieu (manguyenlieu, id_restaurant, tennguyenlieu, donvitinh, mota, xuatxu, trangthai, soluong, updated_at) VALUES (12, 1, 'Thanh cua', 'Gói', 'Topping Pizza', 'Nhật Bản', 'Còn hàng', 40.0000, '2026-02-06 02:59:34.249006+00');
INSERT INTO public.nguyenlieu (manguyenlieu, id_restaurant, tennguyenlieu, donvitinh, mota, xuatxu, trangthai, soluong, updated_at) VALUES (17, 1, 'Gạo tẻ', 'Kg', 'Nấu cơm rang', 'ST25', 'Còn hàng', 100.0000, '2026-02-06 02:59:34.249006+00');
INSERT INTO public.nguyenlieu (manguyenlieu, id_restaurant, tennguyenlieu, donvitinh, mota, xuatxu, trangthai, soluong, updated_at) VALUES (20, 1, 'Cà chua', 'Kg', 'Làm sốt, ăn kèm', 'Đà Lạt', 'Còn hàng', 25.0000, '2026-02-06 02:59:34.249006+00');
INSERT INTO public.nguyenlieu (manguyenlieu, id_restaurant, tennguyenlieu, donvitinh, mota, xuatxu, trangthai, soluong, updated_at) VALUES (21, 1, 'Hành tây', 'Kg', 'Xào, Pizza', 'Hải Dương', 'Còn hàng', 20.0000, '2026-02-06 02:59:34.249006+00');
INSERT INTO public.nguyenlieu (manguyenlieu, id_restaurant, tennguyenlieu, donvitinh, mota, xuatxu, trangthai, soluong, updated_at) VALUES (22, 1, 'Ớt chuông', 'Kg', 'Topping Pizza', 'Đà Lạt', 'Còn hàng', 10.0000, '2026-02-06 02:59:34.249006+00');
INSERT INTO public.nguyenlieu (manguyenlieu, id_restaurant, tennguyenlieu, donvitinh, mota, xuatxu, trangthai, soluong, updated_at) VALUES (23, 1, 'Dưa cải chua', 'Kg', 'Cơm rang dưa bò', 'Việt Nam', 'Còn hàng', 15.0000, '2026-02-06 02:59:34.249006+00');
INSERT INTO public.nguyenlieu (manguyenlieu, id_restaurant, tennguyenlieu, donvitinh, mota, xuatxu, trangthai, soluong, updated_at) VALUES (32, 1, 'Whipping Cream', 'Hộp', 'Làm chè khúc bạch', 'Anchor', 'Còn hàng', 24.0000, '2026-02-06 02:59:34.249006+00');
INSERT INTO public.nguyenlieu (manguyenlieu, id_restaurant, tennguyenlieu, donvitinh, mota, xuatxu, trangthai, soluong, updated_at) VALUES (33, 1, 'Sữa chua', 'Hộp', 'Làm sữa chua dẻo', 'Vinamilk', 'Còn hàng', 120.0000, '2026-02-06 02:59:34.249006+00');
INSERT INTO public.nguyenlieu (manguyenlieu, id_restaurant, tennguyenlieu, donvitinh, mota, xuatxu, trangthai, soluong, updated_at) VALUES (34, 1, 'Kem Vani', 'Hộp', 'Kem viên', 'Wall', 'Còn hàng', 10.0000, '2026-02-06 02:59:34.249006+00');
INSERT INTO public.nguyenlieu (manguyenlieu, id_restaurant, tennguyenlieu, donvitinh, mota, xuatxu, trangthai, soluong, updated_at) VALUES (37, 1, 'Tương cà', 'Can', 'Chấm đồ chiên', 'Cholimex', 'Còn hàng', 10.0000, '2026-02-06 02:59:34.249006+00');
INSERT INTO public.nguyenlieu (manguyenlieu, id_restaurant, tennguyenlieu, donvitinh, mota, xuatxu, trangthai, soluong, updated_at) VALUES (42, 1, 'Trân châu đen', 'Kg', 'Topping trà sữa', 'Wings', 'Còn hàng', 50.0000, '2026-02-06 02:59:34.249006+00');
INSERT INTO public.nguyenlieu (manguyenlieu, id_restaurant, tennguyenlieu, donvitinh, mota, xuatxu, trangthai, soluong, updated_at) VALUES (44, 1, 'Đường đen', 'Kg', 'Nấu trân châu', 'Hàn Quốc', 'Còn hàng', 30.0000, '2026-02-06 02:59:34.249006+00');
INSERT INTO public.nguyenlieu (manguyenlieu, id_restaurant, tennguyenlieu, donvitinh, mota, xuatxu, trangthai, soluong, updated_at) VALUES (45, 1, 'Bột Gelatin', 'Gói', 'Làm đông chè/bánh', 'Đức', 'Còn hàng', 10.0000, '2026-02-06 02:59:34.249006+00');
INSERT INTO public.nguyenlieu (manguyenlieu, id_restaurant, tennguyenlieu, donvitinh, mota, xuatxu, trangthai, soluong, updated_at) VALUES (46, 1, 'Hạnh nhân lát 789', 'Kg', 'Rắc chè khúc bạch', 'Mỹ', 'Còn hàng', 5.0000, '2026-02-06 02:59:34.249006+00');
INSERT INTO public.nguyenlieu (manguyenlieu, id_restaurant, tennguyenlieu, donvitinh, mota, xuatxu, trangthai, soluong, updated_at) VALUES (63, 1, 'Rièng', 'Kg', 'nau thit cho', 'Viet nam', 'Còn hàng', 5.0000, '2026-03-03 11:31:29.162888+00');
INSERT INTO public.nguyenlieu (manguyenlieu, id_restaurant, tennguyenlieu, donvitinh, mota, xuatxu, trangthai, soluong, updated_at) VALUES (64, 1, 'lá chanh', 'Kg', 'sdsds', 'vietnam', 'Còn hàng', 1.6500, '2026-03-03 15:00:25.397021+00');
INSERT INTO public.nguyenlieu (manguyenlieu, id_restaurant, tennguyenlieu, donvitinh, mota, xuatxu, trangthai, soluong, updated_at) VALUES (1, 1, 'Trà đen', 'Kg', 'Nguyên liệu pha chế', 'Việt Nam', 'Còn hàng', 30.0000, '2026-03-13 17:46:36.988708+00');
INSERT INTO public.nguyenlieu (manguyenlieu, id_restaurant, tennguyenlieu, donvitinh, mota, xuatxu, trangthai, soluong, updated_at) VALUES (10, 1, 'Tôm sú', 'Kg', 'Pizza hải sản', 'Cà Mau', 'Còn hàng', 11.9000, '2026-04-18 10:17:23.494229+00');
INSERT INTO public.nguyenlieu (manguyenlieu, id_restaurant, tennguyenlieu, donvitinh, mota, xuatxu, trangthai, soluong, updated_at) VALUES (3, 1, 'Bánh mì', 'Cái', 'Làm hamburger', 'Việt Nam', 'Còn hàng', 110.0000, '2026-03-13 18:20:16.351416+00');
INSERT INTO public.nguyenlieu (manguyenlieu, id_restaurant, tennguyenlieu, donvitinh, mota, xuatxu, trangthai, soluong, updated_at) VALUES (11, 1, 'Mực ống', 'Kg', 'Pizza hải sản', 'Quảng Ninh', 'Còn hàng', 14.9000, '2026-04-18 10:17:23.494229+00');
INSERT INTO public.nguyenlieu (manguyenlieu, id_restaurant, tennguyenlieu, donvitinh, mota, xuatxu, trangthai, soluong, updated_at) VALUES (4, 1, 'Thịt bò', 'Kg', 'Làm nhân bánh', 'Úc', 'Còn hàng', 21.0000, '2026-03-13 18:33:11.90757+00');
INSERT INTO public.nguyenlieu (manguyenlieu, id_restaurant, tennguyenlieu, donvitinh, mota, xuatxu, trangthai, soluong, updated_at) VALUES (28, 1, 'Phô mai Mozzarella', 'Kg', 'Phô mai kéo sợi Pizza', 'Anchor', 'Còn hàng', 24.8400, '2026-04-18 10:17:23.494229+00');
INSERT INTO public.nguyenlieu (manguyenlieu, id_restaurant, tennguyenlieu, donvitinh, mota, xuatxu, trangthai, soluong, updated_at) VALUES (35, 1, 'Sốt Cà chua (Pizza)', 'Hộp', 'Sốt nền Pizza/Mì Ý', 'Golden Farm', 'Còn hàng', 29.8900, '2026-04-18 10:17:23.494229+00');
INSERT INTO public.nguyenlieu (manguyenlieu, id_restaurant, tennguyenlieu, donvitinh, mota, xuatxu, trangthai, soluong, updated_at) VALUES (16, 1, 'Mì Ý Spaghetti', 'Gói', 'Mì sợi tròn 500g', 'Ý', 'Còn hàng', 34.9000, '2026-03-18 23:35:10.740418+00');
INSERT INTO public.nguyenlieu (manguyenlieu, id_restaurant, tennguyenlieu, donvitinh, mota, xuatxu, trangthai, soluong, updated_at) VALUES (40, 1, 'Trà Thái Xanh', 'Gói', 'Pha trà sữa Thái', 'Thái Lan', 'Còn hàng', 19.8600, '2026-04-18 10:46:33.667468+00');
INSERT INTO public.nguyenlieu (manguyenlieu, id_restaurant, tennguyenlieu, donvitinh, mota, xuatxu, trangthai, soluong, updated_at) VALUES (43, 1, 'Đào ngâm', 'Hộp', 'Trà đào', 'Hosen', 'Còn hàng', 47.9000, '2026-03-18 23:48:45.121556+00');
INSERT INTO public.nguyenlieu (manguyenlieu, id_restaurant, tennguyenlieu, donvitinh, mota, xuatxu, trangthai, soluong, updated_at) VALUES (31, 1, 'Bột kem béo', 'Kg', 'Pha trà sữa', 'Thái Lan', 'Còn hàng', 39.4900, '2026-04-18 11:11:29.992613+00');
INSERT INTO public.nguyenlieu (manguyenlieu, id_restaurant, tennguyenlieu, donvitinh, mota, xuatxu, trangthai, soluong, updated_at) VALUES (25, 1, 'Bơ sáp', 'Kg', 'Sinh tố, Kem bơ', 'Đắk Lắk', 'Còn hàng', 19.5000, '2026-04-18 10:17:23.187892+00');
INSERT INTO public.nguyenlieu (manguyenlieu, id_restaurant, tennguyenlieu, donvitinh, mota, xuatxu, trangthai, soluong, updated_at) VALUES (15, 1, 'Khoai tây tươi', 'Kg', 'Khoai tây chiên, múi cau', 'Đà Lạt', 'Còn hàng', 59.2500, '2026-04-18 10:17:23.16922+00');
INSERT INTO public.nguyenlieu (manguyenlieu, id_restaurant, tennguyenlieu, donvitinh, mota, xuatxu, trangthai, soluong, updated_at) VALUES (30, 1, 'Sữa đặc', 'Hộp', 'Pha chế đồ uống', 'Ông Thọ', 'Còn hàng', 71.1000, '2026-04-18 11:11:29.992613+00');
INSERT INTO public.nguyenlieu (manguyenlieu, id_restaurant, tennguyenlieu, donvitinh, mota, xuatxu, trangthai, soluong, updated_at) VALUES (13, 1, 'Vỏ bánh Hamburger', 'Cái', 'Vỏ bánh tròn rắc vừng', 'Kinh Đô', 'Còn hàng', 195.0000, '2026-04-27 03:07:09.347211+00');
INSERT INTO public.nguyenlieu (manguyenlieu, id_restaurant, tennguyenlieu, donvitinh, mota, xuatxu, trangthai, soluong, updated_at) VALUES (5, 1, 'Thịt bò xay', 'Kg', 'Làm nhân Hamburger, Mì Ý', 'Úc', 'Còn hàng', 25.4200, '2026-04-27 03:07:09.347211+00');
INSERT INTO public.nguyenlieu (manguyenlieu, id_restaurant, tennguyenlieu, donvitinh, mota, xuatxu, trangthai, soluong, updated_at) VALUES (29, 1, 'Phô mai Cheddar', 'Gói', 'Phô mai lát Burger', 'Anchor', 'Còn hàng', 45.0000, '2026-04-27 03:07:09.347211+00');
INSERT INTO public.nguyenlieu (manguyenlieu, id_restaurant, tennguyenlieu, donvitinh, mota, xuatxu, trangthai, soluong, updated_at) VALUES (19, 1, 'Rau Xà lách', 'Kg', 'Ăn kèm Burger, Salad', 'Đà Lạt', 'Còn hàng', 14.9000, '2026-04-27 03:07:09.347211+00');
INSERT INTO public.nguyenlieu (manguyenlieu, id_restaurant, tennguyenlieu, donvitinh, mota, xuatxu, trangthai, soluong, updated_at) VALUES (2, 1, 'Sữa tươi', 'Lít', 'Sữa pha chế', 'Đà Lạt', 'Còn hàng', 59.8000, '2026-04-18 10:17:23.187892+00');
INSERT INTO public.nguyenlieu (manguyenlieu, id_restaurant, tennguyenlieu, donvitinh, mota, xuatxu, trangthai, soluong, updated_at) VALUES (38, 1, 'Tương ớt', 'Can', 'Chấm đồ chiên', 'Chin-su', 'Còn hàng', 9.8500, '2026-04-18 10:17:23.16922+00');
INSERT INTO public.nguyenlieu (manguyenlieu, id_restaurant, tennguyenlieu, donvitinh, mota, xuatxu, trangthai, soluong, updated_at) VALUES (8, 1, 'Thịt gà (Cánh/Đùi)', 'Kg', 'Gà rán, Gà sốt cay', 'CP Việt Nam', 'Còn hàng', 44.3000, '2026-04-18 10:17:23.312052+00');
INSERT INTO public.nguyenlieu (manguyenlieu, id_restaurant, tennguyenlieu, donvitinh, mota, xuatxu, trangthai, soluong, updated_at) VALUES (18, 1, 'Bánh phở tươi', 'Kg', 'Dùng cho món phở', 'Việt Nam', 'Còn hàng', 38.6000, '2026-04-15 14:58:37.050299+00');
INSERT INTO public.nguyenlieu (manguyenlieu, id_restaurant, tennguyenlieu, donvitinh, mota, xuatxu, trangthai, soluong, updated_at) VALUES (39, 1, 'Bột chiên giòn', 'Gói', 'Tẩm gà chiên', 'Aji-Quick', 'Còn hàng', 99.8000, '2026-04-18 10:17:23.312052+00');
INSERT INTO public.nguyenlieu (manguyenlieu, id_restaurant, tennguyenlieu, donvitinh, mota, xuatxu, trangthai, soluong, updated_at) VALUES (36, 1, 'Sốt Gochujang', 'Hộp', 'Tương ớt Hàn Quốc', 'Hàn Quốc', 'Còn hàng', 14.9000, '2026-04-18 10:17:23.312052+00');
INSERT INTO public.nguyenlieu (manguyenlieu, id_restaurant, tennguyenlieu, donvitinh, mota, xuatxu, trangthai, soluong, updated_at) VALUES (6, 1, 'Thịt bò thăn', 'Kg', 'Dùng cho Cơm rang, Phở tái', 'Việt Nam', 'Còn hàng', 9.4400, '2026-04-15 14:58:37.050299+00');
INSERT INTO public.nguyenlieu (manguyenlieu, id_restaurant, tennguyenlieu, donvitinh, mota, xuatxu, trangthai, soluong, updated_at) VALUES (7, 1, 'Xương ống bò', 'Kg', 'Ninh nước dùng phở', 'Việt Nam', 'Còn hàng', 28.6000, '2026-04-15 14:58:37.050299+00');
INSERT INTO public.nguyenlieu (manguyenlieu, id_restaurant, tennguyenlieu, donvitinh, mota, xuatxu, trangthai, soluong, updated_at) VALUES (27, 1, 'Tỏi', 'Kg', 'Gia vị xào nấu', 'Việt Nam', 'Còn hàng', 7.9300, '2026-04-15 14:58:37.050299+00');
INSERT INTO public.nguyenlieu (manguyenlieu, id_restaurant, tennguyenlieu, donvitinh, mota, xuatxu, trangthai, soluong, updated_at) VALUES (14, 1, 'Đế bánh Pizza', 'Cái', 'Đế mỏng size M', 'Việt Nam', 'Còn hàng', 78.0000, '2026-04-18 10:17:23.494229+00');
INSERT INTO public.nguyenlieu (manguyenlieu, id_restaurant, tennguyenlieu, donvitinh, mota, xuatxu, trangthai, soluong, updated_at) VALUES (24, 1, 'Cam vàng', 'Kg', 'Pha nước ép, Trà đào', 'Ai Cập', 'Còn hàng', 27.2500, '2026-04-18 10:17:22.842541+00');
INSERT INTO public.nguyenlieu (manguyenlieu, id_restaurant, tennguyenlieu, donvitinh, mota, xuatxu, trangthai, soluong, updated_at) VALUES (41, 1, 'Hồng trà (Trà đen)', 'Gói', 'Pha trà sữa truyền thống', 'Phúc Long', 'Còn hàng', 19.7500, '2026-04-18 11:11:29.992613+00');


--
-- Data for Name: phieunhapkho; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.phieunhapkho (maphieunhap, id_restaurant, nhacungcap, manhanvien, ngaynhap, tongtien, ghichu, mapieunhap) VALUES (1, 1, 'Nhà cung cấp A', 1, '2025-12-15 17:00:00+00', 2358000.0000, 'Nhập nguyên liệu pha chế', 1);
INSERT INTO public.phieunhapkho (maphieunhap, id_restaurant, nhacungcap, manhanvien, ngaynhap, tongtien, ghichu, mapieunhap) VALUES (2, 1, 'Nhà cung cấp B', 4, '2025-12-15 17:00:00+00', 5550000.0000, 'Nhập nguyên liệu bếp', 2);
INSERT INTO public.phieunhapkho (maphieunhap, id_restaurant, nhacungcap, manhanvien, ngaynhap, tongtien, ghichu, mapieunhap) VALUES (7, 1, 'toan kho 3', 9, '2026-03-13 18:30:56.375523+00', 5500000.0000, '456', 7);
INSERT INTO public.phieunhapkho (maphieunhap, id_restaurant, nhacungcap, manhanvien, ngaynhap, tongtien, ghichu, mapieunhap) VALUES (4, 1, 'ductoankho1', 1, '2026-03-13 18:30:56.375523+00', 450000.0000, 'okokokoko', 4);
INSERT INTO public.phieunhapkho (maphieunhap, id_restaurant, nhacungcap, manhanvien, ngaynhap, tongtien, ghichu, mapieunhap) VALUES (5, 1, 'cong ty1', 1, '2026-03-13 18:30:56.375523+00', 200000.0000, 'okkkkk', 5);
INSERT INTO public.phieunhapkho (maphieunhap, id_restaurant, nhacungcap, manhanvien, ngaynhap, tongtien, ghichu, mapieunhap) VALUES (6, 1, 'ductoan kho 2', 9, '2026-03-13 18:30:56.375523+00', 500000.0000, '12121', 6);
INSERT INTO public.phieunhapkho (maphieunhap, id_restaurant, nhacungcap, manhanvien, ngaynhap, tongtien, ghichu, mapieunhap) VALUES (8, 1, 'toan kho 4', 9, '2026-03-13 18:33:11.947049+00', 400000.0000, '1111', 8);


--
-- Data for Name: chitietphieunhap; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.chitietphieunhap (maphieunhap, manguyenlieu, soluongnhap, gianhap, ngayhethan) VALUES (1, 1, 5.0000, 80000.0000, '2026-12-01');
INSERT INTO public.chitietphieunhap (maphieunhap, manguyenlieu, soluongnhap, gianhap, ngayhethan) VALUES (1, 2, 20.0000, 30000.0000, '2026-03-01');
INSERT INTO public.chitietphieunhap (maphieunhap, manguyenlieu, soluongnhap, gianhap, ngayhethan) VALUES (1, 30, 12.0000, 24000.0000, '2027-01-01');
INSERT INTO public.chitietphieunhap (maphieunhap, manguyenlieu, soluongnhap, gianhap, ngayhethan) VALUES (1, 42, 10.0000, 35000.0000, '2026-06-01');
INSERT INTO public.chitietphieunhap (maphieunhap, manguyenlieu, soluongnhap, gianhap, ngayhethan) VALUES (1, 43, 12.0000, 60000.0000, '2027-05-01');
INSERT INTO public.chitietphieunhap (maphieunhap, manguyenlieu, soluongnhap, gianhap, ngayhethan) VALUES (2, 4, 10.0000, 250000.0000, '2026-02-15');
INSERT INTO public.chitietphieunhap (maphieunhap, manguyenlieu, soluongnhap, gianhap, ngayhethan) VALUES (2, 8, 15.0000, 60000.0000, '2026-02-15');
INSERT INTO public.chitietphieunhap (maphieunhap, manguyenlieu, soluongnhap, gianhap, ngayhethan) VALUES (2, 17, 50.0000, 22000.0000, '2026-12-31');
INSERT INTO public.chitietphieunhap (maphieunhap, manguyenlieu, soluongnhap, gianhap, ngayhethan) VALUES (2, 19, 5.0000, 20000.0000, '2026-02-10');
INSERT INTO public.chitietphieunhap (maphieunhap, manguyenlieu, soluongnhap, gianhap, ngayhethan) VALUES (2, 28, 5.0000, 190000.0000, '2026-08-01');
INSERT INTO public.chitietphieunhap (maphieunhap, manguyenlieu, soluongnhap, gianhap, ngayhethan) VALUES (4, 1, 15.0000, 30000.0000, '2028-06-11');
INSERT INTO public.chitietphieunhap (maphieunhap, manguyenlieu, soluongnhap, gianhap, ngayhethan) VALUES (5, 2, 10.0000, 20000.0000, '2028-06-01');
INSERT INTO public.chitietphieunhap (maphieunhap, manguyenlieu, soluongnhap, gianhap, ngayhethan) VALUES (6, 3, 10.0000, 50000.0000, '2028-12-11');
INSERT INTO public.chitietphieunhap (maphieunhap, manguyenlieu, soluongnhap, gianhap, ngayhethan) VALUES (7, 5, 11.0000, 500000.0000, '2027-11-11');
INSERT INTO public.chitietphieunhap (maphieunhap, manguyenlieu, soluongnhap, gianhap, ngayhethan) VALUES (8, 4, 1.0000, 400000.0000, '2026-11-11');


--
-- Data for Name: danhmuc; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.danhmuc (madanhmuc, tendanhmuc, anh, trangthai) VALUES (1, 'Đồ uống', 'douong.png', 'Hiện');
INSERT INTO public.danhmuc (madanhmuc, tendanhmuc, anh, trangthai) VALUES (2, 'Đồ ăn nhanh', 'doan.png', 'Hiện');
INSERT INTO public.danhmuc (madanhmuc, tendanhmuc, anh, trangthai) VALUES (3, 'Món chính', 'monchinh.png', 'Hiện');
INSERT INTO public.danhmuc (madanhmuc, tendanhmuc, anh, trangthai) VALUES (4, 'Món tráng miệng', 'trangmieng.png', 'Hiện');


--
-- Data for Name: giamgia; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.giamgia (id_giamgia, code, giatri, mota, url_anh, mo_ta) VALUES (1, 'SALE10', 10, 'Giảm 10%', 'sale10.jpg', 'Giảm 10% cho các sản phẩm nước uống');
INSERT INTO public.giamgia (id_giamgia, code, giatri, mota, url_anh, mo_ta) VALUES (4, 'tesst code', 50, NULL, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777571045/duc-toan-restaurant/z9bjrsbpulrlfxivfneg.jpg', 'giảm vớ vẫn ');
INSERT INTO public.giamgia (id_giamgia, code, giatri, mota, url_anh, mo_ta) VALUES (2, 'SALE20', 20, 'Giảm 20%', 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777571434/duc-toan-restaurant/x09jcmkbv93ruxmdwnee.jpg', 'Giảm 20% cho tất cả đơn hàng');


--
-- Data for Name: khachhang; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.khachhang (mataikhoan, matkhau, email, sdt, hoten, avatar, diachi, number_log, first_log, diemtichluy, id_restaurant, trangthai, firebase_uid) VALUES (2, '$2a$10$DQJDd90aXLBCwyNSEyT.XOJlilghS/WarFW197.FAw7inEAuqG5bC', 'b@gmail.com', '0922123456', 'Trần Thị B', NULL, 'Quận 1', 0, NULL, 0, NULL, NULL, NULL);
INSERT INTO public.khachhang (mataikhoan, matkhau, email, sdt, hoten, avatar, diachi, number_log, first_log, diemtichluy, id_restaurant, trangthai, firebase_uid) VALUES (3, '$2a$10$DQJDd90aXLBCwyNSEyT.XOJlilghS/WarFW197.FAw7inEAuqG5bC', 'c@gmail.com', '0912345678', 'nguyen van c', NULL, NULL, 0, '2025-12-16 00:00:00', 0, NULL, NULL, NULL);
INSERT INTO public.khachhang (mataikhoan, matkhau, email, sdt, hoten, avatar, diachi, number_log, first_log, diemtichluy, id_restaurant, trangthai, firebase_uid) VALUES (4, '$2a$10$DQJDd90aXLBCwyNSEyT.XOJlilghS/WarFW197.FAw7inEAuqG5bC', 'd@gmail.com', '0913345678', 'nguyen van d', NULL, NULL, 0, '2025-12-16 00:00:00', 0, NULL, NULL, NULL);
INSERT INTO public.khachhang (mataikhoan, matkhau, email, sdt, hoten, avatar, diachi, number_log, first_log, diemtichluy, id_restaurant, trangthai, firebase_uid) VALUES (6, '$2a$10$DQJDd90aXLBCwyNSEyT.XOJlilghS/WarFW197.FAw7inEAuqG5bC', 'e@gmail.com', '0398343124', 'd', NULL, NULL, 0, '2025-12-16 00:00:00', 0, NULL, NULL, NULL);
INSERT INTO public.khachhang (mataikhoan, matkhau, email, sdt, hoten, avatar, diachi, number_log, first_log, diemtichluy, id_restaurant, trangthai, firebase_uid) VALUES (7, '$2a$10$DQJDd90aXLBCwyNSEyT.XOJlilghS/WarFW197.FAw7inEAuqG5bC', '1@gmail.com', '0387343124', 'a', NULL, NULL, 0, '2025-12-16 00:00:00', 0, NULL, NULL, NULL);
INSERT INTO public.khachhang (mataikhoan, matkhau, email, sdt, hoten, avatar, diachi, number_log, first_log, diemtichluy, id_restaurant, trangthai, firebase_uid) VALUES (8, '$2a$10$DQJDd90aXLBCwyNSEyT.XOJlilghS/WarFW197.FAw7inEAuqG5bC', 'f@gmail.com', '0923456799', 'nguyen van f', NULL, NULL, 0, '2025-12-17 00:00:00', 0, NULL, NULL, NULL);
INSERT INTO public.khachhang (mataikhoan, matkhau, email, sdt, hoten, avatar, diachi, number_log, first_log, diemtichluy, id_restaurant, trangthai, firebase_uid) VALUES (9, '$2a$10$DQJDd90aXLBCwyNSEyT.XOJlilghS/WarFW197.FAw7inEAuqG5bC', 'h@gmail.com', '0923456789', 'h', NULL, NULL, 0, '2025-12-17 00:00:00', 0, NULL, NULL, NULL);
INSERT INTO public.khachhang (mataikhoan, matkhau, email, sdt, hoten, avatar, diachi, number_log, first_log, diemtichluy, id_restaurant, trangthai, firebase_uid) VALUES (61, '$2a$10$DQJDd90aXLBCwyNSEyT.XOJlilghS/WarFW197.FAw7inEAuqG5bC', '1234@gmail.com', '0967645656', 'nguyen 1234', NULL, NULL, 0, NULL, 0, NULL, NULL, NULL);
INSERT INTO public.khachhang (mataikhoan, matkhau, email, sdt, hoten, avatar, diachi, number_log, first_log, diemtichluy, id_restaurant, trangthai, firebase_uid) VALUES (62, '$2a$10$DQJDd90aXLBCwyNSEyT.XOJlilghS/WarFW197.FAw7inEAuqG5bC', 'toan2121@gmail.com', '0987654329', 'toan2121', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL);
INSERT INTO public.khachhang (mataikhoan, matkhau, email, sdt, hoten, avatar, diachi, number_log, first_log, diemtichluy, id_restaurant, trangthai, firebase_uid) VALUES (69, '$2a$10$NKXjcJDPsN2x4G2.bA7aKuQFltvIxsQNw3XRef8GlWSm4t3HYVGi2', 'eeeeemailcuaban@gmail.com', '0837643762', 'dev1222', NULL, '', NULL, NULL, 0, NULL, NULL, NULL);
INSERT INTO public.khachhang (mataikhoan, matkhau, email, sdt, hoten, avatar, diachi, number_log, first_log, diemtichluy, id_restaurant, trangthai, firebase_uid) VALUES (70, '$2a$10$lrOxKdq5.Zk.pVCgxzr8D.jSm4vr6mrVpGhBcO99S6CY5PunNlv/u', '0987467283@default.com', '0987467283', 'toannnnn', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL);
INSERT INTO public.khachhang (mataikhoan, matkhau, email, sdt, hoten, avatar, diachi, number_log, first_log, diemtichluy, id_restaurant, trangthai, firebase_uid) VALUES (73, '$2a$10$/AkTCnIIlfI.8u4fCMJnV.reTKg6HlhkFgCd64Sgqc5dh.A0dcByq', 'khach1123@gmail.com', '0980000000', '123456', NULL, '', NULL, NULL, 0, NULL, NULL, NULL);
INSERT INTO public.khachhang (mataikhoan, matkhau, email, sdt, hoten, avatar, diachi, number_log, first_log, diemtichluy, id_restaurant, trangthai, firebase_uid) VALUES (74, '$2a$10$PcVKdYuX3pBqqQIWALtxFuDpVvYWAA5XOs.SCb36BDf4GdSsrJQQy', 'khach1@gmail.com', '0956789999', 'test khach 1', NULL, '', NULL, NULL, 0, NULL, NULL, NULL);
INSERT INTO public.khachhang (mataikhoan, matkhau, email, sdt, hoten, avatar, diachi, number_log, first_log, diemtichluy, id_restaurant, trangthai, firebase_uid) VALUES (1, '$2a$10$y6ksAfpSGMkvG0s2moqBW.jiklkNPdz4/TvOO0KijAi9pLTGIRxOq', 'a@gmail.com', '0912123456', 'Nguyễn Văn A', 'nguyenvana.png', 'Quận 3', 0, NULL, 12458900, NULL, NULL, NULL);
INSERT INTO public.khachhang (mataikhoan, matkhau, email, sdt, hoten, avatar, diachi, number_log, first_log, diemtichluy, id_restaurant, trangthai, firebase_uid) VALUES (75, '$2a$10$2okr7F2RPIqYzZA4PImokOFg4wBtP6B5mzcIAbnMWZUtijG6cdTla', 'test1@gmail.com', '0955566666', 'Dev1', NULL, '', NULL, NULL, 0, NULL, NULL, NULL);
INSERT INTO public.khachhang (mataikhoan, matkhau, email, sdt, hoten, avatar, diachi, number_log, first_log, diemtichluy, id_restaurant, trangthai, firebase_uid) VALUES (72, '$2a$10$zuLzea7iGmfixWiuUDLfFefzM7RcdyPw1GY2fUyUa8VEXIO0L5fci', 'toanit5.haui@gmail.com', '0985643794', 'Dev', NULL, NULL, NULL, NULL, 45000, NULL, NULL, NULL);
INSERT INTO public.khachhang (mataikhoan, matkhau, email, sdt, hoten, avatar, diachi, number_log, first_log, diemtichluy, id_restaurant, trangthai, firebase_uid) VALUES (66, '$2a$10$DQJDd90aXLBCwyNSEyT.XOJlilghS/WarFW197.FAw7inEAuqG5bC', 'nguyenvanbcheck123@gmail.com', '0987654321', 'Nguyễn Văn B', NULL, '456 Đường ABC, Quận 4, TP. HCM', NULL, NULL, 234500, NULL, NULL, NULL);


--
-- Data for Name: vaitro; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.vaitro (mavaitro, tenvaitro, mota) VALUES (2, 'THU_NGAN', 'Thu ngân tại quầy');
INSERT INTO public.vaitro (mavaitro, tenvaitro, mota) VALUES (3, 'BEP', 'Nhân viên bếp');
INSERT INTO public.vaitro (mavaitro, tenvaitro, mota) VALUES (1, 'QUAN_LY', 'Quản lý nhà hàng');


--
-- Data for Name: nhanvien; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.nhanvien (manhanvien, id_restaurant, mavaitro, tennhanvien, email, password, mota, number_log, first_log, trangthai) VALUES (9, 1, 1, 'Hoàng Văn I', 'hvi@gmail.com', '$2a$10$DQJDd90aXLBCwyNSEyT.XOJlilghS/WarFW197.FAw7inEAuqG5bC', 'Quản lý', 11, '2023-12-18', true);
INSERT INTO public.nhanvien (manhanvien, id_restaurant, mavaitro, tennhanvien, email, password, mota, number_log, first_log, trangthai) VALUES (1, 1, 1, 'Nguyễn Thị q', 'ntq@gmail.com', '$2a$10$DQJDd90aXLBCwyNSEyT.XOJlilghS/WarFW197.FAw7inEAuqG5bC', 'Thu ngân', 1, '2023-12-19', true);
INSERT INTO public.nhanvien (manhanvien, id_restaurant, mavaitro, tennhanvien, email, password, mota, number_log, first_log, trangthai) VALUES (2, 1, 2, 'Trần Văn Y', 'tvy@gmail.com', '$2a$10$DQJDd90aXLBCwyNSEyT.XOJlilghS/WarFW197.FAw7inEAuqG5bC', 'Phục vụ', 1, '2023-12-19', true);
INSERT INTO public.nhanvien (manhanvien, id_restaurant, mavaitro, tennhanvien, email, password, mota, number_log, first_log, trangthai) VALUES (4, 1, 2, 'Hoàng Văn F', 'hvf@gmail.com', '$2a$10$DQJDd90aXLBCwyNSEyT.XOJlilghS/WarFW197.FAw7inEAuqG5bC', 'Phục vụ', 11, '2023-12-18', true);
INSERT INTO public.nhanvien (manhanvien, id_restaurant, mavaitro, tennhanvien, email, password, mota, number_log, first_log, trangthai) VALUES (5, 1, 2, 'Hoàng Văn J', 'hvj@gmail.com', '$2a$10$DQJDd90aXLBCwyNSEyT.XOJlilghS/WarFW197.FAw7inEAuqG5bC', 'Phục Vụ', 11, '2023-12-18', true);
INSERT INTO public.nhanvien (manhanvien, id_restaurant, mavaitro, tennhanvien, email, password, mota, number_log, first_log, trangthai) VALUES (8, 1, 1, 'Trần Văn H', 'tvh@gmail.com', '$2a$10$DQJDd90aXLBCwyNSEyT.XOJlilghS/WarFW197.FAw7inEAuqG5bC', 'Phục vụ', 1, '2023-12-19', true);
INSERT INTO public.nhanvien (manhanvien, id_restaurant, mavaitro, tennhanvien, email, password, mota, number_log, first_log, trangthai) VALUES (10, 1, 3, 'nhan vien bep a', 'bep@gmail.com', '$2a$10$DQJDd90aXLBCwyNSEyT.XOJlilghS/WarFW197.FAw7inEAuqG5bC', 'Nhan vien bep', 1, '2023-12-19', true);
INSERT INTO public.nhanvien (manhanvien, id_restaurant, mavaitro, tennhanvien, email, password, mota, number_log, first_log, trangthai) VALUES (7, 1, 2, 'Nguyễn Thị G', 'ntg@gmail.com', '$2a$10$slCcZISm6OShXhhuaDZWOOo6egMGs5llXyTF2sjOy1uF8N2//nY5O', NULL, NULL, NULL, true);
INSERT INTO public.nhanvien (manhanvien, id_restaurant, mavaitro, tennhanvien, email, password, mota, number_log, first_log, trangthai) VALUES (6, 1, 3, 'Hoàng Văn K', 'hvk@gmail.com', '$2a$10$e3BIh9a1HzcEBRBmBCMzaOj5K0TyVqe7ErRDq/osNv4c70oEczguK', NULL, NULL, NULL, true);
INSERT INTO public.nhanvien (manhanvien, id_restaurant, mavaitro, tennhanvien, email, password, mota, number_log, first_log, trangthai) VALUES (3, 1, 2, 'Hoàng Văn E', 'hve@gmail.com', '$2a$10$OLc6pvUZJmtqnFnj1KOCNOyAxr441ziSIsvs9fxQM2pJRD9IwFgi2', NULL, NULL, NULL, true);
INSERT INTO public.nhanvien (manhanvien, id_restaurant, mavaitro, tennhanvien, email, password, mota, number_log, first_log, trangthai) VALUES (11, 1, 1, 'devvvvvvvv', 'devvvvvvvv@gmail.com', '$2a$10$L1VzHC...mvJVCKweJdaiOror.zp4au3jkzrrfcbXrlr98a9zCExq', NULL, NULL, NULL, true);


--
-- Data for Name: sanpham; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.sanpham (masanpham, madanhmuc, tensanpham, mota, gia) VALUES (3, 2, 'Hamburger bò', 'Bánh hamburger', 45000);
INSERT INTO public.sanpham (masanpham, madanhmuc, tensanpham, mota, gia) VALUES (7, 1, 'Trà sữa Thái xanh', 'Trà sữa vị thái xanh thơm mát', 32000);
INSERT INTO public.sanpham (masanpham, madanhmuc, tensanpham, mota, gia) VALUES (8, 1, 'Hồng trà sữa', 'Trà sữa truyền thống đậm vị trà', 28000);
INSERT INTO public.sanpham (masanpham, madanhmuc, tensanpham, mota, gia) VALUES (9, 2, 'Pizza Hải sản', 'Pizza nhân tôm, mực, thanh cua', 125000);
INSERT INTO public.sanpham (masanpham, madanhmuc, tensanpham, mota, gia) VALUES (10, 3, 'Mì Ý Sốt Bò Bằm', 'Mì Ý sốt cà chua và thịt bò bằm', 55000);
INSERT INTO public.sanpham (masanpham, madanhmuc, tensanpham, mota, gia) VALUES (11, 1, 'Nước ép Cam', 'Cam tươi nguyên chất 100%', 35000);
INSERT INTO public.sanpham (masanpham, madanhmuc, tensanpham, mota, gia) VALUES (12, 3, 'Gà sốt Cay Hàn Quốc', 'Gà chiên giòn sốt cay ngọt', 45000);
INSERT INTO public.sanpham (masanpham, madanhmuc, tensanpham, mota, gia) VALUES (13, 1, 'Sinh tố Bơ', 'Bơ sáp xay cùng sữa đặc', 40000);
INSERT INTO public.sanpham (masanpham, madanhmuc, tensanpham, mota, gia) VALUES (14, 2, 'Khoai tây múi cau', 'Khoai tây cắt múi cau chiên giòn', 25000);
INSERT INTO public.sanpham (masanpham, madanhmuc, tensanpham, mota, gia) VALUES (15, 1, 'Trà đào cam sả', 'Trà đào kết hợp cam và sả tươi', 38000);
INSERT INTO public.sanpham (masanpham, madanhmuc, tensanpham, mota, gia) VALUES (16, 3, 'Salad Ức Gà', 'Salad rau củ kèm ức gà áp chảo', 48000);
INSERT INTO public.sanpham (masanpham, madanhmuc, tensanpham, mota, gia) VALUES (17, 4, 'Chè khúc bạch', 'Chè khúc bạch trân châu đường đen', 25000);
INSERT INTO public.sanpham (masanpham, madanhmuc, tensanpham, mota, gia) VALUES (18, 4, 'Bánh Flan', 'Bánh Flan cốt dừa thơm béo', 15000);
INSERT INTO public.sanpham (masanpham, madanhmuc, tensanpham, mota, gia) VALUES (20, 4, 'Sữa chua dẻo', 'Sữa chua dẻo xắt miếng kèm bột ca cao', 30000);
INSERT INTO public.sanpham (masanpham, madanhmuc, tensanpham, mota, gia) VALUES (21, 4, 'Kem bơ Đà Lạt', 'Bơ sáp xay nhuyễn kèm kem vani viên', 45000);
INSERT INTO public.sanpham (masanpham, madanhmuc, tensanpham, mota, gia) VALUES (22, 3, 'Phở bò Nam Định', 'Phở bò đặc sản nổi tiếng Nam Định', 50000);
INSERT INTO public.sanpham (masanpham, madanhmuc, tensanpham, mota, gia) VALUES (23, 3, 'Phở bò Lý Thái Tổ', 'Phở bò tái chín', 65000);
INSERT INTO public.sanpham (masanpham, madanhmuc, tensanpham, mota, gia) VALUES (1, 1, 'Trà sữa trân châu đường đen', 'Thức uống ngọt, trân châu đường đen', 25000);
INSERT INTO public.sanpham (masanpham, madanhmuc, tensanpham, mota, gia) VALUES (24, 1, 'Ca-fe đen', 'ca-fe đen đá ít đường', 25000);
INSERT INTO public.sanpham (masanpham, madanhmuc, tensanpham, mota, gia) VALUES (4, 2, 'Khoai tây chiên', 'Khoai tây chiên giòn', 20000);
INSERT INTO public.sanpham (masanpham, madanhmuc, tensanpham, mota, gia) VALUES (25, 3, 'Cơm rang dưa bò', 'Cơm rang dưa bò ngon nhức nách', 35000);
INSERT INTO public.sanpham (masanpham, madanhmuc, tensanpham, mota, gia) VALUES (29, 2, 'gaf rans', 'ahgaa', 40000);


--
-- Data for Name: thanhtoan; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.thanhtoan (id_thanhtoan, kieuthanhtoan) VALUES (1, 'Tiền mặt');
INSERT INTO public.thanhtoan (id_thanhtoan, kieuthanhtoan) VALUES (2, 'Chuyển khoản');
INSERT INTO public.thanhtoan (id_thanhtoan, kieuthanhtoan) VALUES (3, 'Điểm');


--
-- Data for Name: yeucaudon; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.yeucaudon (madonhang, id_restaurant, trangthaithanhtoan, thoigianthanhtoan, ngaytaodon, mataikhoan, id_thanhtoan, ghichu, id_giamgia, maban, manhanvien, giosudung, tongtien) VALUES (8, 1, 'đã thanh toán', '2026-01-13 09:09:09.813186', '2026-01-13 09:09:09.813186', 1, 1, NULL, NULL, 11, NULL, '2026-01-13 16:08:00', 100000);
INSERT INTO public.yeucaudon (madonhang, id_restaurant, trangthaithanhtoan, thoigianthanhtoan, ngaytaodon, mataikhoan, id_thanhtoan, ghichu, id_giamgia, maban, manhanvien, giosudung, tongtien) VALUES (83, 1, 'chưa thanh toán', NULL, '2026-03-06 16:19:33.048217', 1, 1, NULL, NULL, 9, NULL, '2026-03-06 21:44:00', 32000);
INSERT INTO public.yeucaudon (madonhang, id_restaurant, trangthaithanhtoan, thoigianthanhtoan, ngaytaodon, mataikhoan, id_thanhtoan, ghichu, id_giamgia, maban, manhanvien, giosudung, tongtien) VALUES (1, 1, 'đã thanh toán', '2026-01-05 17:39:33.545112', '2026-01-05 17:31:02.460008', 1, 2, NULL, NULL, 7, NULL, '2026-01-05 14:30:00', 30000);
INSERT INTO public.yeucaudon (madonhang, id_restaurant, trangthaithanhtoan, thoigianthanhtoan, ngaytaodon, mataikhoan, id_thanhtoan, ghichu, id_giamgia, maban, manhanvien, giosudung, tongtien) VALUES (87, 1, 'đã thanh toán', '2026-03-09 00:57:49.030121', '2026-03-09 00:57:21.499187', 1, 2, NULL, NULL, 9, NULL, '2026-03-10 02:56:00', 32000);
INSERT INTO public.yeucaudon (madonhang, id_restaurant, trangthaithanhtoan, thoigianthanhtoan, ngaytaodon, mataikhoan, id_thanhtoan, ghichu, id_giamgia, maban, manhanvien, giosudung, tongtien) VALUES (89, 1, 'đã thanh toán', NULL, '2026-03-09 16:46:14.126528', 1, 3, NULL, NULL, 7, NULL, '2026-03-09 18:45:00', 32000);
INSERT INTO public.yeucaudon (madonhang, id_restaurant, trangthaithanhtoan, thoigianthanhtoan, ngaytaodon, mataikhoan, id_thanhtoan, ghichu, id_giamgia, maban, manhanvien, giosudung, tongtien) VALUES (91, 1, 'đã thanh toán', NULL, '2026-03-10 13:55:00.519209', 1, 3, NULL, NULL, 5, NULL, '2026-03-10 15:54:00', 28000);
INSERT INTO public.yeucaudon (madonhang, id_restaurant, trangthaithanhtoan, thoigianthanhtoan, ngaytaodon, mataikhoan, id_thanhtoan, ghichu, id_giamgia, maban, manhanvien, giosudung, tongtien) VALUES (92, 1, 'đã thanh toán', NULL, '2026-03-10 14:28:51.216487', 1, 3, NULL, 2, 7, NULL, '2026-03-10 17:26:00', 12000);
INSERT INTO public.yeucaudon (madonhang, id_restaurant, trangthaithanhtoan, thoigianthanhtoan, ngaytaodon, mataikhoan, id_thanhtoan, ghichu, id_giamgia, maban, manhanvien, giosudung, tongtien) VALUES (107, 1, 'chưa thanh toán', NULL, '2026-03-11 05:38:34.790971', 1, 1, NULL, NULL, 2, NULL, '2026-03-12 18:37:00', 28000);
INSERT INTO public.yeucaudon (madonhang, id_restaurant, trangthaithanhtoan, thoigianthanhtoan, ngaytaodon, mataikhoan, id_thanhtoan, ghichu, id_giamgia, maban, manhanvien, giosudung, tongtien) VALUES (115, 1, 'chưa thanh toán', NULL, '2026-03-11 21:36:38.975527', 1, 1, NULL, NULL, 15, NULL, '2026-03-13 23:34:00', 28000);
INSERT INTO public.yeucaudon (madonhang, id_restaurant, trangthaithanhtoan, thoigianthanhtoan, ngaytaodon, mataikhoan, id_thanhtoan, ghichu, id_giamgia, maban, manhanvien, giosudung, tongtien) VALUES (100, 1, 'đã thanh toán', '2026-03-13 04:39:21.25012', '2026-03-10 17:41:26.670754', 1, 1, NULL, NULL, 11, NULL, '2026-03-10 19:41:00', 28000);
INSERT INTO public.yeucaudon (madonhang, id_restaurant, trangthaithanhtoan, thoigianthanhtoan, ngaytaodon, mataikhoan, id_thanhtoan, ghichu, id_giamgia, maban, manhanvien, giosudung, tongtien) VALUES (118, 1, 'đã thanh toán', NULL, '2026-03-13 04:50:33.681133', 1, 3, NULL, NULL, 1, NULL, '2026-03-13 18:50:00', 35000);
INSERT INTO public.yeucaudon (madonhang, id_restaurant, trangthaithanhtoan, thoigianthanhtoan, ngaytaodon, mataikhoan, id_thanhtoan, ghichu, id_giamgia, maban, manhanvien, giosudung, tongtien) VALUES (119, 1, 'đã thanh toán', NULL, '2026-03-13 04:54:05.865808', 72, 3, NULL, NULL, 2, NULL, '2026-03-13 18:53:00', 50000);
INSERT INTO public.yeucaudon (madonhang, id_restaurant, trangthaithanhtoan, thoigianthanhtoan, ngaytaodon, mataikhoan, id_thanhtoan, ghichu, id_giamgia, maban, manhanvien, giosudung, tongtien) VALUES (120, 1, 'đã thanh toán', NULL, '2026-03-13 04:56:48.229477', 72, 3, NULL, NULL, 1, NULL, '2026-03-13 20:55:00', 50000);
INSERT INTO public.yeucaudon (madonhang, id_restaurant, trangthaithanhtoan, thoigianthanhtoan, ngaytaodon, mataikhoan, id_thanhtoan, ghichu, id_giamgia, maban, manhanvien, giosudung, tongtien) VALUES (121, 1, 'chưa thanh toán', NULL, '2026-03-13 05:01:00.818719', 72, 1, NULL, NULL, 15, NULL, '2026-03-13 20:57:00', 32000);
INSERT INTO public.yeucaudon (madonhang, id_restaurant, trangthaithanhtoan, thoigianthanhtoan, ngaytaodon, mataikhoan, id_thanhtoan, ghichu, id_giamgia, maban, manhanvien, giosudung, tongtien) VALUES (122, 1, 'chưa thanh toán', NULL, '2026-03-13 05:15:19.386952', 72, 1, NULL, NULL, 15, NULL, '2026-03-13 20:14:00', 125000);
INSERT INTO public.yeucaudon (madonhang, id_restaurant, trangthaithanhtoan, thoigianthanhtoan, ngaytaodon, mataikhoan, id_thanhtoan, ghichu, id_giamgia, maban, manhanvien, giosudung, tongtien) VALUES (123, 1, 'đã thanh toán', NULL, '2026-03-13 05:16:59.859937', 72, 3, NULL, NULL, 15, NULL, '2026-03-13 20:15:00', 55000);
INSERT INTO public.yeucaudon (madonhang, id_restaurant, trangthaithanhtoan, thoigianthanhtoan, ngaytaodon, mataikhoan, id_thanhtoan, ghichu, id_giamgia, maban, manhanvien, giosudung, tongtien) VALUES (125, 1, 'đã thanh toán', NULL, '2026-03-13 16:21:54.871136', 66, 3, NULL, 4, 15, 9, '2026-03-13 16:12:38.285', 16000);
INSERT INTO public.yeucaudon (madonhang, id_restaurant, trangthaithanhtoan, thoigianthanhtoan, ngaytaodon, mataikhoan, id_thanhtoan, ghichu, id_giamgia, maban, manhanvien, giosudung, tongtien) VALUES (126, 1, 'đã thanh toán', NULL, '2026-03-13 16:25:30.809177', 66, 3, NULL, 4, 1, 9, '2026-03-13 16:25:12.066', 16000);
INSERT INTO public.yeucaudon (madonhang, id_restaurant, trangthaithanhtoan, thoigianthanhtoan, ngaytaodon, mataikhoan, id_thanhtoan, ghichu, id_giamgia, maban, manhanvien, giosudung, tongtien) VALUES (127, 1, 'đã thanh toán', NULL, '2026-03-13 16:31:34.51919', 1, 3, NULL, 1, 2, NULL, '2026-03-13 17:31:00', 40500);
INSERT INTO public.yeucaudon (madonhang, id_restaurant, trangthaithanhtoan, thoigianthanhtoan, ngaytaodon, mataikhoan, id_thanhtoan, ghichu, id_giamgia, maban, manhanvien, giosudung, tongtien) VALUES (128, 1, 'đã thanh toán', NULL, '2026-03-13 17:51:06.912555', 66, 3, NULL, 4, 2, NULL, '2026-03-13 19:50:00', 62500);
INSERT INTO public.yeucaudon (madonhang, id_restaurant, trangthaithanhtoan, thoigianthanhtoan, ngaytaodon, mataikhoan, id_thanhtoan, ghichu, id_giamgia, maban, manhanvien, giosudung, tongtien) VALUES (129, 1, 'đã thanh toán', NULL, '2026-03-13 19:16:36.137156', 66, 3, NULL, 4, 2, NULL, '2026-03-13 21:16:00', 43500);
INSERT INTO public.yeucaudon (madonhang, id_restaurant, trangthaithanhtoan, thoigianthanhtoan, ngaytaodon, mataikhoan, id_thanhtoan, ghichu, id_giamgia, maban, manhanvien, giosudung, tongtien) VALUES (86, 1, 'đã thanh toán', '2026-03-15 17:24:03.091169', '2026-03-07 17:51:57.986036', 1, 1, NULL, NULL, 5, NULL, '2026-03-07 21:51:00', 80000);
INSERT INTO public.yeucaudon (madonhang, id_restaurant, trangthaithanhtoan, thoigianthanhtoan, ngaytaodon, mataikhoan, id_thanhtoan, ghichu, id_giamgia, maban, manhanvien, giosudung, tongtien) VALUES (132, 1, 'đã thanh toán', '2026-03-17 12:33:11.069153', '2026-03-17 12:32:41.55731', 1, 2, NULL, 4, 2, NULL, '2026-03-17 14:31:00', 38500);
INSERT INTO public.yeucaudon (madonhang, id_restaurant, trangthaithanhtoan, thoigianthanhtoan, ngaytaodon, mataikhoan, id_thanhtoan, ghichu, id_giamgia, maban, manhanvien, giosudung, tongtien) VALUES (80, 1, 'đã thanh toán', '2026-03-17 13:08:13.744038', '2026-03-06 15:51:37.746357', 66, 1, NULL, NULL, 15, 9, '2026-03-05 22:15:47.888', 45000);
INSERT INTO public.yeucaudon (madonhang, id_restaurant, trangthaithanhtoan, thoigianthanhtoan, ngaytaodon, mataikhoan, id_thanhtoan, ghichu, id_giamgia, maban, manhanvien, giosudung, tongtien) VALUES (124, 1, 'đã thanh toán', '2026-03-18 19:00:43.399657', '2026-03-13 05:18:13.477687', 72, 1, NULL, NULL, 15, NULL, '2026-03-13 20:17:00', 32000);
INSERT INTO public.yeucaudon (madonhang, id_restaurant, trangthaithanhtoan, thoigianthanhtoan, ngaytaodon, mataikhoan, id_thanhtoan, ghichu, id_giamgia, maban, manhanvien, giosudung, tongtien) VALUES (103, 1, 'đã thanh toán', '2026-03-18 19:02:07.511855', '2026-03-10 20:12:41.650523', 1, 1, NULL, NULL, 1, NULL, '2026-03-10 20:11:50.853', 28000);
INSERT INTO public.yeucaudon (madonhang, id_restaurant, trangthaithanhtoan, thoigianthanhtoan, ngaytaodon, mataikhoan, id_thanhtoan, ghichu, id_giamgia, maban, manhanvien, giosudung, tongtien) VALUES (138, 1, 'đã thanh toán', NULL, '2026-03-18 19:04:22.933481', 66, 3, NULL, 4, 15, 9, '2026-03-18 19:03:43.293', 45000);
INSERT INTO public.yeucaudon (madonhang, id_restaurant, trangthaithanhtoan, thoigianthanhtoan, ngaytaodon, mataikhoan, id_thanhtoan, ghichu, id_giamgia, maban, manhanvien, giosudung, tongtien) VALUES (139, 1, 'đã thanh toán', '2026-03-18 19:05:38.683992', '2026-03-18 19:05:21.732153', 66, 1, NULL, 4, 2, 9, '2026-03-18 19:04:54.359', 22500);
INSERT INTO public.yeucaudon (madonhang, id_restaurant, trangthaithanhtoan, thoigianthanhtoan, ngaytaodon, mataikhoan, id_thanhtoan, ghichu, id_giamgia, maban, manhanvien, giosudung, tongtien) VALUES (140, 1, 'đã thanh toán', '2026-03-18 19:21:29.14987', '2026-03-18 19:17:54.61465', 66, 1, NULL, 4, 15, 9, '2026-03-18 19:17:24.975', 20000);
INSERT INTO public.yeucaudon (madonhang, id_restaurant, trangthaithanhtoan, thoigianthanhtoan, ngaytaodon, mataikhoan, id_thanhtoan, ghichu, id_giamgia, maban, manhanvien, giosudung, tongtien) VALUES (143, 1, 'đã thanh toán', '2026-03-19 06:26:44.408229', '2026-03-19 06:24:48.529252', 1, 1, NULL, 4, 2, NULL, '2026-03-19 08:24:00', 17500);
INSERT INTO public.yeucaudon (madonhang, id_restaurant, trangthaithanhtoan, thoigianthanhtoan, ngaytaodon, mataikhoan, id_thanhtoan, ghichu, id_giamgia, maban, manhanvien, giosudung, tongtien) VALUES (144, 1, 'đã thanh toán', '2026-03-19 06:35:04.969428', '2026-03-19 06:28:57.880197', 1, 3, NULL, 4, 3, NULL, '2026-03-19 08:28:00', 27500);
INSERT INTO public.yeucaudon (madonhang, id_restaurant, trangthaithanhtoan, thoigianthanhtoan, ngaytaodon, mataikhoan, id_thanhtoan, ghichu, id_giamgia, maban, manhanvien, giosudung, tongtien) VALUES (145, 1, 'đã thanh toán', '2026-03-19 06:39:05.425705', '2026-03-19 06:37:58.63326', 1, 2, NULL, 4, 3, NULL, '2026-03-19 09:35:00', 22500);
INSERT INTO public.yeucaudon (madonhang, id_restaurant, trangthaithanhtoan, thoigianthanhtoan, ngaytaodon, mataikhoan, id_thanhtoan, ghichu, id_giamgia, maban, manhanvien, giosudung, tongtien) VALUES (146, 1, 'đã thanh toán', '2026-03-19 06:46:22.916994', '2026-03-19 06:45:56.618799', 66, 2, NULL, 4, 15, 9, '2026-03-19 06:40:30.971', 20000);
INSERT INTO public.yeucaudon (madonhang, id_restaurant, trangthaithanhtoan, thoigianthanhtoan, ngaytaodon, mataikhoan, id_thanhtoan, ghichu, id_giamgia, maban, manhanvien, giosudung, tongtien) VALUES (147, 1, 'đã thanh toán', '2026-03-19 06:47:21.033016', '2026-03-19 06:47:06.457309', 1, 2, NULL, 4, 4, NULL, '2026-03-19 09:35:00', 12500);
INSERT INTO public.yeucaudon (madonhang, id_restaurant, trangthaithanhtoan, thoigianthanhtoan, ngaytaodon, mataikhoan, id_thanhtoan, ghichu, id_giamgia, maban, manhanvien, giosudung, tongtien) VALUES (153, 1, 'đã thanh toán', '2026-03-23 17:11:39.141418', '2026-03-23 17:08:32.262504', 66, 3, NULL, 4, 15, 9, '2026-03-23 17:08:00.448', 22500);
INSERT INTO public.yeucaudon (madonhang, id_restaurant, trangthaithanhtoan, thoigianthanhtoan, ngaytaodon, mataikhoan, id_thanhtoan, ghichu, id_giamgia, maban, manhanvien, giosudung, tongtien) VALUES (164, 1, 'đã thanh toán', '2026-04-27 09:52:03.994178', '2026-04-27 09:37:28.480782', 75, 1, NULL, 4, 4, NULL, '2026-04-27 13:37:00', 62500);
INSERT INTO public.yeucaudon (madonhang, id_restaurant, trangthaithanhtoan, thoigianthanhtoan, ngaytaodon, mataikhoan, id_thanhtoan, ghichu, id_giamgia, maban, manhanvien, giosudung, tongtien) VALUES (163, 1, 'đã thanh toán', '2026-04-27 10:07:06.22452', '2026-04-27 09:16:58.884859', 75, 1, NULL, NULL, 2, NULL, '2026-04-27 10:16:00', 45000);
INSERT INTO public.yeucaudon (madonhang, id_restaurant, trangthaithanhtoan, thoigianthanhtoan, ngaytaodon, mataikhoan, id_thanhtoan, ghichu, id_giamgia, maban, manhanvien, giosudung, tongtien) VALUES (165, 1, 'đã thanh toán', '2026-04-30 23:27:36.874262', '2026-04-27 13:15:46.111907', 1, 2, NULL, NULL, 8, NULL, '2026-04-27 15:15:00', 28000);


--
-- Data for Name: chitietyeucau; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.chitietyeucau (madonhang, id_restaurant, masanpham, soluong, trangthai, gia, update_trang_thai_at) VALUES (100, 1, 8, 1, 'hoàn thành', 28000, '2026-03-13 04:40:02.651849');
INSERT INTO public.chitietyeucau (madonhang, id_restaurant, masanpham, soluong, trangthai, gia, update_trang_thai_at) VALUES (118, 1, 11, 1, 'hoàn thành', 35000, '2026-03-13 04:51:17.632007');
INSERT INTO public.chitietyeucau (madonhang, id_restaurant, masanpham, soluong, trangthai, gia, update_trang_thai_at) VALUES (119, 1, 22, 1, 'hoàn thành', 50000, '2026-03-13 04:54:26.171886');
INSERT INTO public.chitietyeucau (madonhang, id_restaurant, masanpham, soluong, trangthai, gia, update_trang_thai_at) VALUES (91, 1, 8, 1, 'hoàn thành', 28000, '2026-03-14 00:29:49.722091');
INSERT INTO public.chitietyeucau (madonhang, id_restaurant, masanpham, soluong, trangthai, gia, update_trang_thai_at) VALUES (120, 1, 11, 1, 'hoàn thành', 35000, '2026-03-13 04:57:05.831584');
INSERT INTO public.chitietyeucau (madonhang, id_restaurant, masanpham, soluong, trangthai, gia, update_trang_thai_at) VALUES (120, 1, 18, 1, 'hoàn thành', 15000, '2026-03-13 04:57:05.831584');
INSERT INTO public.chitietyeucau (madonhang, id_restaurant, masanpham, soluong, trangthai, gia, update_trang_thai_at) VALUES (121, 1, 7, 1, 'Đã hủy', 32000, '2026-03-13 05:01:07.711018');
INSERT INTO public.chitietyeucau (madonhang, id_restaurant, masanpham, soluong, trangthai, gia, update_trang_thai_at) VALUES (92, 1, 7, 1, 'hoàn thành', 32000, '2026-03-14 00:29:53.28621');
INSERT INTO public.chitietyeucau (madonhang, id_restaurant, masanpham, soluong, trangthai, gia, update_trang_thai_at) VALUES (122, 1, 9, 1, 'Đã hủy', 125000, '2026-03-13 05:15:42.744698');
INSERT INTO public.chitietyeucau (madonhang, id_restaurant, masanpham, soluong, trangthai, gia, update_trang_thai_at) VALUES (83, 1, 7, 1, 'Đã hủy', 32000, '2026-03-09 14:40:44.67051');
INSERT INTO public.chitietyeucau (madonhang, id_restaurant, masanpham, soluong, trangthai, gia, update_trang_thai_at) VALUES (123, 1, 10, 1, 'hoàn thành', 55000, '2026-03-13 05:17:50.630518');
INSERT INTO public.chitietyeucau (madonhang, id_restaurant, masanpham, soluong, trangthai, gia, update_trang_thai_at) VALUES (124, 1, 7, 1, 'hoàn thành', 32000, '2026-03-18 19:00:43.275618');
INSERT INTO public.chitietyeucau (madonhang, id_restaurant, masanpham, soluong, trangthai, gia, update_trang_thai_at) VALUES (87, 1, 7, 1, 'Đã hủy', 32000, '2026-03-09 17:30:30.687343');
INSERT INTO public.chitietyeucau (madonhang, id_restaurant, masanpham, soluong, trangthai, gia, update_trang_thai_at) VALUES (80, 1, 3, 1, 'Đã hủy', 45000, '2026-03-10 14:37:17.974485');
INSERT INTO public.chitietyeucau (madonhang, id_restaurant, masanpham, soluong, trangthai, gia, update_trang_thai_at) VALUES (127, 1, 3, 1, 'hoàn thành', 45000, '2026-03-13 16:31:51.104541');
INSERT INTO public.chitietyeucau (madonhang, id_restaurant, masanpham, soluong, trangthai, gia, update_trang_thai_at) VALUES (107, 1, 8, 1, 'Đã hủy', 28000, '2026-03-11 05:38:34.912823');
INSERT INTO public.chitietyeucau (madonhang, id_restaurant, masanpham, soluong, trangthai, gia, update_trang_thai_at) VALUES (8, 1, 3, 1, 'hoàn thành', 45000, '2026-03-13 16:37:04.642606');
INSERT INTO public.chitietyeucau (madonhang, id_restaurant, masanpham, soluong, trangthai, gia, update_trang_thai_at) VALUES (8, 1, 1, 1, 'hoàn thành', 30000, '2026-03-13 16:37:21.787599');
INSERT INTO public.chitietyeucau (madonhang, id_restaurant, masanpham, soluong, trangthai, gia, update_trang_thai_at) VALUES (126, 1, 7, 1, 'hoàn thành', 32000, '2026-03-13 17:33:17.661275');
INSERT INTO public.chitietyeucau (madonhang, id_restaurant, masanpham, soluong, trangthai, gia, update_trang_thai_at) VALUES (103, 1, 8, 1, 'hoàn thành', 28000, '2026-03-18 19:02:07.389346');
INSERT INTO public.chitietyeucau (madonhang, id_restaurant, masanpham, soluong, trangthai, gia, update_trang_thai_at) VALUES (128, 1, 9, 1, 'hoàn thành', 125000, '2026-03-13 19:10:36.797181');
INSERT INTO public.chitietyeucau (madonhang, id_restaurant, masanpham, soluong, trangthai, gia, update_trang_thai_at) VALUES (138, 1, 3, 2, 'hoàn thành', 45000, '2026-03-18 19:04:46.061865');
INSERT INTO public.chitietyeucau (madonhang, id_restaurant, masanpham, soluong, trangthai, gia, update_trang_thai_at) VALUES (129, 1, 7, 1, 'hoàn thành', 32000, '2026-03-13 19:17:18.918228');
INSERT INTO public.chitietyeucau (madonhang, id_restaurant, masanpham, soluong, trangthai, gia, update_trang_thai_at) VALUES (129, 1, 10, 1, 'hoàn thành', 55000, '2026-03-13 19:17:18.921231');
INSERT INTO public.chitietyeucau (madonhang, id_restaurant, masanpham, soluong, trangthai, gia, update_trang_thai_at) VALUES (89, 1, 7, 1, 'hoàn thành', 32000, '2026-03-15 17:17:32.053012');
INSERT INTO public.chitietyeucau (madonhang, id_restaurant, masanpham, soluong, trangthai, gia, update_trang_thai_at) VALUES (139, 1, 12, 1, 'hoàn thành', 45000, '2026-03-18 19:05:38.555194');
INSERT INTO public.chitietyeucau (madonhang, id_restaurant, masanpham, soluong, trangthai, gia, update_trang_thai_at) VALUES (1, 1, 1, 2, 'hoàn thành', 30000, '2026-03-15 17:20:42.382809');
INSERT INTO public.chitietyeucau (madonhang, id_restaurant, masanpham, soluong, trangthai, gia, update_trang_thai_at) VALUES (86, 1, 3, 1, 'hoàn thành', 45000, '2026-03-15 17:24:02.862867');
INSERT INTO public.chitietyeucau (madonhang, id_restaurant, masanpham, soluong, trangthai, gia, update_trang_thai_at) VALUES (140, 1, 13, 1, 'hoàn thành', 40000, '2026-03-18 19:21:28.92685');
INSERT INTO public.chitietyeucau (madonhang, id_restaurant, masanpham, soluong, trangthai, gia, update_trang_thai_at) VALUES (115, 1, 8, 1, 'Đã hủy', 28000, '2026-03-17 14:40:21.080949');
INSERT INTO public.chitietyeucau (madonhang, id_restaurant, masanpham, soluong, trangthai, gia, update_trang_thai_at) VALUES (132, 1, 3, 1, 'hoàn thành', 45000, '2026-03-17 15:57:23.584213');
INSERT INTO public.chitietyeucau (madonhang, id_restaurant, masanpham, soluong, trangthai, gia, update_trang_thai_at) VALUES (132, 1, 7, 1, 'hoàn thành', 32000, '2026-03-17 15:57:23.604489');
INSERT INTO public.chitietyeucau (madonhang, id_restaurant, masanpham, soluong, trangthai, gia, update_trang_thai_at) VALUES (143, 1, 11, 1, 'hoàn thành', 35000, '2026-03-19 06:26:57.882137');
INSERT INTO public.chitietyeucau (madonhang, id_restaurant, masanpham, soluong, trangthai, gia, update_trang_thai_at) VALUES (144, 1, 10, 1, 'hoàn thành', 55000, '2026-03-19 06:35:10.989637');
INSERT INTO public.chitietyeucau (madonhang, id_restaurant, masanpham, soluong, trangthai, gia, update_trang_thai_at) VALUES (153, 1, 3, 1, 'hoàn thành', 45000, '2026-03-23 17:11:45.765799');
INSERT INTO public.chitietyeucau (madonhang, id_restaurant, masanpham, soluong, trangthai, gia, update_trang_thai_at) VALUES (145, 1, 12, 1, 'hoàn thành', 45000, '2026-04-18 17:17:26.367515');
INSERT INTO public.chitietyeucau (madonhang, id_restaurant, masanpham, soluong, trangthai, gia, update_trang_thai_at) VALUES (146, 1, 13, 1, 'hoàn thành', 40000, '2026-04-18 17:17:26.403383');
INSERT INTO public.chitietyeucau (madonhang, id_restaurant, masanpham, soluong, trangthai, gia, update_trang_thai_at) VALUES (125, 1, 7, 1, 'hoàn thành', 32000, '2026-04-18 17:17:22.8681');
INSERT INTO public.chitietyeucau (madonhang, id_restaurant, masanpham, soluong, trangthai, gia, update_trang_thai_at) VALUES (147, 1, 14, 1, 'hoàn thành', 25000, '2026-04-18 17:17:23.147626');
INSERT INTO public.chitietyeucau (madonhang, id_restaurant, masanpham, soluong, trangthai, gia, update_trang_thai_at) VALUES (164, 1, 9, 1, 'đã chế biến', 125000, '2026-04-27 09:51:48.559032');
INSERT INTO public.chitietyeucau (madonhang, id_restaurant, masanpham, soluong, trangthai, gia, update_trang_thai_at) VALUES (163, 1, 3, 1, 'hoàn thành', 45000, '2026-04-27 10:07:09.349124');
INSERT INTO public.chitietyeucau (madonhang, id_restaurant, masanpham, soluong, trangthai, gia, update_trang_thai_at) VALUES (165, 1, 8, 1, 'chờ xác nhận', 28000, '2026-04-27 13:15:46.205778');


--
-- Data for Name: congthuc; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (1, 41, 0.02);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (1, 31, 0.03);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (1, 42, 0.05);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (1, 44, 0.02);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (3, 13, 1.00);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (3, 5, 0.10);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (3, 29, 1.00);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (3, 19, 0.02);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (9, 14, 1.00);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (9, 10, 0.05);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (9, 11, 0.05);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (9, 28, 0.08);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (9, 35, 0.03);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (10, 16, 0.10);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (10, 5, 0.08);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (10, 35, 0.05);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (22, 18, 0.20);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (22, 6, 0.08);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (22, 7, 0.20);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (22, 27, 0.01);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (25, 17, 0.15);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (25, 23, 0.10);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (25, 6, 0.05);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (25, 27, 0.01);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (4, 15, 0.20);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (4, 37, 0.05);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (7, 40, 0.02);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (7, 31, 0.03);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (7, 30, 0.05);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (8, 41, 0.02);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (8, 31, 0.03);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (8, 30, 0.05);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (11, 24, 0.30);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (12, 8, 0.35);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (12, 39, 0.10);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (12, 36, 0.05);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (13, 25, 0.25);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (13, 30, 0.05);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (13, 2, 0.10);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (14, 15, 0.25);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (14, 38, 0.05);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (15, 41, 0.01);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (15, 43, 0.10);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (15, 24, 0.05);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (16, 9, 0.15);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (16, 19, 0.10);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (16, 20, 0.05);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (17, 32, 0.10);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (17, 2, 0.10);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (17, 45, 0.01);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (17, 46, 0.02);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (18, 2, 0.20);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (18, 30, 0.05);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (20, 33, 1.00);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (20, 45, 0.01);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (21, 25, 0.20);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (21, 34, 1.00);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (21, 30, 0.02);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (23, 18, 0.20);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (23, 6, 0.10);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (23, 7, 0.30);
INSERT INTO public.congthuc (masanpham, manguyenlieu, slnguyenlieu) VALUES (24, 30, 0.01);


--
-- Data for Name: danhgia; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (1, 1, 'Ngon tuyệt!', 5, '2025-12-16 12:52:11.83692');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (2, 3, 'Bình thường', 3, '2025-12-16 12:52:11.83692');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (1, 9, 'Pizza hải sản rất nhiều topping, đáng tiền.', 5, '2025-12-25 09:18:36.903524');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (1, 12, 'Gà sốt cay hơi cay quá so với mình.', 4, '2025-12-25 09:18:36.903524');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (2, 1, 'Trà sữa trân châu hơi ngọt.', 4, '2025-12-25 09:18:36.903524');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (2, 23, 'Phở bò tái chín nước dùng rất thanh.', 5, '2025-12-25 09:18:36.903524');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (3, 10, 'Mì Ý hơi ít sốt một chút.', 3, '2025-12-25 09:18:36.903524');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (4, 15, 'Trà đào cam sả rất thơm.', 5, '2025-12-25 09:18:36.903524');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (6, 22, 'Phở Nam Định rất ngon, chuẩn vị Bắc.', 5, '2025-12-25 09:18:36.903524');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (6, 3, 'Hamburger bò hơi khô.', 3, '2025-12-25 09:18:36.903524');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (7, 18, 'Bánh Flan mềm mịn, béo ngậy.', 5, '2025-12-25 09:18:36.903524');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (8, 13, 'Sinh tố bơ đặc, rất chất lượng.', 5, '2025-12-25 09:18:36.903524');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (8, 20, 'Sữa chua dẻo ngon nhưng hơi ít.', 4, '2025-12-25 09:18:36.903524');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (9, 17, 'Chè khúc bạch thanh mát, không quá ngọt.', 5, '2025-12-25 09:18:36.903524');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (9, 14, 'Khoai tây múi cau rất ngon, lạ miệng.', 4, '2025-12-25 09:18:36.903524');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (4, 1, 'Hài lòng với dịch vụ và sản phẩm.', 5, '2025-12-16 05:59:01.127809');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (8, 1, 'Hài lòng với dịch vụ và sản phẩm.', 4, '2025-11-26 03:04:47.418014');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (3, 3, 'Hài lòng với dịch vụ và sản phẩm.', 3, '2025-12-16 06:12:16.54521');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (7, 3, 'Chất lượng ổn, đúng như mô tả.', 5, '2025-12-19 17:03:59.217463');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (1, 3, 'Chất lượng ổn, đúng như mô tả.', 5, '2025-12-09 08:26:35.040229');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (1, 4, 'Chất lượng ổn, đúng như mô tả.', 4, '2025-12-09 07:58:47.29603');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (3, 4, 'Hài lòng với dịch vụ và sản phẩm.', 3, '2025-12-20 10:29:49.270565');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (6, 4, 'Giao hàng nhanh, đóng gói cẩn thận.', 5, '2025-11-28 01:59:35.149212');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (2, 4, 'Giao hàng nhanh, đóng gói cẩn thận.', 3, '2025-12-10 11:08:15.201139');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (3, 7, 'Hài lòng với dịch vụ và sản phẩm.', 5, '2025-12-05 07:54:58.773004');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (4, 7, 'Hài lòng với dịch vụ và sản phẩm.', 5, '2025-11-28 02:18:52.0359');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (7, 7, 'Hài lòng với dịch vụ và sản phẩm.', 5, '2025-12-24 00:05:49.236436');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (6, 7, 'Hài lòng với dịch vụ và sản phẩm.', 3, '2025-12-25 08:57:49.741487');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (2, 7, 'Dùng rất thích, sẽ ủng hộ shop tiếp.', 4, '2025-12-16 11:03:02.641282');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (4, 8, 'Dùng rất thích, sẽ ủng hộ shop tiếp.', 5, '2025-11-27 02:19:53.702746');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (6, 8, 'Hài lòng với dịch vụ và sản phẩm.', 4, '2025-12-15 19:10:24.837012');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (1, 8, 'Chất lượng ổn, đúng như mô tả.', 4, '2025-12-03 08:04:36.922927');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (9, 8, 'Sản phẩm tuyệt vời, rất đáng mua.', 3, '2025-12-23 03:48:59.680942');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (7, 8, 'Giao hàng nhanh, đóng gói cẩn thận.', 5, '2025-11-28 20:21:26.959879');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (4, 9, 'Hài lòng với dịch vụ và sản phẩm.', 3, '2025-12-11 10:35:03.252229');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (3, 9, 'Chất lượng ổn, đúng như mô tả.', 3, '2025-12-22 20:32:58.388423');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (7, 9, 'Sản phẩm tuyệt vời, rất đáng mua.', 3, '2025-11-30 21:16:45.501226');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (6, 9, 'Sản phẩm tuyệt vời, rất đáng mua.', 4, '2025-12-06 15:55:07.446316');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (6, 10, 'Sản phẩm tuyệt vời, rất đáng mua.', 5, '2025-12-23 02:41:21.454335');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (8, 10, 'Chất lượng ổn, đúng như mô tả.', 4, '2025-11-29 04:10:39.257935');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (7, 10, 'Hài lòng với dịch vụ và sản phẩm.', 4, '2025-11-30 09:05:19.597304');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (2, 11, 'Hài lòng với dịch vụ và sản phẩm.', 3, '2025-12-19 18:56:53.004578');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (9, 11, 'Hài lòng với dịch vụ và sản phẩm.', 3, '2025-11-27 03:13:19.455936');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (1, 11, 'Giao hàng nhanh, đóng gói cẩn thận.', 4, '2025-12-14 00:43:27.012032');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (4, 11, 'Dùng rất thích, sẽ ủng hộ shop tiếp.', 3, '2025-12-19 20:41:34.019248');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (4, 12, 'Sản phẩm tuyệt vời, rất đáng mua.', 4, '2025-12-21 00:05:00.933464');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (9, 12, 'Chất lượng ổn, đúng như mô tả.', 4, '2025-12-15 19:52:30.956623');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (2, 12, 'Sản phẩm tuyệt vời, rất đáng mua.', 4, '2025-12-20 22:23:48.324723');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (3, 13, 'Sản phẩm tuyệt vời, rất đáng mua.', 4, '2025-12-02 21:49:31.878636');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (2, 13, 'Hài lòng với dịch vụ và sản phẩm.', 5, '2025-12-24 00:53:25.863059');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (7, 13, 'Giao hàng nhanh, đóng gói cẩn thận.', 4, '2025-12-20 09:52:15.033611');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (4, 13, 'Hài lòng với dịch vụ và sản phẩm.', 3, '2025-12-12 05:51:32.04171');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (6, 14, 'Chất lượng ổn, đúng như mô tả.', 4, '2025-12-14 10:03:41.64306');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (1, 14, 'Chất lượng ổn, đúng như mô tả.', 5, '2025-12-22 01:20:08.505903');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (3, 14, 'Sản phẩm tuyệt vời, rất đáng mua.', 3, '2025-11-28 09:30:09.535028');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (2, 14, 'Sản phẩm tuyệt vời, rất đáng mua.', 5, '2025-11-30 11:52:00.523484');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (7, 15, 'Dùng rất thích, sẽ ủng hộ shop tiếp.', 3, '2025-12-09 19:08:33.27388');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (9, 15, 'Sản phẩm tuyệt vời, rất đáng mua.', 3, '2025-12-15 11:09:00.711092');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (3, 15, 'Giao hàng nhanh, đóng gói cẩn thận.', 4, '2025-12-15 12:03:11.384524');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (1, 16, 'Chất lượng ổn, đúng như mô tả.', 3, '2025-12-04 16:42:15.648764');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (7, 16, 'Hài lòng với dịch vụ và sản phẩm.', 3, '2025-12-02 14:31:44.445199');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (4, 16, 'Hài lòng với dịch vụ và sản phẩm.', 4, '2025-12-20 14:24:33.323321');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (9, 16, 'Chất lượng ổn, đúng như mô tả.', 5, '2025-12-08 19:34:38.118879');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (7, 17, 'Hài lòng với dịch vụ và sản phẩm.', 3, '2025-12-18 22:13:09.875355');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (4, 17, 'Sản phẩm tuyệt vời, rất đáng mua.', 3, '2025-12-22 14:50:52.615522');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (1, 17, 'Chất lượng ổn, đúng như mô tả.', 4, '2025-12-10 01:53:52.792505');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (6, 17, 'Dùng rất thích, sẽ ủng hộ shop tiếp.', 4, '2025-12-10 07:42:03.617398');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (4, 18, 'Chất lượng ổn, đúng như mô tả.', 5, '2025-11-30 14:30:41.737877');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (8, 18, 'Hài lòng với dịch vụ và sản phẩm.', 3, '2025-12-01 16:02:12.38855');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (9, 18, 'Chất lượng ổn, đúng như mô tả.', 3, '2025-12-09 05:44:34.103586');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (1, 18, 'Sản phẩm tuyệt vời, rất đáng mua.', 4, '2025-12-25 02:25:58.399312');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (9, 20, 'Hài lòng với dịch vụ và sản phẩm.', 5, '2025-12-06 13:10:16.559798');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (6, 20, 'Sản phẩm tuyệt vời, rất đáng mua.', 3, '2025-11-29 20:27:38.066118');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (3, 20, 'Dùng rất thích, sẽ ủng hộ shop tiếp.', 4, '2025-11-30 21:03:08.098678');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (2, 20, 'Dùng rất thích, sẽ ủng hộ shop tiếp.', 4, '2025-12-17 07:34:44.141184');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (3, 21, 'Hài lòng với dịch vụ và sản phẩm.', 5, '2025-12-13 11:14:30.046952');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (2, 21, 'Dùng rất thích, sẽ ủng hộ shop tiếp.', 5, '2025-12-03 21:58:30.752405');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (8, 21, 'Hài lòng với dịch vụ và sản phẩm.', 4, '2025-12-06 12:08:53.289307');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (6, 21, 'Giao hàng nhanh, đóng gói cẩn thận.', 4, '2025-12-20 09:58:25.359704');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (9, 21, 'Chất lượng ổn, đúng như mô tả.', 5, '2025-12-05 20:56:22.015033');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (4, 22, 'Giao hàng nhanh, đóng gói cẩn thận.', 3, '2025-11-27 04:22:07.39943');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (9, 22, 'Chất lượng ổn, đúng như mô tả.', 5, '2025-12-22 03:20:24.440517');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (8, 22, 'Giao hàng nhanh, đóng gói cẩn thận.', 5, '2025-11-27 03:04:49.253398');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (6, 23, 'Chất lượng ổn, đúng như mô tả.', 5, '2025-12-22 11:38:06.820694');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (9, 23, 'Giao hàng nhanh, đóng gói cẩn thận.', 5, '2025-12-24 10:26:44.60293');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (3, 23, 'Giao hàng nhanh, đóng gói cẩn thận.', 4, '2025-12-22 19:09:36.779424');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (8, 23, 'Hài lòng với dịch vụ và sản phẩm.', 3, '2025-12-12 12:33:58.530422');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (66, 1, 'Sản phẩm này rất tuyệt vời okokokokoko!', 5, '2026-01-15 17:00:00');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (1, 7, 'cũng cũng okela', 5, '2026-03-12 21:36:36.755');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (72, 22, 'nước dùng ngon nhưng hơi mặn', 4, '2026-03-12 21:54:53.568');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (72, 11, 'ngọt, mát', 4, '2026-03-12 21:57:27.348');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (72, 18, 'ngon lanh luôn', 5, '2026-03-12 21:57:27.686');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (1, 15, 'mát, giá hợp lý', 5, '2026-03-23 10:05:26.283');
INSERT INTO public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) VALUES (1, 29, 'Ngon, thơm', 4, '2026-04-11 07:34:53.501');


--
-- Data for Name: dondatban; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: khuyenmai; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.khuyenmai (id_khuyenmai, masanpham, makhuyenmai, giatri, ngaybatdau, ngayketthuc, trangthai) VALUES (1, 1, 101, 5000, '2025-01-01', '2025-12-31', 'Đang áp dụng');
INSERT INTO public.khuyenmai (id_khuyenmai, masanpham, makhuyenmai, giatri, ngaybatdau, ngayketthuc, trangthai) VALUES (2, 3, 102, 8000, '2025-01-01', '2025-06-30', 'Đang áp dụng');


--
-- Data for Name: listimage; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (121, NULL, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570387/duc-toan-restaurant/c3xdzvd7naip9ky8aobf.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (157, 24, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570395/duc-toan-restaurant/so3vixxiiqoaxnvbtnfr.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (159, 24, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570400/duc-toan-restaurant/agdrydlcwthsyje3pv87.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (161, 4, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570405/duc-toan-restaurant/ylfe2umi3ljnadaul1cn.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (163, 4, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570420/duc-toan-restaurant/gmeu7ka5pnie40o6f7mp.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (190, 29, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570430/duc-toan-restaurant/pippesuqlakvc81fglmm.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (193, 29, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570442/duc-toan-restaurant/vcovtzz83ikaxmgmge5g.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (216, 3, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570453/duc-toan-restaurant/qddtujobcba6nqu64rmv.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (2, 1, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570090/duc-toan-restaurant/t9qgqnwgcfmqj7k38gbo.png');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (1, 1, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570094/duc-toan-restaurant/p9yp1az7xpr0vt9dalxo.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (16, 1, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570097/duc-toan-restaurant/jwbrdlgekdkh9fqawbkv.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (21, 1, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570099/duc-toan-restaurant/jzablqblvjxidfjgcsib.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (22, 1, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570101/duc-toan-restaurant/yk3riqezq3vlblxdot8f.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (43, 7, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570114/duc-toan-restaurant/hyrzt9abtbm6yhsx7pig.png');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (59, 11, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570123/duc-toan-restaurant/a3tm2ndygvzv7elstzo0.png');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (99, 20, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570126/duc-toan-restaurant/vvwvbjpqi8vbgdgap6pk.png');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (107, 22, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570130/duc-toan-restaurant/wlilvvtgdtthrozw5jlq.png');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (5, 7, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570132/duc-toan-restaurant/c5nsk8ifcj4hwuxhif25.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (6, 7, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570136/duc-toan-restaurant/ogqgwnxtmoeqizrw9j81.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (42, 7, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570140/duc-toan-restaurant/q08xnp7yna3jxlyzeqz6.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (44, 8, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570145/duc-toan-restaurant/u3vlse2rx63lbfrqtmlw.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (47, 8, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570151/duc-toan-restaurant/wtuevem1ckni1zwfxg8t.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (57, 11, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570162/duc-toan-restaurant/milrv3sfngbiiwaoari9.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (8, 9, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570166/duc-toan-restaurant/jdcl5phebrjmxgasp4oi.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (50, 9, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570176/duc-toan-restaurant/m7dkncaxhhbnbedhwhz6.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (52, 10, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570185/duc-toan-restaurant/mnk8uggurodcamsq6ufj.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (54, 10, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570189/duc-toan-restaurant/ngh21azcrssdquyxzwf7.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (60, 12, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570200/duc-toan-restaurant/kke3rkvlrw1zvkfmii5f.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (63, 12, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570210/duc-toan-restaurant/tsspzzhrrbzkevq7p3ch.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (64, 13, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570214/duc-toan-restaurant/rk5bpjntirccnshrkewm.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (67, 13, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570231/duc-toan-restaurant/k97crdteabnohsheylzt.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (69, 14, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570240/duc-toan-restaurant/mcrdvpxhxer185rg8ngp.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (71, 14, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570245/duc-toan-restaurant/vtiirvldldgbzgbcbjaq.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (73, 15, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570252/duc-toan-restaurant/h5sn1oqvvgse2ahgtilc.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (75, 15, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570258/duc-toan-restaurant/jglngecquhb4vxluhocw.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (77, 16, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570265/duc-toan-restaurant/io406txgnb9k5vvdblfb.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (80, 17, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570275/duc-toan-restaurant/mcvoqb4musekirxubsaz.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (83, 17, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570284/duc-toan-restaurant/zcsned1oyblilcjkpi7p.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (86, 18, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570290/duc-toan-restaurant/q471h02bznjufovbry2l.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (89, 18, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570298/duc-toan-restaurant/q8d399k84pdxz8mw6y1z.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (97, 20, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570303/duc-toan-restaurant/nd2syjussmleqa9umwwl.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (101, 21, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570313/duc-toan-restaurant/rlqtpilhdmuvu207mq34.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (104, 21, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570318/duc-toan-restaurant/hjbhzlpzrihsemwwdc6t.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (108, 22, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570327/duc-toan-restaurant/pz4uaf0oozl7jdbcro33.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (166, 25, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570337/duc-toan-restaurant/xcqp6kcvmemzxdjmlxkm.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (114, 23, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570343/duc-toan-restaurant/tigqzno9fz1vfjuurjb1.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (112, 23, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570353/duc-toan-restaurant/bpnhwuea15tatpl08qi3.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (169, 25, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570360/duc-toan-restaurant/ilx7w8ldii0xlfiol5nl.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (115, NULL, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570366/duc-toan-restaurant/b1e2rq8ikxx8rbgpg5u0.png');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (118, NULL, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570377/duc-toan-restaurant/wxc3int8zohjan6rjsci.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (41, 7, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570138/duc-toan-restaurant/mpgvlxd5uygkwhzmkf8r.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (7, 8, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570142/duc-toan-restaurant/rfxomduwguvapyev4mbv.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (45, 8, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570148/duc-toan-restaurant/xiezyxazdoolnjb2btrw.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (46, 8, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570149/duc-toan-restaurant/ysu4irzttdeibpcyist2.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (10, 11, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570154/duc-toan-restaurant/t5zmixtdxasqwct4nhva.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (56, 11, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570159/duc-toan-restaurant/yvc09ilylscrb1ryb6ay.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (58, 11, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570164/duc-toan-restaurant/kf5qegi8qln47c2snyqx.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (48, 9, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570168/duc-toan-restaurant/pr53yz3pzzbngwqggm7o.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (49, 9, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570174/duc-toan-restaurant/goyriyppddqpd12ju5wr.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (51, 9, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570179/duc-toan-restaurant/jnlbosx42x2r4yrsbdjk.png');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (9, 10, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570182/duc-toan-restaurant/xdgdtxbjl8jsrfsmsv0q.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (53, 10, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570187/duc-toan-restaurant/bpdp533qv4hid9txodkj.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (55, 10, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570193/duc-toan-restaurant/gp2on5d9o1ight1ecjw2.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (11, 12, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570197/duc-toan-restaurant/dkearjghhk4ttmnp1kik.png');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (61, 12, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570202/duc-toan-restaurant/uiu2aarlr6kxrsdphrid.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (62, 12, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570205/duc-toan-restaurant/vaap3sscnovz3flmboi0.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (12, 13, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570212/duc-toan-restaurant/nesejfkl7gfpgm5a3hf3.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (65, 13, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570224/duc-toan-restaurant/b57zvw0fitiha95olsnm.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (66, 13, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570227/duc-toan-restaurant/hh5mfghhcxlq3p36vng7.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (13, 14, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570235/duc-toan-restaurant/aej14hgftnc6wuon9wku.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (68, 14, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570238/duc-toan-restaurant/gdtshnrzyueumakssffk.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (70, 14, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570243/duc-toan-restaurant/xdcihhagzyhrdzxjczht.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (14, 15, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570248/duc-toan-restaurant/d0qxslo7smeg23zf3juc.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (72, 15, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570250/duc-toan-restaurant/tbrzpmxcroa0gsgueeoa.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (74, 15, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570255/duc-toan-restaurant/nhi6oedbc0aptx0ehwzp.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (15, 16, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570261/duc-toan-restaurant/ngf0ldnnj1ghgzzdx8ke.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (76, 16, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570263/duc-toan-restaurant/grnccr9yx2melrtvlggt.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (78, 16, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570268/duc-toan-restaurant/nlzr9vqdz0gkamcb3qi2.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (79, 16, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570272/duc-toan-restaurant/zijvobt4o9wgbrljoc3a.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (81, 17, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570277/duc-toan-restaurant/dzrllovevxv7n0az1vmb.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (82, 17, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570280/duc-toan-restaurant/jxnqyqnr9ohw8bsyk5rt.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (84, 17, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570285/duc-toan-restaurant/rgup1hzxtgd69a71q2dp.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (85, 18, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570287/duc-toan-restaurant/pzzlqeiqgiuryeqbljf4.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (87, 18, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570291/duc-toan-restaurant/k0alssntr2ezo581rrnq.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (88, 18, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570294/duc-toan-restaurant/f1ai6rdesrtaerrycuqj.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (95, 20, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570300/duc-toan-restaurant/upxjsnf04xotmwd36cng.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (96, 20, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570301/duc-toan-restaurant/pqbudtdmugfksvyhxtiv.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (98, 20, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570307/duc-toan-restaurant/ocdfrsgtvjhwsnkjzauz.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (100, 21, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570311/duc-toan-restaurant/si8gugef0ke1q0h6m6pf.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (102, 21, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570314/duc-toan-restaurant/lgqrsvugtzxjf4eessh6.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (103, 21, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570316/duc-toan-restaurant/wzfbyl2kpau3tljlycbd.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (105, 22, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570322/duc-toan-restaurant/pf7ugmctdfkwpdz6ohwb.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (106, 22, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570325/duc-toan-restaurant/ken6tqeazhgcryonrthb.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (109, 22, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570329/duc-toan-restaurant/h67ybylylkylstdoshhg.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (110, 23, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570332/duc-toan-restaurant/vao8lviapijj90xtnbgo.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (113, 23, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570340/duc-toan-restaurant/eyqk1cslvtoytyhg15cc.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (111, 23, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570347/duc-toan-restaurant/x4msboudsbnj9d13egyl.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (167, 25, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570351/duc-toan-restaurant/pb98dyjysabznqcxiioc.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (168, 25, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570356/duc-toan-restaurant/lbuidniu1s4cpuv8skja.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (170, 25, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570363/duc-toan-restaurant/btqmdizdnzu3uodwjfqn.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (116, NULL, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570371/duc-toan-restaurant/hd4wq4niboqpuhbicbmn.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (117, NULL, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570375/duc-toan-restaurant/slfyhwtsby2ydzwbvr8p.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (119, NULL, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570380/duc-toan-restaurant/jd1d1poqahl7dodhnzqc.png');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (120, NULL, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570383/duc-toan-restaurant/rqngzbrqrqa6wptdaob1.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (122, NULL, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570389/duc-toan-restaurant/moxm8mioqtd2js0mrwut.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (156, 24, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570392/duc-toan-restaurant/r3bbx9obzkbcdldk5jad.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (158, 24, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570398/duc-toan-restaurant/hft1nopfug3tf8097a5t.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (160, 24, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570402/duc-toan-restaurant/ibjusqnrsan9cefc3qia.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (162, 4, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570416/duc-toan-restaurant/vn8f2jpbbm0v7yzj4c1j.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (164, 4, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570425/duc-toan-restaurant/ambkw8pfliwpkpvyv66h.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (165, 4, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570427/duc-toan-restaurant/hcbnzhgwpvdetzczypod.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (191, 29, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570434/duc-toan-restaurant/qwb2inow4hle44pxnmrf.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (192, 29, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570439/duc-toan-restaurant/wa2fjzgxnani1nds0lcw.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (214, 3, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570444/duc-toan-restaurant/fuukoikrwamwoeju2qvu.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (215, 3, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570447/duc-toan-restaurant/th25igcv8le8fknkvgaw.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (217, 3, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570457/duc-toan-restaurant/mrh3nvvfvdz4gmcgyide.jpg');
INSERT INTO public.listimage (id_anh, masanpham, url_anh) VALUES (218, 3, 'https://res.cloudinary.com/dxyc5yhcl/image/upload/v1777570460/duc-toan-restaurant/syd4bxd31oektpaa0rb8.jpg');


--
-- Data for Name: thongtin_nganhang; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.thongtin_nganhang (id, bank_id, account_no, template, account_name, content, id_restaurant) VALUES (1, '970415', '6868686868', 'compact', 'DUCTOAN RESTAURANT', 'Thanh toan', 1);
INSERT INTO public.thongtin_nganhang (id, bank_id, account_no, template, account_name, content, id_restaurant) VALUES (2, '970436', '6868686868', 'compact', 'DUCTOAN RESTAURANT', 'Thanh toan', 1);
INSERT INTO public.thongtin_nganhang (id, bank_id, account_no, template, account_name, content, id_restaurant) VALUES (3, '970418', '6868686868', 'compact', 'DUCTOAN RESTAURANT', 'Thanh toan', 1);
INSERT INTO public.thongtin_nganhang (id, bank_id, account_no, template, account_name, content, id_restaurant) VALUES (4, '970405', '6868686868', 'compact', 'DUCTOAN RESTAURANT', 'Thanh toan', 1);
INSERT INTO public.thongtin_nganhang (id, bank_id, account_no, template, account_name, content, id_restaurant) VALUES (5, '970448', '6868686868', 'compact', 'DUCTOAN RESTAURANT', 'Thanh toan', 1);
INSERT INTO public.thongtin_nganhang (id, bank_id, account_no, template, account_name, content, id_restaurant) VALUES (6, '970422', '6868686868', 'compact', 'DUCTOAN RESTAURANT', 'Thanh toan', 1);
INSERT INTO public.thongtin_nganhang (id, bank_id, account_no, template, account_name, content, id_restaurant) VALUES (7, '970407', '6868686868', 'compact', 'DUCTOAN RESTAURANT', 'Thanh toan', 1);
INSERT INTO public.thongtin_nganhang (id, bank_id, account_no, template, account_name, content, id_restaurant) VALUES (8, '970416', '6868686868', 'compact', 'DUCTOAN RESTAURANT', 'Thanh toan', 1);
INSERT INTO public.thongtin_nganhang (id, bank_id, account_no, template, account_name, content, id_restaurant) VALUES (9, '970432', '6868686868', 'compact', 'DUCTOAN RESTAURANT', 'Thanh toan', 1);
INSERT INTO public.thongtin_nganhang (id, bank_id, account_no, template, account_name, content, id_restaurant) VALUES (10, '970423', '6868686868', 'compact', 'DUCTOAN RESTAURANT', 'Thanh toan', 1);
INSERT INTO public.thongtin_nganhang (id, bank_id, account_no, template, account_name, content, id_restaurant) VALUES (11, '970403', '6868686868', 'compact', 'DUCTOAN RESTAURANT', 'Thanh toan', 1);
INSERT INTO public.thongtin_nganhang (id, bank_id, account_no, template, account_name, content, id_restaurant) VALUES (12, '970437', '6868686868', 'compact', 'DUCTOAN RESTAURANT', 'Thanh toan', 1);
INSERT INTO public.thongtin_nganhang (id, bank_id, account_no, template, account_name, content, id_restaurant) VALUES (13, '970454', '6868686868', 'compact', 'DUCTOAN RESTAURANT', 'Thanh toan', 1);
INSERT INTO public.thongtin_nganhang (id, bank_id, account_no, template, account_name, content, id_restaurant) VALUES (14, '970429', '6868686868', 'compact', 'DUCTOAN RESTAURANT', 'Thanh toan', 1);
INSERT INTO public.thongtin_nganhang (id, bank_id, account_no, template, account_name, content, id_restaurant) VALUES (15, '970441', '6868686868', 'compact', 'DUCTOAN RESTAURANT', 'Thanh toan', 1);
INSERT INTO public.thongtin_nganhang (id, bank_id, account_no, template, account_name, content, id_restaurant) VALUES (16, '970443', '6868686868', 'compact', 'DUCTOAN RESTAURANT', 'Thanh toan', 1);
INSERT INTO public.thongtin_nganhang (id, bank_id, account_no, template, account_name, content, id_restaurant) VALUES (17, '970431', '6868686868', 'compact', 'DUCTOAN RESTAURANT', 'Thanh toan', 1);
INSERT INTO public.thongtin_nganhang (id, bank_id, account_no, template, account_name, content, id_restaurant) VALUES (18, '970426', '6868686868', 'compact', 'DUCTOAN RESTAURANT', 'Thanh toan', 1);
INSERT INTO public.thongtin_nganhang (id, bank_id, account_no, template, account_name, content, id_restaurant) VALUES (19, '546034', '6868686868', 'compact', 'DUCTOAN RESTAURANT', 'Thanh toan', 1);
INSERT INTO public.thongtin_nganhang (id, bank_id, account_no, template, account_name, content, id_restaurant) VALUES (20, '546035', '6868686868', 'compact', 'DUCTOAN RESTAURANT', 'Thanh toan', 1);
INSERT INTO public.thongtin_nganhang (id, bank_id, account_no, template, account_name, content, id_restaurant) VALUES (21, '971005', '6868686868', 'compact', 'DUCTOAN RESTAURANT', 'Thanh toan', 1);
INSERT INTO public.thongtin_nganhang (id, bank_id, account_no, template, account_name, content, id_restaurant) VALUES (22, '963388', '6868686868', 'compact', 'DUCTOAN RESTAURANT', 'Thanh toan', 1);
INSERT INTO public.thongtin_nganhang (id, bank_id, account_no, template, account_name, content, id_restaurant) VALUES (23, '971011', '6868686868', 'compact', 'DUCTOAN RESTAURANT', 'Thanh toan', 1);
INSERT INTO public.thongtin_nganhang (id, bank_id, account_no, template, account_name, content, id_restaurant) VALUES (24, '970400', '6868686868', 'compact', 'DUCTOAN RESTAURANT', 'Thanh toan', 1);
INSERT INTO public.thongtin_nganhang (id, bank_id, account_no, template, account_name, content, id_restaurant) VALUES (25, '970409', '6868686868', 'compact', 'DUCTOAN RESTAURANT', 'Thanh toan', 1);
INSERT INTO public.thongtin_nganhang (id, bank_id, account_no, template, account_name, content, id_restaurant) VALUES (26, '971025', '6868686868', 'compact', 'DUCTOAN RESTAURANT', 'Thanh toan', 1);
INSERT INTO public.thongtin_nganhang (id, bank_id, account_no, template, account_name, content, id_restaurant) VALUES (27, '971133', '6868686868', 'compact', 'DUCTOAN RESTAURANT', 'Thanh toan', 1);
INSERT INTO public.thongtin_nganhang (id, bank_id, account_no, template, account_name, content, id_restaurant) VALUES (28, '970412', '6868686868', 'compact', 'DUCTOAN RESTAURANT', 'Thanh toan', 1);
INSERT INTO public.thongtin_nganhang (id, bank_id, account_no, template, account_name, content, id_restaurant) VALUES (29, '970414', '6868686868', 'compact', 'DUCTOAN RESTAURANT', 'Thanh toan', 1);
INSERT INTO public.thongtin_nganhang (id, bank_id, account_no, template, account_name, content, id_restaurant) VALUES (30, '970419', '6868686868', 'compact', 'DUCTOAN RESTAURANT', 'Thanh toan', 1);
INSERT INTO public.thongtin_nganhang (id, bank_id, account_no, template, account_name, content, id_restaurant) VALUES (31, '970424', '6868686868', 'compact', 'DUCTOAN RESTAURANT', 'Thanh toan', 1);
INSERT INTO public.thongtin_nganhang (id, bank_id, account_no, template, account_name, content, id_restaurant) VALUES (32, '970425', '6868686868', 'compact', 'DUCTOAN RESTAURANT', 'Thanh toan', 1);
INSERT INTO public.thongtin_nganhang (id, bank_id, account_no, template, account_name, content, id_restaurant) VALUES (33, '970427', '6868686868', 'compact', 'DUCTOAN RESTAURANT', 'Thanh toan', 1);
INSERT INTO public.thongtin_nganhang (id, bank_id, account_no, template, account_name, content, id_restaurant) VALUES (34, '970428', '6868686868', 'compact', 'DUCTOAN RESTAURANT', 'Thanh toan', 1);
INSERT INTO public.thongtin_nganhang (id, bank_id, account_no, template, account_name, content, id_restaurant) VALUES (35, '970430', '6868686868', 'compact', 'DUCTOAN RESTAURANT', 'Thanh toan', 1);
INSERT INTO public.thongtin_nganhang (id, bank_id, account_no, template, account_name, content, id_restaurant) VALUES (36, '970433', '6868686868', 'compact', 'DUCTOAN RESTAURANT', 'Thanh toan', 1);


--
-- Data for Name: yeuthich; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.yeuthich (mataikhoan, masanpham, ngaythem) VALUES (1, 1, '2025-12-16 12:52:21.220371');
INSERT INTO public.yeuthich (mataikhoan, masanpham, ngaythem) VALUES (1, 3, '2025-12-16 12:52:21.220371');
INSERT INTO public.yeuthich (mataikhoan, masanpham, ngaythem) VALUES (2, 4, '2025-12-16 12:52:21.220371');


--
-- Name: ban_maban_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.ban_maban_seq', 4, true);


--
-- Name: danhmuc_madanhmuc_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.danhmuc_madanhmuc_seq', 2, true);


--
-- Name: dondatban_madondatban_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.dondatban_madondatban_seq', 1, false);


--
-- Name: giamgia_id_giamgia_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.giamgia_id_giamgia_seq', 5, true);


--
-- Name: khachhang_mataikhoan_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.khachhang_mataikhoan_seq', 75, true);


--
-- Name: khuyenmai_id_khuyenmai_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.khuyenmai_id_khuyenmai_seq', 2, true);


--
-- Name: listimage_id_anh_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.listimage_id_anh_seq', 218, true);


--
-- Name: nguyenlieu_manguyenlieu_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.nguyenlieu_manguyenlieu_seq', 66, true);


--
-- Name: nhanvien_manhanvien_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.nhanvien_manhanvien_seq', 4, true);


--
-- Name: phieunhapkho_maphieunhap_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.phieunhapkho_maphieunhap_seq', 8, true);


--
-- Name: phieunhapkho_mapieunhap_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.phieunhapkho_mapieunhap_seq', 8, true);


--
-- Name: restaurant_id_restaurant_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.restaurant_id_restaurant_seq', 2, true);


--
-- Name: sanpham_masanpham_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sanpham_masanpham_seq', 29, true);


--
-- Name: thanhtoan_id_thanhtoan_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.thanhtoan_id_thanhtoan_seq', 3, true);


--
-- Name: thongtin_nganhang_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.thongtin_nganhang_id_seq', 36, true);


--
-- Name: vaitro_mavaitro_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.vaitro_mavaitro_seq', 3, true);


--
-- Name: yeucaudon_madonhang_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.yeucaudon_madonhang_seq', 3, true);


--
-- PostgreSQL database dump complete
--

\unrestrict tURdd92N3NmLHjiTrh9tTZscrdpgZ5iIfmsDFqXCnrcq5T58XcOUe4rm1zDZnjc

