import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppSelector } from '@hooks';
import {
  LoginScreen,
  RegisterScreen,
  ContactListScreen,
  ProfileScreen,
} from '@screens';
import { Colors } from '@constants';

// Type definitions
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  ContactList: undefined;
  Profile: undefined;
};

export type RootStackParamList = AuthStackParamList & MainTabParamList;

const Stack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Icons
const ContactIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon name="people" size={size} color={color} />
);

const ProfileIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon name="person" size={size} color={color} />
);

// Auth Stack Navigator (Login/Register tanpa tab)
const AuthStack = () => {
  return (
    // @ts-ignore - Stack Navigator type issue
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

// Main Tab Navigator (Contact List & Profile dengan tab setelah login)
const MainTabs = () => {
  return (
    // @ts-ignore - Tab Navigator type issue
    <Tab.Navigator
      initialRouteName="ContactList"
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: Colors.white,
        headerTitleStyle: {
          fontWeight: '600',
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.border,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tab.Screen
        name="ContactList"
        component={ContactListScreen}
        options={{
          title: 'Contacts',
          tabBarLabel: 'Contacts',
          tabBarIcon: ContactIcon,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ProfileIcon,
        }}
      />
    </Tab.Navigator>
  );
};

// Root Navigator dengan authentication logic
export const AppNavigator: React.FC = () => {
  // Check authentication status dari Redux
  const { token } = useAppSelector(state => state.auth);
  const isAuthenticated = !!token;

  return (
    <NavigationContainer>
      {/* Jika authenticated tampilkan MainTabs, jika belum tampilkan AuthStack */}
      {isAuthenticated ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

