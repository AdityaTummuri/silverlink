import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { theme } from '../../theme/theme';

export const CaregiverSettingsScreen: React.FC = () => {
  const { switchRole, currentUser } = useApp();

  const [pushNotifs, setPushNotifs] = useState(true);
  const [sosCallout, setSosCallout] = useState(true);
  const [missedDoseTimeout, setMissedDoseTimeout] = useState('30 mins');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Caregiver Settings</Text>
      <Text style={styles.sub}>Alert configurations & account controls</Text>

      {/* Account Info */}
      <View style={styles.card}>
        <Text style={styles.sectionHeading}>Caregiver Profile</Text>
        <Text style={styles.profileName}>{currentUser.name}</Text>
        <Text style={styles.profileRole}>Primary Caregiver (Daughter)</Text>
        <Text style={styles.profileEmail}>{currentUser.email}</Text>
      </View>

      {/* Notification Rules */}
      <View style={styles.card}>
        <Text style={styles.sectionHeading}>Alert & Notification Rules</Text>

        <View style={styles.row}>
          <View style={styles.rowTextCol}>
            <Text style={styles.rowLabel}>Emergency SOS Push Alerts</Text>
            <Text style={styles.rowSub}>Instant high-priority notification when SOS is pressed</Text>
          </View>
          <Switch
            value={sosCallout}
            onValueChange={setSosCallout}
            trackColor={{ false: '#CBD5E1', true: '#BFDBFE' }}
            thumbColor={sosCallout ? '#2563EB' : '#94A3B8'}
          />
        </View>

        <View style={styles.row}>
          <View style={styles.rowTextCol}>
            <Text style={styles.rowLabel}>Missed Medication Warning</Text>
            <Text style={styles.rowSub}>Alert if dose remains unconfirmed after scheduled time</Text>
          </View>
          <Switch
            value={pushNotifs}
            onValueChange={setPushNotifs}
            trackColor={{ false: '#CBD5E1', true: '#BFDBFE' }}
            thumbColor={pushNotifs ? '#2563EB' : '#94A3B8'}
          />
        </View>

        <View style={[styles.row, { borderBottomWidth: 0 }]}>
          <View style={styles.rowTextCol}>
            <Text style={styles.rowLabel}>Missed Dose Timeout Threshold</Text>
            <Text style={styles.rowSub}>Time before marking pending dose as missed</Text>
          </View>
          <View style={styles.timeoutChip}>
            <Text style={styles.timeoutText}>{missedDoseTimeout}</Text>
          </View>
        </View>
      </View>

      {/* Switch to Senior Mode */}
      <View style={styles.card}>
        <Text style={styles.sectionHeading}>Hackathon Demo Controls</Text>
        <Text style={styles.rowSub}>
          Switch to the Senior Accessibility App interface to test Senior buttons, voice assistant, check-in, and SOS.
        </Text>
        <TouchableOpacity style={styles.switchBtn} onPress={() => switchRole('senior')}>
          <Ionicons name="swap-horizontal" size={20} color="#FFFFFF" />
          <Text style={styles.switchBtnText}>Switch to Senior Interface 👵</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  sub: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.medium,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  profileRole: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '600',
    marginTop: 2,
  },
  profileEmail: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  rowTextCol: {
    flex: 1,
    marginRight: 10,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
  rowSub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  timeoutChip: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  timeoutText: {
    color: '#2563EB',
    fontWeight: 'bold',
    fontSize: 13,
  },
  switchBtn: {
    backgroundColor: '#0F766E',
    height: 52,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 14,
  },
  switchBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
