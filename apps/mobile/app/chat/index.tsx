import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ActivityIndicator, TextInput } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { Colors, FontSizes, BorderRadius } from '@/constants/theme';
import { ArrowLeft, Search, MessageCircle } from 'lucide-react-native';
import apiClient from '@/lib/api';

interface Conversation {
  id: string;
  listing: { id: string; title: string; thumbnailUrl: string | null };
  otherUser: { id: string; fullName: string };
  lastMessage: { content: string };
}

export default function ChatIndexScreen() {
  const { listingId } = useLocalSearchParams<{ listingId: string }>();
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.gold} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
        <View style={{ width: 24 }} />
      </View>

      {conversations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MessageCircle size={48} color={Colors.gray300} />
          <Text style={styles.emptyTitle}>No conversations yet</Text>
          <Text style={styles.emptyText}>Browse cars and message sellers to get started</Text>
          <TouchableOpacity style={styles.browseButton} onPress={() => router.push('/(tabs)/browse')}>
            <Text style={styles.browseText}>Browse Cars</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.conversationItem} onPress={() => router.push(`/chat/${item.id}`)}>
              <View style={styles.listingImage} />
              <View style={styles.conversationContent}>
                <Text style={styles.conversationTitle} numberOfLines={1}>{item.listing.title}</Text>
                <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage.content}</Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.cream },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.gray200 },
  headerTitle: { fontSize: FontSizes.lg, fontWeight: '600', color: Colors.gray900 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  emptyTitle: { fontSize: FontSizes.xl, fontWeight: 'bold', color: Colors.gray900, marginTop: 16, marginBottom: 8 },
  emptyText: { fontSize: FontSizes.base, color: Colors.gray600, textAlign: 'center', marginBottom: 24 },
  browseButton: { backgroundColor: Colors.gold, borderRadius: BorderRadius.md, paddingHorizontal: 32, paddingVertical: 12 },
  browseText: { fontSize: FontSizes.base, fontWeight: '600', color: Colors.navy },
  list: { padding: 16, gap: 8 },
  conversationItem: { flexDirection: 'row', backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: 12, borderWidth: 1, borderColor: Colors.gray100, alignItems: 'center' },
  listingImage: { width: 50, height: 40, borderRadius: BorderRadius.sm, backgroundColor: Colors.gray200, marginRight: 12 },
  conversationContent: { flex: 1 },
  conversationTitle: { fontSize: FontSizes.base, fontWeight: '600', color: Colors.gray900 },
  lastMessage: { fontSize: FontSizes.sm, color: Colors.gray400, marginTop: 2 },
});
