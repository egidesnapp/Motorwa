import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router, Stack } from 'expo-router';
import { Colors, FontSizes, BorderRadius } from '@/constants/theme';
import { ArrowLeft, Heart, Car } from 'lucide-react-native';
import { useState } from 'react';

export default function SavedScreen() {
  const [saved, setSaved] = useState<any[]>([]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Cars</Text>
        <View style={{ width: 24 }} />
      </View>

      {saved.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Heart size={48} color={Colors.gray300} />
          <Text style={styles.emptyTitle}>No saved cars</Text>
          <Text style={styles.emptyText}>Tap the heart icon on any listing to save it</Text>
          <TouchableOpacity style={styles.browseButton} onPress={() => router.push('/(tabs)/browse')}>
            <Text style={styles.browseText}>Browse Cars</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {saved.map((item) => (
            <TouchableOpacity key={item.id} style={styles.savedCard}>
              <View style={styles.savedImage} />
              <View style={styles.savedInfo}>
                <Text style={styles.savedTitle}>{item.title}</Text>
                <Text style={styles.savedPrice}>{Number(item.priceRwf).toLocaleString()} RWF</Text>
              </View>
            </TouchableOpacity>
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
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  emptyTitle: { fontSize: FontSizes.xl, fontWeight: 'bold', color: Colors.gray900, marginTop: 16, marginBottom: 8 },
  emptyText: { fontSize: FontSizes.base, color: Colors.gray600, textAlign: 'center', marginBottom: 24 },
  browseButton: { backgroundColor: Colors.gold, borderRadius: BorderRadius.md, paddingHorizontal: 32, paddingVertical: 12 },
  browseText: { fontSize: FontSizes.base, fontWeight: '600', color: Colors.navy },
  list: { padding: 16, gap: 12 },
  savedCard: { flexDirection: 'row', backgroundColor: Colors.white, borderRadius: BorderRadius.lg, overflow: 'hidden', borderWidth: 1, borderColor: Colors.gray200 },
  savedImage: { width: 100, height: 80, backgroundColor: Colors.gray200 },
  savedInfo: { flex: 1, padding: 12, justifyContent: 'center' },
  savedTitle: { fontSize: FontSizes.base, fontWeight: '600', color: Colors.gray900 },
  savedPrice: { fontSize: FontSizes.sm, color: Colors.gold, fontWeight: '600', marginTop: 4 },
});
