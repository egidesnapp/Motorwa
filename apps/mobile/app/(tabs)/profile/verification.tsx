import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image, TextInput } from 'react-native';
import { router, Stack } from 'expo-router';
import { Colors, FontSizes, BorderRadius } from '@/constants/theme';
import { ArrowLeft, Shield, Camera, CheckCircle, Clock, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

type VerificationStatus = 'none' | 'pending' | 'approved' | 'rejected';

export default function VerificationScreen() {
  const [status, setStatus] = useState<VerificationStatus>('none');
  const [loading, setLoading] = useState(false);
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [idNumber, setIdNumber] = useState('');

  const pickImage = async (side: 'front' | 'back') => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled) {
      if (side === 'front') setFrontImage(result.assets[0].uri);
      else setBackImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!idNumber || !frontImage || !backImage) {
      Alert.alert('Incomplete', 'Please fill in your ID number and upload both sides of your ID');
      return;
    }
    setLoading(true);
    try {
      setStatus('pending');
      Alert.alert('Submitted', 'Your ID verification is being reviewed. This usually takes 24 hours.');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit verification');
    } finally {
      setLoading(false);
    }
  };

  const renderNone = () => (
    <View style={styles.content}>
      <View style={styles.infoCard}>
        <Shield size={48} color={Colors.gold} />
        <Text style={styles.infoTitle}>Verify Your Identity</Text>
        <Text style={styles.infoText}>Verified sellers get a trusted badge, higher visibility, and more buyer trust</Text>
      </View>

      <View style={styles.benefitsCard}>
        <Text style={styles.benefitsTitle}>Benefits of Verification</Text>
        {[
          'Trusted seller badge on all listings',
          'Higher ranking in search results',
          'Buyers more likely to contact you',
          'Access to dealer features',
        ].map((benefit, i) => (
          <View key={i} style={styles.benefitRow}>
            <CheckCircle size={18} color={Colors.green} />
            <Text style={styles.benefitText}>{benefit}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.formLabel}>ID Number</Text>
      <View style={styles.inputRow}>
        <Text style={styles.inputLabel}>1-</Text>
        <TextInput style={styles.input} value={idNumber} onChangeText={setIdNumber} placeholder="2000XXXXXXXXXXX" placeholderTextColor={Colors.gray400} keyboardType="number-pad" maxLength={16} />
      </View>

      <Text style={styles.formLabel}>National ID - Front</Text>
      <TouchableOpacity style={[styles.uploadArea, frontImage && styles.uploadAreaFilled]} onPress={() => pickImage('front')}>
        {frontImage ? (
          <Image source={{ uri: frontImage }} style={styles.uploadedImage} />
        ) : (
          <>
            <Camera size={32} color={Colors.gray400} />
            <Text style={styles.uploadText}>Tap to capture front</Text>
          </>
        )}
      </TouchableOpacity>

      <Text style={styles.formLabel}>National ID - Back</Text>
      <TouchableOpacity style={[styles.uploadArea, backImage && styles.uploadAreaFilled]} onPress={() => pickImage('back')}>
        {backImage ? (
          <Image source={{ uri: backImage }} style={styles.uploadedImage} />
        ) : (
          <>
            <Camera size={32} color={Colors.gray400} />
            <Text style={styles.uploadText}>Tap to capture back</Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={[styles.submitButton, (!idNumber || !frontImage || !backImage) && styles.submitButtonDisabled]} onPress={handleSubmit} disabled={!idNumber || !frontImage || !backImage}>
        {loading ? <ActivityIndicator color={Colors.navy} /> : <Text style={styles.submitText}>Submit for Verification</Text>}
      </TouchableOpacity>
    </View>
  );

  const renderPending = () => (
    <View style={[styles.content, styles.centerContent]}>
      <View style={styles.statusCard}>
        <Clock size={64} color={Colors.gold} />
        <Text style={styles.statusTitle}>Verification Pending</Text>
        <Text style={styles.statusText}>Your ID is being reviewed. This typically takes up to 24 hours.</Text>
        <Text style={styles.statusHint}>You will be notified once your verification is complete</Text>
      </View>
    </View>
  );

  const renderApproved = () => (
    <View style={[styles.content, styles.centerContent]}>
      <View style={[styles.statusCard, { borderColor: Colors.green }]}>
        <CheckCircle size={64} color={Colors.green} />
        <Text style={styles.statusTitle}>Verified</Text>
        <Text style={styles.statusText}>Your identity has been verified. You now have the trusted seller badge!</Text>
      </View>
    </View>
  );

  const renderRejected = () => (
    <View style={[styles.content, styles.centerContent]}>
      <View style={[styles.statusCard, { borderColor: Colors.accent }]}>
        <X size={64} color={Colors.accent} />
        <Text style={styles.statusTitle}>Verification Failed</Text>
        <Text style={styles.statusText}>Your ID could not be verified. Please try again with a clearer photo</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => setStatus('none')}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verification</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {status === 'none' && renderNone()}
        {status === 'pending' && renderPending()}
        {status === 'approved' && renderApproved()}
        {status === 'rejected' && renderRejected()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.gray200 },
  headerTitle: { fontSize: FontSizes.lg, fontWeight: '600', color: Colors.gray900 },
  content: { padding: 20 },
  centerContent: { flex: 1, justifyContent: 'center' },
  infoCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: Colors.gray200, marginBottom: 20 },
  infoTitle: { fontSize: FontSizes.xl, fontWeight: 'bold', color: Colors.gray900, marginTop: 12, marginBottom: 8 },
  infoText: { fontSize: FontSizes.base, color: Colors.gray600, textAlign: 'center' },
  benefitsCard: { backgroundColor: Colors.goldPale, borderRadius: BorderRadius.lg, padding: 20, marginBottom: 24 },
  benefitsTitle: { fontSize: FontSizes.lg, fontWeight: '600', color: Colors.navy, marginBottom: 16 },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  benefitText: { fontSize: FontSizes.base, color: Colors.navy },
  formLabel: { fontSize: FontSizes.sm, fontWeight: '600', color: Colors.gray700, marginBottom: 8 },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.gray200, paddingHorizontal: 14, marginBottom: 20 },
  inputLabel: { fontSize: FontSizes.base, color: Colors.gray900, fontWeight: '600' },
  input: { flex: 1, paddingVertical: 12, fontSize: FontSizes.base, color: Colors.gray900 },
  uploadArea: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, borderWidth: 2, borderColor: Colors.gray200, borderStyle: 'dashed', padding: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 20, minHeight: 120 },
  uploadAreaFilled: { borderWidth: 0, padding: 0 },
  uploadText: { fontSize: FontSizes.base, color: Colors.gray400, marginTop: 8 },
  uploadedImage: { width: '100%', height: 160, borderRadius: BorderRadius.lg },
  submitButton: { backgroundColor: Colors.gold, borderRadius: BorderRadius.md, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  submitButtonDisabled: { backgroundColor: Colors.gray200 },
  submitText: { fontSize: FontSizes.base, fontWeight: '600', color: Colors.navy },
  statusCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: 32, alignItems: 'center', borderWidth: 1, borderColor: Colors.gray200 },
  statusTitle: { fontSize: FontSizes['2xl'], fontWeight: 'bold', color: Colors.gray900, marginTop: 16, marginBottom: 8 },
  statusText: { fontSize: FontSizes.base, color: Colors.gray600, textAlign: 'center', marginBottom: 8 },
  statusHint: { fontSize: FontSizes.sm, color: Colors.gray400, textAlign: 'center' },
  retryButton: { backgroundColor: Colors.gold, borderRadius: BorderRadius.md, paddingHorizontal: 24, paddingVertical: 12, marginTop: 16 },
  retryText: { fontSize: FontSizes.base, fontWeight: '600', color: Colors.navy },
});
