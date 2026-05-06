import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Colors, FontSizes, BorderRadius } from '@/constants/theme';
import { MapPin, Gauge, Fuel, Heart } from 'lucide-react-native';

interface CarCardProps {
  listing: {
    id: string;
    title: string;
    year: number;
    priceRwf: string;
    mileageKm: number;
    fuelType: string;
    transmission: string;
    province: string;
    district: string;
    isBoosted: boolean;
    photos: Array<{ photoUrl: string; thumbnailUrl: string }>;
  };
  onPress: () => void;
}

export default function CarCard({ listing, onPress }: CarCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.imageContainer}>
        {listing.photos?.[0]?.thumbnailUrl ? (
          <View style={styles.image} />
        ) : (
          <View style={[styles.image, { backgroundColor: Colors.gray200 }]} />
        )}
        {listing.isBoosted && (
          <View style={styles.boostBadge}>
            <Text style={styles.boostText}>Boosted</Text>
          </View>
        )}
        <TouchableOpacity style={styles.saveButton}>
          <Heart size={18} color={Colors.gray600} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{listing.title}</Text>
        <Text style={styles.price}>{Number(listing.priceRwf).toLocaleString()} RWF</Text>

        <View style={styles.specsRow}>
          <View style={styles.specItem}>
            <Gauge size={14} color={Colors.gray400} />
            <Text style={styles.specText}>{listing.mileageKm?.toLocaleString() || 0} km</Text>
          </View>
          <View style={styles.specItem}>
            <Fuel size={14} color={Colors.gray400} />
            <Text style={styles.specText}>{listing.fuelType}</Text>
          </View>
          <View style={styles.specItem}>
            <MapPin size={14} color={Colors.gray400} />
            <Text style={styles.specText}>{listing.district}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, overflow: 'hidden', borderWidth: 1, borderColor: Colors.gray200, marginBottom: 12 },
  imageContainer: { position: 'relative', height: 160, backgroundColor: Colors.gray100 },
  image: { width: '100%', height: '100%' },
  boostBadge: { position: 'absolute', top: 10, left: 10, backgroundColor: Colors.goldPale, paddingHorizontal: 8, paddingVertical: 4, borderRadius: BorderRadius.sm },
  boostText: { fontSize: FontSizes.xs, color: Colors.gold, fontWeight: '600' },
  saveButton: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 20, padding: 8 },
  content: { padding: 14 },
  title: { fontSize: FontSizes.base, fontWeight: '600', color: Colors.gray900, marginBottom: 4 },
  price: { fontSize: FontSizes.lg, fontWeight: 'bold', color: Colors.gold, marginBottom: 8 },
  specsRow: { flexDirection: 'row', gap: 12 },
  specItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  specText: { fontSize: FontSizes.sm, color: Colors.gray600 },
});
