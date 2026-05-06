import { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Colors, FontSizes, BorderRadius } from '@/constants/theme';
import { MessageCircle, Check, CheckCheck } from 'lucide-react-native';
import apiClient from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

interface Conversation {
  id: string;
  listingId: string;
  listingTitle: string;
  otherUser: { id: string; fullName: string; photoUrl: string | null };
  lastMessage: { content: string; createdAt: string; senderId: string };
  unreadCount: number;
  updatedAt: string;
}

export default function MessagesScreen() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await apiClient.get('/api/v1/conversations');
      if (res.data.success) setConversations(res.data.data);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const renderItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity style={styles.conversationItem} onPress={() => router.push(`/chat/${item.id}`)}>
      <View style={styles.avatarContainer}>
        {item.otherUser.photoUrl ? (
          <Image source={{ uri: item.otherUser.photoUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.otherUser.fullName.charAt(0)}</Text>
          </View>
        )}
        {item.unreadCount > 0 && <View style={styles.unreadBadge} />}
      </View>
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.conversationName} numberOfLines={1}>{item.otherUser.fullName}</Text>
          <Text style={[styles.conversationTime, item.unreadCount > 0 && styles.conversationTimeUnread]}>{formatDate(item.updatedAt)}</Text>
        </View>
        <View style={styles.conversationFooter}>
          <View style={styles.lastMessageContainer}>
            {item.lastMessage.senderId === user?.id ? (
              <CheckCheck size={14} color={Colors.gray400} style={styles.readIcon} />
            ) : null}
            <Text style={[styles.lastMessage, item.unreadCount > 0 && styles.lastMessageUnread]} numberOfLines={1}>{item.lastMessage.content}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.gold} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      {conversations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MessageCircle size={64} color={Colors.gray300} />
          <Text style={styles.emptyTitle}>No messages yet</Text>
          <Text style={styles.emptyText}>Start a conversation when you find a car you are interested in</Text>
          <TouchableOpacity style={styles.browseButton} onPress={() => router.push('/(tabs)/browse')}>
            <Text style={styles.browseText}>Browse Cars</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream },
  header: { backgroundColor: Colors.white, paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: Colors.gray200 },
  headerTitle: { fontSize: FontSizes.xl, fontWeight: 'bold', color: Colors.gray900 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.cream },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  emptyTitle: { fontSize: FontSizes.xl, fontWeight: 'bold', color: Colors.gray900, marginTop: 16, marginBottom: 8 },
  emptyText: { fontSize: FontSizes.base, color: Colors.gray600, textAlign: 'center', marginBottom: 24 },
  browseButton: { backgroundColor: Colors.gold, borderRadius: BorderRadius.md, paddingHorizontal: 32, paddingVertical: 12 },
  browseText: { fontSize: FontSizes.base, fontWeight: '600', color: Colors.navy },
  list: { padding: 16 },
  conversationItem: { flexDirection: 'row', backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: 16, marginBottom: 8, borderWidth: 1, borderColor: Colors.gray100 },
  avatarContainer: { position: 'relative', marginRight: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.goldPale, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: FontSizes.lg, fontWeight: '600', color: Colors.navy },
  unreadBadge: { position: 'absolute', top: 0, right: 0, width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.accent },
  conversationContent: { flex: 1, justifyContent: 'center' },
  conversationHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  conversationName: { fontSize: FontSizes.base, fontWeight: '600', color: Colors.gray900, flex: 1, marginRight: 8 },
  conversationTime: { fontSize: FontSizes.xs, color: Colors.gray400 },
  conversationTimeUnread: { color: Colors.accent, fontWeight: '600' },
  conversationFooter: { flexDirection: 'row', alignItems: 'center' },
  lastMessageContainer: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  readIcon: { marginRight: 4 },
  lastMessage: { fontSize: FontSizes.sm, color: Colors.gray600, flex: 1 },
  lastMessageUnread: { color: Colors.gray900, fontWeight: '500' },
});
