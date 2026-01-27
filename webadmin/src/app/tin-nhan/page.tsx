'use client';

import { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import { Search, Send, Paperclip, Smile, User, Video, Phone } from 'lucide-react';
import { db } from '@/lib/firebase'; // Import a Firestore instance
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { format } from 'date-fns';

// --- TYPE DEFINITIONS ---
interface IMessage {
  id: string;
  senderUID: string;
  text: string;
  timestamp: any; // Firestore timestamp object
}

interface IConversation {
  id: string;
  customerName: string;
  lastMessageText: string;
  lastMessageTimestamp: any;
  unreadByAdmin: boolean;
}

export default function TinNhanPage() {
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // Scroll to the bottom of the messages list
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // --- Firestore Real-time Listeners ---

  // 1. Listen for conversations
  useEffect(() => {
    const q = query(collection(db, 'conversations'), orderBy('lastMessageTimestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const convos: IConversation[] = [];
      querySnapshot.forEach((doc) => {
        convos.push({ id: doc.id, ...doc.data() } as IConversation);
      });
      setConversations(convos);
    });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, []);

  // 2. Listen for messages in the selected conversation
  useEffect(() => {
    if (!selectedConversationId) {
      setMessages([]);
      return;
    }

    const messagesColRef = collection(db, 'conversations', selectedConversationId, 'messages');
    const q = query(messagesColRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs: IMessage[] = [];
      querySnapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() } as IMessage);
      });
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [selectedConversationId]);

  // --- Event Handlers ---

  const handleSelectConversation = (convoId: string) => {
    setSelectedConversationId(convoId);
    // Mark conversation as read
    const convoRef = doc(db, 'conversations', convoId);
    updateDoc(convoRef, {
      unreadByAdmin: false
    });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !selectedConversationId) return;

    const messagesColRef = collection(db, 'conversations', selectedConversationId, 'messages');
    const conversationRef = doc(db, 'conversations', selectedConversationId);

    try {
      // Add new message to the 'messages' sub-collection
      await addDoc(messagesColRef, {
        senderUID: 'admin_user_id', // Replace with actual admin user ID
        text: newMessage,
        timestamp: serverTimestamp(),
      });

      // Update the last message in the parent conversation document
      await updateDoc(conversationRef, {
        lastMessageText: newMessage,
        lastMessageTimestamp: serverTimestamp(),
      });

      setNewMessage('');
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel: Conversation List */}
          <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-800">Tin nhắn</h1>
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Tìm kiếm cuộc trò chuyện..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.map((convo) => (
                <div
                  key={convo.id}
                  className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 ${selectedConversationId === convo.id ? 'bg-blue-50' : ''}`}
                  onClick={() => handleSelectConversation(convo.id)}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-500" />
                    </div>
                    {convo.unreadByAdmin && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>}
                  </div>
                  <div className="flex-1 ml-4">
                    <div className="flex justify-between items-center">
                      <h3 className={`font-semibold ${convo.unreadByAdmin ? 'text-gray-900' : 'text-gray-800'}`}>{convo.customerName}</h3>
                      <span className="text-xs text-gray-500">
                        {convo.lastMessageTimestamp && format(convo.lastMessageTimestamp.toDate(), 'HH:mm')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <p className={`text-sm truncate ${convo.unreadByAdmin ? 'text-gray-700 font-bold' : 'text-gray-600'}`}>{convo.lastMessageText}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel: Chat Window */}
          <div className="w-2/3 flex flex-col bg-gray-50">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center"><User className="w-5 h-5 text-gray-500" /></div>
                    <div className="ml-3">
                      <h2 className="text-lg font-semibold text-gray-800">{selectedConversation.customerName}</h2>
                      <p className="text-sm text-green-500">Đang hoạt động</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-gray-500">
                    <Phone size={20} className="cursor-pointer hover:text-blue-500" />
                    <Video size={20} className="cursor-pointer hover:text-blue-500" />
                    <User size={20} className="cursor-pointer hover:text-blue-500" />
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 p-6 overflow-y-auto">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex mb-4 ${msg.senderUID === 'admin_user_id' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-lg px-4 py-3 rounded-2xl ${msg.senderUID === 'admin_user_id' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none'}`}>
                        <p>{msg.text}</p>
                        {msg.timestamp && <span className={`text-xs mt-1 block ${msg.senderUID === 'admin_user_id' ? 'text-blue-100' : 'text-gray-500'}`}>{format(msg.timestamp.toDate(), 'HH:mm')}</span>}
                      </div>
                    </div>
                  ))}
                   <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 bg-white border-t border-gray-200">
                  <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                    <Paperclip size={20} className="text-gray-500 cursor-pointer hover:text-blue-500" />
                    <Smile size={20} className="text-gray-500 cursor-pointer hover:text-blue-500" />
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Nhập tin nhắn..."
                      className="flex-1 px-4 py-2 bg-gray-100 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="submit" className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-blue-300" disabled={!newMessage.trim()}>
                      <Send size={20} />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>Chọn một cuộc trò chuyện để bắt đầu</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
