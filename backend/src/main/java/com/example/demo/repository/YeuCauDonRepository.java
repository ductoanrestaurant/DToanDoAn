package com.example.demo.repository;

import com.example.demo.entity.YeuCauDon;
import com.example.demo.entity.YeuCauDonId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface YeuCauDonRepository extends JpaRepository<YeuCauDon, YeuCauDonId> {
    @Query("SELECT y FROM YeuCauDon y WHERE y.id.idRestaurant = :idRestaurant")
    List<YeuCauDon> findByIdRestaurant(Integer idRestaurant);

    @Query("SELECT y FROM YeuCauDon y WHERE y.maTaiKhoan = :maTaiKhoan")
    List<YeuCauDon> findByMaTaiKhoan(Integer maTaiKhoan);

    @Query("SELECT y FROM YeuCauDon y WHERE y.trangThaiThanhToan = :trangThai")
    List<YeuCauDon> findByTrangThaiThanhToan(String trangThai);

    @Query("SELECT MAX(y.id.maDonHang) FROM YeuCauDon y WHERE y.id.idRestaurant = :idRestaurant")
    Optional<Integer> findMaxMaDonHangByIdRestaurant(@Param("idRestaurant") Integer idRestaurant);

    @Query("SELECT new map(month(y.ngayTaoDon) as month, count(y.id.maDonHang) as orderCount) " +
            "FROM YeuCauDon y " +
            "WHERE year(y.ngayTaoDon) = :year " +
            "GROUP BY month(y.ngayTaoDon) " +
            "ORDER BY month(y.ngayTaoDon)")
    List<Map<String, Object>> countOrdersByMonth(@Param("year") int year);

    @Query(value = "SELECT TO_CHAR(y.ngaytaodon, 'YYYY-MM-DD') as day, COUNT(y.madonhang) as orderCount " +
            "FROM yeucaudon y " +
            "WHERE y.ngaytaodon >= date_trunc('week', CURRENT_DATE) " +
            "AND y.ngaytaodon < date_trunc('week', CURRENT_DATE) + interval '1 week' " +
            "GROUP BY day " +
            "ORDER BY day", nativeQuery = true)
    List<Map<String, Object>> countOrdersByDay();

    // Tìm các đơn hàng của một bàn trong khoảng thời gian nhất định,
    // CHỈ lấy đơn có ít nhất 1 chiTiet KHÔNG phải Đã hủy / hoàn thành
    // (đơn bị hủy không được chiếm bàn)
    @Query("SELECT y FROM YeuCauDon y " +
            "WHERE y.id.idRestaurant = :idRestaurant " +
            "AND y.maBan = :maBan " +
            "AND y.gioSuDung BETWEEN :start AND :end " +
            "AND y.id.maDonHang IN (" +
            "    SELECT DISTINCT c.id.maDonHang FROM ChiTietYeuCauDon c " +
            "    WHERE c.id.idRestaurant = :idRestaurant " +
            "    AND c.trangThai NOT IN ('\u0110\u00e3 h\u1ee7y', 'ho\u00e0n th\u00e0nh')" +
            ")")
    List<YeuCauDon> findByBanAndGioSuDungBetween(
            @Param("idRestaurant") Integer idRestaurant,
            @Param("maBan") Integer maBan,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);


    @Query("SELECT DISTINCT y.maBan FROM YeuCauDon y " +
            "WHERE y.id.idRestaurant = :idRestaurant " +
            "AND y.gioSuDung BETWEEN :start AND :end " +
            "AND y.id.maDonHang IN (" +
            "    SELECT DISTINCT c.id.maDonHang FROM ChiTietYeuCauDon c " +
            "    WHERE c.id.idRestaurant = :idRestaurant " +
            "    AND c.trangThai NOT IN ('Đã hủy', 'hoàn thành')" +
            ")")
    List<Integer> findMaBanByRestaurantAndGioSuDungBetween(
            @Param("idRestaurant") Integer idRestaurant,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    @Query("SELECT y.id.maDonHang FROM YeuCauDon y")
    List<Integer> findAllMaDonHang();

    //  Query tính Tổng doanh thu trong khoảng thời gian
    @Query(value = "SELECT TO_CHAR(y.giosudung, 'YYYY-MM') as month, SUM(y.tongtien) as total " +
            "FROM yeucaudon y " +
            "WHERE EXISTS (" +
            "    SELECT 1 FROM chitietyeucau c " +
            "    WHERE y.madonhang = c.madonhang " +
            "    AND y.id_restaurant = c.id_restaurant " +
            "    AND lower(c.trangthai) = 'hoàn thành'" +
            ") " +
            "GROUP BY TO_CHAR(y.giosudung, 'YYYY-MM')", nativeQuery = true)
    List<Map<String, Object>> getDoanhThuTheoThang();

    @Query(value = "SELECT TO_CHAR(y.giosudung, 'YYYY-MM-DD') as day, SUM(y.tongtien) as total " +
            "FROM yeucaudon y " +
            "WHERE (y.giosudung::date >= date_trunc('week', CURRENT_DATE)::date AND y.giosudung::date <= CURRENT_DATE) " +
            "AND EXISTS (" +
            "    SELECT 1 FROM chitietyeucau c " +
            "    WHERE y.madonhang = c.madonhang " +
            "    AND y.id_restaurant = c.id_restaurant " +
            "    AND lower(c.trangthai) = 'hoàn thành'" +
            ") " +
            "GROUP BY TO_CHAR(y.giosudung, 'YYYY-MM-DD') " +
            "ORDER BY day", nativeQuery = true)
    List<Map<String, Object>> getDoanhThuTheoNgay();

    @Query("SELECT COUNT(y) FROM YeuCauDon y " +
            "WHERE cast(y.gioSuDung as date) = current_date " +
            "AND y.trangThaiThanhToan = 'đã thanh toán'")
    Long tongDonHomNay();

    @Query("SELECT COUNT(y) FROM YeuCauDon y " +
            "WHERE MONTH(y.gioSuDung) = MONTH(current_date) " +
            "AND YEAR(y.gioSuDung) = YEAR(current_date) " +
            "AND y.trangThaiThanhToan = 'đã thanh toán'")
    Long tongDonThangNay();

}
