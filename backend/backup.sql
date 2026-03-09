--
-- PostgreSQL database dump
--

\restrict gogUtybHmlVmCOm50jfNlKzQZ5qd2lt2BPh711bupsGXs5Tkw6r1lc7bc9Ff10q

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ban; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ban (
    maban integer NOT NULL,
    id_restaurant integer NOT NULL,
    tenban character varying(50),
    succhua integer,
    trangthai boolean DEFAULT false
);


ALTER TABLE public.ban OWNER TO postgres;

--
-- Name: ban_maban_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ban_maban_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ban_maban_seq OWNER TO postgres;

--
-- Name: ban_maban_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ban_maban_seq OWNED BY public.ban.maban;


--
-- Name: chitietphieunhap; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chitietphieunhap (
    maphieunhap integer NOT NULL,
    manguyenlieu integer NOT NULL,
    soluongnhap numeric(19,4),
    gianhap numeric(19,4),
    ngayhethan date
);


ALTER TABLE public.chitietphieunhap OWNER TO postgres;

--
-- Name: chitietyeucau; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chitietyeucau (
    madonhang integer NOT NULL,
    id_restaurant integer NOT NULL,
    masanpham integer NOT NULL,
    soluong integer DEFAULT 1,
    trangthai character varying(255),
    gia double precision,
    update_trang_thai_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.chitietyeucau OWNER TO postgres;

--
-- Name: congthuc; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.congthuc (
    masanpham integer NOT NULL,
    manguyenlieu integer NOT NULL,
    slnguyenlieu numeric(38,2)
);


ALTER TABLE public.congthuc OWNER TO postgres;

--
-- Name: danhgia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.danhgia (
    mataikhoan integer NOT NULL,
    masanpham integer NOT NULL,
    noidung text,
    sosao integer,
    ngaydanhgia timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT danhgia_sosao_check CHECK (((sosao >= 1) AND (sosao <= 5)))
);


ALTER TABLE public.danhgia OWNER TO postgres;

--
-- Name: danhmuc; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.danhmuc (
    madanhmuc integer NOT NULL,
    tendanhmuc character varying(100),
    anh character varying(200),
    trangthai character varying(20)
);


ALTER TABLE public.danhmuc OWNER TO postgres;

--
-- Name: danhmuc_madanhmuc_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.danhmuc_madanhmuc_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.danhmuc_madanhmuc_seq OWNER TO postgres;

--
-- Name: danhmuc_madanhmuc_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.danhmuc_madanhmuc_seq OWNED BY public.danhmuc.madanhmuc;


--
-- Name: giamgia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.giamgia (
    id_giamgia integer NOT NULL,
    code character varying(20),
    giatri double precision,
    mota text
);


ALTER TABLE public.giamgia OWNER TO postgres;

--
-- Name: giamgia_id_giamgia_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.giamgia_id_giamgia_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.giamgia_id_giamgia_seq OWNER TO postgres;

--
-- Name: giamgia_id_giamgia_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.giamgia_id_giamgia_seq OWNED BY public.giamgia.id_giamgia;


--
-- Name: khachhang; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.khachhang (
    mataikhoan integer NOT NULL,
    matkhau character varying(255),
    email character varying(255),
    sdt character varying(255),
    hoten character varying(255),
    avatar character varying(255),
    diachi character varying(255),
    number_log integer DEFAULT 0,
    first_log timestamp without time zone,
    diemtichluy integer,
    id_restaurant integer,
    trangthai boolean,
    firebase_uid character varying(128)
);


ALTER TABLE public.khachhang OWNER TO postgres;

--
-- Name: TABLE khachhang; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.khachhang IS 'Bảng quản lý thông tin khách hàng';


--
-- Name: khachhang_mataikhoan_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.khachhang_mataikhoan_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.khachhang_mataikhoan_seq OWNER TO postgres;

--
-- Name: khachhang_mataikhoan_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.khachhang_mataikhoan_seq OWNED BY public.khachhang.mataikhoan;


--
-- Name: khuyenmai; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.khuyenmai (
    id_khuyenmai integer NOT NULL,
    masanpham integer,
    makhuyenmai integer,
    giatri double precision,
    ngaybatdau date,
    ngayketthuc date,
    trangthai character varying(50)
);


ALTER TABLE public.khuyenmai OWNER TO postgres;

--
-- Name: khuyenmai_id_khuyenmai_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.khuyenmai_id_khuyenmai_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.khuyenmai_id_khuyenmai_seq OWNER TO postgres;

--
-- Name: khuyenmai_id_khuyenmai_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.khuyenmai_id_khuyenmai_seq OWNED BY public.khuyenmai.id_khuyenmai;


--
-- Name: listimage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.listimage (
    id_anh integer NOT NULL,
    masanpham integer,
    url_anh character varying(200)
);


ALTER TABLE public.listimage OWNER TO postgres;

--
-- Name: listimage_id_anh_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.listimage_id_anh_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.listimage_id_anh_seq OWNER TO postgres;

--
-- Name: listimage_id_anh_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.listimage_id_anh_seq OWNED BY public.listimage.id_anh;


--
-- Name: nguyenlieu; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.nguyenlieu (
    manguyenlieu integer NOT NULL,
    id_restaurant integer,
    tennguyenlieu character varying(50),
    donvitinh character varying(50),
    mota text,
    xuatxu character varying(50),
    trangthai character varying(50),
    soluong numeric(19,4) DEFAULT 0,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.nguyenlieu OWNER TO postgres;

--
-- Name: TABLE nguyenlieu; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.nguyenlieu IS 'Bảng quản lý nguyên liệu';


--
-- Name: nguyenlieu_manguyenlieu_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.nguyenlieu_manguyenlieu_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.nguyenlieu_manguyenlieu_seq OWNER TO postgres;

--
-- Name: nguyenlieu_manguyenlieu_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.nguyenlieu_manguyenlieu_seq OWNED BY public.nguyenlieu.manguyenlieu;


--
-- Name: nhanvien; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.nhanvien (
    manhanvien integer NOT NULL,
    id_restaurant integer NOT NULL,
    mavaitro integer,
    tennhanvien character varying(50),
    email character varying(50),
    password character varying(255),
    mota text,
    number_log integer DEFAULT 0,
    first_log date,
    trangthai boolean DEFAULT true
);


ALTER TABLE public.nhanvien OWNER TO postgres;

--
-- Name: TABLE nhanvien; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.nhanvien IS 'Bảng quản lý nhân viên';


--
-- Name: nhanvien_manhanvien_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.nhanvien_manhanvien_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.nhanvien_manhanvien_seq OWNER TO postgres;

--
-- Name: nhanvien_manhanvien_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.nhanvien_manhanvien_seq OWNED BY public.nhanvien.manhanvien;


--
-- Name: phieunhapkho; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.phieunhapkho (
    maphieunhap integer NOT NULL,
    id_restaurant integer,
    nhacungcap character varying(100),
    manhanvien integer,
    ngaynhap timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    tongtien numeric(19,4),
    ghichu text,
    mapieunhap integer NOT NULL
);


ALTER TABLE public.phieunhapkho OWNER TO postgres;

--
-- Name: phieunhapkho_maphieunhap_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.phieunhapkho_maphieunhap_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.phieunhapkho_maphieunhap_seq OWNER TO postgres;

--
-- Name: phieunhapkho_maphieunhap_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.phieunhapkho_maphieunhap_seq OWNED BY public.phieunhapkho.maphieunhap;


--
-- Name: phieunhapkho_mapieunhap_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.phieunhapkho ALTER COLUMN mapieunhap ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.phieunhapkho_mapieunhap_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: restaurant; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.restaurant (
    id_restaurant integer NOT NULL,
    ten character varying(100),
    sdt character varying(10),
    diachi character varying(200),
    mota text,
    status character varying(50),
    parent_id integer,
    bank_id character varying(20),
    account_no character varying(50),
    template character varying(20),
    account_name character varying(100),
    content character varying(255),
    img character varying(255)
);


ALTER TABLE public.restaurant OWNER TO postgres;

--
-- Name: TABLE restaurant; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.restaurant IS 'Bảng quản lý nhà hàng';


--
-- Name: restaurant_id_restaurant_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.restaurant_id_restaurant_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.restaurant_id_restaurant_seq OWNER TO postgres;

--
-- Name: restaurant_id_restaurant_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.restaurant_id_restaurant_seq OWNED BY public.restaurant.id_restaurant;


--
-- Name: sanpham; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sanpham (
    masanpham integer NOT NULL,
    madanhmuc integer,
    tensanpham character varying(100),
    mota text,
    gia double precision
);


ALTER TABLE public.sanpham OWNER TO postgres;

--
-- Name: TABLE sanpham; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.sanpham IS 'Bảng quản lý sản phẩm/món ăn';


--
-- Name: sanpham_masanpham_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sanpham_masanpham_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sanpham_masanpham_seq OWNER TO postgres;

--
-- Name: sanpham_masanpham_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sanpham_masanpham_seq OWNED BY public.sanpham.masanpham;


--
-- Name: thanhtoan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.thanhtoan (
    id_thanhtoan integer NOT NULL,
    kieuthanhtoan character varying(50)
);


ALTER TABLE public.thanhtoan OWNER TO postgres;

--
-- Name: thanhtoan_id_thanhtoan_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.thanhtoan_id_thanhtoan_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.thanhtoan_id_thanhtoan_seq OWNER TO postgres;

--
-- Name: thanhtoan_id_thanhtoan_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.thanhtoan_id_thanhtoan_seq OWNED BY public.thanhtoan.id_thanhtoan;


--
-- Name: thongtin_nganhang; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.thongtin_nganhang (
    id integer NOT NULL,
    bank_id character varying(20) NOT NULL,
    account_no character varying(50) NOT NULL,
    template character varying(20) DEFAULT 'compact2'::character varying,
    account_name character varying(100) NOT NULL,
    content character varying(255),
    id_restaurant integer
);


ALTER TABLE public.thongtin_nganhang OWNER TO postgres;

--
-- Name: thongtin_nganhang_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.thongtin_nganhang_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.thongtin_nganhang_id_seq OWNER TO postgres;

--
-- Name: thongtin_nganhang_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.thongtin_nganhang_id_seq OWNED BY public.thongtin_nganhang.id;


--
-- Name: vaitro; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vaitro (
    mavaitro integer NOT NULL,
    tenvaitro character varying(50),
    mota text
);


ALTER TABLE public.vaitro OWNER TO postgres;

--
-- Name: vaitro_mavaitro_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vaitro_mavaitro_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vaitro_mavaitro_seq OWNER TO postgres;

--
-- Name: vaitro_mavaitro_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vaitro_mavaitro_seq OWNED BY public.vaitro.mavaitro;


--
-- Name: yeucaudon; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.yeucaudon (
    madonhang integer NOT NULL,
    id_restaurant integer NOT NULL,
    trangthaithanhtoan character varying(50),
    thoigianthanhtoan timestamp without time zone,
    ngaytaodon timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    mataikhoan integer,
    id_thanhtoan integer,
    ghichu text,
    id_giamgia integer,
    maban integer,
    manhanvien integer,
    giosudung timestamp without time zone,
    tongtien double precision
);


ALTER TABLE public.yeucaudon OWNER TO postgres;

--
-- Name: TABLE yeucaudon; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.yeucaudon IS 'Bảng quản lý đơn hàng';


--
-- Name: yeucaudon_madonhang_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.yeucaudon_madonhang_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.yeucaudon_madonhang_seq OWNER TO postgres;

--
-- Name: yeucaudon_madonhang_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.yeucaudon_madonhang_seq OWNED BY public.yeucaudon.madonhang;


--
-- Name: yeuthich; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.yeuthich (
    mataikhoan integer NOT NULL,
    masanpham integer NOT NULL,
    ngaythem timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.yeuthich OWNER TO postgres;

--
-- Name: ban maban; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ban ALTER COLUMN maban SET DEFAULT nextval('public.ban_maban_seq'::regclass);


--
-- Name: danhmuc madanhmuc; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.danhmuc ALTER COLUMN madanhmuc SET DEFAULT nextval('public.danhmuc_madanhmuc_seq'::regclass);


--
-- Name: giamgia id_giamgia; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.giamgia ALTER COLUMN id_giamgia SET DEFAULT nextval('public.giamgia_id_giamgia_seq'::regclass);


--
-- Name: khachhang mataikhoan; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.khachhang ALTER COLUMN mataikhoan SET DEFAULT nextval('public.khachhang_mataikhoan_seq'::regclass);


--
-- Name: khuyenmai id_khuyenmai; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.khuyenmai ALTER COLUMN id_khuyenmai SET DEFAULT nextval('public.khuyenmai_id_khuyenmai_seq'::regclass);


--
-- Name: listimage id_anh; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listimage ALTER COLUMN id_anh SET DEFAULT nextval('public.listimage_id_anh_seq'::regclass);


--
-- Name: nguyenlieu manguyenlieu; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nguyenlieu ALTER COLUMN manguyenlieu SET DEFAULT nextval('public.nguyenlieu_manguyenlieu_seq'::regclass);


--
-- Name: nhanvien manhanvien; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nhanvien ALTER COLUMN manhanvien SET DEFAULT nextval('public.nhanvien_manhanvien_seq'::regclass);


--
-- Name: phieunhapkho maphieunhap; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.phieunhapkho ALTER COLUMN maphieunhap SET DEFAULT nextval('public.phieunhapkho_maphieunhap_seq'::regclass);


--
-- Name: restaurant id_restaurant; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurant ALTER COLUMN id_restaurant SET DEFAULT nextval('public.restaurant_id_restaurant_seq'::regclass);


--
-- Name: sanpham masanpham; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sanpham ALTER COLUMN masanpham SET DEFAULT nextval('public.sanpham_masanpham_seq'::regclass);


--
-- Name: thanhtoan id_thanhtoan; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.thanhtoan ALTER COLUMN id_thanhtoan SET DEFAULT nextval('public.thanhtoan_id_thanhtoan_seq'::regclass);


--
-- Name: thongtin_nganhang id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.thongtin_nganhang ALTER COLUMN id SET DEFAULT nextval('public.thongtin_nganhang_id_seq'::regclass);


--
-- Name: vaitro mavaitro; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vaitro ALTER COLUMN mavaitro SET DEFAULT nextval('public.vaitro_mavaitro_seq'::regclass);


--
-- Name: yeucaudon madonhang; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.yeucaudon ALTER COLUMN madonhang SET DEFAULT nextval('public.yeucaudon_madonhang_seq'::regclass);


--
-- Data for Name: ban; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ban (maban, id_restaurant, tenban, succhua, trangthai) FROM stdin;
2	1	Bàn 2	2	f
6	1	Bàn 6	10	f
7	1	Bàn 7	10	f
8	1	Bàn 8	6	t
9	1	Bàn 9	2	f
10	1	Bàn 10	2	f
11	1	Bàn 11	10	f
1	1	Bàn 1	6	t
4	1	Bàn 4	6	f
12	1	bàn 12	10	f
13	1	Bàn 13	8	t
14	1	bàn 14	10	f
15	1	Bàn 15	4	f
5	1	Bàn 5	8	f
3	1	Bàn 3	2	f
\.


--
-- Data for Name: chitietphieunhap; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chitietphieunhap (maphieunhap, manguyenlieu, soluongnhap, gianhap, ngayhethan) FROM stdin;
1	1	5.0000	80000.0000	2026-12-01
1	2	20.0000	30000.0000	2026-03-01
1	30	12.0000	24000.0000	2027-01-01
1	42	10.0000	35000.0000	2026-06-01
1	43	12.0000	60000.0000	2027-05-01
2	4	10.0000	250000.0000	2026-02-15
2	8	15.0000	60000.0000	2026-02-15
2	17	50.0000	22000.0000	2026-12-31
2	19	5.0000	20000.0000	2026-02-10
2	28	5.0000	190000.0000	2026-08-01
\.


--
-- Data for Name: chitietyeucau; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chitietyeucau (madonhang, id_restaurant, masanpham, soluong, trangthai, gia, update_trang_thai_at) FROM stdin;
8	1	1	1	Đã hoàn thành	30000	2026-02-05 16:35:18.66501
8	1	3	1	Đã hoàn thành	45000	2026-02-05 16:35:18.66501
1	1	1	2	Chờ xác nhận	30000	2026-02-05 16:35:18.66501
79	1	5	1	chờ xác nhận	35000	2026-03-05 18:54:25.776854
80	1	3	1	chờ xác nhận	45000	2026-03-06 15:51:37.750029
81	1	5	1	chờ xác nhận	35000	2026-03-06 15:52:53.059226
82	1	7	1	chờ xác nhận	32000	2026-03-06 16:14:10.404999
83	1	7	1	chờ xác nhận	32000	2026-03-06 16:19:33.054859
\.


--
-- Data for Name: congthuc; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.congthuc (masanpham, manguyenlieu, slnguyenlieu) FROM stdin;
1	41	0.02
1	31	0.03
1	42	0.05
1	44	0.02
3	13	1.00
3	5	0.10
3	29	1.00
3	19	0.02
5	8	0.25
5	39	0.05
5	38	0.01
9	14	1.00
9	10	0.05
9	11	0.05
9	28	0.08
9	35	0.03
10	16	0.10
10	5	0.08
10	35	0.05
22	18	0.20
22	6	0.08
22	7	0.20
22	27	0.01
25	17	0.15
25	23	0.10
25	6	0.05
25	27	0.01
4	15	0.20
4	37	0.05
7	40	0.02
7	31	0.03
7	30	0.05
8	41	0.02
8	31	0.03
8	30	0.05
11	24	0.30
12	8	0.35
12	39	0.10
12	36	0.05
13	25	0.25
13	30	0.05
13	2	0.10
14	15	0.25
14	38	0.05
15	41	0.01
15	43	0.10
15	24	0.05
16	9	0.15
16	19	0.10
16	20	0.05
17	32	0.10
17	2	0.10
17	45	0.01
17	46	0.02
18	2	0.20
18	30	0.05
20	33	1.00
20	45	0.01
21	25	0.20
21	34	1.00
21	30	0.02
23	18	0.20
23	6	0.10
23	7	0.30
24	30	0.01
\.


--
-- Data for Name: danhgia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.danhgia (mataikhoan, masanpham, noidung, sosao, ngaydanhgia) FROM stdin;
1	1	Ngon tuyệt!	5	2025-12-16 12:52:11.83692
2	3	Bình thường	3	2025-12-16 12:52:11.83692
1	9	Pizza hải sản rất nhiều topping, đáng tiền.	5	2025-12-25 09:18:36.903524
1	12	Gà sốt cay hơi cay quá so với mình.	4	2025-12-25 09:18:36.903524
2	1	Trà sữa trân châu hơi ngọt.	4	2025-12-25 09:18:36.903524
2	23	Phở bò tái chín nước dùng rất thanh.	5	2025-12-25 09:18:36.903524
3	5	Gà rán giòn, giao hàng nhanh.	5	2025-12-25 09:18:36.903524
3	10	Mì Ý hơi ít sốt một chút.	3	2025-12-25 09:18:36.903524
4	15	Trà đào cam sả rất thơm.	5	2025-12-25 09:18:36.903524
6	22	Phở Nam Định rất ngon, chuẩn vị Bắc.	5	2025-12-25 09:18:36.903524
6	3	Hamburger bò hơi khô.	3	2025-12-25 09:18:36.903524
7	18	Bánh Flan mềm mịn, béo ngậy.	5	2025-12-25 09:18:36.903524
8	13	Sinh tố bơ đặc, rất chất lượng.	5	2025-12-25 09:18:36.903524
8	20	Sữa chua dẻo ngon nhưng hơi ít.	4	2025-12-25 09:18:36.903524
9	17	Chè khúc bạch thanh mát, không quá ngọt.	5	2025-12-25 09:18:36.903524
9	14	Khoai tây múi cau rất ngon, lạ miệng.	4	2025-12-25 09:18:36.903524
4	1	Hài lòng với dịch vụ và sản phẩm.	5	2025-12-16 05:59:01.127809
8	1	Hài lòng với dịch vụ và sản phẩm.	4	2025-11-26 03:04:47.418014
3	3	Hài lòng với dịch vụ và sản phẩm.	3	2025-12-16 06:12:16.54521
7	3	Chất lượng ổn, đúng như mô tả.	5	2025-12-19 17:03:59.217463
1	3	Chất lượng ổn, đúng như mô tả.	5	2025-12-09 08:26:35.040229
1	4	Chất lượng ổn, đúng như mô tả.	4	2025-12-09 07:58:47.29603
3	4	Hài lòng với dịch vụ và sản phẩm.	3	2025-12-20 10:29:49.270565
6	4	Giao hàng nhanh, đóng gói cẩn thận.	5	2025-11-28 01:59:35.149212
2	4	Giao hàng nhanh, đóng gói cẩn thận.	3	2025-12-10 11:08:15.201139
6	5	Sản phẩm tuyệt vời, rất đáng mua.	4	2025-11-28 09:59:03.465542
9	5	Hài lòng với dịch vụ và sản phẩm.	5	2025-12-08 10:06:52.262556
1	5	Giao hàng nhanh, đóng gói cẩn thận.	3	2025-12-16 12:49:48.873566
3	7	Hài lòng với dịch vụ và sản phẩm.	5	2025-12-05 07:54:58.773004
4	7	Hài lòng với dịch vụ và sản phẩm.	5	2025-11-28 02:18:52.0359
7	7	Hài lòng với dịch vụ và sản phẩm.	5	2025-12-24 00:05:49.236436
6	7	Hài lòng với dịch vụ và sản phẩm.	3	2025-12-25 08:57:49.741487
2	7	Dùng rất thích, sẽ ủng hộ shop tiếp.	4	2025-12-16 11:03:02.641282
4	8	Dùng rất thích, sẽ ủng hộ shop tiếp.	5	2025-11-27 02:19:53.702746
6	8	Hài lòng với dịch vụ và sản phẩm.	4	2025-12-15 19:10:24.837012
1	8	Chất lượng ổn, đúng như mô tả.	4	2025-12-03 08:04:36.922927
9	8	Sản phẩm tuyệt vời, rất đáng mua.	3	2025-12-23 03:48:59.680942
7	8	Giao hàng nhanh, đóng gói cẩn thận.	5	2025-11-28 20:21:26.959879
4	9	Hài lòng với dịch vụ và sản phẩm.	3	2025-12-11 10:35:03.252229
3	9	Chất lượng ổn, đúng như mô tả.	3	2025-12-22 20:32:58.388423
7	9	Sản phẩm tuyệt vời, rất đáng mua.	3	2025-11-30 21:16:45.501226
6	9	Sản phẩm tuyệt vời, rất đáng mua.	4	2025-12-06 15:55:07.446316
6	10	Sản phẩm tuyệt vời, rất đáng mua.	5	2025-12-23 02:41:21.454335
8	10	Chất lượng ổn, đúng như mô tả.	4	2025-11-29 04:10:39.257935
7	10	Hài lòng với dịch vụ và sản phẩm.	4	2025-11-30 09:05:19.597304
2	11	Hài lòng với dịch vụ và sản phẩm.	3	2025-12-19 18:56:53.004578
9	11	Hài lòng với dịch vụ và sản phẩm.	3	2025-11-27 03:13:19.455936
1	11	Giao hàng nhanh, đóng gói cẩn thận.	4	2025-12-14 00:43:27.012032
4	11	Dùng rất thích, sẽ ủng hộ shop tiếp.	3	2025-12-19 20:41:34.019248
4	12	Sản phẩm tuyệt vời, rất đáng mua.	4	2025-12-21 00:05:00.933464
9	12	Chất lượng ổn, đúng như mô tả.	4	2025-12-15 19:52:30.956623
2	12	Sản phẩm tuyệt vời, rất đáng mua.	4	2025-12-20 22:23:48.324723
3	13	Sản phẩm tuyệt vời, rất đáng mua.	4	2025-12-02 21:49:31.878636
2	13	Hài lòng với dịch vụ và sản phẩm.	5	2025-12-24 00:53:25.863059
7	13	Giao hàng nhanh, đóng gói cẩn thận.	4	2025-12-20 09:52:15.033611
4	13	Hài lòng với dịch vụ và sản phẩm.	3	2025-12-12 05:51:32.04171
6	14	Chất lượng ổn, đúng như mô tả.	4	2025-12-14 10:03:41.64306
1	14	Chất lượng ổn, đúng như mô tả.	5	2025-12-22 01:20:08.505903
3	14	Sản phẩm tuyệt vời, rất đáng mua.	3	2025-11-28 09:30:09.535028
2	14	Sản phẩm tuyệt vời, rất đáng mua.	5	2025-11-30 11:52:00.523484
7	15	Dùng rất thích, sẽ ủng hộ shop tiếp.	3	2025-12-09 19:08:33.27388
9	15	Sản phẩm tuyệt vời, rất đáng mua.	3	2025-12-15 11:09:00.711092
3	15	Giao hàng nhanh, đóng gói cẩn thận.	4	2025-12-15 12:03:11.384524
1	16	Chất lượng ổn, đúng như mô tả.	3	2025-12-04 16:42:15.648764
7	16	Hài lòng với dịch vụ và sản phẩm.	3	2025-12-02 14:31:44.445199
4	16	Hài lòng với dịch vụ và sản phẩm.	4	2025-12-20 14:24:33.323321
9	16	Chất lượng ổn, đúng như mô tả.	5	2025-12-08 19:34:38.118879
7	17	Hài lòng với dịch vụ và sản phẩm.	3	2025-12-18 22:13:09.875355
4	17	Sản phẩm tuyệt vời, rất đáng mua.	3	2025-12-22 14:50:52.615522
1	17	Chất lượng ổn, đúng như mô tả.	4	2025-12-10 01:53:52.792505
6	17	Dùng rất thích, sẽ ủng hộ shop tiếp.	4	2025-12-10 07:42:03.617398
4	18	Chất lượng ổn, đúng như mô tả.	5	2025-11-30 14:30:41.737877
8	18	Hài lòng với dịch vụ và sản phẩm.	3	2025-12-01 16:02:12.38855
9	18	Chất lượng ổn, đúng như mô tả.	3	2025-12-09 05:44:34.103586
1	18	Sản phẩm tuyệt vời, rất đáng mua.	4	2025-12-25 02:25:58.399312
9	20	Hài lòng với dịch vụ và sản phẩm.	5	2025-12-06 13:10:16.559798
6	20	Sản phẩm tuyệt vời, rất đáng mua.	3	2025-11-29 20:27:38.066118
3	20	Dùng rất thích, sẽ ủng hộ shop tiếp.	4	2025-11-30 21:03:08.098678
2	20	Dùng rất thích, sẽ ủng hộ shop tiếp.	4	2025-12-17 07:34:44.141184
3	21	Hài lòng với dịch vụ và sản phẩm.	5	2025-12-13 11:14:30.046952
2	21	Dùng rất thích, sẽ ủng hộ shop tiếp.	5	2025-12-03 21:58:30.752405
8	21	Hài lòng với dịch vụ và sản phẩm.	4	2025-12-06 12:08:53.289307
6	21	Giao hàng nhanh, đóng gói cẩn thận.	4	2025-12-20 09:58:25.359704
9	21	Chất lượng ổn, đúng như mô tả.	5	2025-12-05 20:56:22.015033
4	22	Giao hàng nhanh, đóng gói cẩn thận.	3	2025-11-27 04:22:07.39943
9	22	Chất lượng ổn, đúng như mô tả.	5	2025-12-22 03:20:24.440517
8	22	Giao hàng nhanh, đóng gói cẩn thận.	5	2025-11-27 03:04:49.253398
6	23	Chất lượng ổn, đúng như mô tả.	5	2025-12-22 11:38:06.820694
9	23	Giao hàng nhanh, đóng gói cẩn thận.	5	2025-12-24 10:26:44.60293
3	23	Giao hàng nhanh, đóng gói cẩn thận.	4	2025-12-22 19:09:36.779424
8	23	Hài lòng với dịch vụ và sản phẩm.	3	2025-12-12 12:33:58.530422
66	1	Sản phẩm này rất tuyệt vời okokokokoko!	5	2026-01-15 17:00:00
\.


--
-- Data for Name: danhmuc; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.danhmuc (madanhmuc, tendanhmuc, anh, trangthai) FROM stdin;
1	Đồ uống	douong.png	Hiện
2	Đồ ăn nhanh	doan.png	Hiện
3	Món chính	monchinh.png	Hiện
4	Món tráng miệng	trangmieng.png	Hiện
\.


--
-- Data for Name: giamgia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.giamgia (id_giamgia, code, giatri, mota) FROM stdin;
1	SALE10	10	Giảm 10%
2	SALE20	20	Giảm 20%
\.


--
-- Data for Name: khachhang; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.khachhang (mataikhoan, matkhau, email, sdt, hoten, avatar, diachi, number_log, first_log, diemtichluy, id_restaurant, trangthai, firebase_uid) FROM stdin;
66	$2a$10$DQJDd90aXLBCwyNSEyT.XOJlilghS/WarFW197.FAw7inEAuqG5bC	nguyenvanbcheck123@gmail.com	0987654321	Nguyễn Văn B	\N	456 Đường ABC, Quận 4, TP. HCM	\N	\N	\N	\N	\N	\N
1	$2a$10$DQJDd90aXLBCwyNSEyT.XOJlilghS/WarFW197.FAw7inEAuqG5bC	a@gmail.com	0912123456	Nguyễn Văn A	nguyenvana.png	Quận 3	0	\N	\N	\N	\N	\N
2	$2a$10$DQJDd90aXLBCwyNSEyT.XOJlilghS/WarFW197.FAw7inEAuqG5bC	b@gmail.com	0922123456	Trần Thị B	\N	Quận 1	0	\N	\N	\N	\N	\N
3	$2a$10$DQJDd90aXLBCwyNSEyT.XOJlilghS/WarFW197.FAw7inEAuqG5bC	c@gmail.com	0912345678	nguyen van c	\N	\N	0	2025-12-16 00:00:00	\N	\N	\N	\N
4	$2a$10$DQJDd90aXLBCwyNSEyT.XOJlilghS/WarFW197.FAw7inEAuqG5bC	d@gmail.com	0913345678	nguyen van d	\N	\N	0	2025-12-16 00:00:00	\N	\N	\N	\N
6	$2a$10$DQJDd90aXLBCwyNSEyT.XOJlilghS/WarFW197.FAw7inEAuqG5bC	e@gmail.com	0398343124	d	\N	\N	0	2025-12-16 00:00:00	\N	\N	\N	\N
7	$2a$10$DQJDd90aXLBCwyNSEyT.XOJlilghS/WarFW197.FAw7inEAuqG5bC	1@gmail.com	0387343124	a	\N	\N	0	2025-12-16 00:00:00	\N	\N	\N	\N
8	$2a$10$DQJDd90aXLBCwyNSEyT.XOJlilghS/WarFW197.FAw7inEAuqG5bC	f@gmail.com	0923456799	nguyen van f	\N	\N	0	2025-12-17 00:00:00	\N	\N	\N	\N
9	$2a$10$DQJDd90aXLBCwyNSEyT.XOJlilghS/WarFW197.FAw7inEAuqG5bC	h@gmail.com	0923456789	h	\N	\N	0	2025-12-17 00:00:00	\N	\N	\N	\N
61	$2a$10$DQJDd90aXLBCwyNSEyT.XOJlilghS/WarFW197.FAw7inEAuqG5bC	1234@gmail.com	0967645656	nguyen 1234	\N	\N	0	\N	\N	\N	\N	\N
62	$2a$10$DQJDd90aXLBCwyNSEyT.XOJlilghS/WarFW197.FAw7inEAuqG5bC	toan2121@gmail.com	0987654329	toan2121	\N	\N	\N	\N	\N	\N	\N	\N
69	$2a$10$NKXjcJDPsN2x4G2.bA7aKuQFltvIxsQNw3XRef8GlWSm4t3HYVGi2	eeeeemailcuaban@gmail.com	0837643762	dev1222	\N		\N	\N	\N	\N	\N	\N
70	$2a$10$lrOxKdq5.Zk.pVCgxzr8D.jSm4vr6mrVpGhBcO99S6CY5PunNlv/u	0987467283@default.com	0987467283	toannnnn	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: khuyenmai; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.khuyenmai (id_khuyenmai, masanpham, makhuyenmai, giatri, ngaybatdau, ngayketthuc, trangthai) FROM stdin;
1	1	101	5000	2025-01-01	2025-12-31	Đang áp dụng
2	3	102	8000	2025-01-01	2025-06-30	Đang áp dụng
\.


--
-- Data for Name: listimage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.listimage (id_anh, masanpham, url_anh) FROM stdin;
2	1	trasua2.png
1	1	trasua1.jpg
16	1	trasua3.jpg
21	1	trasua4.jpg
22	1	trasua5.jpg
43	7	tra-sua-thai-xanh-5.png
59	11	nuoc-ep-cam-5.png
99	20	sua-chua-5.png
107	22	pho-bo-nd-3.png
3	3	burger1.jpg
17	3	burger2.jpg
18	3	burger3.jpg
26	3	burger4.jpg
27	3	burger5.jpg
5	7	tra-sua-thai-xanh-1.jpg
6	7	tra-sua-thai-xanh-2.jpg
41	7	tra-sua-thai-xanh-3.jpg
42	7	tra-sua-thai-xanh-4.jpg
7	8	hong-tra-sua-1.jpg
44	8	hong-tra-sua-2.jpg
45	8	hong-tra-sua-3.jpg
46	8	hong-tra-sua-4.jpg
47	8	hong-tra-sua-5.jpg
10	11	nuoc-ep-cam-1.jpg
56	11	nuoc-ep-cam-2.jpg
57	11	nuoc-ep-cam-3.jpg
58	11	nuoc-ep-cam-4.jpg
8	9	pizza-hai-san-1.jpg
48	9	pizza-hai-san-2.jpg
49	9	pizza-hai-san-3.jpg
50	9	pizza-hai-san-4.jpg
51	9	pizza-hai-san-5.jpg
9	10	mi-y-bo-bam-1.jpg
52	10	mi-y-bo-bam-2.jpg
53	10	mi-y-bo-bam-3.jpg
54	10	mi-y-bo-bam-4.jpg
55	10	mi-y-bo-bam-5.jpg
11	12	ga-sot-cay-1.png
60	12	ga-sot-cay-2.jpg
61	12	ga-sot-cay-3.jpg
62	12	ga-sot-cay-4.jpg
63	12	ga-sot-cay-5.jpg
12	13	sinh-to-bo-1.jpg
64	13	sinh-to-bo-2.jpg
65	13	sinh-to-bo-3.jpg
66	13	sinh-to-bo-4.jpg
67	13	sinh-to-bo-5.jpg
13	14	khoai-tay-mui-cau-1.jpg
68	14	khoai-tay-mui-cau-2.jpg
69	14	khoai-tay-mui-cau-3.jpg
70	14	khoai-tay-mui-cau-4.jpg
71	14	khoai-tay-mui-cau-5.jpg
14	15	tra-dao-cam-sa-1.jpg
72	15	tra-dao-cam-sa-2.jpg
73	15	tra-dao-cam-sa-3.jpg
74	15	tra-dao-cam-sa-4.jpg
75	15	tra-dao-cam-sa-5.jpg
15	16	salad-uc-ga-1.jpg
76	16	salad-uc-ga-2.jpg
77	16	salad-uc-ga-3.jpg
78	16	salad-uc-ga-4.jpg
79	16	salad-uc-ga-5.jpg
80	17	che-kb-1.jpg
81	17	che-kb-2.jpg
82	17	che-kb-3.jpg
83	17	che-kb-4.jpg
84	17	che-kb-5.jpg
85	18	banh-flan-1.jpg
86	18	banh-flan-2.jpg
87	18	banh-flan-3.jpg
88	18	banh-flan-4.jpg
89	18	banh-flan-5.jpg
95	20	sua-chua-1.jpg
96	20	sua-chua-2.jpg
97	20	sua-chua-3.jpg
98	20	sua-chua-4.jpg
100	21	kem-bo-1.jpg
101	21	kem-bo-2.jpg
102	21	kem-bo-3.jpg
103	21	kem-bo-4.jpg
104	21	kem-bo-5.jpg
105	22	pho-bo-nd-1.jpg
106	22	pho-bo-nd-2.jpg
108	22	pho-bo-nd-4.jpg
109	22	pho-bo-nd-5.jpg
110	23	pho-bo-ltt-1.jpg
166	25	45495899-e5fc-4c3d-bf28-5ca950654838.jpg
113	23	pho-bo-ltt-4.jpg
114	23	pho-bo-ltt-5.jpg
111	23	pho-bo-ltt-3.jpg
167	25	2e824b2a-87a8-40c2-9728-a9af7696df77.jpg
112	23	pho-bo-ltt-2.jpg
32	5	ga-ran-2.jpg
33	5	ga-ran-3.jpg
34	5	ga-ran-4.jpg
35	5	ga-ran-5.jpg
168	25	d54708b9-cc5b-408c-b7eb-ee34978cfa24.jpg
169	25	8aef3bd6-03a8-49a4-b254-0ae4028e25a9.jpg
170	25	f7464487-f82c-4a11-ba6b-8f00a68e008b.jpg
115	\N	trasua2.png
116	\N	trasua1.jpg
117	\N	trasua3.jpg
118	\N	trasua4.jpg
119	\N	trasua2.png
120	\N	trasua1.jpg
121	\N	trasua3.jpg
122	\N	trasua4.jpg
156	24	52c5bf3b-6ceb-41c0-a643-789de402f1cd.jpg
157	24	6872cd06-df22-49cd-81a9-4083bbf066fe.jpg
158	24	026ccbb6-2274-4f1d-b34f-46b14ddda5cd.jpg
159	24	4422ceca-7758-4760-bb54-5bc3a4666074.jpg
160	24	5e4c251f-b3fa-4259-b665-0ffa0c88846f.jpg
161	4	khoai2.jpg
162	4	khoai3.jpg
163	4	khoai1.jpg
164	4	khoai4.jpg
165	4	khoai5.jpg
\.


--
-- Data for Name: nguyenlieu; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.nguyenlieu (manguyenlieu, id_restaurant, tennguyenlieu, donvitinh, mota, xuatxu, trangthai, soluong, updated_at) FROM stdin;
1	1	Trà đen	Kg	Nguyên liệu pha chế	Việt Nam	Còn hàng	15.0000	2026-02-06 09:59:34.249006+07
2	1	Sữa tươi	Lít	Sữa pha chế	Đà Lạt	Còn hàng	50.0000	2026-02-06 09:59:34.249006+07
3	1	Bánh mì	Cái	Làm hamburger	Việt Nam	Còn hàng	100.0000	2026-02-06 09:59:34.249006+07
4	1	Thịt bò	Kg	Làm nhân bánh	Úc	Còn hàng	20.0000	2026-02-06 09:59:34.249006+07
5	1	Thịt bò xay	Kg	Làm nhân Hamburger, Mì Ý	Úc	Còn hàng	15.0000	2026-02-06 09:59:34.249006+07
6	1	Thịt bò thăn	Kg	Dùng cho Cơm rang, Phở tái	Việt Nam	Còn hàng	10.0000	2026-02-06 09:59:34.249006+07
7	1	Xương ống bò	Kg	Ninh nước dùng phở	Việt Nam	Còn hàng	30.0000	2026-02-06 09:59:34.249006+07
8	1	Thịt gà (Cánh/Đùi)	Kg	Gà rán, Gà sốt cay	CP Việt Nam	Còn hàng	45.0000	2026-02-06 09:59:34.249006+07
9	1	Ức gà Fillet	Kg	Làm Salad	CP Việt Nam	Còn hàng	25.0000	2026-02-06 09:59:34.249006+07
10	1	Tôm sú	Kg	Pizza hải sản	Cà Mau	Còn hàng	12.0000	2026-02-06 09:59:34.249006+07
11	1	Mực ống	Kg	Pizza hải sản	Quảng Ninh	Còn hàng	15.0000	2026-02-06 09:59:34.249006+07
12	1	Thanh cua	Gói	Topping Pizza	Nhật Bản	Còn hàng	40.0000	2026-02-06 09:59:34.249006+07
13	1	Vỏ bánh Hamburger	Cái	Vỏ bánh tròn rắc vừng	Kinh Đô	Còn hàng	200.0000	2026-02-06 09:59:34.249006+07
14	1	Đế bánh Pizza	Cái	Đế mỏng size M	Việt Nam	Còn hàng	80.0000	2026-02-06 09:59:34.249006+07
15	1	Khoai tây tươi	Kg	Khoai tây chiên, múi cau	Đà Lạt	Còn hàng	60.0000	2026-02-06 09:59:34.249006+07
16	1	Mì Ý Spaghetti	Gói	Mì sợi tròn 500g	Ý	Còn hàng	35.0000	2026-02-06 09:59:34.249006+07
17	1	Gạo tẻ	Kg	Nấu cơm rang	ST25	Còn hàng	100.0000	2026-02-06 09:59:34.249006+07
18	1	Bánh phở tươi	Kg	Dùng cho món phở	Việt Nam	Còn hàng	40.0000	2026-02-06 09:59:34.249006+07
19	1	Rau Xà lách	Kg	Ăn kèm Burger, Salad	Đà Lạt	Còn hàng	15.0000	2026-02-06 09:59:34.249006+07
20	1	Cà chua	Kg	Làm sốt, ăn kèm	Đà Lạt	Còn hàng	25.0000	2026-02-06 09:59:34.249006+07
21	1	Hành tây	Kg	Xào, Pizza	Hải Dương	Còn hàng	20.0000	2026-02-06 09:59:34.249006+07
22	1	Ớt chuông	Kg	Topping Pizza	Đà Lạt	Còn hàng	10.0000	2026-02-06 09:59:34.249006+07
23	1	Dưa cải chua	Kg	Cơm rang dưa bò	Việt Nam	Còn hàng	15.0000	2026-02-06 09:59:34.249006+07
24	1	Cam vàng	Kg	Pha nước ép, Trà đào	Ai Cập	Còn hàng	30.0000	2026-02-06 09:59:34.249006+07
25	1	Bơ sáp	Kg	Sinh tố, Kem bơ	Đắk Lắk	Còn hàng	20.0000	2026-02-06 09:59:34.249006+07
27	1	Tỏi	Kg	Gia vị xào nấu	Việt Nam	Còn hàng	8.0000	2026-02-06 09:59:34.249006+07
28	1	Phô mai Mozzarella	Kg	Phô mai kéo sợi Pizza	Anchor	Còn hàng	25.0000	2026-02-06 09:59:34.249006+07
29	1	Phô mai Cheddar	Gói	Phô mai lát Burger	Anchor	Còn hàng	50.0000	2026-02-06 09:59:34.249006+07
30	1	Sữa đặc	Hộp	Pha chế đồ uống	Ông Thọ	Còn hàng	72.0000	2026-02-06 09:59:34.249006+07
31	1	Bột kem béo	Kg	Pha trà sữa	Thái Lan	Còn hàng	40.0000	2026-02-06 09:59:34.249006+07
32	1	Whipping Cream	Hộp	Làm chè khúc bạch	Anchor	Còn hàng	24.0000	2026-02-06 09:59:34.249006+07
33	1	Sữa chua	Hộp	Làm sữa chua dẻo	Vinamilk	Còn hàng	120.0000	2026-02-06 09:59:34.249006+07
34	1	Kem Vani	Hộp	Kem viên	Wall	Còn hàng	10.0000	2026-02-06 09:59:34.249006+07
35	1	Sốt Cà chua (Pizza)	Hộp	Sốt nền Pizza/Mì Ý	Golden Farm	Còn hàng	30.0000	2026-02-06 09:59:34.249006+07
36	1	Sốt Gochujang	Hộp	Tương ớt Hàn Quốc	Hàn Quốc	Còn hàng	15.0000	2026-02-06 09:59:34.249006+07
37	1	Tương cà	Can	Chấm đồ chiên	Cholimex	Còn hàng	10.0000	2026-02-06 09:59:34.249006+07
38	1	Tương ớt	Can	Chấm đồ chiên	Chin-su	Còn hàng	10.0000	2026-02-06 09:59:34.249006+07
39	1	Bột chiên giòn	Gói	Tẩm gà chiên	Aji-Quick	Còn hàng	100.0000	2026-02-06 09:59:34.249006+07
40	1	Trà Thái Xanh	Gói	Pha trà sữa Thái	Thái Lan	Còn hàng	20.0000	2026-02-06 09:59:34.249006+07
41	1	Hồng trà (Trà đen)	Gói	Pha trà sữa truyền thống	Phúc Long	Còn hàng	20.0000	2026-02-06 09:59:34.249006+07
42	1	Trân châu đen	Kg	Topping trà sữa	Wings	Còn hàng	50.0000	2026-02-06 09:59:34.249006+07
43	1	Đào ngâm	Hộp	Trà đào	Hosen	Còn hàng	48.0000	2026-02-06 09:59:34.249006+07
44	1	Đường đen	Kg	Nấu trân châu	Hàn Quốc	Còn hàng	30.0000	2026-02-06 09:59:34.249006+07
45	1	Bột Gelatin	Gói	Làm đông chè/bánh	Đức	Còn hàng	10.0000	2026-02-06 09:59:34.249006+07
46	1	Hạnh nhân lát 789	Kg	Rắc chè khúc bạch	Mỹ	Còn hàng	5.0000	2026-02-06 09:59:34.249006+07
63	1	Rièng	Kg	nau thit cho	Viet nam	Còn hàng	5.0000	2026-03-03 18:31:29.162888+07
64	1	lá chanh	Kg	sdsds	vietnam	Còn hàng	1.6500	2026-03-03 22:00:25.397021+07
\.


--
-- Data for Name: nhanvien; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.nhanvien (manhanvien, id_restaurant, mavaitro, tennhanvien, email, password, mota, number_log, first_log, trangthai) FROM stdin;
9	1	1	Hoàng Văn I	hvi@gmail.com	$2a$10$DQJDd90aXLBCwyNSEyT.XOJlilghS/WarFW197.FAw7inEAuqG5bC	Quản lý	11	2023-12-18	t
1	1	1	Nguyễn Thị q	ntq@gmail.com	$2a$10$DQJDd90aXLBCwyNSEyT.XOJlilghS/WarFW197.FAw7inEAuqG5bC	Thu ngân	1	2023-12-19	t
2	1	2	Trần Văn Y	tvy@gmail.com	$2a$10$DQJDd90aXLBCwyNSEyT.XOJlilghS/WarFW197.FAw7inEAuqG5bC	Phục vụ	1	2023-12-19	t
4	1	2	Hoàng Văn F	hvf@gmail.com	$2a$10$DQJDd90aXLBCwyNSEyT.XOJlilghS/WarFW197.FAw7inEAuqG5bC	Phục vụ	11	2023-12-18	t
5	1	2	Hoàng Văn J	hvj@gmail.com	$2a$10$DQJDd90aXLBCwyNSEyT.XOJlilghS/WarFW197.FAw7inEAuqG5bC	Phục Vụ	11	2023-12-18	t
8	1	1	Trần Văn H	tvh@gmail.com	$2a$10$DQJDd90aXLBCwyNSEyT.XOJlilghS/WarFW197.FAw7inEAuqG5bC	Phục vụ	1	2023-12-19	t
10	1	3	nhan vien bep a	bep@gmail.com	$2a$10$DQJDd90aXLBCwyNSEyT.XOJlilghS/WarFW197.FAw7inEAuqG5bC	Nhan vien bep	1	2023-12-19	t
7	1	2	Nguyễn Thị G	ntg@gmail.com	$2a$10$slCcZISm6OShXhhuaDZWOOo6egMGs5llXyTF2sjOy1uF8N2//nY5O	\N	\N	\N	t
3	1	2	Hoàng Văn E	hve@gmail.com	$2a$10$OLc6pvUZJmtqnFnj1KOCNOyAxr441ziSIsvs9fxQM2pJRD9IwFgi2	\N	\N	\N	t
6	1	3	Hoàng Văn K	hvk@gmail.com	$2a$10$e3BIh9a1HzcEBRBmBCMzaOj5K0TyVqe7ErRDq/osNv4c70oEczguK	\N	\N	\N	t
\.


--
-- Data for Name: phieunhapkho; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.phieunhapkho (maphieunhap, id_restaurant, nhacungcap, manhanvien, ngaynhap, tongtien, ghichu, mapieunhap) FROM stdin;
1	1	Nhà cung cấp A	1	2025-12-16 00:00:00+07	2358000.0000	Nhập nguyên liệu pha chế	1
2	1	Nhà cung cấp B	4	2025-12-16 00:00:00+07	5550000.0000	Nhập nguyên liệu bếp	2
\.


--
-- Data for Name: restaurant; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.restaurant (id_restaurant, ten, sdt, diachi, mota, status, parent_id, bank_id, account_no, template, account_name, content, img) FROM stdin;
1	Nhà hàng Trung Tâm	0901234567	123 Quận 1	Chi nhánh chính	Hoạt động	\N	BIDV	6868686868688	compact	NGUYEN DUC TOAN	thanh toán	restaurant1.jpg
2	Nhà hàng Chi Nhánh 2	0909876543	456 Quận 5	Chi nhánh 2	Hoạt động	\N	MB	6868686868688	compact	NGUYEN DUC TOAN	thanh toán	restaurant2.jpg
3	Nhà hàng Chi Nhánh 1	0909090922	35, Tu Hoàng, Xã Xuân Phương, Huyện Nam Từ Liêm, Hà Nội	Chi Nhánh 1	Hoạt động	1	MB	6868686868688	compact	NGUYEN DUC TOAN	thanh toan	restaurant3.jpg
\.


--
-- Data for Name: sanpham; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sanpham (masanpham, madanhmuc, tensanpham, mota, gia) FROM stdin;
3	2	Hamburger bò	Bánh hamburger	45000
5	2	Gà rán	Gà rán giòn	35000
7	1	Trà sữa Thái xanh	Trà sữa vị thái xanh thơm mát	32000
8	1	Hồng trà sữa	Trà sữa truyền thống đậm vị trà	28000
9	2	Pizza Hải sản	Pizza nhân tôm, mực, thanh cua	125000
10	3	Mì Ý Sốt Bò Bằm	Mì Ý sốt cà chua và thịt bò bằm	55000
11	1	Nước ép Cam	Cam tươi nguyên chất 100%	35000
12	3	Gà sốt Cay Hàn Quốc	Gà chiên giòn sốt cay ngọt	45000
13	1	Sinh tố Bơ	Bơ sáp xay cùng sữa đặc	40000
14	2	Khoai tây múi cau	Khoai tây cắt múi cau chiên giòn	25000
15	1	Trà đào cam sả	Trà đào kết hợp cam và sả tươi	38000
16	3	Salad Ức Gà	Salad rau củ kèm ức gà áp chảo	48000
17	4	Chè khúc bạch	Chè khúc bạch trân châu đường đen	25000
18	4	Bánh Flan	Bánh Flan cốt dừa thơm béo	15000
20	4	Sữa chua dẻo	Sữa chua dẻo xắt miếng kèm bột ca cao	30000
21	4	Kem bơ Đà Lạt	Bơ sáp xay nhuyễn kèm kem vani viên	45000
22	3	Phở bò Nam Định	Phở bò đặc sản nổi tiếng Nam Định	50000
23	3	Phở bò Lý Thái Tổ	Phở bò tái chín	65000
1	1	Trà sữa trân châu đường đen	Thức uống ngọt, trân châu đường đen	25000
24	1	Ca-fe đen	ca-fe đen đá ít đường	25000
4	2	Khoai tây chiên	Khoai tây chiên giòn	20000
25	3	Cơm rang dưa bò	Cơm rang dưa bò ngon nhức nách	35000
\.


--
-- Data for Name: thanhtoan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.thanhtoan (id_thanhtoan, kieuthanhtoan) FROM stdin;
1	Tiền mặt
2	Chuyển khoản
\.


--
-- Data for Name: thongtin_nganhang; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.thongtin_nganhang (id, bank_id, account_no, template, account_name, content, id_restaurant) FROM stdin;
1	970415	6868686868	compact	DUCTOAN RESTAURANT	Thanh toan	1
2	970436	6868686868	compact	DUCTOAN RESTAURANT	Thanh toan	1
3	970418	6868686868	compact	DUCTOAN RESTAURANT	Thanh toan	1
4	970405	6868686868	compact	DUCTOAN RESTAURANT	Thanh toan	1
5	970448	6868686868	compact	DUCTOAN RESTAURANT	Thanh toan	1
6	970422	6868686868	compact	DUCTOAN RESTAURANT	Thanh toan	1
7	970407	6868686868	compact	DUCTOAN RESTAURANT	Thanh toan	1
8	970416	6868686868	compact	DUCTOAN RESTAURANT	Thanh toan	1
9	970432	6868686868	compact	DUCTOAN RESTAURANT	Thanh toan	1
10	970423	6868686868	compact	DUCTOAN RESTAURANT	Thanh toan	1
11	970403	6868686868	compact	DUCTOAN RESTAURANT	Thanh toan	1
12	970437	6868686868	compact	DUCTOAN RESTAURANT	Thanh toan	1
13	970454	6868686868	compact	DUCTOAN RESTAURANT	Thanh toan	1
14	970429	6868686868	compact	DUCTOAN RESTAURANT	Thanh toan	1
15	970441	6868686868	compact	DUCTOAN RESTAURANT	Thanh toan	1
16	970443	6868686868	compact	DUCTOAN RESTAURANT	Thanh toan	1
17	970431	6868686868	compact	DUCTOAN RESTAURANT	Thanh toan	1
18	970426	6868686868	compact	DUCTOAN RESTAURANT	Thanh toan	1
19	546034	6868686868	compact	DUCTOAN RESTAURANT	Thanh toan	1
20	546035	6868686868	compact	DUCTOAN RESTAURANT	Thanh toan	1
21	971005	6868686868	compact	DUCTOAN RESTAURANT	Thanh toan	1
22	963388	6868686868	compact	DUCTOAN RESTAURANT	Thanh toan	1
23	971011	6868686868	compact	DUCTOAN RESTAURANT	Thanh toan	1
24	970400	6868686868	compact	DUCTOAN RESTAURANT	Thanh toan	1
25	970409	6868686868	compact	DUCTOAN RESTAURANT	Thanh toan	1
26	971025	6868686868	compact	DUCTOAN RESTAURANT	Thanh toan	1
27	971133	6868686868	compact	DUCTOAN RESTAURANT	Thanh toan	1
28	970412	6868686868	compact	DUCTOAN RESTAURANT	Thanh toan	1
29	970414	6868686868	compact	DUCTOAN RESTAURANT	Thanh toan	1
30	970419	6868686868	compact	DUCTOAN RESTAURANT	Thanh toan	1
31	970424	6868686868	compact	DUCTOAN RESTAURANT	Thanh toan	1
32	970425	6868686868	compact	DUCTOAN RESTAURANT	Thanh toan	1
33	970427	6868686868	compact	DUCTOAN RESTAURANT	Thanh toan	1
34	970428	6868686868	compact	DUCTOAN RESTAURANT	Thanh toan	1
35	970430	6868686868	compact	DUCTOAN RESTAURANT	Thanh toan	1
36	970433	6868686868	compact	DUCTOAN RESTAURANT	Thanh toan	1
\.


--
-- Data for Name: vaitro; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vaitro (mavaitro, tenvaitro, mota) FROM stdin;
2	THU_NGAN	Thu ngân tại quầy
3	BEP	Nhân viên bếp
1	QUAN_LY	Quản lý nhà hàng
\.


--
-- Data for Name: yeucaudon; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.yeucaudon (madonhang, id_restaurant, trangthaithanhtoan, thoigianthanhtoan, ngaytaodon, mataikhoan, id_thanhtoan, ghichu, id_giamgia, maban, manhanvien, giosudung, tongtien) FROM stdin;
76	1	đã thanh toán	2026-02-05 09:33:14.621	2026-02-05 16:32:39.190643	1	2	\N	\N	11	\N	2026-02-05 11:31:00	10000
78	1	chưa thanh toán	\N	2026-02-05 17:04:54.629774	66	2	\N	\N	2	9	2026-02-05 10:04:43.593	10000
79	1	đã thanh toán	2026-03-05 18:55:25.731035	2026-03-05 18:54:25.57569	1	2	\N	\N	9	\N	2026-03-05 13:53:00	35000
2	1	đã thanh toán	2026-01-05 17:39:33.545112	2026-01-05 17:39:33.545112	1	1	\N	\N	6	\N	2026-01-05 14:39:00	225000
8	1	đã thanh toán	2026-01-13 09:09:09.813186	2026-01-13 09:09:09.813186	1	1	\N	\N	11	\N	2026-01-13 16:08:00	100000
81	1	chưa thanh toán	\N	2026-03-06 15:52:53.055172	1	1	\N	\N	5	\N	2026-03-06 11:17:00	35000
1	1	đã thanh toán	2026-01-05 17:39:33.545112	2026-01-05 17:31:02.460008	1	2	\N	\N	7	\N	2026-01-05 14:30:00	\N
77	1	đã thanh toán	2026-02-05 17:03:16.147865	2026-02-05 17:01:53.746826	1	2	\N	\N	10	\N	2026-02-05 12:01:00	10000
80	1	chưa thanh toán	\N	2026-03-06 15:51:37.746357	66	1	\N	\N	15	9	2026-03-05 22:15:47.888	45000
82	1	chưa thanh toán	\N	2026-03-06 16:14:10.388169	1	1	\N	\N	5	\N	2026-03-06 13:38:00	32000
83	1	chưa thanh toán	\N	2026-03-06 16:19:33.048217	1	1	\N	\N	9	\N	2026-03-06 21:44:00	32000
\.


--
-- Data for Name: yeuthich; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.yeuthich (mataikhoan, masanpham, ngaythem) FROM stdin;
1	1	2025-12-16 12:52:21.220371
1	3	2025-12-16 12:52:21.220371
2	4	2025-12-16 12:52:21.220371
\.


--
-- Name: ban_maban_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ban_maban_seq', 4, true);


--
-- Name: danhmuc_madanhmuc_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.danhmuc_madanhmuc_seq', 2, true);


--
-- Name: giamgia_id_giamgia_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.giamgia_id_giamgia_seq', 2, true);


--
-- Name: khachhang_mataikhoan_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.khachhang_mataikhoan_seq', 70, true);


--
-- Name: khuyenmai_id_khuyenmai_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.khuyenmai_id_khuyenmai_seq', 2, true);


--
-- Name: listimage_id_anh_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.listimage_id_anh_seq', 170, true);


--
-- Name: nguyenlieu_manguyenlieu_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.nguyenlieu_manguyenlieu_seq', 66, true);


--
-- Name: nhanvien_manhanvien_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.nhanvien_manhanvien_seq', 4, true);


--
-- Name: phieunhapkho_maphieunhap_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.phieunhapkho_maphieunhap_seq', 2, true);


--
-- Name: phieunhapkho_mapieunhap_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.phieunhapkho_mapieunhap_seq', 2, true);


--
-- Name: restaurant_id_restaurant_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.restaurant_id_restaurant_seq', 2, true);


--
-- Name: sanpham_masanpham_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sanpham_masanpham_seq', 25, true);


--
-- Name: thanhtoan_id_thanhtoan_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.thanhtoan_id_thanhtoan_seq', 3, true);


--
-- Name: thongtin_nganhang_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.thongtin_nganhang_id_seq', 36, true);


--
-- Name: vaitro_mavaitro_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vaitro_mavaitro_seq', 3, true);


--
-- Name: yeucaudon_madonhang_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.yeucaudon_madonhang_seq', 3, true);


--
-- Name: danhmuc danhmuc_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.danhmuc
    ADD CONSTRAINT danhmuc_pkey PRIMARY KEY (madanhmuc);


--
-- Name: giamgia giamgia_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.giamgia
    ADD CONSTRAINT giamgia_code_key UNIQUE (code);


--
-- Name: giamgia giamgia_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.giamgia
    ADD CONSTRAINT giamgia_pkey PRIMARY KEY (id_giamgia);


--
-- Name: khachhang khachhang_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.khachhang
    ADD CONSTRAINT khachhang_email_key UNIQUE (email);


--
-- Name: khachhang khachhang_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.khachhang
    ADD CONSTRAINT khachhang_pkey PRIMARY KEY (mataikhoan);


--
-- Name: khuyenmai khuyenmai_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.khuyenmai
    ADD CONSTRAINT khuyenmai_pkey PRIMARY KEY (id_khuyenmai);


--
-- Name: listimage listimage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listimage
    ADD CONSTRAINT listimage_pkey PRIMARY KEY (id_anh);


--
-- Name: nguyenlieu nguyenlieu_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nguyenlieu
    ADD CONSTRAINT nguyenlieu_pkey PRIMARY KEY (manguyenlieu);


--
-- Name: phieunhapkho phieunhapkho_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.phieunhapkho
    ADD CONSTRAINT phieunhapkho_pkey PRIMARY KEY (maphieunhap);


--
-- Name: chitietphieunhap pk_chitietphieunhap; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chitietphieunhap
    ADD CONSTRAINT pk_chitietphieunhap PRIMARY KEY (maphieunhap, manguyenlieu);


--
-- Name: congthuc pk_congthuc; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.congthuc
    ADD CONSTRAINT pk_congthuc PRIMARY KEY (masanpham, manguyenlieu);


--
-- Name: danhgia pk_danhgia; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.danhgia
    ADD CONSTRAINT pk_danhgia PRIMARY KEY (mataikhoan, masanpham);


--
-- Name: nhanvien pk_nhanvien; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nhanvien
    ADD CONSTRAINT pk_nhanvien PRIMARY KEY (manhanvien, id_restaurant);


--
-- Name: ban pk_table; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ban
    ADD CONSTRAINT pk_table PRIMARY KEY (maban, id_restaurant);


--
-- Name: yeucaudon pk_yeucaudon; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.yeucaudon
    ADD CONSTRAINT pk_yeucaudon PRIMARY KEY (madonhang, id_restaurant);


--
-- Name: yeuthich pk_yeuthich; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.yeuthich
    ADD CONSTRAINT pk_yeuthich PRIMARY KEY (mataikhoan, masanpham);


--
-- Name: restaurant restaurant_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurant
    ADD CONSTRAINT restaurant_pkey PRIMARY KEY (id_restaurant);


--
-- Name: sanpham sanpham_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sanpham
    ADD CONSTRAINT sanpham_pkey PRIMARY KEY (masanpham);


--
-- Name: thanhtoan thanhtoan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.thanhtoan
    ADD CONSTRAINT thanhtoan_pkey PRIMARY KEY (id_thanhtoan);


--
-- Name: thongtin_nganhang thongtin_nganhang_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.thongtin_nganhang
    ADD CONSTRAINT thongtin_nganhang_pkey PRIMARY KEY (id);


--
-- Name: khachhang ukp9usvi0nmv01d84ewehqr05nu; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.khachhang
    ADD CONSTRAINT ukp9usvi0nmv01d84ewehqr05nu UNIQUE (firebase_uid);


--
-- Name: vaitro vaitro_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vaitro
    ADD CONSTRAINT vaitro_pkey PRIMARY KEY (mavaitro);


--
-- Name: idx_danhgia_sanpham; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_danhgia_sanpham ON public.danhgia USING btree (masanpham);


--
-- Name: idx_khachhang_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_khachhang_email ON public.khachhang USING btree (email);


--
-- Name: idx_nguyenlieu_restaurant; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_nguyenlieu_restaurant ON public.nguyenlieu USING btree (id_restaurant);


--
-- Name: idx_nhanvien_restaurant; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_nhanvien_restaurant ON public.nhanvien USING btree (id_restaurant);


--
-- Name: idx_sanpham_danhmuc; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sanpham_danhmuc ON public.sanpham USING btree (madanhmuc);


--
-- Name: idx_yeucaudon_khachhang; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_yeucaudon_khachhang ON public.yeucaudon USING btree (mataikhoan);


--
-- Name: idx_yeucaudon_ngaytao; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_yeucaudon_ngaytao ON public.yeucaudon USING btree (ngaytaodon);


--
-- Name: nguyenlieu update_nguyenlieu_modtime; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_nguyenlieu_modtime BEFORE INSERT OR UPDATE ON public.nguyenlieu FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: chitietphieunhap fk_chitietpn_nguyenlieu; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chitietphieunhap
    ADD CONSTRAINT fk_chitietpn_nguyenlieu FOREIGN KEY (manguyenlieu) REFERENCES public.nguyenlieu(manguyenlieu) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: chitietphieunhap fk_chitietpn_phieunhap; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chitietphieunhap
    ADD CONSTRAINT fk_chitietpn_phieunhap FOREIGN KEY (maphieunhap) REFERENCES public.phieunhapkho(maphieunhap) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: chitietyeucau fk_chitietyc_sanpham; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chitietyeucau
    ADD CONSTRAINT fk_chitietyc_sanpham FOREIGN KEY (masanpham) REFERENCES public.sanpham(masanpham) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: chitietyeucau fk_chitietyc_yeucaudon; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chitietyeucau
    ADD CONSTRAINT fk_chitietyc_yeucaudon FOREIGN KEY (madonhang, id_restaurant) REFERENCES public.yeucaudon(madonhang, id_restaurant) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: congthuc fk_congthuc_nguyenlieu; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.congthuc
    ADD CONSTRAINT fk_congthuc_nguyenlieu FOREIGN KEY (manguyenlieu) REFERENCES public.nguyenlieu(manguyenlieu) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: congthuc fk_congthuc_sanpham; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.congthuc
    ADD CONSTRAINT fk_congthuc_sanpham FOREIGN KEY (masanpham) REFERENCES public.sanpham(masanpham) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: danhgia fk_danhgia_khachhang; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.danhgia
    ADD CONSTRAINT fk_danhgia_khachhang FOREIGN KEY (mataikhoan) REFERENCES public.khachhang(mataikhoan) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: danhgia fk_danhgia_sanpham; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.danhgia
    ADD CONSTRAINT fk_danhgia_sanpham FOREIGN KEY (masanpham) REFERENCES public.sanpham(masanpham) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: khuyenmai fk_khuyenmai_sanpham; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.khuyenmai
    ADD CONSTRAINT fk_khuyenmai_sanpham FOREIGN KEY (masanpham) REFERENCES public.sanpham(masanpham) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: listimage fk_listimage_sanpham; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listimage
    ADD CONSTRAINT fk_listimage_sanpham FOREIGN KEY (masanpham) REFERENCES public.sanpham(masanpham) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: nguyenlieu fk_nguyenlieu_restaurant; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nguyenlieu
    ADD CONSTRAINT fk_nguyenlieu_restaurant FOREIGN KEY (id_restaurant) REFERENCES public.restaurant(id_restaurant) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: nhanvien fk_nhanvien_restaurant; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nhanvien
    ADD CONSTRAINT fk_nhanvien_restaurant FOREIGN KEY (id_restaurant) REFERENCES public.restaurant(id_restaurant) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: nhanvien fk_nhanvien_vaitro; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nhanvien
    ADD CONSTRAINT fk_nhanvien_vaitro FOREIGN KEY (mavaitro) REFERENCES public.vaitro(mavaitro) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: phieunhapkho fk_phieunhap_restaurant; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.phieunhapkho
    ADD CONSTRAINT fk_phieunhap_restaurant FOREIGN KEY (id_restaurant) REFERENCES public.restaurant(id_restaurant) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: thongtin_nganhang fk_restaurant_bank; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.thongtin_nganhang
    ADD CONSTRAINT fk_restaurant_bank FOREIGN KEY (id_restaurant) REFERENCES public.restaurant(id_restaurant) ON DELETE CASCADE;


--
-- Name: sanpham fk_sanpham_danhmuc; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sanpham
    ADD CONSTRAINT fk_sanpham_danhmuc FOREIGN KEY (madanhmuc) REFERENCES public.danhmuc(madanhmuc) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ban fk_table_restaurant; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ban
    ADD CONSTRAINT fk_table_restaurant FOREIGN KEY (id_restaurant) REFERENCES public.restaurant(id_restaurant) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: yeucaudon fk_yeucaudon_giamgia; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.yeucaudon
    ADD CONSTRAINT fk_yeucaudon_giamgia FOREIGN KEY (id_giamgia) REFERENCES public.giamgia(id_giamgia) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: yeucaudon fk_yeucaudon_khachhang; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.yeucaudon
    ADD CONSTRAINT fk_yeucaudon_khachhang FOREIGN KEY (mataikhoan) REFERENCES public.khachhang(mataikhoan) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: yeucaudon fk_yeucaudon_nhanvien; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.yeucaudon
    ADD CONSTRAINT fk_yeucaudon_nhanvien FOREIGN KEY (manhanvien, id_restaurant) REFERENCES public.nhanvien(manhanvien, id_restaurant) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: yeucaudon fk_yeucaudon_table; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.yeucaudon
    ADD CONSTRAINT fk_yeucaudon_table FOREIGN KEY (maban, id_restaurant) REFERENCES public.ban(maban, id_restaurant) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: yeucaudon fk_yeucaudon_thanhtoan; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.yeucaudon
    ADD CONSTRAINT fk_yeucaudon_thanhtoan FOREIGN KEY (id_thanhtoan) REFERENCES public.thanhtoan(id_thanhtoan) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: yeuthich fk_yeuthich_khachhang; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.yeuthich
    ADD CONSTRAINT fk_yeuthich_khachhang FOREIGN KEY (mataikhoan) REFERENCES public.khachhang(mataikhoan) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: yeuthich fk_yeuthich_sanpham; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.yeuthich
    ADD CONSTRAINT fk_yeuthich_sanpham FOREIGN KEY (masanpham) REFERENCES public.sanpham(masanpham) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: restaurant fkfi89ux8lkl1c8u5u95l8omvvd; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurant
    ADD CONSTRAINT fkfi89ux8lkl1c8u5u95l8omvvd FOREIGN KEY (parent_id) REFERENCES public.restaurant(id_restaurant);


--
-- PostgreSQL database dump complete
--

\unrestrict gogUtybHmlVmCOm50jfNlKzQZ5qd2lt2BPh711bupsGXs5Tkw6r1lc7bc9Ff10q

