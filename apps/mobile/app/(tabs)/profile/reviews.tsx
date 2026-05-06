import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router, Stack } from 'expo-router';
import { Colors, FontSizes, BorderRadius } from '@/constants/theme';
import { ArrowLeft, Star, Car, MessageSquare, Calendar } from 'lucide-react-native';

interface Review {
  id: string;
  rating: number;
  comment: string;
  reviewer: { name: string; photoUrl: string | null };
  listing: { title: string };
  createdAt: string;
}

export default function ReviewsScreen() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeTab, setActiveTab] = useState<'received' | 'given'>('received');

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0';

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reviews</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity style={[styles.tab, activeTab === 'received' && styles.tabActive]} onPress={() => setActiveTab('received')}>
          <Text style={[styles.tabText, activeTab === 'received' && styles.tabTextActive]}>Received</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'given' && styles.tabActive]} onPress={() => setActiveTab('given')}>
          <Text style={[styles.tabText, activeTab === 'given' && styles.tabTextActive]}>Given</Text>
        </TouchableOpacity>
      </View>

      {reviews.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Star size={48} color={Colors.gray300} />
          <Text style={styles.emptyTitle}>No reviews yet</Text>
          <Text style={styles.emptyText}>
            {activeTab === 'received' ? 'You will see reviews here once buyers rate their experience with you' : 'Leave a review after your next car transaction'}
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {/* Rating Summary */}
          <View style={styles.ratingSummary}>
            <View style={styles.ratingBig}>
              <Text style={styles.ratingScore}>{averageRating}</Text>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={18} color={s <= Math.round(Number(averageRating)) ? Colors.gold : Colors.gray300} fill={s <= Math.round(Number(averageRating)) ? Colors.gold : 'transparent'} />
                ))}
              </View>
              <Text style={styles.ratingCount}>{reviews.length} reviews</Text>
            </View>
          </View>

          {/* Review List */}
          {reviews.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewerAvatar}>
                  <Text style={styles.reviewerText}>{review.reviewer.name.charAt(0)}</Text>
                </View>
                <View style={styles.reviewerInfo}>
                  <Text style={styles.reviewerName}>{review.reviewer.name}</Text>
                  <View style={styles.reviewMeta}>
                    <Car size={12} color={Colors.gray400} />
                    <Text style={styles.reviewListing}>{review.listing.title}</Text>
                  </View>
                </View>
                <View style={styles.reviewRating}>
                  <Star size={14} color={Colors.gold} fill={Colors.gold} />
                  <Text style={styles.reviewRatingText}>{review.rating}.0</Text>
                </View>
              </View>
              <Text style={styles.reviewComment}>{review.comment}</Text>
              <View style={styles.reviewDate}>
                <Calendar size={12} color={Colors.gray400} />
                <Text style={styles.reviewDateText}>{new Date(review.createdAt).toLocaleDateString()}</Text>
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
  tabsContainer: { flexDirection: 'row', backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.gray200 },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: Colors.gold },
  tabText: { fontSize: FontSizes.base, color: Colors.gray400, fontWeight: '500' },
  tabTextActive: { color: Colors.navy, fontWeight: '600' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  emptyTitle: { fontSize: FontSizes.xl, fontWeight: 'bold', color: Colors.gray900, marginTop: 16, marginBottom: 8 },
  emptyText: { fontSize: FontSizes.base, color: Colors.gray600, textAlign: 'center' },
  list: { padding: 16, gap: 12 },
  ratingSummary: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: Colors.gray200, marginBottom: 8 },
  ratingBig: { alignItems: 'center' },
  ratingScore: { fontSize: FontSizes['5xl'], fontWeight: 'bold', color: Colors.navy },
  starsRow: { flexDirection: 'row', gap: 4, marginVertical: 8 },
  ratingCount: { fontSize: FontSizes.sm, color: Colors.gray400 },
  reviewCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: 16, borderWidth: 1, borderColor: Colors.gray200 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  reviewerAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.goldPale, justifyContent: 'center', alignItems: 'center' },
  reviewerText: { fontSize: FontSizes.base, fontWeight: '600', color: Colors.navy },
  reviewerInfo: { flex: 1, marginLeft: 12 },
  reviewerName: { fontSize: FontSizes.base, fontWeight: '600', color: Colors.gray900 },
  reviewMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  reviewListing: { fontSize: FontSizes.xs, color: Colors.gray400 },
  reviewRating: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  reviewRatingText: { fontSize: FontSizes.sm, fontWeight: '600', color: Colors.gold },
  reviewComment: { fontSize: FontSizes.base, color: Colors.gray600, lineHeight: 22, marginBottom: 12 },
  reviewDate: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  reviewDateText: { fontSize: FontSizes.xs, color: Colors.gray400 },
});
