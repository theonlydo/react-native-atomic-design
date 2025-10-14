import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Text } from '@atoms/Text';
import { Button } from '@atoms/Button';
import { Spacer } from '@atoms/Spacer';
import { DataList } from '@organisms/DataList';
import { ListItem } from '@molecules/ListItem';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { fetchUsers } from '../store/slices/userSlice';
import { User } from '../types';
import { Colors } from '../constants/colors';
import { Spacing } from '../constants/spacing';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { users, loading, error } = useAppSelector(state => state.user);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchUsers());
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="h1">Home</Text>
        <Spacer size="sm" />
        <Text variant="body" color={Colors.textSecondary}>
          Welcome to React Native Atomic Design
        </Text>
        <Spacer size="md" />
        <Button
          onPress={() => navigation.navigate('Profile')}
          variant="outline"
          size="small">
          Go to Profile
        </Button>
      </View>

      <Spacer size="md" />

      <DataList
        data={users}
        loading={loading}
        error={error}
        onRefresh={handleRefresh}
        renderItem={(user: User) => (
          <ListItem
            title={user.name}
            subtitle={user.email}
            rightText={`#${user.id}`}
            onPress={() => navigation.navigate('Detail', { id: user.id })}
          />
        )}
        keyExtractor={(user: User) => user.id.toString()}
        emptyMessage="No users found"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
});

