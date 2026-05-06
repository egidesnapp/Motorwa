import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

export async function isBiometricSupported(): Promise<boolean> {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  return hasHardware && isEnrolled;
}

export async function authenticateWithBiometrics(): Promise<boolean> {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Authenticate to access MotorWa',
    fallbackLabel: 'Use passcode',
    cancelLabel: 'Cancel',
  });
  return result.success;
}

export async function enableBiometricLogin(): Promise<void> {
  const isSupported = await isBiometricSupported();
  if (!isSupported) throw new Error('Biometric authentication not available');

  const success = await authenticateWithBiometrics();
  if (!success) throw new Error('Authentication failed');

  await SecureStore.setItemAsync('biometricEnabled', 'true');
}

export async function isBiometricLoginEnabled(): Promise<boolean> {
  const enabled = await SecureStore.getItemAsync('biometricEnabled');
  return enabled === 'true';
}

export async function disableBiometricLogin(): Promise<void> {
  await SecureStore.deleteItemAsync('biometricEnabled');
}
