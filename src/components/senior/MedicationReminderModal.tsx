import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { SpeechService } from '../../services/speechService';
import { emitMedicineTaken } from '../../features/medication/medicationEvents';

export const MedicationReminderModal: React.FC = () => {
  const { activeReminderMed, closeReminderModal, markMedicationTaken, currentUser } = useApp();

  useEffect(() => {
    if (activeReminderMed) {
      SpeechService.speakText(
        `Time for your medicine! ${activeReminderMed.name}. ${activeReminderMed.dosage}.`
      );
    }
  }, [activeReminderMed]);

  if (!activeReminderMed) return null;

  const handleTaken = () => {
    markMedicationTaken(activeReminderMed.id);
    emitMedicineTaken(
      currentUser.uid,
      activeReminderMed.id,
      activeReminderMed.name,
      activeReminderMed.dosage,
      activeReminderMed.scheduledTime
    );
    SpeechService.speakText(`Great job! Marked ${activeReminderMed.name} as taken.`);
    closeReminderModal();
  };

  const handleRemindLater = () => {
    SpeechService.speakText(`Okay, we will remind you again in 15 minutes.`);
    closeReminderModal();
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={!!activeReminderMed}
      onRequestClose={closeReminderModal}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <View style={styles.pillIconBadge}>
              <Ionicons name="medical" size={40} color="#FFFFFF" />
            </View>
            <View style={styles.headerTextCol}>
              <Text style={styles.alertLabel}>MEDICATION REMINDER</Text>
              <Text style={styles.modalTitle}>Time for your medicine</Text>
            </View>
          </View>

          <View style={styles.detailsBox}>
            <Text style={styles.medName}>{activeReminderMed.name}</Text>
            <Text style={styles.medDosage}>{activeReminderMed.dosage}</Text>
            <View style={styles.timeTag}>
              <Ionicons name="time-outline" size={20} color="#0F766E" />
              <Text style={styles.timeText}>Scheduled: {activeReminderMed.scheduledTime}</Text>
            </View>
            {activeReminderMed.instructions ? (
              <Text style={styles.instructionsText}>💡 {activeReminderMed.instructions}</Text>
            ) : null}
          </View>

          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.takenBtn} onPress={handleTaken} activeOpacity={0.85}>
              <Ionicons name="checkmark-circle" size={32} color="#FFFFFF" />
              <Text style={styles.takenBtnText}>TAKEN</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.snoozeBtn} onPress={handleRemindLater} activeOpacity={0.85}>
              <Ionicons name="time" size={28} color="#92400E" />
              <Text style={styles.snoozeBtnText}>REMIND ME LATER</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 480,
    borderWidth: 4,
    borderColor: '#0F766E',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  pillIconBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#0F766E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  headerTextCol: {
    flex: 1,
  },
  alertLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F766E',
    letterSpacing: 1,
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  detailsBox: {
    backgroundColor: '#F0FDFA',
    borderRadius: 16,
    padding: 18,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  medName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  medDosage: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0F766E',
    marginTop: 4,
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 6,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },
  instructionsText: {
    fontSize: 15,
    color: '#475569',
    marginTop: 10,
    lineHeight: 22,
  },
  btnRow: {
    marginTop: 16,
    gap: 12,
  },
  takenBtn: {
    height: 64,
    backgroundColor: '#10B981',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  takenBtnText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  snoozeBtn: {
    height: 58,
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#F59E0B',
    gap: 10,
  },
  snoozeBtnText: {
    color: '#92400E',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
