import { View, Text, StyleSheet } from 'react-native';
import { WifiOff } from 'lucide-react-native';
import { Colors, FontSizes } from '@/constants/theme';
import { useNetwork } from '@/lib/network-context';

export default function OfflineBanner() {
  const { isConnected } = useNetwork();

  if (isConnected) return null;

  return (
    <View style={styles.container}>
      <WifiOff size={16} color={Colors.white} />
      <Text style={styles.text}>No internet connection</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.accent, paddingVertical: 8, paddingHorizontal: 16 },
  text: { color: Colors.white, fontSize: FontSizes.sm, fontWeight: '600' },
});
