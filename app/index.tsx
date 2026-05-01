import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../hooks/useAuth';

export default function Index() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View className="flex-1 bg-[#0B1120] items-center justify-center">
        <ActivityIndicator size="large" color="#F59E0B" />
      </View>
    );
  }

  if (session) return <Redirect href="/(tabs)" />;
  return <Redirect href="/(auth)/login" />;
}
