import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Text } from '@atoms/Text';
import { Spacer } from '@atoms/Spacer';
import { Colors } from '@constants';

interface LoadingStateProps {
    message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
    message = 'Loading...',
}) => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Spacer size="md" />
            <Text variant="body" color={Colors.textSecondary}>
                {message}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
