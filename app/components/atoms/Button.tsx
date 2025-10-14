import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacityProps,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { Colors, Spacing, BorderRadius, FontSize } from '@constants';

interface ButtonProps extends TouchableOpacityProps {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'small' | 'medium' | 'large';
    loading?: boolean;
    fullWidth?: boolean;
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'medium',
    loading = false,
    fullWidth = false,
    disabled,
    style,
    children,
    ...props
}) => {
    const buttonStyle: ViewStyle = {
        ...styles.base,
        ...styles[variant],
        ...styles[`size_${size}`],
        ...(fullWidth && { width: '100%' }),
        ...(disabled && styles.disabled),
    };

    const textColor = variant === 'outline' || variant === 'ghost'
        ? Colors.primary
        : Colors.white;

    return (
        <TouchableOpacity
            style={[buttonStyle, style]}
            disabled={disabled || loading}
            {...props}>
            {loading ? (
                <ActivityIndicator color={textColor} />
            ) : (
                <Text style={[styles.text, { color: textColor }]}>{children}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    base: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: BorderRadius.md,
    },
    primary: {
        backgroundColor: Colors.primary,
    },
    secondary: {
        backgroundColor: Colors.secondary,
    },
    outline: {
        backgroundColor: Colors.transparent,
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    ghost: {
        backgroundColor: Colors.transparent,
    },
    size_small: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
    },
    size_medium: {
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
    },
    size_large: {
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.lg,
    },
    disabled: {
        opacity: 0.5,
    },
    text: {
        fontSize: FontSize.md,
        fontWeight: '600',
    },
});
