import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TextInput,
  TouchableOpacity, FlatList, ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Colors, BorderRadius, FontSizes } from '@/constants/theme';
import { Search, Filter, X } from 'lucide-react-native';
import apiClient from '@/lib/api';
import CarCard from '@/components/CarCard';

export default function BrowseScreen() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    make: '', priceMin: '', priceMax: '', province: '', sort: 'newest',
  });
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchListings();
  }, [filters]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });
      params.set('page', page.toString());
      params.set('limit', '20');

      const res = await apiClient.get(`/api/v1/listings?${params.toString()}`);
      if (res.data.success) setListings(res.data.data);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const activeFilters = Object.entries(filters).filter(([k, v]) => v && k !== 'sort');

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.header}>
        <View style={styles.searchRow}>
          <View style={styles.searchInput}>
            <Search size={20} color={Colors.gray400} />
            <TextInput
              style={styles.searchText}
              placeholder="Search cars..."
              placeholderTextColor={Colors.gray400}
              value={filters.make}
              onChangeText={(text) => setFilters({ ...filters, make: text })}
            />
          </View>
          <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilters(!showFilters)}>
            <Filter size={20} color={Colors.navy} />
          </TouchableOpacity>
        </View>

        {activeFilters.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterTags}>
            {activeFilters.map(([key, value]) => (
              <TouchableOpacity key={key} style={styles.filterTag} onPress={() => setFilters({ ...filters, [key]: '' })}>
                <Text style={styles.filterTagText}>{key}: {value}</Text>
                <X size={14} color={Colors.white} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Filters Panel */}
      {showFilters && (
        <View style={styles.filterPanel}>
          <Text style={styles.filterTitle}>Filters</Text>
          <Text style={styles.filterLabel}>Province</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterOptions}>
            {['Kigali', 'Northern', 'Southern', 'Eastern', 'Western'].map((p) => (
              <TouchableOpacity
                key={p}
                style={[styles.filterOption, filters.province === p && styles.filterOptionActive]}
                onPress={() => setFilters({ ...filters, province: p })}
              >
                <Text style={[styles.filterOptionText, filters.province === p && styles.filterOptionTextActive]}>{p}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.filterLabel}>Sort By</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterOptions}>
            {[
              { key: 'newest', label: 'Newest' },
              { key: 'price_low', label: 'Lowest Price' },
              { key: 'price_high', label: 'Highest Price' },
              { key: 'most_viewed', label: 'Most Viewed' },
            ].map((s) => (
              <TouchableOpacity
                key={s.key}
                style={[styles.filterOption, filters.sort === s.key && styles.filterOptionActive]}
                onPress={() => setFilters({ ...filters, sort: s.key })}
              >
                <Text style={[styles.filterOptionText, filters.sort === s.key && styles.filterOptionTextActive]}>{s.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Results */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.gold} />
        </View>
      ) : listings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No cars found</Text>
          <Text style={styles.emptyText}>Try adjusting your filters</Text>
        </View>
      ) : (
        <FlatList
          data={listings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <CarCard listing={item} onPress={() => router.push(`/cars/${item.id}`)} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream },
  header: { backgroundColor: Colors.white, padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.gray200 },
  searchRow: { flexDirection: 'row', gap: 12 },
  searchInput: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.gray100, borderRadius: BorderRadius.md, paddingHorizontal: 12, gap: 8 },
  searchText: { flex: 1, paddingVertical: 10, fontSize: FontSizes.base, color: Colors.gray900 },
  filterButton: { backgroundColor: Colors.gray100, borderRadius: BorderRadius.md, paddingHorizontal: 12, justifyContent: 'center' },
  filterTags: { flexDirection: 'row', marginTop: 12 },
  filterTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.navy, borderRadius: BorderRadius.full, paddingHorizontal: 12, paddingVertical: 6, marginRight: 8 },
  filterTagText: { color: Colors.white, fontSize: FontSizes.xs, marginRight: 4 },
  filterPanel: { backgroundColor: Colors.white, padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.gray200 },
  filterTitle: { fontSize: FontSizes.lg, fontWeight: '600', color: Colors.gray900, marginBottom: 12 },
  filterLabel: { fontSize: FontSizes.sm, fontWeight: '600', color: Colors.gray600, marginBottom: 8, marginTop: 8 },
  filterOptions: { flexDirection: 'row', marginBottom: 4 },
  filterOption: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.gray200, marginRight: 8 },
  filterOptionActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  filterOptionText: { fontSize: FontSizes.sm, color: Colors.gray600 },
  filterOptionTextActive: { color: Colors.navy, fontWeight: '600' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyTitle: { fontSize: FontSizes.xl, fontWeight: 'bold', color: Colors.gray900, marginBottom: 8 },
  emptyText: { fontSize: FontSizes.base, color: Colors.gray600 },
  list: { padding: 16, gap: 12 },
});
