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
import { User, Lock, Fingerprint } from 'lucide-react-native';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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

  const handleLogin = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Please enter your username');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.post('/api/v1/auth/login', {
        username: username.trim(),
        password,
      });

      if (res.data.success) {
        await login(res.data.data.accessToken, '', res.data.data.user);
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logo}>MotorWa<Text style={styles.logoLight}>.rw</Text></Text>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        {biometricAvailable && (
          <TouchableOpacity style={styles.biometricButton} onPress={handleBiometricLogin}>
            <Fingerprint size={32} color={Colors.navy} />
            <Text style={styles.biometricText}>Login with biometrics</Text>
          </TouchableOpacity>
        )}

        {biometricAvailable && (
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>
        )}

        <View style={styles.form}>
          <View style={styles.inputWrapper}>
            <User size={20} color={Colors.gray400} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Username"
              placeholderTextColor={Colors.gray400}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Lock size={20} color={Colors.gray400} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor={Colors.gray400}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
            {loading ? (
              <ActivityIndicator color={Colors.navy} />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.linkText}>
              Don't have an account? <Text style={styles.linkHighlight}>Create one</Text>
            </Text>
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
  inputWrapper: { flexDirection: 'row', backgroundColor: Colors.white, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.gray200, overflow: 'hidden', alignItems: 'center' },
  inputIcon: { marginLeft: 16 },
  input: { flex: 1, paddingVertical: 16, paddingHorizontal: 12, fontSize: 16, color: Colors.gray900 },
  button: { backgroundColor: Colors.gold, borderRadius: BorderRadius.md, paddingVertical: 16, alignItems: 'center' },
  buttonText: { fontSize: 16, fontWeight: '600', color: Colors.navy },
  linkText: { textAlign: 'center', color: Colors.gray500, fontSize: 14, marginTop: 8 },
  linkHighlight: { color: Colors.gold, fontWeight: '600' },
  footer: { fontSize: 13, color: Colors.gray400, textAlign: 'center', marginTop: 32 },
});
