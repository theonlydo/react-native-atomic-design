import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '@types';
import { HomeScreen, DetailScreen, ProfileScreen } from '@screens';
import { Colors } from '@constants';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerStyle: {
                        backgroundColor: Colors.primary,
                    },
                    headerTintColor: Colors.white,
                    headerTitleStyle: {
                        fontWeight: '600',
                    },
                }}>
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                        title: 'Home',
                    }}
                />
                <Stack.Screen
                    name="Detail"
                    component={DetailScreen}
                    options={{
                        title: 'User Detail',
                    }}
                />
                <Stack.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{
                        title: 'Profile',
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
