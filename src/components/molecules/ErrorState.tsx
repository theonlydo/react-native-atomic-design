import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@atoms/Text';
import { Button } from '@atoms/Button';
import { Spacer } from '@atoms/Spacer';
import { Colors } from '@constants';

interface ErrorStateProps {
    message?: string;
    onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
    message = 'Something went wrong',
    onRetry,
}) => {
    return (
        <View style={styles.container}>
            <Text variant="h3" color={Colors.error}>
                Error
            </Text>
            <Spacer size="sm" />
            <Text variant="body" color={Colors.textSecondary} align="center">
                {message}
            </Text>
            {onRetry && (
                <>
                    <Spacer size="lg" />
                    <Button onPress={onRetry} variant="outline">
                        Try Again
                    </Button>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
});
