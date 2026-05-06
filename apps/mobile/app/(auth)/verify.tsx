import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors, BorderRadius } from '@/constants/theme';
import apiClient from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

export default function VerifyScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [code, setCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [step, setStep] = useState<'otp' | 'name'>('otp');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleVerify = async () => {
    if (code.length !== 6) {
      Alert.alert('Error', 'Please enter a 6-digit code');
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.post('/api/v1/auth/verify-otp', {
        phone,
        code,
      });

      if (res.data.success) {
        if (res.data.data.user.fullName) {
          await login(res.data.data.accessToken, res.data.data.refreshToken, res.data.data.user);
          router.replace('/(tabs)');
        } else {
          setStep('name');
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleSetName = async () => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.post('/api/v1/auth/verify-otp', {
        phone,
        code,
        fullName,
      });

      if (res.data.success) {
        await login(res.data.data.accessToken, res.data.data.refreshToken, res.data.data.user);
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logo}>MotorWa<Text style={styles.logoLight}>.rw</Text></Text>
          <Text style={styles.title}>
            {step === 'otp' ? 'Enter verification code' : 'What is your name?'}
          </Text>
          <Text style={styles.subtitle}>
            {step === 'otp' ? `Code sent to ${phone}` : 'Complete your profile to get started'}
          </Text>
        </View>

        <View style={styles.form}>
          {step === 'otp' ? (
            <>
              <TextInput
                style={styles.otpInput}
                value={code}
                onChangeText={(text) => setCode(text.replace(/[^0-9]/g, '').slice(0, 6))}
                placeholder="000000"
                placeholderTextColor={Colors.gray400}
                keyboardType="number-pad"
                maxLength={6}
                textAlign="center"
              />
              <TouchableOpacity style={styles.button} onPress={handleVerify} disabled={loading}>
                {loading ? <ActivityIndicator color={Colors.navy} /> : <Text style={styles.buttonText}>Verify</Text>}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
                <Text style={styles.linkText}>Change phone number</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TextInput
                style={styles.nameInput}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter your full name"
                placeholderTextColor={Colors.gray400}
                autoCapitalize="words"
              />
              <TouchableOpacity style={styles.button} onPress={handleSetName} disabled={loading}>
                {loading ? <ActivityIndicator color={Colors.navy} /> : <Text style={styles.buttonText}>Create Account</Text>}
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream },
  content: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  header: { marginBottom: 40, alignItems: 'center' },
  logo: { fontSize: 36, fontWeight: 'bold', color: Colors.navy, marginBottom: 32 },
  logoLight: { fontWeight: '300' },
  title: { fontSize: 24, fontWeight: 'bold', color: Colors.gray900, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: Colors.gray600, textAlign: 'center' },
  form: { gap: 16 },
  otpInput: { backgroundColor: Colors.white, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.gray200, paddingVertical: 20, fontSize: 32, fontWeight: 'bold', color: Colors.gray900, letterSpacing: 8 },
  nameInput: { backgroundColor: Colors.white, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.gray200, paddingVertical: 16, paddingHorizontal: 16, fontSize: 16, color: Colors.gray900 },
  button: { backgroundColor: Colors.gold, borderRadius: BorderRadius.md, paddingVertical: 16, alignItems: 'center' },
  buttonText: { fontSize: 16, fontWeight: '600', color: Colors.navy },
  linkText: { textAlign: 'center', color: Colors.gray400, fontSize: 14, marginTop: 8 },
});
