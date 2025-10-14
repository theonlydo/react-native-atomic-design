import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '@atoms/Text';
import { Card } from '@atoms/Card';
import { Button } from '@atoms/Button';
import { Spacer } from '@atoms/Spacer';
import { LoginForm } from '@organisms/LoginForm';
import { LanguageSwitcher } from '@molecules/LanguageSwitcher';
import { Colors, Spacing } from '@constants';
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

