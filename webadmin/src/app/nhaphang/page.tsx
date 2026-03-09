'use client';
import React, { useState } from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    Paper,
    Box,
    InputAdornment,
    Divider,
    Stack,
    CircularProgress,
    Snackbar,
    Alert,
    AlertColor,
} from '@mui/material';
// Sử dụng Grid2 để tương thích hoàn toàn với MUI v6 và prop "size"
import Grid from '@mui/material/Grid';
import {
    Inventory2,
    AttachMoney,
    Numbers,
    Public,
    AddShoppingCart,
    Scale,
    Close,
} from '@mui/icons-material';
import { useRouter } from "next/navigation";

const NhapHangPage = () => {
    const router = useRouter();

    const [tenNguyenLieu, setTenNguyenLieu] = useState('');
    const [donViTinh, setDonViTinh] = useState('');
    const [soLuong, setSoLuong] = useState('');
    const [giaNhap, setGiaNhap] = useState('');
    const [xuatXu, setXuatXu] = useState('');

    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState<{ open: boolean; message: string; severity: AlertColor }>({
        open: false,
        message: '',
        severity: 'info'
    });

    const clearForm = () => {
        setTenNguyenLieu('');
        setDonViTinh('');
        setSoLuong('');
        setGiaNhap('');
        setXuatXu('');
    };

    const handleImport = async () => {
        if (!tenNguyenLieu || !donViTinh || !soLuong || !giaNhap) {
            setFeedback({ open: true, message: 'Vui lòng điền tất cả các trường bắt buộc.', severity: 'warning' });
            return;
        }
        setLoading(true);
        try {
            const response = await fetch('/api/nhaphang', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tenNguyenLieu,
                    donViTinh,
                    soLuong: Number(soLuong),
                    giaNhap: Number(giaNhap),
                    xuatXu,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Có lỗi xảy ra từ server.');
            }

            setFeedback({ open: true, message: 'Nhập hàng thành công!', severity: 'success' });
            clearForm();

            setTimeout(() => router.push('/khohang'), 1500);
        } catch (error: unknown) {
            console.error("Fetch error: ", error);

            // CÁCH SỬA LỖI TS18046: Kiểm tra xem error có phải instance của Error không
            let errorMessage = 'Không thể kết nối đến server.';
            if (error instanceof Error) {
                errorMessage = error.message;
            }

            setFeedback({
                open: true,
                message: errorMessage,
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (window.confirm('Bạn có chắc chắn muốn hủy và quay lại trang kho hàng?')) {
            router.push("/khohang");
        }
    };

    const handleCloseFeedback = (_?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return;
        setFeedback({ ...feedback, open: false });
    };

    return (
        <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
            <Paper
                elevation={4}
                sx={{
                    p: { xs: 3, md: 5 },
                    borderRadius: 3,
                    backgroundColor: '#ffffff'
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Inventory2 color="primary" sx={{ fontSize: 36, mr: 2 }} />
                    <Typography variant="h4" component="h1" fontWeight="700" color="text.primary">
                        Nhập Nguyên Liệu Mới
                    </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, ml: 6 }}>
                    Điền đầy đủ thông tin chi tiết để thêm nguyên liệu vào kho lưu trữ.
                </Typography>

                <Divider sx={{ mb: 4 }} />

                <Box component="form" noValidate autoComplete="off">
                    <Grid container spacing={4}>
                        <Grid size={12}>
                            <TextField
                                fullWidth
                                required
                                label="Tên nguyên liệu"
                                placeholder="VD: Trà đen nguyên lá..."
                                value={tenNguyenLieu}
                                onChange={(e) => setTenNguyenLieu(e.target.value)}
                                variant="outlined"
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Inventory2 fontSize="small" color="action" />
                                            </InputAdornment>
                                        ),
                                    }
                                }}
                            />
                        </Grid>

                        <Grid size={12}>
                            <TextField
                                fullWidth
                                required
                                label="Đơn vị tính"
                                placeholder="VD: Kg, Lít, Gói, Cái..."
                                value={donViTinh}
                                onChange={(e) => setDonViTinh(e.target.value)}
                                variant="outlined"
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Scale fontSize="small" color="action" />
                                            </InputAdornment>
                                        ),
                                    }
                                }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                required
                                label="Số lượng"
                                type="number"
                                placeholder="0"
                                value={soLuong}
                                onChange={(e) => setSoLuong(e.target.value)}
                                variant="outlined"
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Numbers fontSize="small" color="action" />
                                            </InputAdornment>
                                        ),
                                    }
                                }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                required
                                label="Giá nhập"
                                type="number"
                                placeholder="0"
                                value={giaNhap}
                                onChange={(e) => setGiaNhap(e.target.value)}
                                variant="outlined"
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AttachMoney fontSize="small" color="action" />
                                            </InputAdornment>
                                        ),
                                        endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,
                                    }
                                }}
                            />
                        </Grid>

                        <Grid size={12}>
                            <TextField
                                fullWidth
                                label="Xuất xứ"
                                placeholder="VD: Việt Nam, Mỹ, Nhật Bản..."
                                value={xuatXu}
                                onChange={(e) => setXuatXu(e.target.value)}
                                variant="outlined"
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Public fontSize="small" color="action" />
                                            </InputAdornment>
                                        ),
                                    }
                                }}
                            />
                        </Grid>

                        <Grid size={12} sx={{ mt: 2 }}>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    onClick={handleImport}
                                    size="large"
                                    disabled={loading}
                                    startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <AddShoppingCart />}
                                    sx={{ py: 1.5, fontSize: '1.1rem', fontWeight: 'bold', borderRadius: 2, textTransform: 'none' }}
                                >
                                    {loading ? 'Đang xử lý...' : 'Xác nhận Nhập Hàng'}
                                </Button>

                                <Button
                                    fullWidth
                                    variant="outlined"
                                    color="error"
                                    onClick={handleCancel}
                                    size="large"
                                    disabled={loading}
                                    startIcon={<Close />}
                                    sx={{ py: 1.5, fontSize: '1.1rem', fontWeight: 'bold', borderRadius: 2, textTransform: 'none' }}
                                >
                                    Hủy bỏ
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
            <Snackbar
                open={feedback.open}
                autoHideDuration={6000}
                onClose={handleCloseFeedback}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseFeedback} severity={feedback.severity} variant="filled" sx={{ width: '100%' }}>
                    {feedback.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default NhapHangPage;