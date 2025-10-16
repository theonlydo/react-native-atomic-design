import React from 'react';
import { View, StyleSheet, TextStyle } from 'react-native';
import { Input, Text, Spacer } from '@components';
import { Colors } from '@constants';

interface FormInputProps {
  label?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  onBlur?: () => void;
  editable?: boolean;
  style?: TextStyle;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  required = false,
  editable = true,
  style,
  ...inputProps
}) => {
  return (
    <View style={styles.container}>
      {label && (
        <>
          <Text variant="body" weight="medium">
            {label}
            {required && <Text color={Colors.error}> *</Text>}
          </Text>
          <Spacer size="xs" />
        </>
      )}
      <Input
        error={!!error}
        editable={editable}
        style={[!editable && styles.disabledInput, style]}
        {...inputProps}
      />
      {error && (
        <>
          <Spacer size="xs" />
          <Text variant="small" color={Colors.error}>
            {error}
          </Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: Colors.lightGray,
  },
  disabledInput: {
    backgroundColor: Colors.surface,
    opacity: 0.7,
  },
});
