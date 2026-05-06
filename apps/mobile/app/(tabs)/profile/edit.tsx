import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { router, Stack } from 'expo-router';
import { Colors, FontSizes, BorderRadius } from '@/constants/theme';
import { ArrowLeft, Save, Camera, User, Phone, MapPin } from 'lucide-react-native';
import { useState } from 'react';

export default function EditProfileScreen() {
  const [form, setForm] = useState({ fullName: '', phone: '', district: '', bio: '' });

  const handleSave = () => {
    Alert.alert('Profile Updated', 'Your changes have been saved');
    router.back();
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave}>
          <Save size={24} color={Colors.gold} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{form.fullName.charAt(0) || 'U'}</Text>
          </View>
          <TouchableOpacity style={styles.changePhotoButton}>
            <Camera size={18} color={Colors.white} />
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputRow}>
            <User size={20} color={Colors.gray400} />
            <TextInput
              style={styles.input}
              value={form.fullName}
              onChangeText={(t) => setForm({ ...form, fullName: t })}
              placeholder="Enter your name"
              placeholderTextColor={Colors.gray400}
            />
          </View>

          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.inputRow}>
            <Phone size={20} color={Colors.gray400} />
            <TextInput
              style={styles.input}
              value={form.phone}
              onChangeText={(t) => setForm({ ...form, phone: t })}
              placeholder="078 XXX XXXX"
              placeholderTextColor={Colors.gray400}
              keyboardType="phone-pad"
            />
          </View>

          <Text style={styles.label}>Location</Text>
          <View style={styles.inputRow}>
            <MapPin size={20} color={Colors.gray400} />
            <TextInput
              style={styles.input}
              value={form.district}
              onChangeText={(t) => setForm({ ...form, district: t })}
              placeholder="e.g. Kigali, Gasabo"
              placeholderTextColor={Colors.gray400}
            />
          </View>

          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={form.bio}
            onChangeText={(t) => setForm({ ...form, bio: t })}
            placeholder="Tell buyers about yourself..."
            placeholderTextColor={Colors.gray400}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
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
  avatarSection: { alignItems: 'center', marginBottom: 32 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.goldPale, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { fontSize: FontSizes['4xl'], fontWeight: 'bold', color: Colors.navy },
  changePhotoButton: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.navy, borderRadius: BorderRadius.full, paddingHorizontal: 16, paddingVertical: 8 },
  changePhotoText: { fontSize: FontSizes.sm, color: Colors.white, fontWeight: '600' },
  formSection: {},
  label: { fontSize: FontSizes.sm, fontWeight: '600', color: Colors.gray700, marginBottom: 8, marginTop: 16 },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.gray200, paddingHorizontal: 14, gap: 10 },
  input: { flex: 1, paddingVertical: 12, fontSize: FontSizes.base, color: Colors.gray900 },
  textArea: { minHeight: 80, paddingTop: 12 },
});
