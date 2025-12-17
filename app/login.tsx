import { AuthHeader } from '@/components/auth/AuthHeader';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { ApiError } from '@/lib/api/client';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFormValid = email.trim() && password.trim();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await login({ email: email.trim(), password });
      router.replace('/(tabs)');
    } catch (err) {
      console.error('Login error:', err);
      if (err instanceof ApiError) {
        setError(err.message || 'Login failed. Please check your credentials.');
      } else {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(`${errorMessage}. Please try again.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AuthHeader />

          {/* Form section */}
          <View style={styles.formContainer}>
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              variant="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />

            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              variant="outlined"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
              style={styles.passwordInput}
            />

            {error && (
              <View style={styles.errorContainer}>
                <ThemedText style={styles.errorText}>{error}</ThemedText>
              </View>
            )}

            <Button
              onPress={handleLogin}
              block
              disabled={isLoading || !isFormValid}
              style={styles.loginButton}
            >
              {isLoading ? (
                <ActivityIndicator color="#1C1C1C" size="small" />
              ) : (
                <ThemedText style={styles.buttonText}>Login</ThemedText>
              )}
            </Button>

            <TouchableOpacity onPress={() => router.push('/register')} style={styles.registerLink}>
              <Text style={styles.registerText}>
                Don&apos;t have an account? <Text style={styles.registerTextBold}>Sign up</Text>
              </Text>
            </TouchableOpacity>

            <Text style={styles.footerCaption}>
              EU Programme Erasmus+ KA2 Cooperation Partnership YOUTH{'\n'}
              Reference n. 2023-2-IT03-KA220-YOU-000176636
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  passwordInput: {
    marginTop: 16,
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
  },
  loginButton: {
    marginTop: 24,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1C',
  },
  registerLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
    color: '#6B7280',
  },
  registerTextBold: {
    fontWeight: '600',
    color: '#12A5E5',
  },
  footerCaption: {
    color: '#000',
    textAlign: 'center',
    fontSize: 7,
    fontWeight: '500',
    marginTop: 32,
  },
});
