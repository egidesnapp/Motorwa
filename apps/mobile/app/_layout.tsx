import React, { useEffect, useState } from 'react';
import { Stack, Redirect, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { NetworkProvider } from '@/lib/network-context';
import { Colors } from '@/constants/theme';
import { ActivityIndicator, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initPushNotifications } from '@/lib/push-notifications';
import OfflineBanner from '@/components/OfflineBanner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
  },
});

class ErrorBoundaryView extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorText}>{this.state.error?.message}</Text>
          <TouchableOpacity style={styles.errorButton} onPress={() => { this.setState({ hasError: false, error: null }); router.replace('/(tabs)'); }}>
            <Text style={styles.errorButtonText}>Go Home</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

function RootLayoutNav() {
  const { isLoading, isAuthenticated } = useAuth();
  const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      const onboarded = await AsyncStorage.getItem('@motorwa:onboarded');
      setHasOnboarded(onboarded === 'true');
    };
    checkOnboarding();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      initPushNotifications();
    }
  }, [isAuthenticated]);

  if (isLoading || hasOnboarded === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.navy }}>
        <ActivityIndicator size="large" color={Colors.gold} />
      </View>
    );
  }

  if (!hasOnboarded) {
    return (
      <>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        </Stack>
      </>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
      </>
    );
  }

  return (
    <ErrorBoundaryView>
      <QueryClientProvider client={queryClient}>
        <>
          <StatusBar style="light" />
          <OfflineBanner />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="cars/[id]" options={{ presentation: 'card' }} />
            <Stack.Screen name="dealers/[id]" options={{ presentation: 'card' }} />
            <Stack.Screen name="chat/[id]" options={{ presentation: 'card' }} />
            <Stack.Screen name="notifications" options={{ presentation: 'card' }} />
          </Stack>
        </>
      </QueryClientProvider>
    </ErrorBoundaryView>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <NetworkProvider>
        <RootLayoutNav />
      </NetworkProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.cream, padding: 24 },
  errorTitle: { fontSize: 24, fontWeight: 'bold', color: Colors.gray900, marginBottom: 8 },
  errorText: { fontSize: 16, color: Colors.gray600, textAlign: 'center', marginBottom: 24 },
  errorButton: { backgroundColor: Colors.gold, borderRadius: 12, paddingHorizontal: 32, paddingVertical: 14 },
  errorButtonText: { fontSize: 16, fontWeight: '600', color: Colors.navy },
});
