import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SeniorHomeScreen } from '../screens/senior/SeniorHomeScreen';
import { MedicinesScreen } from '../screens/senior/MedicinesScreen';
import { DailyCheckInScreen } from '../screens/senior/DailyCheckInScreen';
import { EmergencyScreen } from '../screens/senior/EmergencyScreen';
import { FamilyContactsScreen } from '../screens/senior/FamilyContactsScreen';
import { SeniorSettingsScreen } from '../screens/senior/SeniorSettingsScreen';
import { theme } from '../theme/theme';

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
          fontSize: 14,
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name="SeniorHome"
        component={SeniorHomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={28} color={color} />,
        }}
      />

      <Tab.Screen
        name="SeniorMedicines"
        component={MedicinesScreen}
        options={{
          tabBarLabel: 'Medicines',
          tabBarIcon: ({ color, size }) => <Ionicons name="medical" size={28} color={color} />,
        }}
      />

      <Tab.Screen
        name="SeniorCheckIn"
        component={DailyCheckInScreen}
        options={{
          tabBarLabel: 'Check-In',
          tabBarIcon: ({ color, size }) => <Ionicons name="happy" size={28} color={color} />,
        }}
      />

      <Tab.Screen
        name="SeniorSOS"
        component={EmergencyScreen}
        options={{
          tabBarLabel: 'SOS',
          tabBarIcon: ({ color, size }) => <Ionicons name="alert-circle" size={30} color="#DC2626" />,
          tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold', color: '#DC2626' },
        }}
      />

      <Tab.Screen
        name="SeniorContacts"
        component={FamilyContactsScreen}
        options={{
          tabBarLabel: 'Family',
          tabBarIcon: ({ color, size }) => <Ionicons name="people" size={28} color={color} />,
        }}
      />

      <Tab.Screen
        name="SeniorSettings"
        component={SeniorSettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => <Ionicons name="settings" size={28} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};
