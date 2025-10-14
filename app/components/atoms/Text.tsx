import React from 'react';
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors, FontSize, FontWeight } from '@constants';

interface TextProps extends RNTextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'small';
  color?: string;
  weight?: keyof typeof FontWeight;
  align?: 'left' | 'center' | 'right';
  children?: React.ReactNode; // Make children optional
  translate?: boolean; // Auto translate by default
  i18nKey?: string; // Translation key
  i18nParams?: Record<string, any>; // Translation parameters
}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  color = Colors.text,
  weight = 'regular',
  align = 'left',
  translate = true,
  i18nKey,
  i18nParams,
  style,
  children,
  ...props
}) => {
  const { t } = useTranslation();

  // Determine the text to display
  const getText = (): React.ReactNode => {
    if (i18nKey) {
      // If i18nKey is provided, use it
      return t(i18nKey, i18nParams) as string;
    }
    if (translate && typeof children === 'string') {
      // If translate is true and children is string, try to translate
      return t(children, i18nParams) as string;
    }
    // Otherwise return children as is
    return children;
  };

  return (
    <RNText
      style={[
        styles[variant],
        {
          color,
          fontWeight: FontWeight[weight],
          textAlign: align,
        },
        style,
      ]}
      {...props}>
      {getText()}
    </RNText>
  );
};

const styles = StyleSheet.create({
  h1: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
  },
  h2: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
  },
  h3: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
  },
  body: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.regular,
  },
  caption: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.regular,
  },
  small: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.regular,
  },
});
