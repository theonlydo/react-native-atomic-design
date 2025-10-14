import React, { useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { Text } from '@atoms/Text';
import { Card } from '@atoms/Card';
import { Spacer } from '@atoms/Spacer';
import { LoadingState } from '@molecules/LoadingState';
import { ErrorState } from '@molecules/ErrorState';
import { useAppDispatch, useAppSelector } from '@hooks';
import { fetchUserById } from '@store/slices/userSlice';
import { Colors, Spacing } from '@constants';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@types';

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

export const DetailScreen: React.FC<Props> = ({ route }) => {
  const { id } = route.params;
  const dispatch = useAppDispatch();
  const { selectedUser: user, loading, error } = useAppSelector(
    state => state.user,
  );

  useEffect(() => {
    dispatch(fetchUserById(id));
  }, [dispatch, id]);

  const handleRetry = () => {
    dispatch(fetchUserById(id));
  };

  if (loading) {
    return <LoadingState message="Loading user details..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={handleRetry} />;
  }

  if (!user) {
    return <ErrorState message="User not found" onRetry={handleRetry} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="h2">User Details</Text>
        <Spacer size="lg" />

        <Card>
          <Text variant="caption" color={Colors.textSecondary}>
            NAME
          </Text>
          <Spacer size="xs" />
          <Text variant="body" weight="medium">
            {user.name}
          </Text>
        </Card>

        <Spacer size="md" />

        <Card>
          <Text variant="caption" color={Colors.textSecondary}>
            EMAIL
          </Text>
          <Spacer size="xs" />
          <Text variant="body" weight="medium">
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
              <Text variant="body" weight="medium">
                {user.username}
              </Text>
            </Card>
          </>
        )}

        {user.phone && (
          <>
            <Spacer size="md" />
            <Card>
              <Text variant="caption" color={Colors.textSecondary}>
                PHONE
              </Text>
              <Spacer size="xs" />
              <Text variant="body" weight="medium">
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
