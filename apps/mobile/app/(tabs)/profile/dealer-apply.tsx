import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { router, Stack } from 'expo-router';
import { Colors, FontSizes, BorderRadius } from '@/constants/theme';
import { ArrowLeft, Building, Shield, CheckCircle } from 'lucide-react-native';
import apiClient from '@/lib/api';

export default function DealerApplyScreen() {
  const [form, setForm] = useState({
    companyName: '',
    description: '',
    website: '',
    province: 'Kigali',
    district: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleApply = async () => {
    if (!form.companyName.trim() || !form.description.trim() || !form.district.trim()) {
      Alert.alert('Incomplete', 'Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      await apiClient.post('/api/v1/dealers/apply', form);
      setSubmitted(true);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color={Colors.navy} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Apply as Dealer</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.successContent}>
          <CheckCircle size={64} color={Colors.green} />
          <Text style={styles.successTitle}>Application Submitted!</Text>
          <Text style={styles.successText}>We will review your application and get back to you within 24-48 hours.</Text>
          <TouchableOpacity style={styles.doneButton} onPress={() => router.replace('/(tabs)/profile')}>
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const benefits = [
    'List up to 50+ vehicles simultaneously',
    'Dealer badge builds buyer trust',
    'Priority placement in search results',
    'Analytics dashboard for your listings',
    'Dedicated account support',
    'Team member management',
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Apply as Dealer</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.benefitsCard}>
          <Shield size={24} color={Colors.gold} />
          <Text style={styles.benefitsTitle}>Dealer Benefits</Text>
          {benefits.map((b, i) => (
            <View key={i} style={styles.benefitRow}>
              <CheckCircle size={16} color={Colors.green} />
              <Text style={styles.benefitText}>{b}</Text>
            </View>
          ))}
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>Company Name *</Text>
          <TextInput style={styles.input} value={form.companyName} onChangeText={(t) => setForm({ ...form, companyName: t })} placeholder="e.g. Kigali Auto Dealers" placeholderTextColor={Colors.gray400} />

          <Text style={styles.label}>Description *</Text>
          <TextInput style={[styles.input, styles.textArea]} value={form.description} onChangeText={(t) => setForm({ ...form, description: t })} placeholder="Tell buyers about your dealership..." placeholderTextColor={Colors.gray400} multiline numberOfLines={3} textAlignVertical="top" />

          <Text style={styles.label}>Website</Text>
          <TextInput style={styles.input} value={form.website} onChangeText={(t) => setForm({ ...form, website: t })} placeholder="https://example.com" placeholderTextColor={Colors.gray400} keyboardType="url" />

          <Text style={styles.label}>Province</Text>
          <View style={styles.optionsRow}>
            {['Kigali', 'Northern', 'Southern', 'Eastern', 'Western'].map((p) => (
              <TouchableOpacity key={p} style={[styles.optionChip, form.province === p && styles.optionChipActive]} onPress={() => setForm({ ...form, province: p })}>
                <Text style={[styles.optionText, form.province === p && styles.optionTextActive]}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>District *</Text>
          <TextInput style={styles.input} value={form.district} onChangeText={(t) => setForm({ ...form, district: t })} placeholder="e.g. Gasabo" placeholderTextColor={Colors.gray400} />

          <TouchableOpacity style={[styles.submitButton, loading && styles.submitButtonDisabled]} onPress={handleApply} disabled={loading}>
            {loading ? <ActivityIndicator color={Colors.navy} /> : (
              <>
                <Building size={20} color={Colors.navy} />
                <Text style={styles.submitText}>Submit Application</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.gray200 },
  headerTitle: { fontSize: FontSizes.lg, fontWeight: '600', color: Colors.gray900 },
  content: { padding: 20 },
  benefitsCard: { backgroundColor: Colors.goldPale, borderRadius: BorderRadius.lg, padding: 20, marginBottom: 24 },
  benefitsTitle: { fontSize: FontSizes.lg, fontWeight: '600', color: Colors.navy, marginBottom: 16, marginTop: 8 },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  benefitText: { fontSize: FontSizes.base, color: Colors.navy },
  formSection: {},
  label: { fontSize: FontSizes.sm, fontWeight: '600', color: Colors.gray700, marginBottom: 8, marginTop: 16 },
  input: { backgroundColor: Colors.white, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.gray200, paddingHorizontal: 14, paddingVertical: 12, fontSize: FontSizes.base, color: Colors.gray900 },
  textArea: { minHeight: 80, paddingTop: 12 },
  optionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  optionChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.gray200, backgroundColor: Colors.white },
  optionChipActive: { backgroundColor: Colors.goldPale, borderColor: Colors.gold },
  optionText: { fontSize: FontSizes.sm, color: Colors.gray600 },
  optionTextActive: { color: Colors.gold, fontWeight: '600' },
  submitButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.gold, borderRadius: BorderRadius.md, paddingVertical: 16, marginTop: 32 },
  submitButtonDisabled: { backgroundColor: Colors.gray200 },
  submitText: { fontSize: FontSizes.base, fontWeight: '600', color: Colors.navy },
  successContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  successTitle: { fontSize: FontSizes['2xl'], fontWeight: 'bold', color: Colors.gray900, marginTop: 16, marginBottom: 8 },
  successText: { fontSize: FontSizes.base, color: Colors.gray600, textAlign: 'center', marginBottom: 32 },
  doneButton: { backgroundColor: Colors.gold, borderRadius: BorderRadius.md, paddingHorizontal: 32, paddingVertical: 14 },
  doneText: { fontSize: FontSizes.base, fontWeight: '600', color: Colors.navy },
});
