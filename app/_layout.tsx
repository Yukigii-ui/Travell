import '../global.css';
import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthContext, useAuthProvider } from '../hooks/useAuth';

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="plan/[id]"
        options={{ headerShown: false, animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="plan/share/[token]"
        options={{ headerShown: false, animation: 'slide_from_bottom' }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const auth = useAuthProvider();
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#0B1120' }}>
      <AuthContext.Provider value={auth}>
        <StatusBar style="light" />
        <RootLayoutNav />
      </AuthContext.Provider>
    </GestureHandlerRootView>
  );
}
