import { AuthHeader } from '@/components/auth/AuthHeader';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { resetPassword } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/client';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
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

export default function ResetPasswordScreen() {
  const { token } = useLocalSearchParams<{ token?: string }>();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token');
    }
  }, [token]);

  const isFormValid = password.trim() && confirmPassword.trim() && password === confirmPassword;

  const handleSubmit = async () => {
    if (!token) {
      setError('Invalid or missing reset token');
      return;
    }

    if (!password.trim() || !confirmPassword.trim()) {
      setError('Please enter both password fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await resetPassword({ token, password });
      setSuccess(true);
    } catch (err) {
      console.error('Reset password error:', err);
      if (err instanceof ApiError) {
        setError(err.message || 'Failed to reset password. Please try again.');
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
              <ThemedText style={styles.successTitle}>Password reset successful</ThemedText>
              <ThemedText style={styles.successMessage}>
                Your password has been successfully reset. You can now log in with your new
                password.
              </ThemedText>
            </View>

            <Button onPress={() => router.replace('/login')} block style={styles.loginButton}>
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
            <ThemedText style={styles.title}>Reset password</ThemedText>

            <Input
              label="New password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter new password"
              variant="outlined"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
              style={styles.passwordInput}
            />

            <Input
              label="Repeat password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Enter new password"
              variant="outlined"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
              style={styles.confirmPasswordInput}
            />

            {error && (
              <View style={styles.errorContainer}>
                <ThemedText style={styles.errorText}>{error}</ThemedText>
              </View>
            )}

            <Button
              onPress={handleSubmit}
              block
              disabled={isLoading || !isFormValid || !token}
              style={styles.submitButton}
            >
              {isLoading ? (
                <ActivityIndicator color="#1C1C1C" size="small" />
              ) : (
                <ThemedText style={styles.buttonText}>Reset password</ThemedText>
              )}
            </Button>

            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => router.push('/login')}
              style={styles.loginLinkContainer}
            >
              <ThemedText style={styles.loginLinkAction}>Back to login</ThemedText>
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
    marginBottom: 24,
  },
  passwordInput: {
    marginTop: 8,
  },
  confirmPasswordInput: {
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
  loginButton: {
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
