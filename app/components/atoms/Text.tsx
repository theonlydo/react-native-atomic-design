import React from 'react';
import {
    Text as RNText,
    TextProps as RNTextProps,
    StyleSheet,
} from 'react-native';
import { Colors, FontSize, FontWeight } from '@constants';

interface TextProps extends RNTextProps {
    variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'small';
    color?: string;
    weight?: keyof typeof FontWeight;
    align?: 'left' | 'center' | 'right';
    children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({
    variant = 'body',
    color = Colors.text,
    weight = 'regular',
    align = 'left',
    style,
    children,
    ...props
}) => {
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
            {children}
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
