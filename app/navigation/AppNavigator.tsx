import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '@types';
import { HomeScreen, DetailScreen, ProfileScreen } from '@screens';
import { Colors } from '@constants';

const Tab = createBottomTabNavigator<RootStackParamList>();

const HomeIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon name="home" size={size} color={color} />
);

const DetailIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon name="person" size={size} color={color} />
);

const ProfileIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon name="settings" size={size} color={color} />
);

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      {/* @ts-ignore - Tab Navigator type issue with bottom tabs */}
      <Tab.Navigator
        initialRouteName="Home"
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
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Home',
            tabBarLabel: 'Home',
            tabBarIcon: HomeIcon,
          }}
        />
        <Tab.Screen
          name="Detail"
          component={DetailScreen}
          options={{
            title: 'Detail',
            tabBarLabel: 'Detail',
            tabBarIcon: DetailIcon,
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
    </NavigationContainer>
  );
};


