import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { SeniorButton } from '../../components/common/SeniorButton';
import { SpeechService } from '../../services/speechService';
import { theme } from '../../theme/theme';

export const EmergencyScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { triggerSos, seniorStatus, contacts } = useApp();

  const primaryCaregiver = contacts.find(c => c.isPrimary) || contacts[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#0F766E" />
        <Text style={styles.backBtnText}>Back to Home</Text>
      </TouchableOpacity>

      {/* Prominent SOS Activation */}
      <View style={styles.emergencyCard}>
        <View style={styles.warningHeader}>
          <Ionicons name="warning-sharp" size={48} color="#DC2626" />
          <Text style={styles.emergencyTitle}>Emergency Help Center</Text>
          <Text style={styles.emergencySub}>
            If you need immediate assistance or are feeling unwell, press the SOS button below.
          </Text>
        </View>

        <SeniorButton
          title="TRIGGER EMERGENCY SOS"
          subtitle="Sends instant alert with your live location to Sarah"
          variant="sos"
          icon="alert-circle"
          onPress={() => triggerSos()}
          style={styles.bigSosBtn}
        />
      </View>

      {/* Live Location & Safety Status */}
      <View style={styles.statusCard}>
        <View style={styles.statusHeaderRow}>
          <Ionicons name="location-sharp" size={28} color="#0F766E" />
          <Text style={styles.statusCardTitle}>Location & Safety Status</Text>
        </View>

        <View style={styles.statusDetailRow}>
          <Text style={styles.statusLabel}>Current Location:</Text>
          <Text style={styles.statusValue}>{seniorStatus.locationName}</Text>
        </View>

        <View style={styles.statusDetailRow}>
          <Text style={styles.statusLabel}>Safe Zone Status:</Text>
          <View style={styles.safeTag}>
            <Ionicons name="shield-checkmark" size={18} color="#065F46" />
            <Text style={styles.safeTagText}>Safe at Home</Text>
          </View>
        </View>

        <View style={styles.statusDetailRow}>
          <Text style={styles.statusLabel}>Device Battery:</Text>
          <Text style={styles.statusValue}>⚡ {seniorStatus.batteryLevel}% (Healthy)</Text>
        </View>
      </View>

      {/* Quick Direct Dial Buttons */}
      <View style={styles.dialerCard}>
        <Text style={styles.dialerTitle}>Direct Emergency Callers</Text>

        {primaryCaregiver && (
          <TouchableOpacity
            style={styles.dialBtnCaregiver}
            onPress={() => {
              SpeechService.speakText(`Calling caregiver ${primaryCaregiver.name}`);
              alert(`Calling Caregiver ${primaryCaregiver.name} (${primaryCaregiver.phone})...`);
            }}
          >
            <Ionicons name="call" size={32} color="#FFFFFF" />
            <View style={styles.dialBtnTextCol}>
              <Text style={styles.dialBtnTitle}>Call {primaryCaregiver.name}</Text>
              <Text style={styles.dialBtnSub}>{primaryCaregiver.relationship} • {primaryCaregiver.phone}</Text>
            </View>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.dialBtn911}
          onPress={() => {
            SpeechService.speakText("Dialing 911 Emergency Services");
            alert("Simulated Emergency Call: Dialing 911...");
          }}
        >
          <Ionicons name="shield" size={32} color="#FFFFFF" />
          <View style={styles.dialBtnTextCol}>
            <Text style={styles.dialBtnTitle}>Call 911 Emergency</Text>
            <Text style={styles.dialBtnSub}>Local Police & Medical Dispatch</Text>
          </View>
        </TouchableOpacity>
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
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  backBtnText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F766E',
  },
  emergencyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.large,
    padding: 22,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FECACA',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  warningHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  emergencyTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#DC2626',
    marginTop: 8,
  },
  emergencySub: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 22,
  },
  bigSosBtn: {
    width: '100%',
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.medium,
    padding: 20,
    marginBottom: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  statusHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  statusCardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  statusDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  statusLabel: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '600',
  },
  statusValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  safeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 6,
  },
  safeTagText: {
    color: '#065F46',
    fontWeight: 'bold',
    fontSize: 15,
  },
  dialerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.medium,
    padding: 20,
    gap: 14,
  },
  dialerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  dialBtnCaregiver: {
    backgroundColor: '#2563EB',
    borderRadius: theme.borderRadius.medium,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  dialBtn911: {
    backgroundColor: '#DC2626',
    borderRadius: theme.borderRadius.medium,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  dialBtnTextCol: {
    flex: 1,
  },
  dialBtnTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  dialBtnSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
    fontWeight: '500',
  },
});
