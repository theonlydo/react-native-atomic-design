import React from 'react';
import { FlatList, StyleSheet, View, RefreshControl } from 'react-native';
import { LoadingState, ErrorState, Text } from '@components';
import { Colors, Spacing } from '@constants';

interface DataListProps<T> {
  data: T[] | null;
  loading: boolean;
  error: string | null;
  onRefresh?: () => void;
  refreshing?: boolean;
  renderItem: (item: T, index: number) => React.ReactElement;
  keyExtractor: (item: T, index: number) => string;
  emptyMessage?: string;
}

export function DataList<T>({
  data,
  loading,
  error,
  onRefresh,
  refreshing = false,
  renderItem,
  keyExtractor,
  emptyMessage = 'No data available',
}: DataListProps<T>) {
  if (loading && !data) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={onRefresh} />;
  }

  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text variant="body" color={Colors.textSecondary}>
          {emptyMessage}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      renderItem={({ item, index }) => renderItem(item, index)}
      keyExtractor={keyExtractor}
      contentContainerStyle={styles.listContent}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
          />
        ) : undefined
      }
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: Spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
});
