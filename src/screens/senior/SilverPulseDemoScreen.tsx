import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { silverPulseService, SilverPulseState } from '../../features/silverpulse/silverPulseService';
import { seniorEventService } from '../../services/senior/eventService';
import { SeniorEvent } from '../../types/events';

export const SilverPulseDemoScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [pulseState, setPulseState] = useState<SilverPulseState>(silverPulseService.getCurrentState());
  const [eventsLog, setEventsLog] = useState<SeniorEvent[]>(seniorEventService.getEvents());

  useEffect(() => {
    const unsubService = silverPulseService.subscribe((state) => {
      setPulseState(state);
      setEventsLog([...seniorEventService.getEvents()]);
    });
    const unsubEvent = seniorEventService.subscribe(() => {
      setEventsLog([...seniorEventService.getEvents()]);
    });
    return () => {
      unsubService();
      unsubEvent();
    };
  }, []);

  const handleSimulateNormal = () => {
    silverPulseService.resetToNormal();
  };

  const handleSimulateMissingCheckIn = () => {
    silverPulseService.triggerDeviation(
      'checkin',
      'MODERATE',
      "Morning check-in is outside the senior's usual activity window (expected by 9:30 AM)."
    );
  };

  const handleSimulateMissedMedicine = () => {
    silverPulseService.triggerDeviation(
      'medication',
      'LOW',
      "Scheduled Morning Medicine (Lisinopril) grace period has passed without confirmation."
    );
  };

  const handleSimulateMultipleDeviations = () => {
    silverPulseService.triggerDeviation(
      'multiple',
      'HIGH',
      "Morning check-in and scheduled medication are both missing outside the senior's usual activity window."
    );
  };

  const handleImOkay = () => {
    silverPulseService.resolveSeniorIsOkay();
  };

  const handleNeedHelp = () => {
    silverPulseService.resolveSeniorNeedsHelp();
    navigation.navigate('Emergency');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#0F766E" />
        <Text style={styles.backBtnText}>Back to Home</Text>
      </TouchableOpacity>

      {/* DEV / DEMO BANNER */}
      <View style={styles.devBanner}>
        <Ionicons name="construct" size={28} color="#D97706" />
        <View style={styles.devBannerCol}>
          <Text style={styles.devTitle}>🛠️ DEV / DEMO MODE ONLY</Text>
          <Text style={styles.devSub}>
            SilverPulse Intelligence Test Bench for Hackathon Evaluators
          </Text>
        </View>
      </View>

      {/* Current Live State Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Live SilverPulse Engine State</Text>

        <View style={styles.stateRow}>
          <Text style={styles.stateLabel}>Status:</Text>
          <View
            style={[
              styles.statusChip,
              pulseState.routineStatus === 'NORMAL' ? styles.chipNormal : styles.chipDeviation,
            ]}
          >
            <Text
              style={[
                styles.statusChipText,
                pulseState.routineStatus === 'NORMAL' ? styles.textNormal : styles.textDeviation,
              ]}
            >
              {pulseState.routineStatus === 'NORMAL' ? '🟢 NORMAL ROUTINE' : '🟡 ROUTINE DEVIATION'}
            </Text>
          </View>
        </View>

        <View style={styles.stateRow}>
          <Text style={styles.stateLabel}>Severity Level:</Text>
          <Text style={styles.stateValue}>{pulseState.severity}</Text>
        </View>

        <View style={styles.stateRow}>
          <Text style={styles.stateLabel}>Wellbeing Check Active:</Text>
          <Text style={styles.stateValue}>{pulseState.wellbeingCheckActive ? 'YES (Pending Prompt)' : 'NO'}</Text>
        </View>

        {pulseState.reason ? (
          <View style={styles.reasonBox}>
            <Text style={styles.reasonLabel}>Reasoning / Explanation:</Text>
            <Text style={styles.reasonText}>{pulseState.reason}</Text>
          </View>
        ) : null}
      </View>

      {/* Simulation Controls */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Test Scenario Simulator</Text>
        <Text style={styles.cardSub}>Trigger scenarios instantly without waiting hours:</Text>

        <View style={styles.btnGrid}>
          <TouchableOpacity style={[styles.simBtn, { backgroundColor: '#10B981' }]} onPress={handleSimulateNormal}>
            <Text style={styles.simBtnText}>1. Normal Routine</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.simBtn, { backgroundColor: '#F59E0B' }]} onPress={handleSimulateMissingCheckIn}>
            <Text style={styles.simBtnText}>2. Missing Check-In</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.simBtn, { backgroundColor: '#0284C7' }]} onPress={handleSimulateMissedMedicine}>
            <Text style={styles.simBtnText}>3. Missed Medicine</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.simBtn, { backgroundColor: '#DC2626' }]} onPress={handleSimulateMultipleDeviations}>
            <Text style={styles.simBtnText}>4. Multiple Deviations (HIGH)</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Wellbeing Response Simulator */}
      {pulseState.wellbeingCheckActive && (
        <View style={styles.wellbeingSimCard}>
          <Text style={styles.wellbeingTitle}>Wellbeing Prompt Simulation</Text>
          <Text style={styles.wellbeingPrompt}>"{pulseState.promptMessage}"</Text>

          <View style={styles.wbBtnRow}>
            <TouchableOpacity style={styles.imOkayBtn} onPress={handleImOkay}>
              <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
              <Text style={styles.wbBtnText}>"I'm okay" (Resolve)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.needHelpBtn} onPress={handleNeedHelp}>
              <Ionicons name="alert-circle" size={24} color="#FFFFFF" />
              <Text style={styles.wbBtnText}>"I need help" (SOS Flow)</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* SilverPulse Event Output History Log */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Generated Senior Events Log ({eventsLog.length})</Text>

        {eventsLog.length === 0 ? (
          <Text style={styles.emptyText}>No events generated yet.</Text>
        ) : (
          eventsLog.slice(0, 6).map((evt) => (
            <View key={evt.id} style={styles.eventLogItem}>
              <View style={styles.eventLogHeader}>
                <Text style={styles.eventTypeTag}>{evt.eventType}</Text>
                <Text style={styles.eventTimeTag}>
                  {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </Text>
              </View>
              <Text style={styles.eventDetails}>
                {JSON.stringify((evt as any).payload || {})}
              </Text>
            </View>
          ))
        )}
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
    marginBottom: 12,
  },
  backBtnText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F766E',
  },
  devBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#F59E0B',
    gap: 12,
  },
  devBannerCol: {
    flex: 1,
  },
  devTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#92400E',
  },
  devSub: {
    fontSize: 14,
    color: '#78350F',
    marginTop: 2,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 12,
  },
  cardSub: {
    fontSize: 15,
    color: '#475569',
    marginBottom: 14,
  },
  stateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  stateLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  stateValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  statusChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  chipNormal: {
    backgroundColor: '#D1FAE5',
  },
  chipDeviation: {
    backgroundColor: '#FEF3C7',
  },
  statusChipText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  textNormal: {
    color: '#065F46',
  },
  textDeviation: {
    color: '#92400E',
  },
  reasonBox: {
    backgroundColor: '#FFFBEB',
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  reasonLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 4,
  },
  reasonText: {
    fontSize: 15,
    color: '#78350F',
    lineHeight: 20,
  },
  btnGrid: {
    gap: 10,
  },
  simBtn: {
    height: 54,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  simBtnText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
  wellbeingSimCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  wellbeingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#92400E',
  },
  wellbeingPrompt: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#78350F',
    marginVertical: 10,
  },
  wbBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  imOkayBtn: {
    flex: 1,
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  needHelpBtn: {
    flex: 1,
    backgroundColor: '#DC2626',
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  wbBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  emptyText: {
    fontSize: 15,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  eventLogItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  eventLogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  eventTypeTag: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F766E',
  },
  eventTimeTag: {
    fontSize: 12,
    color: '#64748B',
  },
  eventDetails: {
    fontSize: 13,
    color: '#334155',
  },
});
