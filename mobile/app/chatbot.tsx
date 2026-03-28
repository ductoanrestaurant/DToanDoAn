import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    TextInput, FlatList, KeyboardAvoidingView,
    Platform, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { BASE_URL, ENDPOINTS } from '@/constants/api';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    paymentOptions?: PaymentOptionsData; // chi render neu co
}

interface PaymentOptionsData {
    orderId: number;
    idRestaurant: number;
    tongTien: number;
    viHienTai: number;
    monDat: string;
    soNguoi: number;
    gioSuDung: string;
    maBan: number;
}

const ChatbotScreen = () => {
    const router = useRouter();
    const flatListRef = useRef<FlatList>(null);
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: 'Xin chào! Tôi là trợ lý ảo của nhà hàng Đức Toàn. Bạn cần tư vấn món gì không?', sender: 'bot' }
    ]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (inputText.trim().length === 0) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputText,
            sender: 'user',
        };

        setMessages(prev => [...prev, userMessage]);
        const messageToSend = inputText;
        setInputText('');
        setIsLoading(true);

        try {
            const response = await api.post(ENDPOINTS.AI_CHAT, { message: messageToSend });
            const data = response.data;

            // Kiem tra action dac biet tu backend
            if (data.action === 'SHOW_PAYMENT_OPTIONS' && data.data) {
                const parsedData: PaymentOptionsData = JSON.parse(data.data);
                const botMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    text: data.reply,
                    sender: 'bot',
                    paymentOptions: parsedData,
                };
                setMessages(prev => [...prev, botMessage]);
            } else {
                // Chat binh thuong
                let botResponseText = '';
                if (typeof data === 'string') botResponseText = data;
                else if (data.reply) botResponseText = data.reply;
                else if (data.text) botResponseText = data.text;
                else botResponseText = JSON.stringify(data);

                setMessages(prev => [...prev, {
                    id: (Date.now() + 1).toString(),
                    text: botResponseText,
                    sender: 'bot',
                }]);
            }
        } catch (error) {
            console.error("Lỗi gọi API Chatbot:", error);
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                text: 'Server đang bận hoặc mất kết nối. Vui lòng thử lại sau.',
                sender: 'bot',
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePayment = async (method: 'cash' | 'transfer' | 'wallet', options: PaymentOptionsData) => {
        const { orderId, idRestaurant, tongTien, viHienTai } = options;

        if (method === 'wallet' && viHienTai < tongTien) {
            Alert.alert('Không đủ số dư', `Số dư ví: ${viHienTai.toLocaleString('vi-VN')}đ\nCần: ${tongTien.toLocaleString('vi-VN')}đ`);
            return;
        }

        try {
            setIsLoading(true);

            if (method === 'cash') {
                // Cap nhat phuong thuc tien mat
                await api.patch(`${ENDPOINTS.YEU_CAU_DON}/${orderId}/${idRestaurant}/thanh-toan`, {
                    trangThaiThanhToan: 'Chưa thanh toán',
                    idThanhToan: 1,
                });
                const confirmMsg = `✅ Đặt bàn thành công!\n• Mã đơn: #${orderId}\n• Bàn số: ${options.maBan}\n• Số khách: ${options.soNguoi} người\n• Giờ đến: ${options.gioSuDung}\n• Món: ${options.monDat}\n• Tổng tiền: ${tongTien.toLocaleString('vi-VN')}đ\n• Thanh toán: Tiền mặt tại quầy\n\nCảm ơn anh/chị! 🙏`;
                setMessages(prev => [...prev, { id: Date.now().toString(), text: confirmMsg, sender: 'bot' }]);

            } else if (method === 'wallet') {
                // Cap nhat phuong thuc vi va tru diem
                await api.patch(`${ENDPOINTS.YEU_CAU_DON}/${orderId}/${idRestaurant}/thanh-toan`, {
                    trangThaiThanhToan: 'đã thanh toán',
                    idThanhToan: 3,
                });
                // Lay ma tai khoan tu AsyncStorage de tru diem
                const customerInfoStr = await AsyncStorage.getItem('customerInfo');
                if (customerInfoStr) {
                    const customerInfo = JSON.parse(customerInfoStr);
                    const maKhachHang = customerInfo.maKhachHang || customerInfo.maTaiKhoan;
                    if (maKhachHang) {
                        await api.post(`${ENDPOINTS.KHACH_HANG}/${maKhachHang}/tru-diem`, { diem: tongTien });
                    }
                }
                const confirmMsg = `✅ Thanh toán bằng ví thành công!\n• Mã đơn: #${orderId}\n• Bàn số: ${options.maBan}\n• Số khách: ${options.soNguoi} người\n• Giờ đến: ${options.gioSuDung}\n• Món: ${options.monDat}\n• Đã trừ ví: ${tongTien.toLocaleString('vi-VN')}đ\n\nCảm ơn anh/chị! 🙏`;
                setMessages(prev => [...prev, { id: Date.now().toString(), text: confirmMsg, sender: 'bot' }]);

            } else if (method === 'transfer') {
                // Tao PayOS payment URL
                const paymentResponse = await api.post(ENDPOINTS.CREATE_PAYOS_PAYMENT, {
                    amount: Math.round(tongTien),
                    orderId,
                    returnUrl: `${BASE_URL}/payment/success`,
                    cancelUrl: `${BASE_URL}/payment/cancel`,
                });
                const paymentUrl = paymentResponse.data.checkoutUrl;
                if (paymentUrl) {
                    router.push({
                        pathname: '/PaymentWebView',
                        params: {
                            url: paymentUrl,
                            orderId: orderId.toString(),
                            idRestaurant: idRestaurant.toString(),
                            idThanhToan: '2',
                            returnScreen: '/chatbot',
                        }
                    });
                } else {
                    throw new Error('Không tạo được link thanh toán.');
                }
            }
        } catch (err: any) {
            console.error('Payment error:', err);
            Alert.alert('Lỗi', `Không thể xử lý thanh toán: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (flatListRef.current) {
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
        }
    }, [messages]);

    const renderMessageItem = ({ item }: { item: Message }) => {
        const isUser = item.sender === 'user';
        return (
            <View style={[styles.messageBubbleContainer, isUser ? styles.userMessageContainer : styles.botMessageContainer]}>
                <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.botBubble]}>
                    <Text style={isUser ? styles.userText : styles.botText}>{item.text}</Text>

                    {/* Render 3 nut thanh toan neu co paymentOptions */}
                    {item.paymentOptions && (
                        <PaymentButtons
                            data={item.paymentOptions}
                            onSelect={handlePayment}
                        />
                    )}
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Trợ lý Đức Toàn</Text>
                    <View style={{ width: 24 }} />
                </View>

                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessageItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.chatContent}
                    showsVerticalScrollIndicator={false}
                />

                {isLoading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color="#FF6600" />
                        <Text style={{ marginLeft: 10, color: '#888', fontSize: 12 }}>Đang xử lý...</Text>
                    </View>
                )}

                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
                >
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={inputText}
                            onChangeText={setInputText}
                            placeholder="Hỏi về menu, đặt bàn..."
                            placeholderTextColor="#999"
                            multiline
                        />
                        <TouchableOpacity
                            style={[styles.sendButton, { backgroundColor: inputText.trim() ? '#FF6600' : '#E5E5EA' }]}
                            onPress={handleSend}
                            disabled={!inputText.trim() || isLoading}
                        >
                            <Ionicons name="send" size={20} color={inputText.trim() ? "#fff" : "#A0A0A0"} />
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
    );
};

// Component hien thi 3 nut thanh toan
const PaymentButtons = ({
    data,
    onSelect,
}: {
    data: PaymentOptionsData;
    onSelect: (method: 'cash' | 'transfer' | 'wallet', data: PaymentOptionsData) => void;
}) => {
    const viDu = data.viHienTai < data.tongTien;

    return (
        <View style={btnStyles.container}>
            <Text style={btnStyles.label}>Chọn phương thức:</Text>
            <View style={btnStyles.row}>
                {/* Tien mat */}
                <TouchableOpacity style={btnStyles.btn} onPress={() => onSelect('cash', data)}>
                    <Ionicons name="cash-outline" size={22} color="#fff" />
                    <Text style={btnStyles.btnText}>Tiền mặt</Text>
                </TouchableOpacity>

                {/* Chuyen khoan */}
                <TouchableOpacity style={[btnStyles.btn, btnStyles.btnTransfer]} onPress={() => onSelect('transfer', data)}>
                    <Ionicons name="qr-code-outline" size={22} color="#fff" />
                    <Text style={btnStyles.btnText}>Chuyển khoản</Text>
                </TouchableOpacity>

                {/* Vi - disabled neu khong du so du */}
                <TouchableOpacity
                    style={[btnStyles.btn, btnStyles.btnWallet, viDu && btnStyles.btnDisabled]}
                    onPress={() => !viDu && onSelect('wallet', data)}
                    disabled={viDu}
                    activeOpacity={viDu ? 1 : 0.7}
                >
                    <Ionicons name="wallet-outline" size={22} color={viDu ? '#aaa' : '#fff'} />
                    <Text style={[btnStyles.btnText, viDu && btnStyles.btnTextDisabled]}>Ví</Text>
                    <Text style={[btnStyles.walletBalance, viDu && btnStyles.btnTextDisabled]}>
                        {data.viHienTai.toLocaleString('vi-VN')}đ
                    </Text>
                    {viDu && <Text style={btnStyles.insufficientLabel}>Không đủ</Text>}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const btnStyles = StyleSheet.create({
    container: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.1)' },
    label: { fontSize: 13, color: '#555', marginBottom: 8 },
    row: { flexDirection: 'row', gap: 8 },
    btn: { flex: 1, backgroundColor: '#27AE60', borderRadius: 10, paddingVertical: 10, alignItems: 'center', gap: 4 },
    btnTransfer: { backgroundColor: '#2980B9' },
    btnWallet: { backgroundColor: '#FF6600' },
    btnDisabled: { backgroundColor: '#E0E0E0' },
    btnText: { color: '#fff', fontSize: 11, fontWeight: '600' },
    btnTextDisabled: { color: '#aaa' },
    walletBalance: { fontSize: 10, color: 'rgba(255,255,255,0.85)' },
    insufficientLabel: { fontSize: 9, color: '#999', marginTop: 1 },
});

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fff' },
    container: { flex: 1, backgroundColor: '#F5F5F5' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
    backButton: { padding: 5 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    chatContent: { padding: 15, paddingBottom: 20 },
    messageBubbleContainer: { marginBottom: 15, flexDirection: 'row' },
    userMessageContainer: { justifyContent: 'flex-end' },
    botMessageContainer: { justifyContent: 'flex-start' },
    messageBubble: { maxWidth: '85%', padding: 14, borderRadius: 20 },
    userBubble: { backgroundColor: '#FF6600', borderBottomRightRadius: 4 },
    botBubble: { backgroundColor: '#E5E5EA', borderBottomLeftRadius: 4 },
    userText: { color: '#fff', fontSize: 15 },
    botText: { color: '#000', fontSize: 15 },
    loadingContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 25, paddingBottom: 10 },
    inputContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 10, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E0E0E0' },
    input: { flex: 1, backgroundColor: '#F2F2F7', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, marginRight: 10, fontSize: 16, maxHeight: 100 },
    sendButton: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
});

export default ChatbotScreen;