/**
 * Login Screen
 * Authentication screen untuk user login
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Text, Spacer, Button } from '@components';
import { FormInput } from '@components';
import { Colors, Spacing } from '@constants';
import { useAppDispatch } from '@hooks';
import { setTokens } from '@store/reducer/authSlice';
import { setCurrentUser } from '@store/reducer/userSlice';
import { isValidEmail } from '@utils';

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Validation states
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  // Email validation
  const emailError = useMemo(() => {
    if (!emailTouched) return '';
    if (!email) return 'Email is required';
    if (!isValidEmail(email)) return 'Invalid email format';
    return '';
  }, [email, emailTouched]);

  // Password validation
  const passwordError = useMemo(() => {
    if (!passwordTouched) return '';
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return '';
  }, [password, passwordTouched]);

  // Check if form is valid
  const isFormValid = useMemo(() => {
    return email && password && !emailError && !passwordError;
  }, [email, password, emailError, passwordError]);

  const handleLogin = async () => {
    // Mark all fields as touched
    setEmailTouched(true);
    setPasswordTouched(true);

    // Validation
    if (!isFormValid) {
      Alert.alert('Error', 'Please fix all errors before continuing');
      return;
    }

    try {
      setLoading(true);

      // Simulate API call for now (akan diganti dengan real API nanti)
      setTimeout(() => {
        // Mock user data
        const mockUser = {
          id: 1,
          email: email,
          name: 'John Doe',
          phone: '+1 234 567 8900',
        };
        const mockToken = 'mock-jwt-token-' + Date.now();
        const mockRefreshToken = 'mock-refresh-token-' + Date.now();

        // Save tokens to auth store
        dispatch(
          setTokens({
            token: mockToken,
            refreshToken: mockRefreshToken,
          }),
        );

        // Save user data to user store
        dispatch(setCurrentUser(mockUser));

        setLoading(false);
        // Navigation will happen automatically via AppNavigator
      }, 1000);
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Failed to login. Please try again.');
      setLoading(false);
    }
  };

  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          {/* Logo/Title */}
          <View style={styles.header}>
            <Text style={styles.logo}>🌐</Text>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </View>

          <Spacer size="xl" />

          {/* Form */}
          <View style={styles.form}>
            <FormInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              error={emailError}
              onBlur={() => setEmailTouched(true)}
            />

            <Spacer size="md" />

            <FormInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              secureTextEntry
              error={passwordError}
              onBlur={() => setPasswordTouched(true)}
            />

            <Spacer size="xl" />

            <Button
              onPress={handleLogin}
              disabled={!isFormValid || loading}
              loading={loading}
              fullWidth>
              {loading ? 'Logging in...' : 'Sign In'}
            </Button>

            <Spacer size="md" />

            {/* Register Link */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={navigateToRegister}>
                <Text style={styles.registerLink}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl * 2,
    paddingBottom: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  logo: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  form: {
    flex: 1,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonIcon: {
    fontSize: 20,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  registerText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  registerLink: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: 'bold',
  },
});
