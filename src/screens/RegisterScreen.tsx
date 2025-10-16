/**
 * Register Screen
 * Authentication screen untuk user registration
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Text, Spacer } from '@components';
import { FormInput } from '@components';
import { Colors, Spacing } from '@constants';
import { useAppDispatch } from '@hooks';
import { setTokens } from '@store/reducer/authSlice';
import { setCurrentUser } from '@store/reducer/userSlice';
import { authApi } from '@services';
interface RegisterScreenProps {
  navigation: any;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Validation
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      // Call real API
      const response = await authApi.register({
        full_name: fullName,
        email: email,
        password: password,
      });

      console.log('Response received:', response);

      if (response.status === 1 && response.data) {
        console.log('Registration success, saving token...');

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

        Alert.alert('Success', 'Registration successful!', [
          {
            text: 'OK',
            onPress: () => {
              // Navigation will happen automatically via AppNavigator
            },
          },
        ]);
      } else {
        console.log('Registration failed:', response.message);
        Alert.alert('Error', response.message || 'Registration failed');
      }

      setLoading(false);
    } catch (error: any) {

      let errorMessage = 'Failed to register. Please try again.';

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

  const navigateToLogin = () => {
    navigation.navigate('Login');
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to get started</Text>
          </View>

          <Spacer size="lg" />

          {/* Form */}
          <View style={styles.form}>
            <FormInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Full Name"
            />

            <Spacer size="md" />

            <FormInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
            />


            <Spacer size="md" />

            <FormInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              secureTextEntry
            />

            <Spacer size="md" />

            <FormInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your password"
              secureTextEntry
            />

            <Spacer size="xl" />

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}>
              <Text style={styles.buttonText}>
                {loading ? 'Creating Account...' : 'Register'}
              </Text>
            </TouchableOpacity>

            <Spacer size="md" />

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={navigateToLogin}>
                <Text style={styles.loginLink}>Login</Text>
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
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginTop: Spacing.lg,
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
    borderRadius: 14,
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  loginText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  loginLink: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: 'bold',
  },
});
