import React, { useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text, Card, Spacer, LoadingState, ErrorState } from '@components';
import { useAppDispatch, useAppSelector } from '@hooks';
import { fetchUserById } from '@store/reducer/userSlice';
import { Colors, Spacing } from '@constants';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootStackParamList } from '@types';

type Props = BottomTabScreenProps<RootStackParamList, 'Detail'>;

export const DetailScreen: React.FC<Props> = ({ route }) => {
  // Default to user id 1 if no id is provided (for tab navigation)
  const { id = 1 } = route.params || {};
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { selectedUser: user, loading, error } = useAppSelector(
    state => state.user,
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchUserById(id));
    }
  }, [dispatch, id]);

  const handleRetry = () => {
    if (id) {
      dispatch(fetchUserById(id));
    }
  };

  if (loading) {
    return <LoadingState message={t('detail.loading')} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={handleRetry} />;
  }

  if (!user) {
    return <ErrorState message={t('detail.notFound')} onRetry={handleRetry} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="h2" i18nKey="detail.userDetails" />
        <Spacer size="lg" />

        <Card>
          <Text variant="caption" color={Colors.textSecondary} i18nKey="detail.name" />
          <Spacer size="xs" />
          <Text variant="body" weight="medium" translate={false}>
            {user.name}
          </Text>
        </Card>

        <Spacer size="md" />

        <Card>
          <Text variant="caption" color={Colors.textSecondary} i18nKey="detail.email" />
          <Spacer size="xs" />
          <Text variant="body" weight="medium" translate={false}>
            {user.email}
          </Text>
        </Card>

        {user.username && (
          <>
            <Spacer size="md" />
            <Card>
              <Text variant="caption" color={Colors.textSecondary}>
                USERNAME
              </Text>
              <Spacer size="xs" />
              <Text variant="body" weight="medium" translate={false}>
                {user.username}
              </Text>
            </Card>
          </>
        )}

        {user.phone && (
          <>
            <Spacer size="md" />
            <Card>
              <Text variant="caption" color={Colors.textSecondary} i18nKey="detail.phone" />
              <Spacer size="xs" />
              <Text variant="body" weight="medium" translate={false}>
                {user.phone}
              </Text>
            </Card>
          </>
        )}

        {user.website && (
          <>
            <Spacer size="md" />
            <Card>
              <Text variant="caption" color={Colors.textSecondary}>
                WEBSITE
              </Text>
              <Spacer size="xs" />
              <Text variant="body" weight="medium">
                {user.website}
              </Text>
            </Card>
          </>
        )}
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
});
