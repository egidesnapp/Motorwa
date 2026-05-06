import { Redirect } from 'expo-router';
import { useAuth } from '@/lib/auth-context';

export default function AuthLayout() {
  const { user, isLoading } = useAuth();

  if (!isLoading && user) {
    return <Redirect href="/(tabs)" />;
  }

  return null;
}
