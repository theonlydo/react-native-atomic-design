import React from 'react';
import {
    TextInput as RNTextInput,
    TextInputProps as RNTextInputProps,
    StyleSheet,
    View,
    ViewStyle,
} from 'react-native';
import { Colors, Spacing, BorderRadius, FontSize } from '@constants';

interface InputProps extends RNTextInputProps {
    error?: boolean;
    containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
    error = false,
    containerStyle,
    style,
    ...props
}) => {
    return (
        <View style={[styles.container, containerStyle]}>
            <RNTextInput
                style={[
                    styles.input,
                    error && styles.inputError,
                    style,
                ]}
                placeholderTextColor={Colors.textSecondary}
                {...props}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: BorderRadius.md,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.md,
        fontSize: FontSize.md,
        color: Colors.text,
        backgroundColor: Colors.white,
    },
    inputError: {
        borderColor: Colors.error,
    },
});
