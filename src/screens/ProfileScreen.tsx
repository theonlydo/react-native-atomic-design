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
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Text, Spacer, LanguageSwitcher, Button } from '@components';
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
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.content}>


          {/* Profile Avatar Section */}
          <View style={styles.profileSection}>
            <Spacer size="lg" />
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarTextLarge}>
                {currentUser?.name?.substring(0, 2).toUpperCase() || '👤'}
              </Text>
            </View>
            <Spacer size="sm" />
            <Text style={styles.profileName}>{currentUser?.name || 'User Name'}</Text>
            <Text style={styles.profileEmail}>{currentUser?.email || 'user@example.com'}</Text>
          </View>

          <Spacer size="xl" />

          {/* Form Container */}
          <View style={styles.formContainer}>
            {/* Email (Read-only) */}
            <FormInput
              label="Email"
              value={currentUser?.email || ''}
              placeholder="Email"
              keyboardType="email-address"
              editable={false}
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
              size="small"
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
              size="small"
            />

            <Spacer size="xl" />

            {/* Action Buttons */}
            {!isEditing ? (
              <Button
                variant="primary"
                onPress={handleEditProfile}
                fullWidth
                size='small'
                icon={<Icon name="edit" size={18} color={Colors.white} />}
                iconPosition="left">
                Edit Profile
              </Button>
            ) : (
              <View style={styles.editActions}>
                <Button
                  variant="outline"
                  onPress={handleCancelEdit}
                  size="small"
                  style={styles.actionButton}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onPress={handleSaveProfile}
                  loading={loading}
                  disabled={!isFormValid}
                  size="small"
                  style={styles.actionButton}>
                  Save
                </Button>
              </View>
            )}
          </View>

          <Spacer size="xl" />

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Icon name="logout" size={20} color={Colors.white} />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>

          <Spacer size="xl" />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.lightGray,
  },
  headerContainer: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  profileHeaderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.white,
    paddingBottom: Spacing.md,

  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarTextLarge: {
    fontSize: 40,
    fontWeight: 'bold',
    color: Colors.white,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
  },
  profileEmail: {
    fontSize: 15,
    color: Colors.textSecondary,
  },
  formContainer: {
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.white,
  },
  editActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
  logoutButton: {
    backgroundColor: Colors.error,
    marginHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  logoutButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
