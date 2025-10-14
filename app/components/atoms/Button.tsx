import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacityProps,
    ViewStyle,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors, Spacing, BorderRadius, FontSize } from '@constants';
interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  translate?: boolean; // Auto translate by default
  i18nKey?: string; // Translation key
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  loading = false,
  fullWidth = false,
  translate = true,
  i18nKey,
  disabled,
  style,
  children,
  ...props
}) => {
  const { t } = useTranslation();

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

  // Get translated text
  const getText = () => {
    if (i18nKey) {
      return t(i18nKey);
    }
    if (translate && typeof children === 'string') {
      return t(children);
    }
    return children;
  };

  return (
    <TouchableOpacity
      style={[buttonStyle, style]}
      disabled={disabled || loading}
      {...props}>
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.text, { color: textColor }]}>{getText()}</Text>
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
