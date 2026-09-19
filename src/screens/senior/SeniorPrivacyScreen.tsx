import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme/theme';

export const SeniorPrivacyScreen: React.FC<{ navigation?: any }> = () => {
  const [shareMedicationStatus, setShareMedicationStatus] = useState<boolean>(true);
  const [shareDailyWellbeing, setShareDailyWellbeing] = useState<boolean>(true);
  const [shareEmergencyEvents, setShareEmergencyEvents] = useState<boolean>(true);
  const [shareVisitInfo, setShareVisitInfo] = useState<boolean>(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Banner */}
      <View style={styles.headerCard}>
        <View style={styles.iconCircle}>
          <Ionicons name="shield-checkmark" size={36} color="#0F766E" />
        </View>
        <Text style={styles.headerTitle}>Privacy & Sharing</Text>
        <Text style={styles.headerSubtitle}>
          SilverLink is built to support your independence—never for surveillance. You control what information is shared with your caregivers.
        </Text>
      </View>

      {/* Sharing Toggles */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeading}>Caregiver Sharing Preferences</Text>

        {/* Medication Status */}
        <View style={styles.toggleRow}>
          <View style={styles.toggleTextCol}>
            <View style={styles.titleRow}>
              <Ionicons name="medical" size={24} color="#0F766E" style={styles.itemIcon} />
              <Text style={styles.toggleTitle}>Medication Status</Text>
            </View>
            <Text style={styles.toggleDesc}>
              Let your caregiver see if your daily medicines have been taken or missed.
            </Text>
          </View>
          <Switch
            value={shareMedicationStatus}
            onValueChange={setShareMedicationStatus}
            trackColor={{ false: '#CBD5E1', true: '#99F6E4' }}
            thumbColor={shareMedicationStatus ? '#0F766E' : '#94A3B8'}
            style={styles.switchStyle}
          />
        </View>

        {/* Daily Wellbeing */}
        <View style={styles.toggleRow}>
          <View style={styles.toggleTextCol}>
            <View style={styles.titleRow}>
              <Ionicons name="happy" size={24} color="#0F766E" style={styles.itemIcon} />
              <Text style={styles.toggleTitle}>Daily Wellbeing</Text>
            </View>
            <Text style={styles.toggleDesc}>
              Share your daily mood check-ins (e.g. Good, Okay, Not Well) with your family.
            </Text>
          </View>
          <Switch
            value={shareDailyWellbeing}
            onValueChange={setShareDailyWellbeing}
            trackColor={{ false: '#CBD5E1', true: '#99F6E4' }}
            thumbColor={shareDailyWellbeing ? '#0F766E' : '#94A3B8'}
            style={styles.switchStyle}
          />
        </View>

        {/* Emergency SOS Events */}
        <View style={styles.toggleRow}>
          <View style={styles.toggleTextCol}>
            <View style={styles.titleRow}>
              <Ionicons name="alert-circle" size={24} color="#DC2626" style={styles.itemIcon} />
              <Text style={styles.toggleTitle}>Emergency SOS Alerts</Text>
            </View>
            <Text style={styles.toggleDesc}>
              Instantly notify your primary contacts whenever you trigger an Emergency SOS.
            </Text>
          </View>
          <Switch
            value={shareEmergencyEvents}
            onValueChange={setShareEmergencyEvents}
            trackColor={{ false: '#CBD5E1', true: '#FECACA' }}
            thumbColor={shareEmergencyEvents ? '#DC2626' : '#94A3B8'}
            style={styles.switchStyle}
          />
        </View>

        {/* Visit Information */}
        <View style={styles.toggleRowLast}>
          <View style={styles.toggleTextCol}>
            <View style={styles.titleRow}>
              <Ionicons name="calendar" size={24} color="#0F766E" style={styles.itemIcon} />
              <Text style={styles.toggleTitle}>Visit Information</Text>
            </View>
            <Text style={styles.toggleDesc}>
              Allow caregivers to view scheduled appointments or helper visits.
            </Text>
          </View>
          <Switch
            value={shareVisitInfo}
            onValueChange={setShareVisitInfo}
            trackColor={{ false: '#CBD5E1', true: '#99F6E4' }}
            thumbColor={shareVisitInfo ? '#0F766E' : '#94A3B8'}
            style={styles.switchStyle}
          />
        </View>
      </View>

      {/* Data Protection Statement */}
      <View style={styles.infoCard}>
        <Ionicons name="lock-closed" size={28} color="#0F766E" style={{ marginBottom: 8 }} />
        <Text style={styles.infoTitle}>Your Data is Encrypted & Safe</Text>
        <Text style={styles.infoBody}>
          You can update these preferences anytime. Your settings take effect immediately.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderLeftWidth: 6,
    borderLeftColor: '#0F766E',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#334155',
    textAlign: 'center',
    lineHeight: 24,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  toggleRowLast: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  toggleTextCol: {
    flex: 1,
    marginRight: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemIcon: {
    marginRight: 8,
  },
  toggleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  toggleDesc: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  switchStyle: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
  infoCard: {
    backgroundColor: '#CCFBF1',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#99F6E4',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F766E',
    marginBottom: 4,
  },
  infoBody: {
    fontSize: 14,
    color: '#115E59',
    textAlign: 'center',
    lineHeight: 20,
  },
});
