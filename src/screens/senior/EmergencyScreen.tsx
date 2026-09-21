import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { SpeechService } from '../../services/speechService';
import { emergencyService, EmergencyStatus } from '../../features/emergency/emergencyEvents';
import { theme } from '../../theme/theme';

export const EmergencyScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { seniorStatus, contacts, currentUser } = useApp();
  const [emergencyStatus, setEmergencyStatus] = useState<EmergencyStatus>(emergencyService.getStatus());

  const primaryCaregiver = contacts.find((c) => c.isPrimary) || contacts[0];

  useEffect(() => {
    const unsubscribe = emergencyService.subscribe((status) => {
      setEmergencyStatus(status);
    });
    return () => unsubscribe();
  }, []);

  const handleConfirmYesHelp = () => {
    emergencyService.createEmergencyEvent(
      currentUser.uid,
      'Senior confirmed Emergency SOS on confirmation screen.',
      'manual_button'
    );
    SpeechService.speakText(
      'Help request sent! Your care team has been notified. Please stay calm.'
    );
  };

  const handleCancelSafe = () => {
    emergencyService.resetToIdle();
    SpeechService.speakText("Emergency request cancelled. Returning to Home.");
    navigation.navigate('SeniorHome');
  };

  const handleResolveMarkSafe = () => {
    emergencyService.resolveEmergencyEvent(emergencyStatus.sosId);
    SpeechService.speakText("Emergency marked resolved. Glad you are safe!");
    setTimeout(() => {
      navigation.navigate('SeniorHome');
    }, 1500);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backBtn} onPress={handleCancelSafe}>
        <Ionicons name="arrow-back" size={28} color="#0F766E" />
        <Text style={styles.backBtnText}>Back to Home</Text>
      </TouchableOpacity>

      {/* State 1: ACTIVE EMERGENCY */}
      {emergencyStatus.state === 'ACTIVE' ? (
        <View style={styles.activeSosCard}>
          <View style={styles.activeHeaderRow}>
            <Ionicons name="alert-circle" size={56} color="#DC2626" />
            <View style={styles.activeHeaderCol}>
              <Text style={styles.activeTitle}>Help Request Active</Text>
              <Text style={styles.activeSubTitle}>Help request sent ✓</Text>
            </View>
          </View>

          <View style={styles.activeAlertBox}>
            <Text style={styles.activeAlertMain}>🚨 Your care team has been notified.</Text>
            <Text style={styles.activeAlertSub}>
              Please stay calm. Live status updated at{' '}
              {emergencyStatus.activeSince
                ? new Date(emergencyStatus.activeSince).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Just now'}
              .
            </Text>
          </View>

          {/* Quick Direct Phone Call Shortcuts */}
          <View style={styles.callShortcutGroup}>
            {primaryCaregiver && (
              <TouchableOpacity
                style={styles.caregiverCallBtn}
                onPress={() => {
                  SpeechService.speakText(`Calling ${primaryCaregiver.name}`);
                  alert(`Calling ${primaryCaregiver.name} (${primaryCaregiver.phone})...`);
                }}
              >
                <Ionicons name="call" size={28} color="#FFFFFF" />
                <Text style={styles.caregiverCallText}>Call {primaryCaregiver.name}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.direct911Btn}
              onPress={() => {
                SpeechService.speakText('Dialing 911 Emergency');
                alert('Simulated Call: Dialing 911 Emergency Services...');
              }}
            >
              <Ionicons name="shield-sharp" size={28} color="#FFFFFF" />
              <Text style={styles.direct911Text}>Call 911 Emergency</Text>
            </TouchableOpacity>
          </View>

          {/* Mark Safe / Cancel Action */}
          <TouchableOpacity style={styles.markSafeBtn} onPress={handleResolveMarkSafe} activeOpacity={0.85}>
            <Ionicons name="checkmark-circle" size={30} color="#FFFFFF" />
            <Text style={styles.markSafeText}>I AM SAFE (CANCEL SOS)</Text>
          </TouchableOpacity>
        </View>
      ) : emergencyStatus.state === 'RESOLVED' ? (
        /* State 2: RESOLVED */
        <View style={styles.resolvedCard}>
          <Ionicons name="checkmark-circle-sharp" size={72} color="#10B981" />
          <Text style={styles.resolvedTitle}>Emergency Resolved</Text>
          <Text style={styles.resolvedSub}>
            Your status is now marked safe. Returning to home...
          </Text>
        </View>
      ) : (
        /* State 3: CONFIRMATION SCREEN (Default Entry from Senior Home SOS) */
        <View style={styles.confirmCard}>
          <View style={styles.warningHeader}>
            <Ionicons name="warning-sharp" size={54} color="#DC2626" />
            <Text style={styles.confirmQuestion}>Do you need help?</Text>
            <Text style={styles.confirmSub}>
              Pressing Send Help will notify your emergency contacts immediately.
            </Text>
          </View>

          <View style={styles.confirmBtnGroup}>
            {/* 🚨 YES, SEND HELP */}
            <TouchableOpacity
              style={styles.yesHelpBtn}
              onPress={handleConfirmYesHelp}
              activeOpacity={0.85}
              accessibilityLabel="Yes, send help"
            >
              <Ionicons name="alert-circle" size={36} color="#FFFFFF" />
              <View style={styles.btnTextCol}>
                <Text style={styles.yesHelpText}>🚨 YES, SEND HELP</Text>
                <Text style={styles.yesHelpSubText}>Notify emergency contacts now</Text>
              </View>
            </TouchableOpacity>

            {/* 🛡️ NO, I'M SAFE */}
            <TouchableOpacity
              style={styles.noSafeBtn}
              onPress={handleCancelSafe}
              activeOpacity={0.85}
              accessibilityLabel="No, I am safe"
            >
              <Ionicons name="shield-checkmark" size={30} color="#FFFFFF" />
              <Text style={styles.noSafeText}>NO, I'M SAFE</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Safety & Location Details Footer */}
      <View style={styles.statusCard}>
        <View style={styles.statusHeaderRow}>
          <Ionicons name="location-sharp" size={24} color="#0F766E" />
          <Text style={styles.statusCardTitle}>Location & Safety Status</Text>
        </View>
        <View style={styles.statusDetailRow}>
          <Text style={styles.statusLabel}>Current Location:</Text>
          <Text style={styles.statusValue}>{seniorStatus.locationName}</Text>
        </View>
        <View style={styles.statusDetailRow}>
          <Text style={styles.statusLabel}>Battery Level:</Text>
          <Text style={styles.statusValue}>⚡ {seniorStatus.batteryLevel}%</Text>
        </View>
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
  confirmCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.large,
    padding: 24,
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#FECACA',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  warningHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  confirmQuestion: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#DC2626',
    marginTop: 10,
    textAlign: 'center',
  },
  confirmSub: {
    fontSize: 18,
    color: '#475569',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 26,
  },
  confirmBtnGroup: {
    gap: 16,
  },
  yesHelpBtn: {
    minHeight: 74,
    backgroundColor: '#DC2626',
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 14,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  btnTextCol: {
    flex: 1,
  },
  yesHelpText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  yesHelpSubText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
    fontWeight: '500',
  },
  noSafeBtn: {
    minHeight: 64,
    backgroundColor: '#334155',
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  noSafeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  activeSosCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: theme.borderRadius.large,
    padding: 24,
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#DC2626',
  },
  activeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 14,
  },
  activeHeaderCol: {
    flex: 1,
  },
  activeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  activeSubTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#991B1B',
    marginTop: 2,
  },
  activeAlertBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 6,
    borderLeftColor: '#DC2626',
  },
  activeAlertMain: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7F1D1D',
  },
  activeAlertSub: {
    fontSize: 16,
    color: '#451A03',
    marginTop: 6,
    lineHeight: 22,
  },
  callShortcutGroup: {
    gap: 12,
    marginBottom: 20,
  },
  caregiverCallBtn: {
    height: 58,
    backgroundColor: '#2563EB',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  caregiverCallText: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: 'bold',
  },
  direct911Btn: {
    height: 58,
    backgroundColor: '#DC2626',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  direct911Text: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: 'bold',
  },
  markSafeBtn: {
    height: 64,
    backgroundColor: '#10B981',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  markSafeText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  resolvedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    marginBottom: 16,
  },
  resolvedTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F766E',
    marginTop: 16,
  },
  resolvedSub: {
    fontSize: 17,
    color: '#475569',
    marginTop: 8,
    textAlign: 'center',
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.medium,
    padding: 18,
    gap: 10,
  },
  statusHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  statusCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  statusDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  statusLabel: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '600',
  },
  statusValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
});
