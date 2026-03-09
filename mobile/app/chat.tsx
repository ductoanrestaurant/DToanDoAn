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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../constants/firebase';
import {
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
    doc,
    setDoc,
    getDoc,
    updateDoc
} from 'firebase/firestore';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'restaurant';
    time: string;
    senderUID?: string;
}

const ADMIN_ID = 'admin_user_id';

const ChatScreen = () => {
    const router = useRouter();
    const flatListRef = useRef<FlatList>(null);
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [customerName, setCustomerName] = useState<string | null>(null);
    const [conversationId, setConversationId] = useState<string | null>(null);

    // Lấy userId và customerName từ AsyncStorage
    useEffect(() => {
        const loadUserData = async () => {
            const storedUserId = await AsyncStorage.getItem('userId');
            const storedCustomerName = await AsyncStorage.getItem('customerName');
            if (storedUserId) {
                const fullUserId = `customer_${storedUserId}`;
                setUserId(fullUserId);
                setCustomerName(storedCustomerName || `Khách hàng ${storedUserId}`);
                const convoId = [ADMIN_ID, fullUserId].sort().join('_');
                setConversationId(convoId);
            }
        };
        loadUserData();
    }, []);

    // Lắng nghe tin nhắn
    useEffect(() => {
        if (!conversationId) return;

        const messagesColRef = collection(db, 'conversations', conversationId, 'messages');
        const q = query(messagesColRef, orderBy('timestamp', 'asc'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedMessages: Message[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                fetchedMessages.push({
                    id: doc.id,
                    text: data.text,
                    sender: data.senderUID === userId ? 'user' : 'restaurant',
                    time: data.timestamp ? new Date(data.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Sending...',
                    senderUID: data.senderUID,
                });
            });
            setMessages(fetchedMessages);
        });

        return () => unsubscribe();
    }, [conversationId, userId]);


    // Hàm gửi tin nhắn
    const handleSend = async () => {
        if (inputText.trim().length === 0 || !userId || !conversationId || !customerName) return;

        const conversationRef = doc(db, 'conversations', conversationId);
        const messagesColRef = collection(conversationRef, 'messages');

        try {
            const convoDoc = await getDoc(conversationRef);
            if (!convoDoc.exists()) {

                await setDoc(conversationRef, {
                    customerName: customerName,
                    lastMessageText: inputText,
                    lastMessageTimestamp: serverTimestamp(),
                    unreadByAdmin: true,
                });
            } else {
                await updateDoc(conversationRef, {
                    lastMessageText: inputText,
                    lastMessageTimestamp: serverTimestamp(),
                    unreadByAdmin: true,
                });
            }

            await addDoc(messagesColRef, {
                senderUID: userId,
                text: inputText,
                timestamp: serverTimestamp(),
            });

            setInputText('');
        } catch (error) {
            console.error("Error sending message: ", error);
        }
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
                        <Text style={styles.headerTitle}>Nhà hàng</Text>
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
