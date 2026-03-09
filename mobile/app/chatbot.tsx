import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';


import api, { ENDPOINTS } from '@/constants/api';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
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

            const response = await api.post(ENDPOINTS.AI_CHAT, {
                message: messageToSend
            });


            let botResponseText = '';
            if (typeof response.data === 'string') {
                botResponseText = response.data;
            } else if (response.data.reply) {
                botResponseText = response.data.reply;
            } else if (response.data.text) {
                botResponseText = response.data.text;
            } else {
                botResponseText = JSON.stringify(response.data);
            }

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: botResponseText,
                sender: 'bot',
            };
            setMessages(prev => [...prev, botMessage]);

        } catch (error) {
            console.error("Lỗi gọi API Chatbot:", error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: 'Server đang bận hoặc mất kết nối. Vui lòng thử lại sau.',
                sender: 'bot',
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };



    useEffect(() => {
        if (flatListRef.current) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [messages]);

    const renderMessageItem = ({ item }: { item: Message }) => {
        const isUser = item.sender === 'user';
        return (
            <View style={[
                styles.messageBubbleContainer,
                isUser ? styles.userMessageContainer : styles.botMessageContainer
            ]}>
                <View style={[
                    styles.messageBubble,
                    isUser ? styles.userBubble : styles.botBubble
                ]}>
                    <Text style={isUser ? styles.userText : styles.botText}>
                        {item.text}
                    </Text>
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
                        <Text style={{marginLeft: 10, color: '#888', fontSize: 12}}>Đang soạn câu trả lời...</Text>
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
    messageBubble: { maxWidth: '80%', padding: 14, borderRadius: 20 },
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