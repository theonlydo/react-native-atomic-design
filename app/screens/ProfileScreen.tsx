import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, Alert } from 'react-native';
import { Text } from '@atoms/Text';
import { Card } from '@atoms/Card';
import { Button } from '@atoms/Button';
import { Spacer } from '@atoms/Spacer';
import { LoginForm } from '@organisms/LoginForm';
import { Colors, Spacing } from '@constants';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@types';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export const ProfileScreen: React.FC<Props> = ({ navigation }) => {
    const [loading, setLoading] = useState(false);

    const handleLogin = async (email: string, password: string) => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            Alert.alert(
                'Login Successful',
                `Email: ${email}\nPassword: ${password}`,
            );
        }, 2000);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text variant="h2">Profile</Text>
                <Spacer size="md" />

                <Card>
                    <Text variant="body" color={Colors.textSecondary}>
                        This is a demo profile screen with a login form example.
                    </Text>
                </Card>

                <Spacer size="lg" />

                <LoginForm onSubmit={handleLogin} loading={loading} />

                <Spacer size="lg" />

                <Button
                    onPress={() => navigation.goBack()}
                    variant="ghost"
                    fullWidth>
                    Back to Home
                </Button>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        padding: Spacing.md,
    },
});
