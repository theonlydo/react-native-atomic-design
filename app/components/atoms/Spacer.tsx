import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { Spacing } from '@constants';

interface SpacerProps extends ViewProps {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
    horizontal?: boolean;
}

export const Spacer: React.FC<SpacerProps> = ({
    size = 'md',
    horizontal = false,
    style,
    ...props
}) => {
    const spacing = Spacing[size];

    return (
        <View
            style={[
                horizontal ? { width: spacing } : { height: spacing },
                style,
            ]}
            {...props}
        />
    );
};
