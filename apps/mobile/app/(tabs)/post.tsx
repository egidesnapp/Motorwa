import { useState, useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TextInput,
  TouchableOpacity, Alert, ActivityIndicator, Image,
  KeyboardAvoidingView, Platform, Modal,
} from 'react-native';
import { router } from 'expo-router';
import { Colors, BorderRadius, FontSizes, Spacing } from '@/constants/theme';
import { ArrowLeft, Camera, X, Check, ChevronDown, MapPin, Loader2 } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import apiClient from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

const CAR_MAKES = ['Toyota', 'Mercedes-Benz', 'BMW', 'Honda', 'Nissan', 'Hyundai', 'Volkswagen', 'Mitsubishi', 'Subaru', 'Mazda'];
const TRANSMISSIONS = ['Automatic', 'Manual'];
const FUEL_TYPES = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];
const PROVINCES = ['Kigali', 'Northern', 'Southern', 'Eastern', 'Western'];
const CONDITIONS = ['New', 'Used - Excellent', 'Used - Good', 'Used - Fair'];
const IMPORT_ORIGINS = ['Rwanda', 'Japan', 'UAE', 'Kenya', 'UK', 'USA', 'China'];

const STEPS = ['Details', 'Photos', 'Pricing', 'Review'];

export default function PostScreen() {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [locationLoading, setLocationLoading] = useState(false);

  const [form, setForm] = useState({
    title: '', make: '', model: '', year: '', condition: 'Used - Good',
    mileageKm: '', priceRwf: '', transmission: 'Automatic', fuelType: 'Petrol',
    province: 'Kigali', district: '', description: '',
    importOrigin: 'Rwanda', hasAccidentHistory: false, hasServiceHistory: false,
  });

  const pickImage = async () => {
    if (photos.length >= 15) {
      Alert.alert('Limit Reached', 'Maximum 15 photos allowed');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      const newPhotos = result.assets.map(a => a.uri).slice(0, 15 - photos.length);
      setPhotos([...photos, ...newPhotos]);
    }
  };

  const takePhoto = async () => {
    if (photos.length >= 15) {
      Alert.alert('Limit Reached', 'Maximum 15 photos allowed');
      return;
    }
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera access is needed to take photos');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled) {
      setPhotos([...photos, result.assets[0].uri]);
    }
  };

  const useCurrentLocation = async () => {
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Location access is needed');
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      if (geocode.length > 0) {
        const addr = geocode[0];
        setForm({ ...form, district: addr.district || addr.city || '', province: addr.region || 'Kigali' });
      }
    } catch (error) {
      Alert.alert('Error', 'Could not get your location');
    } finally {
      setLocationLoading(false);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // In production, upload photos first to R2, then get URLs
      // For now, we'll simulate with placeholder URLs
      const photoUrls = photos.map((_, i) => ({
        photoUrl: `https://placeholder.com/photo${i}.jpg`,
        thumbnailUrl: `https://placeholder.com/thumb${i}.jpg`,
        sortOrder: i,
      }));

      const res = await apiClient.post('/api/v1/listings', {
        ...form,
        year: parseInt(form.year),
        mileageKm: parseInt(form.mileageKm) || 0,
        priceRwf: form.priceRwf.replace(/,/g, ''),
        photos: photoUrls,
      });

      if (res.data.success) {
        Alert.alert('Success', 'Listing created successfully', [
          { text: 'View Listing', onPress: () => router.replace('/(tabs)/index') },
        ]);
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 0: return form.make && form.model && form.year && form.transmission && form.fuelType && form.condition;
      case 1: return photos.length > 0;
      case 2: return form.priceRwf && form.province && form.district;
      default: return true;
    }
  };

  const renderStep0 = () => (
    <View style={styles.formSection}>
      <Text style={styles.label}>Title</Text>
      <TextInput style={styles.input} value={form.title} onChangeText={(t) => setForm({ ...form, title: t })} placeholder={`${form.make} ${form.model} ${form.year}`} placeholderTextColor={Colors.gray400} />

      <Text style={styles.label}>Make</Text>
      <View style={styles.optionsGrid}>
        {CAR_MAKES.map((make) => (
          <TouchableOpacity key={make} style={[styles.optionChip, form.make === make && styles.optionChipActive]} onPress={() => setForm({ ...form, make })}>
            <Text style={[styles.optionText, form.make === make && styles.optionTextActive]}>{make}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Model</Text>
      <TextInput style={styles.input} value={form.model} onChangeText={(t) => setForm({ ...form, model: t })} placeholder="e.g. Corolla, C-Class" placeholderTextColor={Colors.gray400} />

      <Text style={styles.label}>Year</Text>
      <TextInput style={styles.input} value={form.year} onChangeText={(t) => setForm({ ...form, year: t })} placeholder="e.g. 2020" keyboardType="number-pad" placeholderTextColor={Colors.gray400} />

      <Text style={styles.label}>Condition</Text>
      <View style={styles.optionsGrid}>
        {CONDITIONS.map((c) => (
          <TouchableOpacity key={c} style={[styles.optionChip, form.condition === c && styles.optionChipActive]} onPress={() => setForm({ ...form, condition: c })}>
            <Text style={[styles.optionText, form.condition === c && styles.optionTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Transmission</Text>
      <View style={styles.optionsRow}>
        {TRANSMISSIONS.map((t) => (
          <TouchableOpacity key={t} style={[styles.optionChipLarge, form.transmission === t && styles.optionChipLargeActive]} onPress={() => setForm({ ...form, transmission: t })}>
            <Text style={[styles.optionTextLarge, form.transmission === t && styles.optionTextLargeActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Fuel Type</Text>
      <View style={styles.optionsRow}>
        {FUEL_TYPES.map((f) => (
          <TouchableOpacity key={f} style={[styles.optionChipLarge, form.fuelType === f && styles.optionChipLargeActive]} onPress={() => setForm({ ...form, fuelType: f })}>
            <Text style={[styles.optionTextLarge, form.fuelType === f && styles.optionTextLargeActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.formSection}>
      <Text style={styles.label}>Photos ({photos.length}/15)</Text>
      <Text style={styles.labelSubtext}>First photo will be the cover image</Text>

      <View style={styles.photoActions}>
        <TouchableOpacity style={styles.photoActionButton} onPress={takePhoto}>
          <Camera size={20} color={Colors.navy} />
          <Text style={styles.photoActionText}>Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.photoActionButton} onPress={pickImage}>
          <Text style={styles.photoActionText}>Gallery</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.photoGrid}>
        {photos.map((uri, index) => (
          <View key={index} style={styles.photoItem}>
            <Image source={{ uri }} style={styles.photoImage} />
            {index === 0 && <View style={styles.coverBadge}><Text style={styles.coverText}>Cover</Text></View>}
            <TouchableOpacity style={styles.photoRemove} onPress={() => removePhoto(index)}>
              <X size={16} color={Colors.white} />
            </TouchableOpacity>
          </View>
        ))}
        {photos.length < 15 && (
          <TouchableOpacity style={styles.photoAdd} onPress={pickImage}>
            <Text style={styles.photoAddText}>+ Add Photo</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.formSection}>
      <Text style={styles.label}>Price (RWF)</Text>
      <TextInput
        style={styles.priceInput}
        value={form.priceRwf}
        onChangeText={(t) => {
          const num = t.replace(/[^0-9]/g, '');
          setForm({ ...form, priceRwf: Number(num).toLocaleString() });
        }}
        placeholder="e.g. 15,000,000"
        keyboardType="number-pad"
        placeholderTextColor={Colors.gray400}
      />

      <Text style={styles.label}>Import Origin</Text>
      <View style={styles.optionsGrid}>
        {IMPORT_ORIGINS.map((o) => (
          <TouchableOpacity key={o} style={[styles.optionChip, form.importOrigin === o && styles.optionChipActive]} onPress={() => setForm({ ...form, importOrigin: o })}>
            <Text style={[styles.optionText, form.importOrigin === o && styles.optionTextActive]}>{o}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Province</Text>
      <View style={styles.optionsGrid}>
        {PROVINCES.map((p) => (
          <TouchableOpacity key={p} style={[styles.optionChip, form.province === p && styles.optionChipActive]} onPress={() => setForm({ ...form, province: p })}>
            <Text style={[styles.optionText, form.province === p && styles.optionTextActive]}>{p}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>District</Text>
      <View style={styles.districtRow}>
        <TextInput style={[styles.input, { flex: 1 }]} value={form.district} onChangeText={(t) => setForm({ ...form, district: t })} placeholder="e.g. Gasabo, Nyarugenge" placeholderTextColor={Colors.gray400} />
        <TouchableOpacity style={styles.locationButton} onPress={useCurrentLocation} disabled={locationLoading}>
          {locationLoading ? <ActivityIndicator size="small" color={Colors.navy} /> : <MapPin size={20} color={Colors.navy} />}
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Vehicle History</Text>
      <View style={styles.toggleRow}>
        <TouchableOpacity style={[styles.toggleOption, form.hasServiceHistory && styles.toggleOptionActive]} onPress={() => setForm({ ...form, hasServiceHistory: !form.hasServiceHistory })}>
          <View style={[styles.toggleDot, form.hasServiceHistory && styles.toggleDotActive]} />
          <Text style={[styles.toggleText, form.hasServiceHistory && styles.toggleTextActive]}>Service History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.toggleOption, form.hasAccidentHistory && styles.toggleOptionActive]} onPress={() => setForm({ ...form, hasAccidentHistory: !form.hasAccidentHistory })}>
          <View style={[styles.toggleDot, form.hasAccidentHistory && styles.toggleDotActive]} />
          <Text style={[styles.toggleText, form.hasAccidentHistory && styles.toggleTextActive]}>Accident History</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={form.description}
        onChangeText={(t) => setForm({ ...form, description: t })}
        placeholder="Describe the car's features, history, and any issues..."
        placeholderTextColor={Colors.gray400}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.formSection}>
      <Text style={styles.sectionTitle}>Review Your Listing</Text>

      <View style={styles.reviewItem}>
        <Text style={styles.reviewLabel}>{form.make} {form.model} {form.year}</Text>
        <Text style={styles.reviewValue}>{form.condition} • {form.transmission} • {form.fuelType}</Text>
      </View>
      <View style={styles.reviewItem}>
        <Text style={styles.reviewLabel}>Price</Text>
        <Text style={[styles.reviewValue, styles.priceHighlight]}>{form.priceRwf} RWF</Text>
      </View>
      <View style={styles.reviewItem}>
        <Text style={styles.reviewLabel}>Location</Text>
        <Text style={styles.reviewValue}>{form.district}, {form.province}</Text>
      </View>
      <View style={styles.reviewItem}>
        <Text style={styles.reviewLabel}>Photos</Text>
        <Text style={styles.reviewValue}>{photos.length} photos uploaded</Text>
      </View>
      {form.description && (
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Description</Text>
          <Text style={styles.reviewText}>{form.description}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.publishButton} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color={Colors.navy} /> : <Text style={styles.publishText}>Publish Listing</Text>}
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => step > 0 ? setStep(step - 1) : router.back()}>
          <ArrowLeft size={24} color={Colors.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post Your Car</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Progress Dots */}
      <View style={styles.progressContainer}>
        {STEPS.map((s, i) => (
          <View key={s} style={styles.progressStep}>
            <View style={[styles.progressDot, i <= step && styles.progressDotActive]} />
            <Text style={[styles.progressLabel, i === step && styles.progressLabelActive]}>{s}</Text>
          </View>
        ))}
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {step === 0 && renderStep0()}
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </ScrollView>

      {/* Next Button */}
      {step < 3 && (
        <View style={styles.footer}>
          <TouchableOpacity style={[styles.nextButton, !canProceed() && styles.nextButtonDisabled]} onPress={() => setStep(step + 1)} disabled={!canProceed()}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.gray200 },
  headerTitle: { fontSize: FontSizes.lg, fontWeight: '600', color: Colors.gray900 },
  progressContainer: { flexDirection: 'row', paddingHorizontal: 24, paddingVertical: 16, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.gray200 },
  progressStep: { flex: 1, alignItems: 'center' },
  progressDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.gray200, marginBottom: 4 },
  progressDotActive: { backgroundColor: Colors.gold },
  progressLabel: { fontSize: FontSizes.xs, color: Colors.gray400 },
  progressLabelActive: { color: Colors.navy, fontWeight: '600' },
  content: { flex: 1 },
  formSection: { padding: 20 },
  label: { fontSize: FontSizes.sm, fontWeight: '600', color: Colors.gray700, marginBottom: 8, marginTop: 16 },
  labelSubtext: { fontSize: FontSizes.xs, color: Colors.gray400, marginTop: -4, marginBottom: 12 },
  input: { backgroundColor: Colors.white, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.gray200, paddingHorizontal: 14, paddingVertical: 12, fontSize: FontSizes.base, color: Colors.gray900 },
  priceInput: { backgroundColor: Colors.white, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.gray200, paddingHorizontal: 14, paddingVertical: 12, fontSize: FontSizes['2xl'], fontWeight: 'bold', color: Colors.gold },
  textArea: { minHeight: 100, paddingTop: 12 },
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  optionChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.gray200, backgroundColor: Colors.white },
  optionChipActive: { backgroundColor: Colors.goldPale, borderColor: Colors.gold },
  optionText: { fontSize: FontSizes.sm, color: Colors.gray600 },
  optionTextActive: { color: Colors.gold, fontWeight: '600' },
  optionsRow: { flexDirection: 'row', gap: 12 },
  optionChipLarge: { flex: 1, paddingVertical: 12, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.gray200, backgroundColor: Colors.white, alignItems: 'center' },
  optionChipLargeActive: { backgroundColor: Colors.goldPale, borderColor: Colors.gold },
  optionTextLarge: { fontSize: FontSizes.base, color: Colors.gray600 },
  optionTextLargeActive: { color: Colors.navy, fontWeight: '600' },
  photoActions: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  photoActionButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: Colors.white, borderRadius: BorderRadius.md, paddingVertical: 10, borderWidth: 1, borderColor: Colors.gray200 },
  photoActionText: { fontSize: FontSizes.sm, color: Colors.navy, fontWeight: '600' },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  photoItem: { width: '30%', aspectRatio: 1, borderRadius: BorderRadius.md, overflow: 'hidden', position: 'relative' },
  photoImage: { width: '100%', height: '100%' },
  coverBadge: { position: 'absolute', top: 4, left: 4, backgroundColor: Colors.gold, paddingHorizontal: 6, paddingVertical: 2, borderRadius: BorderRadius.sm },
  coverText: { fontSize: FontSizes.xs, fontWeight: '600', color: Colors.navy },
  photoRemove: { position: 'absolute', top: 4, right: 4, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 12, padding: 4 },
  photoAdd: { width: '30%', aspectRatio: 1, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.gray200, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.white },
  photoAddText: { fontSize: FontSizes.xs, color: Colors.gray400, marginTop: 4 },
  districtRow: { flexDirection: 'row', gap: 8 },
  locationButton: { backgroundColor: Colors.white, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.gray200, padding: 12, justifyContent: 'center', alignItems: 'center' },
  toggleRow: { gap: 8 },
  toggleOption: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.white, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.gray200, paddingHorizontal: 16, paddingVertical: 12 },
  toggleOptionActive: { backgroundColor: Colors.goldPale, borderColor: Colors.gold },
  toggleDot: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: Colors.gray300 },
  toggleDotActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  toggleText: { fontSize: FontSizes.base, color: Colors.gray600 },
  toggleTextActive: { color: Colors.navy, fontWeight: '600' },
  sectionTitle: { fontSize: FontSizes.xl, fontWeight: 'bold', color: Colors.gray900, marginBottom: 20 },
  reviewItem: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: Colors.gray200 },
  reviewLabel: { fontSize: FontSizes.xs, color: Colors.gray400, marginBottom: 4 },
  reviewValue: { fontSize: FontSizes.base, fontWeight: '600', color: Colors.gray900 },
  priceHighlight: { color: Colors.gold, fontSize: FontSizes.xl },
  reviewText: { fontSize: FontSizes.sm, color: Colors.gray600, lineHeight: 22 },
  publishButton: { backgroundColor: Colors.gold, borderRadius: BorderRadius.md, paddingVertical: 16, alignItems: 'center', marginTop: 24 },
  publishText: { fontSize: FontSizes.base, fontWeight: '600', color: Colors.navy },
  footer: { padding: 20, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.gray200 },
  nextButton: { backgroundColor: Colors.gold, borderRadius: BorderRadius.md, paddingVertical: 16, alignItems: 'center' },
  nextButtonDisabled: { backgroundColor: Colors.gray200 },
  nextButtonText: { fontSize: FontSizes.base, fontWeight: '600', color: Colors.navy },
});
