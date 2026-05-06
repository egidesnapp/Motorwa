import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router, Stack } from 'expo-router';
import { Colors, FontSizes, BorderRadius } from '@/constants/theme';
import { ArrowLeft, Search, Bell, Trash2, Plus, SlidersHorizontal } from 'lucide-react-native';

interface SavedSearch {
  id: string;
  query: string;
  filters: { make?: string; priceMax?: number; province?: string };
  resultCount: number;
  notifications: boolean;
}

export default function SavedSearchesScreen() {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);

  const toggleNotifications = (id: string) => {
    setSavedSearches((prev) =>
      prev.map((s) => (s.id === id ? { ...s, notifications: !s.notifications } : s))
    );
  };

  const removeSearch = (id: string) => {
    Alert.alert('Remove Search', 'Stop receiving alerts for this search?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => setSavedSearches((prev) => prev.filter((s) => s.id !== id)),
      },
    ]);
  };

  const formatFilters = (filters: SavedSearch['filters']) => {
    const parts: string[] = [];
    if (filters.make) parts.push(filters.make);
    if (filters.priceMax) parts.push(`Under ${(filters.priceMax / 1000000).toFixed(1)}M RWF`);
    if (filters.province) parts.push(filters.province);
    return parts.join(' • ');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Searches</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/browse')}>
          <Plus size={24} color={Colors.gold} />
        </TouchableOpacity>
      </View>

      {savedSearches.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Search size={48} color={Colors.gray300} />
          <Text style={styles.emptyTitle}>No saved searches</Text>
          <Text style={styles.emptyText}>Search for cars and save your filters to get notified when new listings match</Text>
          <TouchableOpacity style={styles.browseButton} onPress={() => router.push('/(tabs)/browse')}>
            <Text style={styles.browseText}>Start Searching</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {savedSearches.map((search) => (
            <View key={search.id} style={styles.searchCard}>
              <View style={styles.searchHeader}>
                <View style={styles.searchInfo}>
                  <View style={styles.searchIconContainer}>
                    <SlidersHorizontal size={18} color={Colors.gold} />
                  </View>
                  <View>
                    <Text style={styles.searchQuery}>{search.query || 'Custom Search'}</Text>
                    <Text style={styles.searchFilters}>{formatFilters(search.filters)}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.deleteButton} onPress={() => removeSearch(search.id)}>
                  <Trash2 size={18} color={Colors.gray400} />
                </TouchableOpacity>
              </View>

              <View style={styles.searchFooter}>
                <Text style={styles.resultCount}>{search.resultCount} results</Text>
                <TouchableOpacity
                  style={[styles.notifyToggle, search.notifications && styles.notifyToggleActive]}
                  onPress={() => toggleNotifications(search.id)}
                >
                  <Bell size={14} color={search.notifications ? Colors.navy : Colors.gray400} />
                  <Text style={[styles.notifyText, search.notifications && styles.notifyTextActive]}>
                    {search.notifications ? 'Alerts On' : 'Alerts Off'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.gray200 },
  headerTitle: { fontSize: FontSizes.lg, fontWeight: '600', color: Colors.gray900 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  emptyTitle: { fontSize: FontSizes.xl, fontWeight: 'bold', color: Colors.gray900, marginTop: 16, marginBottom: 8 },
  emptyText: { fontSize: FontSizes.base, color: Colors.gray600, textAlign: 'center', marginBottom: 24 },
  browseButton: { backgroundColor: Colors.gold, borderRadius: BorderRadius.md, paddingHorizontal: 32, paddingVertical: 12 },
  browseText: { fontSize: FontSizes.base, fontWeight: '600', color: Colors.navy },
  list: { padding: 16, gap: 12 },
  searchCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: 16, borderWidth: 1, borderColor: Colors.gray200 },
  searchHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  searchInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  searchIconContainer: { width: 36, height: 36, borderRadius: BorderRadius.md, backgroundColor: Colors.goldPale, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  searchQuery: { fontSize: FontSizes.base, fontWeight: '600', color: Colors.gray900 },
  searchFilters: { fontSize: FontSizes.sm, color: Colors.gray400, marginTop: 2 },
  deleteButton: { padding: 8 },
  searchFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  resultCount: { fontSize: FontSizes.sm, color: Colors.gray600 },
  notifyToggle: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: BorderRadius.full, borderWidth: 1, borderColor: Colors.gray200 },
  notifyToggleActive: { backgroundColor: Colors.goldPale, borderColor: Colors.gold },
  notifyText: { fontSize: FontSizes.xs, color: Colors.gray400, fontWeight: '600' },
  notifyTextActive: { color: Colors.navy },
});
