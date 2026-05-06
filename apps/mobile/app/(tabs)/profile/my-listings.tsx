import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router, Stack } from 'expo-router';
import { Colors, FontSizes, BorderRadius } from '@/constants/theme';
import { ArrowLeft, Car, Edit2, Trash2, Eye, Star } from 'lucide-react-native';
import { useState } from 'react';

export default function MyListingsScreen() {
  const [listings, setListings] = useState<any[]>([]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Listings</Text>
        <View style={{ width: 24 }} />
      </View>

      {listings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Car size={48} color={Colors.gray300} />
          <Text style={styles.emptyTitle}>No listings yet</Text>
          <Text style={styles.emptyText}>Start selling by posting your first car</Text>
          <TouchableOpacity style={styles.postButton} onPress={() => router.push('/(tabs)/post')}>
            <Text style={styles.postText}>Post a Car</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {listings.map((listing) => (
            <View key={listing.id} style={styles.listingCard}>
              <View style={styles.listingStatus}>
                <View style={[styles.statusBadge, { backgroundColor: listing.status === 'ACTIVE' ? Colors.goldPale : Colors.gray200 }]}>
                  <Text style={[styles.statusText, { color: listing.status === 'ACTIVE' ? Colors.gold : Colors.gray600 }]}>{listing.status}</Text>
                </View>
              </View>
              <View style={styles.listingInfo}>
                <Text style={styles.listingTitle}>{listing.title}</Text>
                <Text style={styles.listingPrice}>{Number(listing.priceRwf).toLocaleString()} RWF</Text>
                <Text style={styles.listingStats}>{listing.views} views • {listing.inquiries} inquiries</Text>
              </View>
              <View style={styles.listingActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Eye size={18} color={Colors.navy} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Edit2 size={18} color={Colors.navy} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Trash2 size={18} color={Colors.accent} />
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
  postButton: { backgroundColor: Colors.gold, borderRadius: BorderRadius.md, paddingHorizontal: 32, paddingVertical: 12 },
  postText: { fontSize: FontSizes.base, fontWeight: '600', color: Colors.navy },
  list: { padding: 16, gap: 12 },
  listingCard: { flexDirection: 'row', backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: 16, borderWidth: 1, borderColor: Colors.gray200 },
  listingStatus: { marginRight: 12, justifyContent: 'center' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: BorderRadius.sm },
  statusText: { fontSize: FontSizes.xs, fontWeight: '600' },
  listingInfo: { flex: 1 },
  listingTitle: { fontSize: FontSizes.base, fontWeight: '600', color: Colors.gray900 },
  listingPrice: { fontSize: FontSizes.sm, color: Colors.gold, fontWeight: '600', marginTop: 2 },
  listingStats: { fontSize: FontSizes.xs, color: Colors.gray400, marginTop: 4 },
  listingActions: { flexDirection: 'row', gap: 8, justifyContent: 'center' },
  actionButton: { padding: 8 },
});
