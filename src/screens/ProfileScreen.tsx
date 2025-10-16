import React, { useState, useMemo } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text, Card, Spacer, LanguageSwitcher, Button } from '@components';
import { FormInput } from '@components';
import { Colors, Spacing } from '@constants';
import { useAppDispatch, useAppSelector } from '@hooks';
import { clearTokens } from '@store/reducer/authSlice';
import { clearCurrentUser, setCurrentUser } from '@store/reducer/userSlice';
import { authApi } from '@services';
import { isValidPhone } from '@utils';

export const ProfileScreen: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector(state => state.user);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');

  // Validation states
  const [nameTouched, setNameTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);

  // Form validation
  const nameError = useMemo(() => {
    if (!nameTouched) return '';
    if (!fullName) return 'Name is required';
    return '';
  }, [fullName, nameTouched]);

  const phoneError = useMemo(() => {
    if (!phoneTouched) return '';
    if (!phone) return 'Phone is required';
    if (!isValidPhone(phone)) return 'Invalid phone format';
    return '';
  }, [phone, phoneTouched]);

  const isFormValid = useMemo(() => {
    return fullName && phone && !nameError && !phoneError;
  }, [fullName, phone, nameError, phoneError]);

  const handleLogout = () => {
    Alert.alert(t('auth.logout'), 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          dispatch(clearTokens());
          dispatch(clearCurrentUser());
        },
      },
    ]);
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    // Reset form to original values
    setFullName(currentUser?.name || '');
    setPhone(currentUser?.phone || '');
    setNameTouched(false);
    setPhoneTouched(false);
    setIsEditing(false);
  };

  const handleSaveProfile = async () => {
    // Mark all as touched
    setNameTouched(true);
    setPhoneTouched(true);

    if (!isFormValid) {
      Alert.alert('Error', 'Please fix all errors before saving');
      return;
    }

    try {
      setLoading(true);

      console.log('=== UPDATE PROFILE API CALL ===');
      console.log('Endpoint: PUT /api/v1/me');
      console.log('Payload:', JSON.stringify({
        full_name: fullName,
        phone: phone,
      }, null, 2));

      // Call real API
      const response = await authApi.updateProfile({
        full_name: fullName,
        phone: phone,
      });

      console.log('Response:', JSON.stringify(response, null, 2));

      if (response.status === 1 && response.data) {
        console.log('Profile updated:', response.data);

        // Update Redux store with new profile data
        dispatch(
          setCurrentUser({
            id: response.data.id,
            email: response.data.email,
            name: response.data.full_name,
            phone: response.data.phone,
          }),
        );

        Alert.alert('Success', 'Profile updated successfully!');
        setIsEditing(false);
      } else {
        console.log('Failed to update profile:', response.message);
        Alert.alert('Error', response.message || 'Failed to update profile');
      }

      setLoading(false);
    } catch (err: any) {
      console.error('=== UPDATE PROFILE ERROR ===');
      console.error('Error:', err);

      let errorMessage = 'Failed to update profile';
      if (err.message) {
        errorMessage = err.message;
      }

      Alert.alert('Error', errorMessage);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Text variant="h2" i18nKey="profile.title" />
          <LanguageSwitcher variant="compact" />
        </View>
        <Spacer size="md" />

        {/* Profile Card */}
        <Card>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {currentUser?.name?.charAt(0).toUpperCase() || '👤'}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text variant="h3">{currentUser?.name || 'User Name'}</Text>
              <Spacer size="xs" />
              <Text variant="body" color={Colors.textSecondary}>
                {currentUser?.email || 'user@example.com'}
              </Text>
            </View>
          </View>

          <Spacer size="lg" />

          {/* Email (Read-only) */}
          <FormInput
            label="Email"
            value={currentUser?.email || ''}
            editable={false}
            placeholder="Email"
            keyboardType="email-address"
            style={styles.disabledInput}
          />

          <Spacer size="md" />

          {/* Full Name */}
          <FormInput
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
            editable={isEditing}
            placeholder="Enter your full name"
            error={nameError}
            onBlur={() => setNameTouched(true)}
            style={!isEditing ? styles.disabledInput : undefined}
          />

          <Spacer size="md" />

          {/* Phone */}
          <FormInput
            label="Phone"
            value={phone}
            onChangeText={setPhone}
            editable={isEditing}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            error={phoneError}
            onBlur={() => setPhoneTouched(true)}
            style={!isEditing ? styles.disabledInput : undefined}
          />

          <Spacer size="lg" />

          {/* Action Buttons */}
          {!isEditing ? (
            <Button
              variant="secondary"
              onPress={handleEditProfile}
              icon="✏️"
              iconPosition="left">
              Edit Profile
            </Button>
          ) : (
            <View style={styles.editActions}>
              <Button
                variant="outline"
                onPress={handleCancelEdit}
                style={styles.cancelButton}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onPress={handleSaveProfile}
                loading={loading}
                disabled={!isFormValid}
                style={styles.saveButton}>
                Save Changes
              </Button>
            </View>
          )}
        </Card>

        <Spacer size="lg" />

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>🚪 Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    fontSize: 32,
    color: Colors.white,
  },
  profileInfo: {
    flex: 1,
  },
  disabledInput: {
    backgroundColor: Colors.surface,
    opacity: 0.7,
  },
  editActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
  editButton: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.sm,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: Colors.error,
    padding: Spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
