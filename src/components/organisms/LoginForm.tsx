import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { FormInput } from '@molecules/FormInput';
import { Button } from '@atoms/Button';
import { Spacer } from '@atoms/Spacer';
import { isValidEmail, isEmpty } from '@utils';

interface LoginFormProps {
    onSubmit: (email: string, password: string) => void;
    loading?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
    onSubmit,
    loading = false,
}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ email?: string; password?: string }>(
        {},
    );

    const validate = (): boolean => {
        const newErrors: { email?: string; password?: string } = {};

        if (isEmpty(email)) {
            newErrors.email = 'Email is required';
        } else if (!isValidEmail(email)) {
            newErrors.email = 'Invalid email format';
        }

        if (isEmpty(password)) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validate()) {
            onSubmit(email, password);
        }
    };

    return (
        <View style={styles.container}>
            <FormInput
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                error={errors.email}
                required
            />
            <Spacer size="md" />
            <FormInput
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                error={errors.password}
                required
            />
            <Spacer size="lg" />
            <Button
                onPress={handleSubmit}
                loading={loading}
                disabled={loading}
                fullWidth>
                Login
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
});
