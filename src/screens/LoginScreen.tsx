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
import { authApi } from '@services';
import { isValidEmail } from '@utils';
import { AppConfig } from '../config/env';

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
    if (password.length < 8) return 'Password must be at least 8 characters';
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

      console.log('=== LOGIN API CALL ===');
      console.log('URL:', `${AppConfig.apiBaseUrl}${AppConfig.endpoints.auth.login}`);
      console.log('Payload:', {
        email: email,
        password: '***',
      });

      // Call real API
      const response = await authApi.login({
        email: email,
        password: password,
      });

      console.log('Response received:', response);

      if (response.status === 1 && response.data) {
        console.log('Login success, saving token...');

        // Save access token to auth store
        dispatch(
          setTokens({
            token: response.data.token.access_token,
            refreshToken: '', // No refresh token in response
          }),
        );

        // Save user data to user store
        dispatch(
          setCurrentUser({
            id: response.data.id,
            email: response.data.email,
            name: response.data.full_name,
            phone: response.data.phone,
          }),
        );

        Alert.alert('Success', 'Login successful!', [
          {
            text: 'OK',
            onPress: () => {
              // Navigation will happen automatically via AppNavigator
            },
          },
        ]);
      } else {
        console.log('Login failed:', response.message);
        Alert.alert('Error', response.message || 'Login failed');
      }

      setLoading(false);
    } catch (error: any) {
      console.error('=== LOGIN ERROR ===');
      console.error('Full error:', error);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response);
      console.error('Error request:', error.request);

      let errorMessage = 'Failed to login. Please try again.';

      if (error.response) {
        // Server responded with error
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
        console.error('Server error data:', error.response.data);
      } else if (error.request) {
        // Request made but no response
        errorMessage = 'No response from server. Check your connection.';
        console.error('No response received');
      } else {
        // Error in request setup
        errorMessage = error.message || 'Request setup error';
      }

      Alert.alert('Error', errorMessage);
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

            <Spacer size="md" />

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
                <Text style={styles.registerLink}>Sign Up</Text>
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
    color: Colors.text,
  },
  registerLink: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: 'bold',
  },
});
