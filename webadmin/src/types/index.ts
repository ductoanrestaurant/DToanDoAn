export interface VaiTro {
  maVaiTro: number;
  tenVaiTro: string;
}

export interface NhanVienId {
  maNhanVien: number;
  idRestaurant: number;
}

export interface Employee {
  id: NhanVienId;
  tenNhanVien: string;
  email: string;
  vaiTro: VaiTro;
  trangthai: boolean;
}

export interface KhoHang {
  id: number;
  tenNguyenLieu: string;
  soLuong: number;
  donVi: string;
  ngayHetHan?: string;
}
