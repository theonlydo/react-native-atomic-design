import React from 'react';
import { View, StyleSheet } from 'react-native';
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
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  required = false,
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
      <Input error={!!error} {...inputProps} />
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
});
