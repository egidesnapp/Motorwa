import { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Colors, BorderRadius, FontSizes } from '@/constants/theme';
import apiClient from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { isBiometricSupported, authenticateWithBiometrics, isBiometricLoginEnabled } from '@/lib/biometrics';
import { Fingerprint } from 'lucide-react-native';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    const checkBiometric = async () => {
      const supported = await isBiometricSupported();
      const enabled = await isBiometricLoginEnabled();
      if (supported && enabled) {
        setBiometricAvailable(true);
      }
    };
    checkBiometric();
  }, []);

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.startsWith('0') && cleaned.length === 10) {
      return `+250${cleaned.slice(1)}`;
    }
    if (cleaned.startsWith('250') && cleaned.length === 12) {
      return `+${cleaned}`;
    }
    return value;
  };

  const handleBiometricLogin = async () => {
    const success = await authenticateWithBiometrics();
    if (success) {
      const userStr = await SecureStore.getItemAsync('user');
      const token = await SecureStore.getItemAsync('accessToken');
      if (userStr && token) {
        const user = JSON.parse(userStr);
        await login(token, '', user);
        router.replace('/(tabs)');
      }
    }
  };

  const handleSendOtp = async () => {
    if (!phone.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.post('/api/v1/auth/send-otp', {
        phone: formatPhone(phone),
      });

      if (res.data.success) {
        router.push({ pathname: '/(auth)/verify', params: { phone: formatPhone(phone) } });
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logo}>MotorWa<Text style={styles.logoLight}>.rw</Text></Text>
          <Text style={styles.title}>Enter your phone number</Text>
          <Text style={styles.subtitle}>We will send you a 6-digit verification code</Text>
        </View>

        {biometricAvailable && (
          <TouchableOpacity style={styles.biometricButton} onPress={handleBiometricLogin}>
            <Fingerprint size={32} color={Colors.navy} />
            <Text style={styles.biometricText}>Login with biometrics</Text>
          </TouchableOpacity>
        )}

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.form}>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputPrefix}>+250</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="7XX XXX XXX"
              placeholderTextColor={Colors.gray400}
              keyboardType="phone-pad"
              maxLength={12}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSendOtp} disabled={loading}>
            {loading ? (
              <ActivityIndicator color={Colors.navy} />
            ) : (
              <Text style={styles.buttonText}>Send Code</Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream },
  content: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  header: { marginBottom: 32, alignItems: 'center' },
  logo: { fontSize: 36, fontWeight: 'bold', color: Colors.navy, marginBottom: 32 },
  logoLight: { fontWeight: '300' },
  title: { fontSize: 24, fontWeight: 'bold', color: Colors.gray900, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: Colors.gray600, textAlign: 'center' },
  biometricButton: { alignItems: 'center', padding: 20, backgroundColor: Colors.white, borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: Colors.gray200, marginBottom: 20 },
  biometricText: { fontSize: FontSizes.base, color: Colors.navy, fontWeight: '600', marginTop: 8 },
  divider: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.gray200 },
  dividerText: { fontSize: FontSizes.sm, color: Colors.gray400, marginHorizontal: 12 },
  form: { gap: 16 },
  inputWrapper: { flexDirection: 'row', backgroundColor: Colors.white, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.gray200, overflow: 'hidden' },
  inputPrefix: { paddingHorizontal: 16, paddingVertical: 16, fontSize: 16, color: Colors.gray900, backgroundColor: Colors.gray100, fontWeight: '600' },
  input: { flex: 1, paddingVertical: 16, paddingHorizontal: 12, fontSize: 16, color: Colors.gray900 },
  button: { backgroundColor: Colors.gold, borderRadius: BorderRadius.md, paddingVertical: 16, alignItems: 'center' },
  buttonText: { fontSize: 16, fontWeight: '600', color: Colors.navy },
  footer: { fontSize: 13, color: Colors.gray400, textAlign: 'center', marginTop: 32 },
});
