import { AuthProvider, useAuth } from '@/context/AuthContext';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import 'react-native-reanimated';

export const unstable_settings = {
  anchor: '(tabs)',
};

const DISABLE_AUTH_GUARD = true

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // Lock orientation to portrait for the entire app by default
  useEffect(() => {
    if (Platform.OS === 'web') return;

    const lockOrientation = async () => {
      try {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      } catch (error) {
        console.warn('Unable to lock screen orientation:', error);
      }
    };

    lockOrientation();
  }, []);

  // Handle auth-based navigation
  useEffect(() => {
    if (isLoading) return;

    if (DISABLE_AUTH_GUARD) return;

    const inAuthGroup = segments[0] === 'login' || segments[0] === 'register';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to register if not authenticated
      router.replace('/register');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to main app if authenticated and on auth screen
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments, router]);

  // Show loading screen while checking auth
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
        <ActivityIndicator size="large" color="#FFD07D" />
      </View>
    );
  }

  if (DISABLE_AUTH_GUARD) {
    return (
      <ThemeProvider value={DefaultTheme}>
        <Stack>
          <Stack.Screen name="register" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="video/[id]" options={{ headerShown: false, animation: 'slide_from_right' }} />
          <Stack.Screen
            name="article/[id]"
            options={{ animation: 'slide_from_right', headerTitle: '' }}
          />
          <Stack.Screen
            name="module/[id]"
            options={{ animation: 'slide_from_right', headerTitle: '' }}
          />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="dark" />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="video/[id]" options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen
          name="article/[id]"
          options={{ animation: 'slide_from_right', headerTitle: '' }}
        />
        <Stack.Screen
          name="module/[id]"
          options={{ animation: 'slide_from_right', headerTitle: '' }}
        />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
