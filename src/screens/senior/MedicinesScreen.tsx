import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { SeniorButton } from '../../components/common/SeniorButton';
import { SpeechService } from '../../services/speechService';
import { Medication, TimeOfDay } from '../../types';
import { theme } from '../../theme/theme';

export const MedicinesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { medications, markMedicationTaken, markMedicationPending } = useApp();

  const timesOfDay: TimeOfDay[] = ['Morning', 'Afternoon', 'Evening', 'Night'];

  const getStatusBadge = (status: 'taken' | 'pending' | 'missed') => {
    switch (status) {
      case 'taken':
        return (
          <View style={[styles.statusBadge, { backgroundColor: '#D1FAE5' }]}>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            <Text style={[styles.statusBadgeText, { color: '#065F46' }]}>TAKEN</Text>
          </View>
        );
      case 'missed':
        return (
          <View style={[styles.statusBadge, { backgroundColor: '#FEE2E2' }]}>
            <Ionicons name="alert-circle" size={20} color="#DC2626" />
            <Text style={[styles.statusBadgeText, { color: '#991B1B' }]}>MISSED</Text>
          </View>
        );
      case 'pending':
      default:
        return (
          <View style={[styles.statusBadge, { backgroundColor: '#FEF3C7' }]}>
            <Ionicons name="time" size={20} color="#D97706" />
            <Text style={[styles.statusBadgeText, { color: '#92400E' }]}>PENDING</Text>
          </View>
        );
    }
  };

  const handleToggleStatus = (med: Medication) => {
    if (med.status === 'taken') {
      markMedicationPending(med.id);
      SpeechService.speakText(`Marked ${med.name} as pending.`);
    } else {
      markMedicationTaken(med.id);
      SpeechService.speakText(`Great job! Marked ${med.name} as taken.`);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerTitleRow}>
        <Text style={styles.headerTitle}>My Medicines</Text>
        <TouchableOpacity
          style={styles.speechBtn}
          onPress={() => SpeechService.speakText("Here are your daily scheduled medicines.")}
        >
          <Ionicons name="volume-high" size={26} color="#0F766E" />
        </TouchableOpacity>
      </View>

      {timesOfDay.map(timeGroup => {
        const medsInGroup = medications.filter(m => m.timeOfDay === timeGroup);
        if (medsInGroup.length === 0) return null;

        return (
          <View key={timeGroup} style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Ionicons
                name={
                  timeGroup === 'Morning' ? 'sunny' :
                  timeGroup === 'Afternoon' ? 'partly-sunny' :
                  timeGroup === 'Evening' ? 'moon' : 'bed'
                }
                size={26}
                color="#0F766E"
              />
              <Text style={styles.sectionHeaderTitle}>{timeGroup} Schedule</Text>
            </View>

            {medsInGroup.map(med => (
              <TouchableOpacity
                key={med.id}
                style={[
                  styles.medCard,
                  med.status === 'taken' && styles.medCardTaken,
                ]}
                onPress={() => navigation.navigate('MedicineDetails', { medicineId: med.id })}
                activeOpacity={0.85}
              >
                <View style={styles.medMainRow}>
                  <View style={[styles.pillIconCircle, { backgroundColor: med.pillColor || '#3B82F6' }]}>
                    <Ionicons name="medical" size={28} color="#FFFFFF" />
                  </View>

                  <View style={styles.medDetailsCol}>
                    <View style={styles.nameBadgeRow}>
                      <Text style={styles.medName}>{med.name}</Text>
                      {getStatusBadge(med.status)}
                    </View>
                    <Text style={styles.medDosage}>{med.dosage}</Text>
                    <Text style={styles.medTime}>Scheduled: {med.scheduledTime}</Text>
                  </View>
                </View>

                {med.instructions ? (
                  <View style={styles.instructionsBox}>
                    <Ionicons name="information-circle-outline" size={20} color="#475569" />
                    <Text style={styles.instructionsText}>{med.instructions}</Text>
                  </View>
                ) : null}

                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={[
                      styles.statusToggleBtn,
                      med.status === 'taken' ? styles.btnUndo : styles.btnTake,
                    ]}
                    onPress={() => handleToggleStatus(med)}
                  >
                    <Ionicons
                      name={med.status === 'taken' ? 'close-circle-outline' : 'checkmark-circle'}
                      size={24}
                      color="#FFFFFF"
                    />
                    <Text style={styles.statusToggleBtnText}>
                      {med.status === 'taken' ? 'Undo (Mark Pending)' : 'Press When Taken'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
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
  headerTitle: {
    fontSize: theme.typography.seniorHeader.fontSize,
    fontWeight: theme.typography.seniorHeader.fontWeight,
    color: '#0F172A',
  },
  speechBtn: {
    padding: 10,
    backgroundColor: '#CCFBF1',
    borderRadius: 20,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  sectionHeaderTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F766E',
  },
  medCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.medium,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderLeftWidth: 6,
    borderLeftColor: '#3B82F6',
  },
  medCardTaken: {
    borderLeftColor: '#10B981',
    backgroundColor: '#FAFAFA',
  },
  medMainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  pillIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
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
    flexWrap: 'wrap',
    gap: 8,
  },
  medName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusBadgeText: {
    fontSize: 13,
    fontWeight: 'bold',
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
  },
  instructionsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    marginTop: 12,
    gap: 8,
  },
  instructionsText: {
    fontSize: 16,
    color: '#334155',
    fontWeight: '500',
    flex: 1,
  },
  actionRow: {
    marginTop: 14,
  },
  statusToggleBtn: {
    height: 58,
    borderRadius: theme.borderRadius.small,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  btnTake: {
    backgroundColor: '#10B981',
  },
  btnUndo: {
    backgroundColor: '#64748B',
  },
  statusToggleBtnText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
