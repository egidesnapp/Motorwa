import { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Image, Alert, Switch,
} from 'react-native';
import { router } from 'expo-router';
import { Colors, FontSizes, BorderRadius } from '@/constants/theme';
import {
  User, Settings, Heart, Bookmark, Star, CreditCard, LogOut,
  ChevronRight, Shield, Bell, Edit3, Car, MapPin, Phone, Mail, Building2,
} from 'lucide-react-native';
import { useAuth } from '@/lib/auth-context';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const menuSections = [
    {
      items: [
        { icon: Edit3, label: 'Edit Profile', action: () => router.push('/(tabs)/profile/edit') },
        { icon: Shield, label: 'Verification Status', subtitle: user?.isPhoneVerified ? 'Phone Verified' : 'Not Verified', action: () => router.push('/(tabs)/profile/verification') },
        { icon: Building2, label: 'Apply as Dealer', subtitle: 'Sell more, reach more buyers', action: () => router.push('/(tabs)/profile/dealer-apply') },
      ],
    },
    {
      title: 'My Activity',
      items: [
        { icon: Car, label: 'My Listings', action: () => router.push('/(tabs)/profile/my-listings') },
        { icon: CreditCard, label: 'Payments & Subscriptions', action: () => router.push('/(tabs)/profile/payments') },
        { icon: Heart, label: 'Saved Cars', action: () => router.push('/(tabs)/profile/saved') },
        { icon: Bookmark, label: 'Saved Searches', action: () => router.push('/(tabs)/profile/saved-searches') },
        { icon: Star, label: 'My Reviews', action: () => router.push('/(tabs)/profile/reviews') },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: Bell, label: 'Notifications', action: () => router.push('/notifications') },
        { icon: Bell, label: 'Push Notifications', rightElement: <Switch value={pushNotifications} onValueChange={setPushNotifications} trackColor={{ true: Colors.gold }} /> },
      ],
    },
    {
      items: [
        { icon: Settings, label: 'Settings', action: () => router.push('/(tabs)/profile/settings') },
      ],
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {user?.photoUrl ? (
            <Image source={{ uri: user.photoUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user?.fullName?.charAt(0) || 'U'}</Text>
            </View>
          )}
          <TouchableOpacity style={styles.editAvatarButton}>
            <Edit3 size={16} color={Colors.navy} />
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>{user?.fullName || 'User'}</Text>
        <View style={styles.infoRow}>
          <Phone size={14} color={Colors.gray400} />
          <Text style={styles.infoText}>{user?.phone || 'No phone'}</Text>
        </View>
        <View style={styles.infoRow}>
          <MapPin size={14} color={Colors.gray400} />
          <Text style={styles.infoText}>Rwanda</Text>
        </View>
        {user?.isIdVerified && (
          <View style={styles.verifiedBadge}>
            <Shield size={14} color={Colors.green} />
            <Text style={styles.verifiedText}>ID Verified</Text>
          </View>
        )}
      </View>

      {/* Quick Stats */}
      <View style={styles.statsRow}>
        <TouchableOpacity style={styles.statItem}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Listings</Text>
        </TouchableOpacity>
        <View style={styles.statDivider} />
        <TouchableOpacity style={styles.statItem}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Saved</Text>
        </TouchableOpacity>
        <View style={styles.statDivider} />
        <TouchableOpacity style={styles.statItem}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Reviews</Text>
        </TouchableOpacity>
      </View>

      {/* Menu Sections */}
      {menuSections.map((section, si) => (
        <View key={si} style={styles.menuSection}>
          {section.title && <Text style={styles.sectionTitle}>{section.title}</Text>}
          <View style={styles.menuCard}>
            {section.items.map((item, ii) => (
              <TouchableOpacity key={ii} style={[styles.menuItem, ii > 0 && styles.menuItemBorder]} onPress={item.action || undefined}>
                <View style={styles.menuIconContainer}>
                  <item.icon size={20} color={Colors.gray600} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                {item.subtitle && <Text style={styles.menuSubtitle}>{item.subtitle}</Text>}
                {item.rightElement || <ChevronRight size={18} color={Colors.gray300} />}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      {/* Sign Out */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={20} color={Colors.accent} />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream },
  header: { backgroundColor: Colors.white, alignItems: 'center', paddingVertical: 32, borderBottomWidth: 1, borderBottomColor: Colors.gray200 },
  avatarContainer: { position: 'relative', marginBottom: 16 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.goldPale, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: FontSizes['3xl'], fontWeight: 'bold', color: Colors.navy },
  editAvatarButton: { position: 'absolute', bottom: 0, right: 0, backgroundColor: Colors.gold, borderRadius: 16, padding: 6 },
  name: { fontSize: FontSizes['2xl'], fontWeight: 'bold', color: Colors.gray900, marginBottom: 4 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginVertical: 2 },
  infoText: { fontSize: FontSizes.sm, color: Colors.gray600 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.goldPale, paddingHorizontal: 12, paddingVertical: 4, borderRadius: BorderRadius.full, marginTop: 12 },
  verifiedText: { fontSize: FontSizes.xs, color: Colors.green, fontWeight: '600' },
  statsRow: { flexDirection: 'row', backgroundColor: Colors.white, margin: 16, borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: Colors.gray200 },
  statItem: { flex: 1, paddingVertical: 20, alignItems: 'center' },
  statValue: { fontSize: FontSizes.xl, fontWeight: 'bold', color: Colors.navy },
  statLabel: { fontSize: FontSizes.xs, color: Colors.gray600, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: Colors.gray200 },
  menuSection: { paddingHorizontal: 16, marginBottom: 8 },
  sectionTitle: { fontSize: FontSizes.sm, fontWeight: '600', color: Colors.gray400, marginBottom: 8, marginTop: 8, textTransform: 'uppercase', letterSpacing: 1 },
  menuCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: Colors.gray200, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  menuItemBorder: { borderTopWidth: 1, borderTopColor: Colors.gray100 },
  menuIconContainer: { marginRight: 12 },
  menuLabel: { fontSize: FontSizes.base, color: Colors.gray900, flex: 1 },
  menuSubtitle: { fontSize: FontSizes.sm, color: Colors.gray400, marginRight: 8 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 24, paddingVertical: 14, backgroundColor: Colors.white, borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: Colors.accent + '30' },
  logoutText: { fontSize: FontSizes.base, fontWeight: '600', color: Colors.accent, marginLeft: 8 },
});
