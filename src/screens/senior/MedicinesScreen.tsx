import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { SpeechService } from '../../services/speechService';
import { Medication, TimeOfDay, MedicineStatus } from '../../types';
import {
  emitMedicineTaken,
  emitMedicineSkipped,
  emitMedicineMissed,
} from '../../features/medication/medicationEvents';
import { theme } from '../../theme/theme';

export const MedicinesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const {
    currentUser,
    medications,
    markMedicationTaken,
    markMedicationSkipped,
    markMedicationMissed,
    markMedicationStatus,
    triggerReminderModal,
  } = useApp();

  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const timesOfDay: TimeOfDay[] = ['Morning', 'Afternoon', 'Evening', 'Night'];

  const showConfirmation = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 3500);
  };

  const getStatusBadge = (status: MedicineStatus) => {
    switch (status) {
      case 'taken':
        return (
          <View style={[styles.statusBadge, { backgroundColor: '#D1FAE5', borderColor: '#10B981' }]}>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            <Text style={[styles.statusBadgeText, { color: '#065F46' }]}>🟢 Taken</Text>
          </View>
        );
      case 'due':
        return (
          <View style={[styles.statusBadge, { backgroundColor: '#E0F2FE', borderColor: '#0284C7' }]}>
            <Ionicons name="alert-circle" size={20} color="#0284C7" />
            <Text style={[styles.statusBadgeText, { color: '#0369A1' }]}>🔵 Due Now</Text>
          </View>
        );
      case 'missed':
        return (
          <View style={[styles.statusBadge, { backgroundColor: '#FEE2E2', borderColor: '#DC2626' }]}>
            <Ionicons name="close-circle" size={20} color="#DC2626" />
            <Text style={[styles.statusBadgeText, { color: '#991B1B' }]}>🔴 Missed</Text>
          </View>
        );
      case 'skipped':
        return (
          <View style={[styles.statusBadge, { backgroundColor: '#E2E8F0', borderColor: '#64748B' }]}>
            <Ionicons name="pause-circle" size={20} color="#64748B" />
            <Text style={[styles.statusBadgeText, { color: '#334155' }]}>⚪ Skipped</Text>
          </View>
        );
      case 'upcoming':
      case 'pending':
      default:
        return (
          <View style={[styles.statusBadge, { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' }]}>
            <Ionicons name="time" size={20} color="#D97706" />
            <Text style={[styles.statusBadgeText, { color: '#92400E' }]}>🟡 Upcoming</Text>
          </View>
        );
    }
  };

  const handleTakeMedicine = (med: Medication) => {
    markMedicationTaken(med.id);
    emitMedicineTaken(currentUser.uid, med.id, med.name, med.dosage, med.scheduledTime);
    SpeechService.speakText(`Great job! Marked ${med.name} as taken.`);
    showConfirmation(`Medicine recorded ✓ (${med.name} taken)`);
  };

  const handleSkipMedicine = (med: Medication) => {
    markMedicationSkipped(med.id, 'Senior chose to skip');
    emitMedicineSkipped(currentUser.uid, med.id, med.name, med.dosage, med.scheduledTime, 'Skipped by senior');
    SpeechService.speakText(`Marked ${med.name} as skipped.`);
    showConfirmation(`Recorded ✓ (${med.name} skipped)`);
  };

  const handleMarkMissed = (med: Medication) => {
    markMedicationMissed(med.id);
    emitMedicineMissed(currentUser.uid, med.id, med.name, med.dosage, med.scheduledTime);
    SpeechService.speakText(`Marked ${med.name} as missed.`);
    showConfirmation(`Status updated: ${med.name} marked as missed.`);
  };

  // Demo simulator helper for hackathon judges
  const handleSimulateStateFlow = async (flowType: 'upcoming_due_taken' | 'due_missed' | 'reminder') => {
    if (flowType === 'upcoming_due_taken') {
      const target = medications.find((m) => m.status === 'upcoming') || medications[0];
      await markMedicationStatus(target.id, 'due');
      SpeechService.speakText(`${target.name} is now DUE NOW.`);
      showConfirmation(`Simulated Flow: ${target.name} set to DUE NOW.`);
    } else if (flowType === 'due_missed') {
      const target = medications.find((m) => m.status === 'due') || medications[1] || medications[0];
      await markMedicationStatus(target.id, 'missed');
      emitMedicineMissed(currentUser.uid, target.id, target.name, target.dosage, target.scheduledTime);
      SpeechService.speakText(`${target.name} scheduled time passed. Marked as MISSED.`);
      showConfirmation(`Simulated Flow: ${target.name} set to MISSED.`);
    } else if (flowType === 'reminder') {
      const target = medications[0];
      triggerReminderModal(target);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Row */}
      <View style={styles.headerTitleRow}>
        <View style={styles.headerLeftCol}>
          <Text style={styles.headerTitle}>Today's Medicines</Text>
          <Text style={styles.headerSubtitle}>Simple daily schedule & medication logs</Text>
        </View>
        <TouchableOpacity
          style={styles.speechBtn}
          onPress={() => SpeechService.speakText("Here are your daily scheduled medicines.")}
          accessibilityLabel="Read medicines aloud"
        >
          <Ionicons name="volume-high" size={28} color="#0F766E" />
        </TouchableOpacity>
      </View>

      {/* Immediate Action Confirmation Toast/Banner */}
      {feedbackMessage && (
        <View style={styles.confirmationBanner}>
          <Ionicons name="checkmark-circle-sharp" size={28} color="#065F46" />
          <Text style={styles.confirmationText}>{feedbackMessage}</Text>
        </View>
      )}

      {/* Demo State Flow Simulator Card (For Hackathon Review) */}
      <View style={styles.demoSimCard}>
        <View style={styles.demoHeaderRow}>
          <Ionicons name="play-circle" size={22} color="#92400E" />
          <Text style={styles.demoTitle}>Demo Flow Simulator</Text>
        </View>
        <View style={styles.demoBtnGroup}>
          <TouchableOpacity
            style={styles.demoBtn}
            onPress={() => handleSimulateStateFlow('upcoming_due_taken')}
          >
            <Text style={styles.demoBtnText}>Upcoming ➔ Due</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.demoBtn}
            onPress={() => handleSimulateStateFlow('due_missed')}
          >
            <Text style={styles.demoBtnText}>Due ➔ Missed</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.demoBtn, { backgroundColor: '#0F766E' }]}
            onPress={() => handleSimulateStateFlow('reminder')}
          >
            <Text style={[styles.demoBtnText, { color: '#FFFFFF' }]}>Test Reminder</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Medication List grouped by TimeOfDay */}
      {timesOfDay.map((timeGroup) => {
        const medsInGroup = medications.filter((m) => m.timeOfDay === timeGroup);
        if (medsInGroup.length === 0) return null;

        return (
          <View key={timeGroup} style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Ionicons
                name={
                  timeGroup === 'Morning'
                    ? 'sunny'
                    : timeGroup === 'Afternoon'
                    ? 'partly-sunny'
                    : timeGroup === 'Evening'
                    ? 'moon'
                    : 'bed'
                }
                size={28}
                color="#0F766E"
              />
              <Text style={styles.sectionHeaderTitle}>{timeGroup} Schedule</Text>
            </View>

            {medsInGroup.map((med) => (
              <View
                key={med.id}
                style={[
                  styles.medCard,
                  med.status === 'taken' && styles.medCardTaken,
                  med.status === 'due' && styles.medCardDue,
                  med.status === 'missed' && styles.medCardMissed,
                  med.status === 'skipped' && styles.medCardSkipped,
                ]}
              >
                {/* Main Card Information */}
                <TouchableOpacity
                  onPress={() => navigation.navigate('MedicineDetails', { medicineId: med.id })}
                  activeOpacity={0.8}
                >
                  <View style={styles.medMainRow}>
                    <View
                      style={[styles.pillIconCircle, { backgroundColor: med.pillColor || '#0F766E' }]}
                    >
                      <Ionicons name="medical" size={30} color="#FFFFFF" />
                    </View>

                    <View style={styles.medDetailsCol}>
                      <View style={styles.nameBadgeRow}>
                        <Text style={styles.medName}>{med.name}</Text>
                      </View>
                      <Text style={styles.medDosage}>{med.dosage}</Text>
                      <Text style={styles.medTime}>Scheduled: {med.scheduledTime}</Text>
                    </View>
                  </View>

                  <View style={styles.badgeRowContainer}>{getStatusBadge(med.status)}</View>

                  {med.instructions ? (
                    <View style={styles.instructionsBox}>
                      <Ionicons name="information-circle" size={20} color="#0F766E" />
                      <Text style={styles.instructionsText}>{med.instructions}</Text>
                    </View>
                  ) : null}
                </TouchableOpacity>

                {/* Senior Interactive Buttons */}
                <View style={styles.actionBtnRow}>
                  {med.status !== 'taken' ? (
                    <TouchableOpacity
                      style={styles.btnTake}
                      onPress={() => handleTakeMedicine(med)}
                      activeOpacity={0.85}
                    >
                      <Ionicons name="checkmark-circle" size={26} color="#FFFFFF" />
                      <Text style={styles.btnTextPrimary}>TAKEN</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.takenCompletedBadge}>
                      <Ionicons name="checkmark-done" size={26} color="#10B981" />
                      <Text style={styles.takenCompletedText}>RECORDED AS TAKEN ✓</Text>
                    </View>
                  )}

                  {med.status !== 'taken' && med.status !== 'skipped' && (
                    <TouchableOpacity
                      style={styles.btnSkip}
                      onPress={() => handleSkipMedicine(med)}
                      activeOpacity={0.85}
                    >
                      <Ionicons name="pause-circle" size={24} color="#334155" />
                      <Text style={styles.btnTextSecondary}>SKIP</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    style={styles.btnDetails}
                    onPress={() => navigation.navigate('MedicineDetails', { medicineId: med.id })}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="ellipsis-horizontal" size={24} color="#0F766E" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        );
      })}
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
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerLeftCol: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#475569',
    marginTop: 2,
  },
  speechBtn: {
    padding: 10,
    backgroundColor: '#CCFBF1',
    borderRadius: 20,
  },
  confirmationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
    borderWidth: 2,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    gap: 10,
  },
  confirmationText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#065F46',
    flex: 1,
  },
  demoSimCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  demoHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  demoTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#78350F',
  },
  demoBtnGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  demoBtn: {
    flex: 1,
    backgroundColor: '#F59E0B',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#78350F',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F766E',
  },
  medCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.medium,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderLeftWidth: 8,
    borderLeftColor: '#F59E0B',
  },
  medCardTaken: {
    borderLeftColor: '#10B981',
    backgroundColor: '#FAFAFA',
  },
  medCardDue: {
    borderLeftColor: '#0284C7',
    backgroundColor: '#F0F9FF',
  },
  medCardMissed: {
    borderLeftColor: '#DC2626',
    backgroundColor: '#FEF2F2',
  },
  medCardSkipped: {
    borderLeftColor: '#64748B',
    backgroundColor: '#F8FAFC',
  },
  medMainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  pillIconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  medDetailsCol: {
    flex: 1,
  },
  nameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  medName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  medDosage: {
    fontSize: 18,
    color: '#334155',
    fontWeight: '600',
    marginTop: 4,
  },
  medTime: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  badgeRowContainer: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1.5,
    gap: 6,
  },
  statusBadgeText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  instructionsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    borderRadius: 10,
    padding: 10,
    marginTop: 12,
    gap: 8,
  },
  instructionsText: {
    fontSize: 15,
    color: '#0F766E',
    fontWeight: '500',
    flex: 1,
  },
  actionBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
    alignItems: 'center',
  },
  btnTake: {
    flex: 2,
    height: 58,
    backgroundColor: '#10B981',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  btnTextPrimary: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  takenCompletedBadge: {
    flex: 2,
    height: 58,
    backgroundColor: '#D1FAE5',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  takenCompletedText: {
    color: '#065F46',
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnSkip: {
    flex: 1,
    height: 58,
    backgroundColor: '#E2E8F0',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  btnTextSecondary: {
    color: '#334155',
    fontSize: 17,
    fontWeight: 'bold',
  },
  btnDetails: {
    width: 58,
    height: 58,
    backgroundColor: '#CCFBF1',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
