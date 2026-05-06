import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TextInput,
  TouchableOpacity, FlatList, Image, ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Colors, BorderRadius, Spacing, FontSizes } from '@/constants/theme';
import { Search, MapPin, Gauge, Fuel, Settings, Heart } from 'lucide-react-native';
import apiClient from '@/lib/api';

interface Listing {
  id: string;
  slug: string;
  title: string;
  make: string;
  model: string;
  year: number;
  priceRwf: string;
  mileageKm: number;
  fuelType: string;
  transmission: string;
  province: string;
  district: string;
  isFeatured: boolean;
  isBoosted: boolean;
  photos: Array<{ photoUrl: string; thumbnailUrl: string }>;
  user: { fullName: string; isIdVerified: boolean };
}

export default function HomeScreen() {
  const [featured, setFeatured] = useState<Listing[]>([]);
  const [latest, setLatest] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [featuredRes, latestRes] = await Promise.all([
        apiClient.get('/api/v1/listings/featured'),
        apiClient.get('/api/v1/listings?page=1&limit=8'),
      ]);
      if (featuredRes.data.success) setFeatured(featuredRes.data.data);
      if (latestRes.data.success) setLatest(latestRes.data.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { name: 'SUV' }, { name: 'Sedan' }, { name: 'Pickup' },
    { name: 'Minivan' }, { name: 'Hatchback' }, { name: 'Van' },
  ];

  const stats = [
    { label: 'Active Listings', value: '1,250' },
    { label: 'Verified Sellers', value: '890' },
    { label: 'Dealers', value: '45' },
    { label: 'Cars Sold', value: '3,200' },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.gold} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Rwanda's Trusted Car Marketplace</Text>
        <Text style={styles.heroSubtitle}>Buy and sell cars safely — verified sellers, real prices</Text>

        <TouchableOpacity style={styles.searchBar} onPress={() => router.push('/(tabs)/browse')}>
          <Search size={20} color={Colors.gray400} />
          <Text style={styles.searchText}>Search by make, model, or keyword...</Text>
        </TouchableOpacity>

        <View style={styles.quickFilters}>
          {['SUV', 'Sedan', 'Pickup', 'Under 5M', 'Under 10M'].map((filter) => (
            <TouchableOpacity key={filter} style={styles.filterPill} onPress={() => router.push('/(tabs)/browse')}>
              <Text style={styles.filterText}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        {stats.map((stat) => (
          <View key={stat.label} style={styles.statItem}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Featured */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Listings</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/browse')}>
            <Text style={styles.seeAllText}>View All →</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
          {featured.map((car) => (
            <TouchableOpacity key={car.id} style={styles.featuredCard} onPress={() => router.push(`/cars/${car.id}`)}>
              <View style={styles.cardImage}>
                {car.isFeatured && (
                  <View style={styles.featuredBadge}>
                    <Text style={styles.featuredBadgeText}>Featured</Text>
                  </View>
                )}
                <TouchableOpacity style={styles.saveButton}>
                  <Heart size={18} color={Colors.gray600} />
                </TouchableOpacity>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={1}>{car.title}</Text>
                <Text style={styles.cardPrice}>{Number(car.priceRwf).toLocaleString()} RWF</Text>
                <Text style={styles.cardLocation}>{car.district}, {car.province}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Browse by Category</Text>
        <View style={styles.categoryGrid}>
          {categories.map((cat) => (
            <TouchableOpacity key={cat.name} style={styles.categoryItem} onPress={() => router.push('/(tabs)/browse')}>
              <Text style={styles.categoryText}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Latest */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Just Added</Text>
        </View>
        <View style={styles.latestGrid}>
          {latest.slice(0, 4).map((car) => (
            <TouchableOpacity key={car.id} style={styles.latestCard} onPress={() => router.push(`/cars/${car.id}`)}>
              <View style={styles.latestImage} />
              <View style={styles.latestContent}>
                <Text style={styles.cardTitle} numberOfLines={1}>{car.title}</Text>
                <Text style={styles.cardPrice}>{Number(car.priceRwf).toLocaleString()} RWF</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.browseAllButton} onPress={() => router.push('/(tabs)/browse')}>
          <Text style={styles.browseAllText}>Browse All Cars</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.cream },
  hero: { backgroundColor: Colors.navy, paddingHorizontal: 20, paddingTop: 40, paddingBottom: 24 },
  heroTitle: { fontSize: 28, fontWeight: 'bold', color: Colors.white, marginBottom: 8 },
  heroSubtitle: { fontSize: 16, color: Colors.gray400, marginBottom: 16 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: BorderRadius.lg, paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  searchText: { color: Colors.gray400, fontSize: FontSizes.base },
  quickFilters: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  filterPill: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: BorderRadius.full, paddingHorizontal: 16, paddingVertical: 8 },
  filterText: { color: Colors.white, fontSize: FontSizes.sm },
  statsContainer: { flexDirection: 'row', backgroundColor: Colors.goldPale, padding: 20, justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: FontSizes['2xl'], fontWeight: 'bold', color: Colors.navy },
  statLabel: { fontSize: FontSizes.xs, color: Colors.gray600, marginTop: 2 },
  section: { padding: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: FontSizes.xl, fontWeight: 'bold', color: Colors.gray900 },
  seeAllText: { color: Colors.gold, fontWeight: '600' },
  horizontalScroll: { paddingRight: 20 },
  featuredCard: { width: 220, backgroundColor: Colors.white, borderRadius: BorderRadius.lg, overflow: 'hidden', marginRight: 12, borderWidth: 1, borderColor: Colors.gray200 },
  cardImage: { height: 140, backgroundColor: Colors.gray200, position: 'relative' },
  featuredBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: Colors.goldPale, paddingHorizontal: 8, paddingVertical: 4, borderRadius: BorderRadius.sm },
  featuredBadgeText: { fontSize: FontSizes.xs, color: Colors.gold, fontWeight: '600' },
  saveButton: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: BorderRadius.full, padding: 6 },
  cardContent: { padding: 12 },
  cardTitle: { fontSize: FontSizes.base, fontWeight: '600', color: Colors.gray900 },
  cardPrice: { fontSize: FontSizes.lg, fontWeight: 'bold', color: Colors.gold, marginTop: 4 },
  cardLocation: { fontSize: FontSizes.sm, color: Colors.gray400, marginTop: 4 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 },
  categoryItem: { width: '30%', backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: Colors.gray200 },
  categoryText: { fontSize: FontSizes.sm, fontWeight: '600', color: Colors.gray900 },
  latestGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  latestCard: { width: '48%', backgroundColor: Colors.white, borderRadius: BorderRadius.lg, overflow: 'hidden', borderWidth: 1, borderColor: Colors.gray200 },
  latestImage: { height: 100, backgroundColor: Colors.gray200 },
  latestContent: { padding: 10 },
  browseAllButton: { backgroundColor: Colors.gold, borderRadius: BorderRadius.md, paddingVertical: 14, alignItems: 'center', marginTop: 16 },
  browseAllText: { fontSize: FontSizes.base, fontWeight: '600', color: Colors.navy },
});
