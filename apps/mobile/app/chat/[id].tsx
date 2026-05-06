import { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  FlatList, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Colors, FontSizes, BorderRadius } from '@/constants/theme';
import { ArrowLeft, Send, Image as ImageIcon } from 'lucide-react-native';
import apiClient from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { initSocket, joinConversation, leaveConversation, onNewMessage, sendMessage, getSocket } from '@/lib/socket';

interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  readAt: string | null;
}

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [socketReady, setSocketReady] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    fetchMessages();
    setupSocket();

    return () => {
      leaveConversation(id);
    };
  }, [id]);

  const fetchMessages = async () => {
    try {
      const res = await apiClient.get(`/api/v1/conversations/${id}/messages`);
      if (res.data.success) {
        setMessages(res.data.data);
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: false }), 100);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupSocket = async () => {
    const socket = await initSocket();
    if (socket) {
      joinConversation(id);
      setSocketReady(true);

      onNewMessage((data) => {
        if (data.conversationId === id) {
          setMessages((prev) => {
            const exists = prev.find((m) => m.id === data.message.id);
            if (exists) return prev;
            return [...prev, data.message];
          });
          setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
        }
      });
    }
  };

  const handleSend = useCallback(async () => {
    if (!text.trim() || sending) return;
    const content = text.trim();
    setText('');
    setSending(true);

    if (socketReady) {
      sendMessage(id, content, (msg: any) => {
        setMessages((prev) => [...prev, msg]);
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
        setSending(false);
      });
    } else {
      try {
        const res = await apiClient.post(`/api/v1/conversations/${id}/messages`, { content });
        if (res.data.success) {
          setMessages((prev) => [...prev, res.data.data]);
          setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
        }
      } catch (error) {
        setText(content);
      } finally {
        setSending(false);
      }
    }
  }, [text, sending, socketReady, id]);

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderItem = ({ item }: { item: Message }) => {
    const isMine = item.senderId === user?.id;
    return (
      <View style={[styles.messageRow, isMine ? styles.messageRowMine : styles.messageRowOther]}>
        <View style={[styles.messageBubble, isMine ? styles.messageBubbleMine : styles.messageBubbleOther]}>
          <Text style={[styles.messageText, isMine && styles.messageTextMine]}>{item.content}</Text>
          <Text style={[styles.messageTime, isMine && styles.messageTimeMine]}>
            {formatTime(item.createdAt)}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.gold} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.navy} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Chat</Text>
          {socketReady && <View style={styles.onlineDot} />}
        </View>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.imageButton}>
          <ImageIcon size={20} color={Colors.gray400} />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Type a message..."
          placeholderTextColor={Colors.gray400}
          multiline
          maxLength={500}
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!text.trim() || sending) && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!text.trim() || sending}
        >
          {sending ? (
            <ActivityIndicator size="small" color={Colors.navy} />
          ) : (
            <Send size={20} color={Colors.navy} />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.cream },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.gray200 },
  headerButton: { padding: 4 },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: FontSizes.lg, fontWeight: '600', color: Colors.gray900 },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.green },
  messagesList: { padding: 16, gap: 8 },
  messageRow: { flexDirection: 'row', marginBottom: 4 },
  messageRowMine: { justifyContent: 'flex-end' },
  messageRowOther: { justifyContent: 'flex-start' },
  messageBubble: { maxWidth: '80%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: BorderRadius.lg },
  messageBubbleMine: { backgroundColor: Colors.gold, borderBottomRightRadius: 4 },
  messageBubbleOther: { backgroundColor: Colors.white, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: Colors.gray200 },
  messageText: { fontSize: FontSizes.base, color: Colors.gray900 },
  messageTextMine: { color: Colors.navy },
  messageTime: { fontSize: FontSizes.xs, color: Colors.gray400, marginTop: 4, alignSelf: 'flex-end' },
  messageTimeMine: { color: Colors.navy + '80' },
  inputContainer: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 12, paddingVertical: 10, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.gray200 },
  imageButton: { padding: 10 },
  input: { flex: 1, backgroundColor: Colors.gray100, borderRadius: BorderRadius.full, paddingHorizontal: 16, paddingVertical: 10, fontSize: FontSizes.base, color: Colors.gray900, maxHeight: 100, marginRight: 8 },
  sendButton: { backgroundColor: Colors.gold, borderRadius: 24, width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  sendButtonDisabled: { backgroundColor: Colors.gray200 },
});
