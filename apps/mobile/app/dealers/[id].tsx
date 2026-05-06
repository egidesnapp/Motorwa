import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Image, ActivityIndicator, Share, Linking,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Colors, FontSizes, BorderRadius } from '@/constants/theme';
import {
  ArrowLeft, Share2, MapPin, Phone, MessageCircle, Star,
  Car, Globe, Clock, Shield, ChevronRight, Heart,
} from 'lucide-react-native';
import apiClient from '@/lib/api';

interface Dealer {
  id: string;
  companyName: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  description: string;
  province: string;
  district: string;
  phone: string;
  email: string;
  website: string | null;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  listingsCount: number;
  memberSince: string;
  listings: any[];
}

export default function DealerProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [dealer, setDealer] = useState<Dealer | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'listings' | 'about' | 'reviews'>('listings');

  useEffect(() => {
    fetchDealer();
  }, [id]);

  const fetchDealer = async () => {
    try {
      const res = await apiClient.get(`/api/v1/dealers/${id}`);
      if (res.data.success) setDealer(res.data.data);
    } catch (error) {
      console.error('Failed to fetch dealer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    if (dealer?.phone) {
      Linking.openURL(`tel:${dealer.phone}`);
    }
  };

  const handleShare = async () => {
    if (!dealer) return;
    await Share.share({
      message: `Check out ${dealer.companyName} on MotorWa.rw`,
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.gold} />
      </View>
    );
  }

  if (!dealer) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Dealer not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Banner */}
      {dealer.bannerUrl ? (
        <Image source={{ uri: dealer.bannerUrl }} style={styles.banner} />
      ) : (
        <View style={[styles.banner, { backgroundColor: Colors.navy }]} />
      )}

      {/* Header Overlay */}
      <View style={styles.headerOverlay}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.white} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
          <Share2 size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Dealer Info Card */}
        <View style={styles.dealerCard}>
          <View style={styles.dealerHeader}>
            {dealer.logoUrl ? (
              <Image source={{ uri: dealer.logoUrl }} style={styles.logo} />
            ) : (
              <View style={styles.logo}>
                <Text style={styles.logoText}>{dealer.companyName.charAt(0)}</Text>
              </View>
            )}
            <View style={styles.dealerInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{dealer.companyName}</Text>
                {dealer.isVerified && (
                  <View style={styles.verifiedBadge}>
                    <Shield size={12} color={Colors.green} />
                    <Text style={styles.verifiedText}>Verified</Text>
                  </View>
                )}
              </View>
              <View style={styles.locationRow}>
                <MapPin size={14} color={Colors.gray400} />
                <Text style={styles.locationText}>{dealer.district}, {dealer.province}</Text>
              </View>
            </View>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{dealer.listingsCount}</Text>
              <Text style={styles.statLabel}>Listings</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <View style={styles.ratingRow}>
                <Text style={styles.statValue}>{dealer.rating.toFixed(1)}</Text>
                <Star size={14} color={Colors.gold} fill={Colors.gold} />
              </View>
              <Text style={styles.statLabel}>{dealer.reviewCount} reviews</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{new Date(dealer.memberSince).getFullYear()}</Text>
              <Text style={styles.statLabel}>Since</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
              <Phone size={18} color={Colors.navy} />
              <Text style={styles.actionButtonText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButtonPrimary} onPress={() => router.push(`/chat?dealerId=${id}`)}>
              <MessageCircle size={18} color={Colors.white} />
              <Text style={styles.actionButtonTextPrimary}>Message</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {(['listings', 'about', 'reviews'] as const).map((tab) => (
            <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.tabActive]} onPress={() => setActiveTab(tab)}>
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        {activeTab === 'listings' && (
          <View style={styles.tabContent}>
            {dealer.listings.length === 0 ? (
              <View style={styles.emptyTab}>
                <Car size={48} color={Colors.gray300} />
                <Text style={styles.emptyText}>No active listings</Text>
              </View>
            ) : (
              dealer.listings.map((listing) => (
                <TouchableOpacity key={listing.id} style={styles.listingRow} onPress={() => router.push(`/cars/${listing.id}`)}>
                  <View style={styles.listingImage} />
                  <View style={styles.listingInfo}>
                    <Text style={styles.listingTitle} numberOfLines={1}>{listing.title}</Text>
                    <Text style={styles.listingPrice}>{Number(listing.priceRwf).toLocaleString()} RWF</Text>
                    <View style={styles.listingMeta}>
                      <Clock size={12} color={Colors.gray400} />
                      <Text style={styles.listingMetaText}>{listing.mileageKm} km</Text>
                    </View>
                  </View>
                  <ChevronRight size={18} color={Colors.gray300} />
                </TouchableOpacity>
              ))
            )}
          </View>
        )}

        {activeTab === 'about' && (
          <View style={styles.tabContent}>
            {dealer.description && (
              <View style={styles.infoCard}>
                <Text style={styles.infoCardTitle}>About</Text>
                <Text style={styles.infoCardText}>{dealer.description}</Text>
              </View>
            )}
            <View style={styles.infoCard}>
              <Text style={styles.infoCardTitle}>Contact</Text>
              <View style={styles.contactRow}>
                <Phone size={16} color={Colors.gray400} />
                <Text style={styles.contactText}>{dealer.phone}</Text>
              </View>
              <View style={styles.contactRow}>
                <MapPin size={16} color={Colors.gray400} />
                <Text style={styles.contactText}>{dealer.district}, {dealer.province}</Text>
              </View>
              {dealer.website && (
                <View style={styles.contactRow}>
                  <Globe size={16} color={Colors.gray400} />
                  <Text style={[styles.contactText, { color: Colors.gold }]}>{dealer.website}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {activeTab === 'reviews' && (
          <View style={styles.tabContent}>
            <View style={styles.reviewSummary}>
              <Text style={styles.reviewScore}>{dealer.rating.toFixed(1)}</Text>
              <View style={styles.reviewStars}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={16} color={s <= Math.round(dealer.rating) ? Colors.gold : Colors.gray300} fill={s <= Math.round(dealer.rating) ? Colors.gold : 'transparent'} />
                ))}
              </View>
              <Text style={styles.reviewCount}>{dealer.reviewCount} reviews</Text>
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.cream },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.cream },
  errorTitle: { fontSize: FontSizes.xl, fontWeight: 'bold', color: Colors.gray900, marginBottom: 16 },
  banner: { width: '100%', height: 160 },
  headerOverlay: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 48 },
  headerButton: { backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 24, padding: 10 },
  content: { flex: 1 },
  dealerCard: { backgroundColor: Colors.white, margin: 16, borderRadius: BorderRadius.lg, padding: 16, borderWidth: 1, borderColor: Colors.gray200 },
  dealerHeader: { flexDirection: 'row', marginBottom: 16 },
  logo: { width: 60, height: 60, borderRadius: BorderRadius.lg, backgroundColor: Colors.goldPale, justifyContent: 'center', alignItems: 'center' },
  logoText: { fontSize: FontSizes['2xl'], fontWeight: 'bold', color: Colors.navy },
  dealerInfo: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { fontSize: FontSizes.lg, fontWeight: 'bold', color: Colors.gray900 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.goldPale, paddingHorizontal: 8, paddingVertical: 2, borderRadius: BorderRadius.sm },
  verifiedText: { fontSize: FontSizes.xs, color: Colors.green, fontWeight: '600' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  locationText: { fontSize: FontSizes.sm, color: Colors.gray600 },
  statsRow: { flexDirection: 'row', borderTopWidth: 1, borderBottomWidth: 1, borderColor: Colors.gray100, paddingVertical: 12, marginBottom: 16 },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: FontSizes.lg, fontWeight: 'bold', color: Colors.navy },
  statLabel: { fontSize: FontSizes.xs, color: Colors.gray400, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: Colors.gray100 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionButtons: { flexDirection: 'row', gap: 12 },
  actionButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.gray100, borderRadius: BorderRadius.md, paddingVertical: 12, gap: 6 },
  actionButtonText: { fontSize: FontSizes.base, fontWeight: '600', color: Colors.navy },
  actionButtonPrimary: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.gold, borderRadius: BorderRadius.md, paddingVertical: 12, gap: 6 },
  actionButtonTextPrimary: { fontSize: FontSizes.base, fontWeight: '600', color: Colors.navy },
  tabs: { flexDirection: 'row', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: Colors.gray200 },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: Colors.gold },
  tabText: { fontSize: FontSizes.base, color: Colors.gray400, fontWeight: '500' },
  tabTextActive: { color: Colors.navy, fontWeight: '600' },
  tabContent: { padding: 16 },
  emptyTab: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { fontSize: FontSizes.base, color: Colors.gray400, marginTop: 12 },
  listingRow: { flexDirection: 'row', backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: Colors.gray200, alignItems: 'center' },
  listingImage: { width: 60, height: 45, borderRadius: BorderRadius.sm, backgroundColor: Colors.gray200 },
  listingInfo: { flex: 1, marginLeft: 12 },
  listingTitle: { fontSize: FontSizes.base, fontWeight: '600', color: Colors.gray900 },
  listingPrice: { fontSize: FontSizes.sm, color: Colors.gold, fontWeight: '600', marginTop: 2 },
  listingMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  listingMetaText: { fontSize: FontSizes.xs, color: Colors.gray400 },
  infoCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: Colors.gray200 },
  infoCardTitle: { fontSize: FontSizes.base, fontWeight: '600', color: Colors.gray900, marginBottom: 8 },
  infoCardText: { fontSize: FontSizes.base, color: Colors.gray600, lineHeight: 22 },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  contactText: { fontSize: FontSizes.base, color: Colors.gray600 },
  reviewSummary: { alignItems: 'center', paddingVertical: 32 },
  reviewScore: { fontSize: FontSizes['4xl'], fontWeight: 'bold', color: Colors.navy },
  reviewStars: { flexDirection: 'row', gap: 4, marginVertical: 8 },
  reviewCount: { fontSize: FontSizes.sm, color: Colors.gray400 },
  backButton: { backgroundColor: Colors.gold, borderRadius: BorderRadius.md, paddingHorizontal: 24, paddingVertical: 12 },
  backText: { fontSize: FontSizes.base, fontWeight: '600', color: Colors.navy },
});
