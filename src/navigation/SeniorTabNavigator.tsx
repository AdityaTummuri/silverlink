import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SeniorHomeScreen } from '../screens/senior/SeniorHomeScreen';
import { MedicinesScreen } from '../screens/senior/MedicinesScreen';
import { DailyCheckInScreen } from '../screens/senior/DailyCheckInScreen';
import { EmergencyScreen } from '../screens/senior/EmergencyScreen';
import { SeniorPrivacyScreen } from '../screens/senior/SeniorPrivacyScreen';
import { SeniorSettingsScreen } from '../screens/senior/SeniorSettingsScreen';

const Tab = createBottomTabNavigator();

export const SeniorTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 72,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 2,
          borderTopColor: '#CBD5E1',
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#0F766E',
        tabBarInactiveTintColor: '#64748B',
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name="SeniorHome"
        component={SeniorHomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={28} color={color} />,
        }}
      />

      <Tab.Screen
        name="SeniorMedicines"
        component={MedicinesScreen}
        options={{
          tabBarLabel: 'Medicines',
          tabBarIcon: ({ color }) => <Ionicons name="medical" size={28} color={color} />,
        }}
      />

      <Tab.Screen
        name="SeniorCheckIn"
        component={DailyCheckInScreen}
        options={{
          tabBarLabel: 'Check-In',
          tabBarIcon: ({ color }) => <Ionicons name="happy" size={28} color={color} />,
        }}
      />

      <Tab.Screen
        name="SeniorSOS"
        component={EmergencyScreen}
        options={{
          tabBarLabel: 'SOS',
          tabBarIcon: () => <Ionicons name="alert-circle" size={30} color="#DC2626" />,
          tabBarLabelStyle: { fontSize: 13, fontWeight: 'bold', color: '#DC2626' },
        }}
      />

      <Tab.Screen
        name="SeniorPrivacy"
        component={SeniorPrivacyScreen}
        options={{
          tabBarLabel: 'Privacy',
          tabBarIcon: ({ color }) => <Ionicons name="shield-checkmark" size={28} color={color} />,
        }}
      />

      <Tab.Screen
        name="SeniorSettings"
        component={SeniorSettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color }) => <Ionicons name="settings" size={28} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};
