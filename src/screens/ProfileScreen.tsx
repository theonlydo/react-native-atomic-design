import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text, Card, Button, Spacer, LoginForm, LanguageSwitcher } from '@components';
import { Colors, Spacing } from '@constants';
import { Config, isDevelopment } from '@config';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootStackParamList } from '@types';

type Props = BottomTabScreenProps<RootStackParamList, 'Profile'>;

export const ProfileScreen: React.FC<Props> = () => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleLogin = async (email: string, _password: string) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        t('auth.loginSuccess'),
        `${t('auth.email')}: ${email}`,
      );
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Text variant="h2" i18nKey="profile.title" />
          <LanguageSwitcher variant="compact" />
        </View>
        <Spacer size="md" />

        <Card>
          <Text variant="h3" i18nKey="profile.userName" />
          <Spacer size="xs" />
          <Text variant="body" color={Colors.textSecondary} i18nKey="profile.userEmail" />
          <Spacer size="md" />
          <Button
            variant="outline"
            size="small"
            i18nKey="profile.editProfile">
            Edit Profile
          </Button>
        </Card>

        <Spacer size="lg" />

        {/* Environment Info Card - Show in Development */}
        {isDevelopment() && (
          <>
            <Card>
              <Text variant="h3">🔧 Environment Info</Text>
              <Spacer size="sm" />
              <Text variant="caption" color={Colors.textSecondary}>
                App: {Config.appName} v{Config.appVersion}
              </Text>
              <Text variant="caption" color={Colors.textSecondary}>
                Environment: {Config.environment}
              </Text>
              <Text variant="caption" color={Colors.textSecondary}>
                API: {Config.apiBaseUrl}
              </Text>
              <Text variant="caption" color={Colors.textSecondary}>
                Logging: {Config.enableLogging ? '✅' : '❌'}
              </Text>
              <Text variant="caption" color={Colors.textSecondary}>
                Debug Mode: {Config.enableDebugMode ? '✅' : '❌'}
              </Text>
            </Card>
            <Spacer size="lg" />
          </>
        )}

        <LanguageSwitcher variant="expanded" />

        <Spacer size="lg" />

        <LoginForm onSubmit={handleLogin} loading={loading} />
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
});

