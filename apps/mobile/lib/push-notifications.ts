import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { router } from 'expo-router';
import apiClient from '@/lib/api';
import * as SecureStore from 'expo-secure-store';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function registerForPushNotificationsAsync(): Promise<string | null> {
  let token: string | null = null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#C8960C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      return null;
    }
    const response = await Notifications.getExpoPushTokenAsync({
      projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
    });
    token = response.data;
  }

  return token;
}

export async function initPushNotifications() {
  const pushToken = await registerForPushNotificationsAsync();
  if (pushToken) {
    try {
      await SecureStore.setItemAsync('pushToken', pushToken);
      await apiClient.put('/api/v1/users/me/fcm-token', { fcmToken: pushToken });
    } catch (error) {
      console.error('Failed to register push token:', error);
    }
  }

  const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
    // Handle foreground notifications
  });

  const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
    const data = response.notification.request.content.data;
    if (data.type === 'NEW_MESSAGE' && data.conversationId) {
      router.push(`/chat/${data.conversationId}`);
    } else if (data.type === 'LISTING_APPROVED') {
      router.push('/(tabs)/profile/my-listings');
    } else if (data.type === 'PRICE_DROP' && data.listingId) {
      router.push(`/cars/${data.listingId}`);
    } else if (data.type === 'INSPECTION_UPDATE' && data.inspectionId) {
      // router.push(`/inspections/${data.inspectionId}`);
    }
  });

  return () => {
    Notifications.removeNotificationSubscription(notificationListener);
    Notifications.removeNotificationSubscription(responseListener);
  };
}
