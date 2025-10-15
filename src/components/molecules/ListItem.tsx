import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, Spacer } from '@components';
import { Colors, Spacing } from '@constants';

interface ListItemProps {
    title: string;
    subtitle?: string;
    rightText?: string;
    onPress?: () => void;
}

export const ListItem: React.FC<ListItemProps> = ({
    title,
    subtitle,
    rightText,
    onPress,
}) => {
    const Content = (
        <View style={styles.container}>
            <View style={styles.leftContent}>
                <Text variant="body" weight="medium">
                    {title}
                </Text>
                {subtitle && (
                    <>
                        <Spacer size="xs" />
                        <Text variant="caption" color={Colors.textSecondary}>
                            {subtitle}
                        </Text>
                    </>
                )}
            </View>
            {rightText && (
                <Text variant="caption" color={Colors.textSecondary}>
                    {rightText}
                </Text>
            )}
        </View>
    );

    if (onPress) {
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
                <Card style={styles.card}>{Content}</Card>
            </TouchableOpacity>
        );
    }

    return <Card style={styles.card}>{Content}</Card>;
};

const styles = StyleSheet.create({
    card: {
        marginBottom: Spacing.sm,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    leftContent: {
        flex: 1,
        marginRight: Spacing.sm,
    },
});
