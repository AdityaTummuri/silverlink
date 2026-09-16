import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { CaregiverHomeScreen } from '../screens/caregiver/CaregiverHomeScreen';
import { CaregiverMedsScreen } from '../screens/caregiver/CaregiverMedsScreen';
import { CaregiverCheckInsScreen } from '../screens/caregiver/CaregiverCheckInsScreen';
import { CaregiverAlertsScreen } from '../screens/caregiver/CaregiverAlertsScreen';
import { CaregiverSettingsScreen } from '../screens/caregiver/CaregiverSettingsScreen';
import { useApp } from '../context/AppContext';

const Tab = createBottomTabNavigator();

export const CaregiverTabNavigator: React.FC = () => {
  const { alerts } = useApp();
  const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 64,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
          paddingBottom: 6,
          paddingTop: 6,
        },
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#64748B',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="CaregiverHome"
        component={CaregiverHomeScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Ionicons name="grid" size={24} color={color} />,
        }}
      />

      <Tab.Screen
        name="CaregiverMeds"
        component={CaregiverMedsScreen}
        options={{
          tabBarLabel: 'Meds',
          tabBarIcon: ({ color, size }) => <Ionicons name="medical" size={24} color={color} />,
        }}
      />

      <Tab.Screen
        name="CaregiverCheckIns"
        component={CaregiverCheckInsScreen}
        options={{
          tabBarLabel: 'Logs',
          tabBarIcon: ({ color, size }) => <Ionicons name="heart" size={24} color={color} />,
        }}
      />

      <Tab.Screen
        name="CaregiverAlerts"
        component={CaregiverAlertsScreen}
        options={{
          tabBarLabel: 'Alerts',
          tabBarBadge: unacknowledgedCount > 0 ? unacknowledgedCount : undefined,
          tabBarBadgeStyle: { backgroundColor: '#DC2626', color: '#FFFFFF', fontSize: 11 },
          tabBarIcon: ({ color, size }) => <Ionicons name="notifications" size={24} color={color} />,
        }}
      />

      <Tab.Screen
        name="CaregiverSettings"
        component={CaregiverSettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => <Ionicons name="settings" size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};
