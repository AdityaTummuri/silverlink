import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { SeniorButton } from '../../components/common/SeniorButton';
import { SpeechService } from '../../services/speechService';
import { theme } from '../../theme/theme';

export const MedicineDetailsScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { medicineId } = route.params || {};
  const { medications, markMedicationTaken, markMedicationPending } = useApp();

  const med = medications.find(m => m.id === medicineId) || medications[0];

  if (!med) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Medicine details not found.</Text>
        <SeniorButton title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const handleReadAloud = () => {
    SpeechService.speakText(
      `${med.name}. Dosage is ${med.dosage}. Scheduled for ${med.scheduledTime}. ${med.instructions}`
    );
  };

  const handleToggle = () => {
    if (med.status === 'taken') {
      markMedicationPending(med.id);
      SpeechService.speakText(`Marked ${med.name} as pending.`);
    } else {
      markMedicationTaken(med.id);
      SpeechService.speakText(`Marked ${med.name} as taken!`);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#0F766E" />
        <Text style={styles.backBtnText}>Back to Medicines</Text>
      </TouchableOpacity>

      <View style={styles.detailCard}>
        <View style={styles.pillBanner}>
          <View style={[styles.largePillCircle, { backgroundColor: med.pillColor || '#3B82F6' }]}>
            <Ionicons name="medical" size={48} color="#FFFFFF" />
          </View>
          <Text style={styles.medTitle}>{med.name}</Text>
          <Text style={styles.medSubTitle}>{med.dosage}</Text>
        </View>

        <TouchableOpacity style={styles.audioReadBtn} onPress={handleReadAloud}>
          <Ionicons name="volume-high" size={26} color="#0F766E" />
          <Text style={styles.audioReadText}>Read Instructions Out Loud</Text>
        </TouchableOpacity>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Ionicons name="time" size={26} color="#0F766E" />
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Scheduled Time</Text>
              <Text style={styles.infoValue}>{med.scheduledTime} ({med.timeOfDay})</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="repeat" size={26} color="#0F766E" />
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Frequency</Text>
              <Text style={styles.infoValue}>{med.frequency}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="information-circle" size={26} color="#0F766E" />
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Food & Intake Instructions</Text>
              <Text style={styles.infoValueText}>{med.instructions}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="pulse" size={26} color="#0F766E" />
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Current Status</Text>
              <Text style={[
                styles.infoStatusText,
                { color: med.status === 'taken' ? '#10B981' : '#D97706' }
              ]}>
                {med.status.toUpperCase()} {med.lastTakenTime ? `(${med.lastTakenTime})` : ''}
              </Text>
            </View>
          </View>
        </View>

        <SeniorButton
          title={med.status === 'taken' ? 'Mark as Pending' : 'MARK AS TAKEN'}
          variant={med.status === 'taken' ? 'secondary' : 'success'}
          icon={med.status === 'taken' ? 'close-circle' : 'checkmark-circle'}
          onPress={handleToggle}
          style={{ marginTop: 20 }}
        />
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
  notFoundContainer: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    fontSize: 22,
    color: '#0F172A',
    marginBottom: 20,
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
  detailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.large,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  pillBanner: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  largePillCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  medTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
  },
  medSubTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#475569',
    marginTop: 4,
  },
  audioReadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#CCFBF1',
    borderRadius: theme.borderRadius.small,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 16,
    gap: 10,
  },
  audioReadText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F766E',
  },
  infoSection: {
    gap: 16,
    marginVertical: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    gap: 14,
  },
  infoCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
    marginTop: 2,
  },
  infoValueText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1E293B',
    marginTop: 4,
    lineHeight: 24,
  },
  infoStatusText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 2,
  },
});
