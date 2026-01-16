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
    SafeAreaView,
    Image,
    Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';


interface Message {
    id: string;
    text: string;
    sender: 'user' | 'restaurant';
    time: string;
}

const ChatScreen = () => {
    const router = useRouter();
    const flatListRef = useRef<FlatList>(null);
    const [inputText, setInputText] = useState('');


    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: 'Xin chào! Nhà hàng có thể giúp gì cho bạn?', sender: 'restaurant', time: '10:00 AM' },
        { id: '2', text: 'Mình muốn đặt bàn cho 2 người vào tối nay.', sender: 'user', time: '10:05 AM' },
        { id: '3', text: 'Vâng, bạn muốn đặt lúc mấy giờ ạ?', sender: 'restaurant', time: '10:06 AM' },
    ]);


    const handleSend = () => {
        if (inputText.trim().length === 0) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            text: inputText,
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages(prevMessages => [...prevMessages, newMessage]);
        setInputText('');
    };


    useEffect(() => {
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    }, [messages]);


    const renderMessageItem = ({ item }: { item: Message }) => {
        const isUser = item.sender === 'user';
        return (
            <View style={[
                styles.messageBubbleContainer,
                isUser ? styles.userMessageContainer : styles.restaurantMessageContainer
            ]}>
                {!isUser && (
                    <Image
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/4000/4000523.png' }}
                        style={styles.avatarTiny}
                    />
                )}
                <View style={[
                    styles.messageBubble,
                    isUser ? styles.userBubble : styles.restaurantBubble
                ]}>
                    <Text style={[styles.messageText, isUser ? styles.userText : styles.restaurantText]}>
                        {item.text}
                    </Text>
                    <Text style={[styles.timeText, isUser ? styles.userTimeText : styles.restaurantTimeText]}>
                        {item.time}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>

                    <View style={styles.headerInfo}>
                        <Text style={styles.headerTitle}>Nhà hàng ABC</Text>
                        <View style={styles.statusContainer}>
                            <View style={styles.statusDot} />
                            <Text style={styles.statusText}>Đang hoạt động</Text>
                        </View>
                    </View>

                </View>


                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessageItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.chatContent}
                    showsVerticalScrollIndicator={false}
                />


                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
                >
                    <View style={styles.inputContainer}>


                        <TextInput
                            style={styles.input}
                            value={inputText}
                            onChangeText={setInputText}
                            placeholder="Nhập tin nhắn..."
                            placeholderTextColor="#999"
                            multiline
                        />

                        <TouchableOpacity
                            style={[styles.sendButton, { backgroundColor: inputText.trim() ? '#007AFF' : '#E5E5EA' }]}
                            onPress={handleSend}
                            disabled={!inputText.trim()}
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
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    backButton: {
        marginRight: 15,
    },
    headerInfo: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4CD964',
        marginRight: 5,
    },
    statusText: {
        fontSize: 12,
        color: '#888',
    },
    callButton: {
        padding: 8,
        backgroundColor: '#F0F8FF',
        borderRadius: 20,
    },


    chatContent: {
        padding: 15,
        paddingBottom: 20,
    },
    messageBubbleContainer: {
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    userMessageContainer: {
        justifyContent: 'flex-end',
    },
    restaurantMessageContainer: {
        justifyContent: 'flex-start',
    },
    avatarTiny: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 8,
        backgroundColor: '#ddd',
    },
    messageBubble: {
        maxWidth: '75%',
        padding: 12,
        borderRadius: 20,
    },

    userBubble: {
        backgroundColor: '#007AFF',
        borderBottomRightRadius: 2,
    },

    restaurantBubble: {
        backgroundColor: '#E5E5EA',
        borderBottomLeftRadius: 2,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 22,
    },
    userText: {
        color: '#fff',
    },
    restaurantText: {
        color: '#000',
    },
    timeText: {
        fontSize: 10,
        marginTop: 5,
        alignSelf: 'flex-end',
    },
    userTimeText: {
        color: 'rgba(255,255,255,0.7)',
    },
    restaurantTimeText: {
        color: '#888',
    },


    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    attachButton: {
        padding: 5,
    },
    input: {
        flex: 1,
        backgroundColor: '#F2F2F7',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginHorizontal: 10,
        fontSize: 16,
        maxHeight: 100,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ChatScreen;
