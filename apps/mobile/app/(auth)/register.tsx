import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator, ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Colors, BorderRadius, FontSizes } from '@/constants/theme';
import apiClient from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { User, Lock, Mail, Phone } from 'lucide-react-native';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleRegister = async () => {
    if (!username.trim() || !fullName.trim() || !password.trim()) {
      Alert.alert('Error', 'Username, full name, and password are required');
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.post('/api/v1/auth/register', {
        username: username.trim(),
        fullName: fullName.trim(),
        password,
        ...(phone.trim() ? { phone: phone.trim() } : {}),
        ...(email.trim() ? { email: email.trim() } : {}),
      });

      if (res.data.success) {
        await login(res.data.data.accessToken, '', res.data.data.user);
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      const msg = error.response?.data?.error || 'Registration failed';
      const details = error.response?.data?.details;
      if (details && Array.isArray(details)) {
        Alert.alert('Error', details.map((d: any) => d.message).join('\n'));
      } else {
        Alert.alert('Error', msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.logo}>MotorWa<Text style={styles.logoLight}>.rw</Text></Text>
            <Text style={styles.title}>Create an account</Text>
            <Text style={styles.subtitle}>Join Rwanda's trusted car marketplace</Text>
          </View>

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
              <User size={20} color={Colors.gray400} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Full Name"
                placeholderTextColor={Colors.gray400}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputWrapper}>
              <Lock size={20} color={Colors.gray400} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Password (min 8 chars)"
                placeholderTextColor={Colors.gray400}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputWrapper}>
              <Phone size={20} color={Colors.gray400} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Phone (optional)"
                placeholderTextColor={Colors.gray400}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputWrapper}>
              <Mail size={20} color={Colors.gray400} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Email (optional)"
                placeholderTextColor={Colors.gray400}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
              {loading ? (
                <ActivityIndicator color={Colors.navy} />
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.linkText}>
                Already have an account? <Text style={styles.linkHighlight}>Sign in</Text>
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footer}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream },
  scrollContent: { flexGrow: 1 },
  content: { flex: 1, paddingHorizontal: 24, justifyContent: 'center', paddingVertical: 40 },
  header: { marginBottom: 32, alignItems: 'center' },
  logo: { fontSize: 36, fontWeight: 'bold', color: Colors.navy, marginBottom: 32 },
  logoLight: { fontWeight: '300' },
  title: { fontSize: 24, fontWeight: 'bold', color: Colors.gray900, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: Colors.gray600, textAlign: 'center' },
  form: { gap: 14 },
  inputWrapper: { flexDirection: 'row', backgroundColor: Colors.white, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.gray200, overflow: 'hidden', alignItems: 'center' },
  inputIcon: { marginLeft: 16 },
  input: { flex: 1, paddingVertical: 16, paddingHorizontal: 12, fontSize: 16, color: Colors.gray900 },
  button: { backgroundColor: Colors.gold, borderRadius: BorderRadius.md, paddingVertical: 16, alignItems: 'center', marginTop: 4 },
  buttonText: { fontSize: 16, fontWeight: '600', color: Colors.navy },
  linkText: { textAlign: 'center', color: Colors.gray500, fontSize: 14, marginTop: 12 },
  linkHighlight: { color: Colors.gold, fontWeight: '600' },
  footer: { fontSize: 13, color: Colors.gray400, textAlign: 'center', marginTop: 32 },
});
