import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList,
  ActivityIndicator, Alert,
} from 'react-native';
import { router, Stack } from 'expo-router';
import { Colors, FontSizes, BorderRadius } from '@/constants/theme';
import {
  ArrowLeft, MessageCircle, CheckCircle, AlertCircle, Star,
  TrendingDown, CreditCard, Bell, Trash2,
} from 'lucide-react-native';
import apiClient from '@/lib/api';

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  data?: { listingId?: string; conversationId?: string };
}

const NOTIFICATION_ICONS: Record<string, any> = {
  NEW_MESSAGE: MessageCircle,
  LISTING_APPROVED: CheckCircle,
  LISTING_REJECTED: AlertCircle,
  PRICE_DROP: TrendingDown,
  NEW_REVIEW: Star,
  PAYMENT_SUCCESS: CreditCard,
  DEFAULT: Bell,
};

const NOTIFICATION_COLORS: Record<string, string> = {
  NEW_MESSAGE: Colors.navy,
  LISTING_APPROVED: Colors.green,
  LISTING_REJECTED: Colors.accent,
  PRICE_DROP: Colors.gold,
  NEW_REVIEW: Colors.gold,
  PAYMENT_SUCCESS: Colors.green,
  DEFAULT: Colors.gray400,
};

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [notifsRes, countRes] = await Promise.all([
        apiClient.get('/api/v1/notifications'),
        apiClient.get('/api/v1/notifications/unread-count'),
      ]);
      if (notifsRes.data.success) setNotifications(notifsRes.data.data);
      if (countRes.data.success) setUnreadCount(countRes.data.data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await apiClient.put(`/api/v1/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiClient.put('/api/v1/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await apiClient.delete(`/api/v1/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const handleNotificationPress = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.data?.listingId) {
      router.push(`/cars/${notification.data.listingId}`);
    } else if (notification.data?.conversationId) {
      router.push(`/chat/${notification.data.conversationId}`);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const renderItem = ({ item }: { item: Notification }) => {
    const Icon = NOTIFICATION_ICONS[item.type] || NOTIFICATION_ICONS.DEFAULT;
    const color = NOTIFICATION_COLORS[item.type] || NOTIFICATION_COLORS.DEFAULT;

    return (
      <TouchableOpacity
        style={[styles.notificationItem, !item.isRead && styles.notificationItemUnread]}
        onPress={() => handleNotificationPress(item)}
      >
        <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
          <Icon size={20} color={color} />
        </View>
        <View style={styles.notificationContent}>
          <Text style={[styles.notificationTitle, !item.isRead && styles.notificationTitleUnread]}>{item.title}</Text>
          <Text style={styles.notificationBody} numberOfLines={2}>{item.body}</Text>
          <Text style={styles.notificationTime}>{formatTime(item.createdAt)}</Text>
        </View>
        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteNotification(item.id)}>
          <Trash2 size={16} color={Colors.gray300} />
        </TouchableOpacity>
      </TouchableOpacity>
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
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Notifications{unreadCount > 0 ? ` (${unreadCount})` : ''}
        </Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllAsRead}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
        {!unreadCount && <View style={{ width: 24 }} />}
      </View>

      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Bell size={48} color={Colors.gray300} />
          <Text style={styles.emptyTitle}>No notifications</Text>
          <Text style={styles.emptyText}>You will see alerts for messages, listings, and price updates here</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
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
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.cream },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.gray200 },
  headerTitle: { fontSize: FontSizes.lg, fontWeight: '600', color: Colors.gray900 },
  markAllText: { fontSize: FontSizes.sm, color: Colors.gold, fontWeight: '600' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  emptyTitle: { fontSize: FontSizes.xl, fontWeight: 'bold', color: Colors.gray900, marginTop: 16, marginBottom: 8 },
  emptyText: { fontSize: FontSizes.base, color: Colors.gray600, textAlign: 'center' },
  list: { padding: 16, gap: 8 },
  notificationItem: { flexDirection: 'row', backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: 14, borderWidth: 1, borderColor: Colors.gray100, alignItems: 'flex-start' },
  notificationItemUnread: { borderColor: Colors.gold, borderWidth: 1 },
  iconContainer: { width: 40, height: 40, borderRadius: BorderRadius.lg, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  notificationContent: { flex: 1 },
  notificationTitle: { fontSize: FontSizes.base, fontWeight: '600', color: Colors.gray900, marginBottom: 2 },
  notificationTitleUnread: { color: Colors.navy },
  notificationBody: { fontSize: FontSizes.sm, color: Colors.gray600, lineHeight: 18, marginBottom: 4 },
  notificationTime: { fontSize: FontSizes.xs, color: Colors.gray400 },
  deleteButton: { padding: 4, marginLeft: 8 },
});
