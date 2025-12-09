import { AuthHeader } from '@/components/auth/AuthHeader';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen() {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFormValid = email.trim() && password.trim() && termsAccepted;

  const handleRegister = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }

    if (!termsAccepted) {
      setError('Please accept the terms and privacy policy');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await register({ email: email.trim(), password });
      router.replace('/(tabs)');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || 'Registration failed. Please try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
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

            <Checkbox
              label="I accept the Well Teens app terms of use and agree to the privacy policy"
              checked={termsAccepted}
              onChange={setTermsAccepted}
              disabled={isLoading}
              style={styles.checkbox}
            />

            {error && (
              <View style={styles.errorContainer}>
                <ThemedText style={styles.errorText}>{error}</ThemedText>
              </View>
            )}

            <Button
              onPress={handleRegister}
              block
              disabled={isLoading || !isFormValid}
              style={styles.registerButton}
            >
              {isLoading ? (
                <ActivityIndicator color="#1C1C1C" size="small" />
              ) : (
                <ThemedText style={styles.buttonText}>Register</ThemedText>
              )}
            </Button>

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
  checkbox: {
    marginTop: 24,
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
  registerButton: {
    marginTop: 24,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1C',
  },
  footerCaption: {
    color: '#000',
    textAlign: 'center',
    fontSize: 7,
    fontWeight: '500',
    marginTop: 32,
  },
});
