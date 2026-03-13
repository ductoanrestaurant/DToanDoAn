package com.example.demo.repository;

import com.example.demo.entity.ChiTietYeuCauDon;
import com.example.demo.entity.ChiTietYeuCauDonId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChiTietYeuCauDonRepository extends JpaRepository<ChiTietYeuCauDon, ChiTietYeuCauDonId> {

  @Query("SELECT c.id.maDonHang FROM ChiTietYeuCauDon c WHERE c.trangThai IN ('hoàn thành', 'Đã hủy')")
  List<Integer> findMaDonHangByTrangThaiNot();

  /**
   * Lấy danh sách ChiTietYeuCauDon có trangThai = 'hoàn thành'
   * thuộc các đơn hàng của khách hàng (maTaiKhoan),
   * và sản phẩm đó chưa được khách đánh giá.
   */
  @Query("""
          SELECT c FROM ChiTietYeuCauDon c
          JOIN YeuCauDon y ON y.id.maDonHang = c.id.maDonHang
                          AND y.id.idRestaurant = c.id.idRestaurant
          WHERE y.maTaiKhoan = :maTaiKhoan
            AND c.trangThai = 'hoàn thành'
            AND NOT EXISTS (
                SELECT 1 FROM DanhGia d
                WHERE d.id.maTaiKhoan = :maTaiKhoan
                  AND d.id.maSanPham  = c.id.maSanPham
            )
      """)
  List<ChiTietYeuCauDon> findChuaDanhGiaByKhachHang(@Param("maTaiKhoan") Integer maTaiKhoan);

  /**
   * Lấy danh sách ChiTietYeuCauDon có trangThai = 'hoàn thành'
   * thuộc một đơn hàng cụ thể, và sản phẩm chưa được khách đánh giá.
   */
  @Query("""
          SELECT c FROM ChiTietYeuCauDon c
          WHERE c.id.maDonHang   = :maDonHang
            AND c.id.idRestaurant = :idRestaurant
            AND c.trangThai = 'hoàn thành'
            AND NOT EXISTS (
                SELECT 1 FROM DanhGia d
                WHERE d.id.maTaiKhoan = :maTaiKhoan
                  AND d.id.maSanPham  = c.id.maSanPham
            )
      """)
  List<ChiTietYeuCauDon> findChuaDanhGiaByDon(
      @Param("maDonHang") Integer maDonHang,
      @Param("idRestaurant") Integer idRestaurant,
      @Param("maTaiKhoan") Integer maTaiKhoan);

  /**
   * Lấy TẤT CẢ sản phẩm có trangThai = 'hoàn thành' trong một đơn cụ thể,
   * không lọc đã/chưa đánh giá. Mobile sẽ tự mark món đã đánh giá là disabled.
   */
  @Query("""
          SELECT c FROM ChiTietYeuCauDon c
          WHERE c.id.maDonHang   = :maDonHang
            AND c.id.idRestaurant = :idRestaurant
            AND c.trangThai = 'hoàn thành'
      """)
  List<ChiTietYeuCauDon> findHoanThanhByDon(
      @Param("maDonHang") Integer maDonHang,
      @Param("idRestaurant") Integer idRestaurant);
}
