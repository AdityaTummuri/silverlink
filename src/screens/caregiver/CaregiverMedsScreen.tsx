import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { AddMedicineModal } from '../../components/caregiver/AddMedicineModal';
import { theme } from '../../theme/theme';

export const CaregiverMedsScreen: React.FC = () => {
  const { medications, markMedicationTaken, markMedicationPending } = useApp();
  const [filter, setFilter] = useState<'all' | 'pending' | 'taken'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredMeds = medications.filter(m => {
    if (filter === 'all') return true;
    return m.status === filter;
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Senior Medications</Text>
          <Text style={styles.sub}>Eleanor Vance's prescribed regimen</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => setIsModalOpen(true)}>
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.addBtnText}>Schedule New</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterRow}>
        {(['all', 'pending', 'taken'] as const).map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterChipText, filter === f && styles.filterChipTextActive]}>
              {f.toUpperCase()} ({f === 'all' ? medications.length : medications.filter(m => m.status === f).length})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Medication Cards */}
      {filteredMeds.map(med => (
        <View key={med.id} style={styles.medCard}>
          <View style={styles.cardTopRow}>
            <View style={[styles.pillCircle, { backgroundColor: med.pillColor || '#2563EB' }]}>
              <Ionicons name="medical" size={22} color="#FFFFFF" />
            </View>
            <View style={styles.medInfoCol}>
              <Text style={styles.medName}>{med.name}</Text>
              <Text style={styles.medDosage}>{med.dosage} • {med.scheduledTime} ({med.timeOfDay})</Text>
            </View>
            <View style={[
              styles.statusBadge,
              { backgroundColor: med.status === 'taken' ? '#D1FAE5' : '#FEF3C7' }
            ]}>
              <Text style={[
                styles.statusBadgeText,
                { color: med.status === 'taken' ? '#065F46' : '#92400E' }
              ]}>
                {med.status.toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.instructionsBox}>
            <Ionicons name="information-circle-outline" size={18} color="#475569" />
            <Text style={styles.instructionsText}>{med.instructions}</Text>
          </View>

          <View style={styles.cardActionRow}>
            <Text style={styles.lastTakenText}>
              {med.lastTakenTime ? `Confirmed at ${med.lastTakenTime}` : 'Not yet confirmed today'}
            </Text>
            <TouchableOpacity
              style={styles.overrideBtn}
              onPress={() => {
                if (med.status === 'taken') markMedicationPending(med.id);
                else markMedicationTaken(med.id);
              }}
            >
              <Text style={styles.overrideBtnText}>
                {med.status === 'taken' ? 'Mark Pending' : 'Force Mark Taken'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <AddMedicineModal visible={isModalOpen} onClose={() => setIsModalOpen(false)} />
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
  },
  addBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: '#2563EB',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#475569',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  medCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.medium,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pillCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  medInfoCol: {
    flex: 1,
  },
  medName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  medDosage: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  instructionsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
    gap: 8,
  },
  instructionsText: {
    fontSize: 13,
    color: '#334155',
    flex: 1,
  },
  cardActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  lastTakenText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  overrideBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  overrideBtnText: {
    color: '#2563EB',
    fontWeight: '600',
    fontSize: 13,
  },
});
