import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';

import Toast from '@/components/Toast';
import { C } from '@/constants/theme';
import { StoreProvider, useStore } from '@/lib/store';

SplashScreen.preventAutoHideAsync();

function RootStack() {
  const { ready, user, toast } = useStore();

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: C.bg },
          headerTintColor: C.primary,
          headerTitleStyle: { color: C.ink },
          headerBackButtonDisplayMode: 'minimal',
        }}>
        <Stack.Protected guard={Boolean(user)}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="repte/[id]" options={{ title: '' }} />
          <Stack.Screen name="sortida" options={{ presentation: 'modal', title: 'Nova sortida' }} />
          <Stack.Screen name="comerc" options={{ presentation: 'modal', title: 'Repte per a comerços' }} />
        </Stack.Protected>
        <Stack.Protected guard={!user}>
          <Stack.Screen name="benvinguda" options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>
      <Toast message={toast} />
    </View>
  );
}

export default function RootLayout() {
  return (
    <StoreProvider>
      <RootStack />
    </StoreProvider>
  );
}
