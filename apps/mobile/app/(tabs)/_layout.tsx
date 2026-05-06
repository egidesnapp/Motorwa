import { Tabs } from 'expo-router';
import { View, StyleSheet, Text } from 'react-native';
import { Colors } from '@/constants/theme';
import { Home, Search, PlusCircle, MessageSquare, User, Bell } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import apiClient from '@/lib/api';

function MessagesTabIcon({ color, unread }: { color: string; unread: number }) {
  return (
    <View style={styles.iconContainer}>
      <MessageSquare size={24} color={color} />
      {unread > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{unread > 9 ? '9+' : unread}</Text>
        </View>
      )}
    </View>
  );
}

function NotificationsTabIcon({ color, unread }: { color: string; unread: number }) {
  return (
    <View style={styles.iconContainer}>
      <Bell size={24} color={color} />
      {unread > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{unread > 9 ? '9+' : unread}</Text>
        </View>
      )}
    </View>
  );
}

export default function TabsLayout() {
  const [messageCount, setMessageCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [unreadRes, notifRes] = await Promise.all([
          apiClient.get('/api/v1/conversations'),
          apiClient.get('/api/v1/notifications/unread-count'),
        ]);
        if (unreadRes.data.success) {
          const unread = unreadRes.data.data.filter((c: any) => c.unreadCount > 0).length;
          setMessageCount(unread);
        }
        if (notifRes.data.success) {
          setNotificationCount(notifRes.data.data);
        }
      } catch (error) {
        // silently fail
      }
    };
    fetchCounts();
    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.gold,
        tabBarInactiveTintColor: Colors.gray400,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ tabBarIcon: ({ color }) => <Home size={24} color={color} /> }}
      />
      <Tabs.Screen
        name="browse"
        options={{ tabBarIcon: ({ color }) => <Search size={24} color={color} /> }}
      />
      <Tabs.Screen
        name="post"
        options={{
          tabBarIcon: ({ color }) => (
            <View style={styles.postButton}>
              <PlusCircle size={28} color={Colors.navy} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{ tabBarIcon: ({ color }) => <MessagesTabIcon color={color} unread={messageCount} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => (
            <View style={styles.profileIconContainer}>
              <User size={24} color={color} />
              {notificationCount > 0 && <View style={styles.profileBadge} />}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
  },
  postButton: {
    backgroundColor: Colors.gold,
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    top: -10,
  },
  iconContainer: { position: 'relative' },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: Colors.accent,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  profileIconContainer: { position: 'relative' },
  profileBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.accent,
  },
});
