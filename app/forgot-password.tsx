import { AuthHeader } from '@/components/auth/AuthHeader';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { forgotPassword } from '@/lib/api/auth';
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

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const isFormValid = email.trim();

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await forgotPassword(email.trim());
      setSuccess(true);
    } catch (err) {
      console.error('Forgot password error:', err);
      if (err instanceof ApiError) {
        setError(err.message || 'Failed to send reset email. Please try again.');
      } else {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(`${errorMessage}. Please try again.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <AuthHeader />

          <View style={styles.formContainer}>
            <View style={styles.successContainer}>
              <ThemedText style={styles.successTitle}>Check your email</ThemedText>
              <ThemedText style={styles.successMessage}>
                We&apos;ve sent a password reset link to {email}. Please check your inbox and
                follow the instructions to reset your password.
              </ThemedText>
            </View>

            <Button onPress={() => router.push('/login')} block style={styles.backButton}>
              <ThemedText style={styles.buttonText}>Back to login</ThemedText>
            </Button>

            <Text style={styles.footerCaption}>
              EU Programme Erasmus+ KA2 Cooperation Partnership YOUTH{'\n'}
              Reference n. 2023-2-IT03-KA220-YOU-000176636
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

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

          <View style={styles.formContainer}>
            <ThemedText style={styles.title}>Forgot password</ThemedText>
            <ThemedText style={styles.subtitle}>
              Enter your email address and we&apos;ll send you a link to reset your password.
            </ThemedText>

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
              style={styles.emailInput}
            />

            {error && (
              <View style={styles.errorContainer}>
                <ThemedText style={styles.errorText}>{error}</ThemedText>
              </View>
            )}

            <Button
              onPress={handleSubmit}
              block
              disabled={isLoading || !isFormValid}
              style={styles.submitButton}
            >
              {isLoading ? (
                <ActivityIndicator color="#1C1C1C" size="small" />
              ) : (
                <ThemedText style={styles.buttonText}>Send reset link</ThemedText>
              )}
            </Button>

            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => router.push('/login')}
              style={styles.loginLinkContainer}
            >
              <ThemedText style={styles.loginLinkText}>
                Remember your password?{' '}
                <ThemedText style={styles.loginLinkAction}>Log in</ThemedText>
              </ThemedText>
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1C1C',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
    lineHeight: 20,
  },
  emailInput: {
    marginTop: 8,
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
  submitButton: {
    marginTop: 24,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1C',
  },
  loginLinkContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  loginLinkText: {
    color: '#6B7280',
    fontSize: 14,
  },
  loginLinkAction: {
    color: '#2563EB',
    fontWeight: '600',
  },
  successContainer: {
    paddingVertical: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1C1C',
    marginBottom: 16,
  },
  successMessage: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  backButton: {
    marginTop: 24,
  },
  footerCaption: {
    color: '#000',
    textAlign: 'center',
    fontSize: 7,
    fontWeight: '500',
    marginTop: 32,
  },
});
