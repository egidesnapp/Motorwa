import { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, Dimensions, FlatList,
  TouchableOpacity, Image, StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { Colors, FontSizes, BorderRadius } from '@/constants/theme';
import { Car, Shield, CreditCard, ArrowRight, SkipForward } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const slides = [
  {
    title: "Find Your Perfect Car",
    subtitle: "Browse thousands of verified listings from trusted sellers across Rwanda",
    icon: Car,
    bgColors: [Colors.navy, Colors.navyLight],
  },
  {
    title: "Buy & Sell Safely",
    subtitle: "Verified sellers, secure messaging, and ID verification for peace of mind",
    icon: Shield,
    bgColors: [Colors.gold, Colors.goldLight],
  },
  {
    title: "Easy Mobile Payments",
    subtitle: "Pay for listings, boosts, and subscriptions with MTN MoMo or Airtel Money",
    icon: CreditCard,
    bgColors: [Colors.navy, '#1A3A5C'],
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      completeOnboarding();
    }
  };

  const completeOnboarding = async () => {
    await AsyncStorage.setItem('@motorwa:onboarded', 'true');
    router.replace('/(auth)/login');
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem('@motorwa:onboarded', 'true');
    router.replace('/(auth)/login');
  };

  const renderSlide = ({ item }: { item: typeof slides[0] }) => (
    <View style={[styles.slide, { width }]}>
      <View style={[styles.iconContainer, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
        <item.icon size={80} color={Colors.white} />
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subtitle}>{item.subtitle}</Text>
    </View>
  );

  const currentSlide = slides[currentIndex];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={currentSlide.bgColors[0]} />
      <View style={[styles.background, { backgroundColor: currentSlide.bgColors[0] }]} />

      <View style={styles.skipContainer}>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <SkipForward size={20} color={Colors.white} />
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(_, i) => i.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        scrollEventThrottle={16}
      />

      <View style={styles.footer}>
        <View style={styles.dotsContainer}>
          {slides.map((_, i) => (
            <View key={i} style={[styles.dot, i === currentIndex && styles.dotActive]} />
          ))}
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <ArrowRight size={20} color={Colors.navy} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.navy },
  background: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  skipContainer: { position: 'absolute', top: 48, right: 20, zIndex: 10 },
  skipButton: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  skipText: { color: Colors.white, fontSize: FontSizes.base, fontWeight: '500' },
  slide: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  iconContainer: { width: 160, height: 160, borderRadius: 80, justifyContent: 'center', alignItems: 'center', marginBottom: 40 },
  title: { fontSize: FontSizes['3xl'], fontWeight: 'bold', color: Colors.white, textAlign: 'center', marginBottom: 16 },
  subtitle: { fontSize: FontSizes.lg, color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 26 },
  footer: { paddingHorizontal: 24, paddingBottom: 40 },
  dotsContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 32 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.3)', marginHorizontal: 4 },
  dotActive: { width: 24, backgroundColor: Colors.gold },
  nextButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.gold, borderRadius: BorderRadius.lg, paddingVertical: 16, gap: 8 },
  nextButtonText: { fontSize: FontSizes.lg, fontWeight: '600', color: Colors.navy },
});
