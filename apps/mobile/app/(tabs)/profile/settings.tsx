import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { router, Stack } from 'expo-router';
import { Colors, FontSizes, BorderRadius } from '@/constants/theme';
import { ArrowLeft, Bell, Shield, Lock, Globe, Trash2, ChevronRight, Languages } from 'lucide-react-native';
import { useAuth } from '@/lib/auth-context';

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const [pushNotifs, setPushNotifs] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(false);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently removed.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  const settingsSections = [
    {
      items: [
        { icon: Bell, label: 'Push Notifications', right: <Switch value={pushNotifs} onValueChange={setPushNotifs} trackColor={{ true: Colors.gold }} /> },
        { icon: Bell, label: 'Email Notifications', subtitle: 'Receive updates via email', right: <Switch value={emailNotifs} onValueChange={setEmailNotifs} trackColor={{ true: Colors.gold }} /> },
        { icon: Bell, label: 'SMS Notifications', subtitle: 'Receive updates via SMS', right: <Switch value={smsNotifs} onValueChange={setSmsNotifs} trackColor={{ true: Colors.gold }} /> },
      ],
    },
    {
      title: 'Privacy & Security',
      items: [
        { icon: Shield, label: 'Privacy Policy', action: () => {} },
        { icon: Lock, label: 'Change Password', action: () => {} },
        { icon: Trash2, label: 'Delete Account', action: handleDeleteAccount, destructive: true },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {settingsSections.map((section, si) => (
          <View key={si} style={styles.section}>
            {section.title && <Text style={styles.sectionTitle}>{section.title}</Text>}
            <View style={styles.card}>
              {section.items.map((item, ii) => (
                <TouchableOpacity
                  key={ii}
                  style={[styles.row, ii > 0 && styles.rowBorder]}
                  onPress={item.action}
                  disabled={!item.action}
                >
                  <item.icon size={20} color={item.destructive ? Colors.accent : Colors.gray600} />
                  <View style={styles.rowContent}>
                    <Text style={[styles.rowLabel, item.destructive && styles.rowLabelDestructive]}>{item.label}</Text>
                    {item.subtitle && <Text style={styles.rowSubtitle}>{item.subtitle}</Text>}
                  </View>
                  {item.right || (item.action ? <ChevronRight size={18} color={Colors.gray300} /> : null)}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.versionText}>MotorWa.rw v1.0.0</Text>
          <Text style={styles.footerText}>Built for Rwanda's car marketplace</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.gray200 },
  headerTitle: { fontSize: FontSizes.lg, fontWeight: '600', color: Colors.gray900 },
  section: { paddingHorizontal: 16, marginTop: 24 },
  sectionTitle: { fontSize: FontSizes.sm, fontWeight: '600', color: Colors.gray400, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
  card: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: Colors.gray200, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  rowBorder: { borderTopWidth: 1, borderTopColor: Colors.gray100 },
  rowContent: { flex: 1, marginLeft: 12 },
  rowLabel: { fontSize: FontSizes.base, color: Colors.gray900 },
  rowLabelDestructive: { color: Colors.accent },
  rowSubtitle: { fontSize: FontSizes.sm, color: Colors.gray400, marginTop: 2 },
  footer: { alignItems: 'center', paddingVertical: 32, marginTop: 24 },
  versionText: { fontSize: FontSizes.sm, color: Colors.gray400, fontWeight: '600' },
  footerText: { fontSize: FontSizes.xs, color: Colors.gray300, marginTop: 4 },
});
