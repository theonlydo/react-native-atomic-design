import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text, Card, Spacer, LanguageSwitcher } from '@components';
import { Colors, Spacing } from '@constants';
import { useAppDispatch, useAppSelector } from '@hooks';
import { clearTokens } from '@store/reducer/authSlice';
import { clearCurrentUser } from '@store/reducer/userSlice';

export const ProfileScreen: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector(state => state.user);

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
    Alert.alert('Edit Profile', 'Feature coming soon!');
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
                {currentUser?.name?.charAt(0) || '👤'}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text variant="h3">{currentUser?.name || 'User Name'}</Text>
              <Spacer size="xs" />
              <Text variant="body" color={Colors.textSecondary}>
                {currentUser?.email || 'user@example.com'}
              </Text>
              {currentUser?.phone && (
                <>
                  <Spacer size="xs" />
                  <Text variant="caption" color={Colors.textSecondary}>
                    📞 {currentUser.phone}
                  </Text>
                </>
              )}
            </View>
          </View>

          <Spacer size="md" />

          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditProfile}>
            <Text style={styles.editButtonText}>✏️ Edit Profile</Text>
          </TouchableOpacity>
        </Card>

        <Spacer size="lg" />

        {/* Environment Info Card - Show in Development */}



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
