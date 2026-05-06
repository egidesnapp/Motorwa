import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Image, ActivityIndicator, Share, Dimensions, Linking, Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Colors, FontSizes, BorderRadius } from '@/constants/theme';
import {
  ArrowLeft, Heart, Share2, MapPin, Gauge, Fuel, Settings,
  Calendar, MessageCircle, Phone, ChevronRight, Star, Flag,
  Wrench, TrendingDown, Eye,
} from 'lucide-react-native';
import apiClient from '@/lib/api';

const { width } = Dimensions.get('window');

export default function CarDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);
  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const [sellerPhone, setSellerPhone] = useState('');
  const [reviews, setReviews] = useState<any[]>([]);
  const [similarListings, setSimilarListings] = useState<any[]>([]);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [listingRes, reviewsRes, similarRes] = await Promise.all([
        apiClient.get(`/api/v1/listings/${id}`),
        apiClient.get(`/api/v1/reviews/user/${id}`).catch(() => ({ data: { success: false, data: [] } })),
        apiClient.get(`/api/v1/listings/${id}/similar`).catch(() => ({ data: { success: false, data: [] } })),
      ]);
      if (listingRes.data.success) setListing(listingRes.data.data);
      if (reviewsRes.data.success) setReviews(reviewsRes.data.data);
      if (similarRes.data.success) setSimilarListings(similarRes.data.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRevealPhone = async () => {
    try {
      const res = await apiClient.post(`/api/v1/listings/${id}/reveal-phone`);
      if (res.data.success) {
        setSellerPhone(res.data.data.phoneNumber);
        setPhoneRevealed(true);
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to reveal phone');
    }
  };

  const handleCall = () => {
    if (sellerPhone) {
      Linking.openURL(`tel:${sellerPhone}`);
    } else {
      handleRevealPhone();
    }
  };

  const handleReport = async (reason: string, details: string) => {
    try {
      await apiClient.post(`/api/v1/listings/${id}/report`, { reason, details });
      Alert.alert('Reported', 'Thank you for your report. Our team will review it.');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit report');
    }
  };

  const handleShare = async () => {
    if (!listing) return;
    await Share.share({
      message: `Check out this ${listing.title} on MotorWa.rw - ${Number(listing.priceRwf).toLocaleString()} RWF\nmotorwa.rw/cars/${listing.id}`,
    });
  };

  const handleSave = async () => {
    try {
      await apiClient.post(`/api/v1/saved/listings/${id}`);
      setSaved(!saved);
    } catch (error) {
      console.error('Failed to save listing:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.gold} />
      </View>
    );
  }

  if (!listing) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Listing not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const photos = listing.photos?.map((p: any) => p.photoUrl) || [];
  const specs = [
    { icon: Calendar, label: 'Year', value: listing.year.toString() },
    { icon: Gauge, label: 'Mileage', value: `${listing.mileageKm?.toLocaleString() || 0} km` },
    { icon: Fuel, label: 'Fuel', value: listing.fuelType },
    { icon: Settings, label: 'Transmission', value: listing.transmission },
  ];

  return (
    <View style={styles.container}>
      {/* Photo Carousel */}
      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} onScroll={(e) => {
        const offset = e.nativeEvent.contentOffset.x;
        setActivePhoto(Math.round(offset / width));
      }}>
        {photos.map((url: string, i: number) => (
          <Image key={i} source={{ uri: url }} style={styles.photo} />
        ))}
        {photos.length === 0 && <View style={[styles.photo, { backgroundColor: Colors.gray200 }]} />}
      </ScrollView>

      {/* Photo Indicators */}
      {photos.length > 1 && (
        <View style={styles.photoIndicators}>
          {photos.map((_: any, i: number) => (
            <View key={i} style={[styles.indicator, i === activePhoto && styles.indicatorActive]} />
          ))}
        </View>
      )}

      {/* Header Overlay */}
      <View style={styles.headerOverlay}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={handleSave}>
            <Heart size={24} color={Colors.white} fill={saved ? Colors.accent : 'transparent'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
            <Share2 size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.contentHeader}>
          <View>
            <Text style={styles.price}>{Number(listing.priceRwf).toLocaleString()} RWF</Text>
            <Text style={styles.title}>{listing.title}</Text>
          </View>
          {listing.isBoosted && <View style={styles.boostBadge}><Text style={styles.boostText}>Boosted</Text></View>}
        </View>

        {/* Location */}
        <View style={styles.locationRow}>
          <MapPin size={16} color={Colors.gray400} />
          <Text style={styles.locationText}>{listing.district}, {listing.province}</Text>
          <Eye size={14} color={Colors.gray400} style={{ marginLeft: 'auto' }} />
          <Text style={styles.locationText}>{listing.viewsCount || 0} views</Text>
        </View>

        {/* Specs Grid */}
        <View style={styles.specsGrid}>
          {specs.map((spec) => (
            <View key={spec.label} style={styles.specItem}>
              <spec.icon size={20} color={Colors.gold} />
              <Text style={styles.specLabel}>{spec.label}</Text>
              <Text style={styles.specValue}>{spec.value}</Text>
            </View>
          ))}
        </View>

        {/* Description */}
        {listing.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{listing.description}</Text>
          </View>
        )}

        {/* Seller Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seller Information</Text>
          <View style={styles.sellerCard}>
            <View style={styles.sellerAvatar}>
              <Text style={styles.sellerAvatarText}>{listing.user?.fullName?.charAt(0) || 'S'}</Text>
            </View>
            <View style={styles.sellerInfo}>
              <View style={styles.sellerNameRow}>
                <Text style={styles.sellerName}>{listing.user?.fullName || 'Seller'}</Text>
                {listing.user?.isIdVerified && <View style={styles.verifiedBadge}><Text style={styles.verifiedText}>Verified</Text></View>}
              </View>
              <Text style={styles.sellerSubtitle}>Member since {new Date(listing.user?.createdAt).getFullYear()}</Text>
              {listing.user?.averageRating > 0 && (
                <View style={styles.sellerRating}>
                  <Star size={12} color={Colors.gold} fill={Colors.gold} />
                  <Text style={styles.sellerRatingText}>{listing.user.averageRating.toFixed(1)} ({listing.user.reviewCount} reviews)</Text>
                </View>
              )}
              {listing.user?.isDealer && (
                <TouchableOpacity style={styles.dealerLink} onPress={() => router.push(`/dealers/${listing.user.dealerId}`)}>
                  <Text style={styles.dealerLinkText}>View Dealer Profile →</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Inspection Badge */}
        {!listing.hasInspection && (
          <View style={styles.section}>
            <TouchableOpacity style={styles.inspectionCard} onPress={() => Alert.alert('Book Inspection', 'Inspection booking will be available soon.')}>
              <Wrench size={24} color={Colors.navy} />
              <View style={styles.inspectionInfo}>
                <Text style={styles.inspectionTitle}>Book Pre-Purchase Inspection</Text>
                <Text style={styles.inspectionSubtitle}>Verified mechanics, full condition report</Text>
              </View>
              <ChevronRight size={20} color={Colors.gray400} />
            </TouchableOpacity>
          </View>
        )}

        {/* Reviews */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Seller Reviews</Text>
            <TouchableOpacity onPress={() => router.push(`/dealers/${listing.user?.dealerId}#reviews`)}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {reviews.length > 0 ? (
            reviews.slice(0, 2).map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewerAvatar}>
                    <Text style={styles.reviewerText}>{review.reviewer?.fullName?.charAt(0) || 'U'}</Text>
                  </View>
                  <View style={styles.reviewerInfo}>
                    <Text style={styles.reviewerName}>{review.reviewer?.fullName || 'User'}</Text>
                    <View style={styles.reviewStars}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={12} color={s <= review.rating ? Colors.gold : Colors.gray300} fill={s <= review.rating ? Colors.gold : 'transparent'} />
                      ))}
                    </View>
                  </View>
                </View>
                <Text style={styles.reviewComment}>{review.comment}</Text>
              </View>
            ))
          ) : (
            <View style={styles.noReviews}>
              <Text style={styles.noReviewsText}>No reviews yet</Text>
            </View>
          )}
        </View>

        {/* Similar Cars */}
        {similarListings.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Similar Cars</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
              {similarListings.map((car: any) => (
                <TouchableOpacity key={car.id} style={styles.similarCard} onPress={() => router.push(`/cars/${car.id}`)}>
                  <View style={styles.similarImage} />
                  <Text style={styles.similarTitle} numberOfLines={1}>{car.title}</Text>
                  <Text style={styles.similarPrice}>{Number(car.priceRwf).toLocaleString()} RWF</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Report */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.reportLink} onPress={() => {
            Alert.alert(
              'Report Listing',
              'Why are you reporting this listing?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Scam/Fraud', onPress: () => handleReport('SCAM', '') },
                { text: 'Wrong Info', onPress: () => handleReport('WRONG_INFO', '') },
                { text: 'Stolen Vehicle', onPress: () => handleReport('STOLEN', '') },
                { text: 'Other', onPress: () => handleReport('OTHER', '') },
              ]
            );
          }}>
            <Flag size={16} color={Colors.gray400} />
            <Text style={styles.reportText}>Report this listing</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.actionButtonSecondary} onPress={() => router.push(`/chat?listingId=${id}`)}>
          <MessageCircle size={20} color={Colors.navy} />
          <Text style={styles.actionTextSecondary}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButtonPrimary} onPress={handleCall}>
          <Phone size={20} color={Colors.white} />
          <Text style={styles.actionTextPrimary}>{phoneRevealed ? sellerPhone : 'Show Phone'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.cream },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.cream },
  errorTitle: { fontSize: FontSizes.xl, fontWeight: 'bold', color: Colors.gray900, marginBottom: 16 },
  photo: { width, height: 300, backgroundColor: Colors.gray100 },
  photoIndicators: { position: 'absolute', bottom: 280, alignSelf: 'center', flexDirection: 'row', gap: 6 },
  indicator: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)' },
  indicatorActive: { backgroundColor: Colors.white, width: 16 },
  headerOverlay: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 48, backgroundColor: 'rgba(0,0,0,0.3)' },
  headerButton: { backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 24, padding: 10 },
  headerActions: { flexDirection: 'row', gap: 8 },
  content: { flex: 1 },
  contentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: 16 },
  price: { fontSize: FontSizes['3xl'], fontWeight: 'bold', color: Colors.gold },
  title: { fontSize: FontSizes.lg, fontWeight: '600', color: Colors.gray900, marginTop: 4 },
  boostBadge: { backgroundColor: Colors.goldPale, paddingHorizontal: 10, paddingVertical: 4, borderRadius: BorderRadius.sm },
  boostText: { fontSize: FontSizes.xs, color: Colors.gold, fontWeight: '600' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, marginBottom: 16 },
  locationText: { fontSize: FontSizes.sm, color: Colors.gray400 },
  specsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 12 },
  specItem: { width: '47%', backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: Colors.gray100 },
  specLabel: { fontSize: FontSizes.xs, color: Colors.gray400, marginTop: 8 },
  specValue: { fontSize: FontSizes.base, fontWeight: '600', color: Colors.gray900, marginTop: 2 },
  section: { paddingHorizontal: 16, marginTop: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: { fontSize: FontSizes.lg, fontWeight: 'bold', color: Colors.gray900 },
  seeAllText: { color: Colors.gold, fontWeight: '600' },
  description: { fontSize: FontSizes.base, color: Colors.gray600, lineHeight: 24, marginTop: 8 },
  sellerCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: 16, borderWidth: 1, borderColor: Colors.gray200 },
  sellerAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.goldPale, justifyContent: 'center', alignItems: 'center' },
  sellerAvatarText: { fontSize: FontSizes.lg, fontWeight: 'bold', color: Colors.navy },
  sellerInfo: { flex: 1, marginLeft: 12 },
  sellerNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sellerName: { fontSize: FontSizes.base, fontWeight: '600', color: Colors.gray900 },
  verifiedBadge: { backgroundColor: Colors.goldPale, paddingHorizontal: 8, paddingVertical: 2, borderRadius: BorderRadius.sm },
  verifiedText: { fontSize: FontSizes.xs, color: Colors.green, fontWeight: '600' },
  sellerSubtitle: { fontSize: FontSizes.sm, color: Colors.gray400, marginTop: 2 },
  sellerRating: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  sellerRatingText: { fontSize: FontSizes.xs, color: Colors.gray600 },
  dealerLink: { marginTop: 6 },
  dealerLinkText: { fontSize: FontSizes.sm, color: Colors.gold, fontWeight: '600' },
  inspectionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.goldPale, borderRadius: BorderRadius.lg, padding: 16, gap: 12 },
  inspectionInfo: { flex: 1 },
  inspectionTitle: { fontSize: FontSizes.base, fontWeight: '600', color: Colors.navy },
  inspectionSubtitle: { fontSize: FontSizes.sm, color: Colors.navy + 'AA' },
  reviewCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: 14, borderWidth: 1, borderColor: Colors.gray200, marginBottom: 8 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  reviewerAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.goldPale, justifyContent: 'center', alignItems: 'center' },
  reviewerText: { fontSize: FontSizes.sm, fontWeight: '600', color: Colors.navy },
  reviewerInfo: { marginLeft: 10 },
  reviewerName: { fontSize: FontSizes.sm, fontWeight: '600', color: Colors.gray900 },
  reviewStars: { flexDirection: 'row', gap: 2, marginTop: 2 },
  reviewComment: { fontSize: FontSizes.sm, color: Colors.gray600, lineHeight: 20 },
  noReviews: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: Colors.gray200 },
  noReviewsText: { fontSize: FontSizes.base, color: Colors.gray400 },
  horizontalList: { paddingRight: 16 },
  similarCard: { width: 140, backgroundColor: Colors.white, borderRadius: BorderRadius.lg, overflow: 'hidden', borderWidth: 1, borderColor: Colors.gray200, marginRight: 10 },
  similarImage: { height: 90, backgroundColor: Colors.gray200 },
  similarTitle: { fontSize: FontSizes.sm, fontWeight: '600', color: Colors.gray900, padding: 8, paddingBottom: 4 },
  similarPrice: { fontSize: FontSizes.sm, fontWeight: 'bold', color: Colors.gold, paddingHorizontal: 8, paddingBottom: 8 },
  reportLink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12 },
  reportText: { fontSize: FontSizes.sm, color: Colors.gray400 },
  actionBar: { flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 24, paddingTop: 12, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.gray200 },
  actionButtonSecondary: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.gray100, borderRadius: BorderRadius.md, paddingVertical: 14, gap: 8 },
  actionTextSecondary: { fontSize: FontSizes.base, fontWeight: '600', color: Colors.navy },
  actionButtonPrimary: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.gold, borderRadius: BorderRadius.md, paddingVertical: 14, gap: 8, marginLeft: 12 },
  actionTextPrimary: { fontSize: FontSizes.base, fontWeight: '600', color: Colors.navy },
  backButton: { backgroundColor: Colors.gold, borderRadius: BorderRadius.md, paddingHorizontal: 24, paddingVertical: 12 },
  backText: { fontSize: FontSizes.base, fontWeight: '600', color: Colors.navy },
});
