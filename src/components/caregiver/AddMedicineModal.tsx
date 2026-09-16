import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { TimeOfDay } from '../../types';
import { theme } from '../../theme/theme';

interface AddMedicineModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AddMedicineModal: React.FC<AddMedicineModalProps> = ({ visible, onClose }) => {
  const { addMedication } = useApp();

  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [scheduledTime, setScheduledTime] = useState('08:00 AM');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('Morning');
  const [instructions, setInstructions] = useState('');

  const handleSave = async () => {
    if (!name.trim() || !dosage.trim()) {
      alert("Please enter medication name and dosage.");
      return;
    }

    await addMedication({
      name,
      dosage,
      scheduledTime,
      timeOfDay,
      frequency: 'Daily',
      instructions: instructions || 'Take as prescribed by doctor.',
      pillColor: '#2563EB',
    });

    setName('');
    setDosage('');
    setInstructions('');
    onClose();
    alert("New medication scheduled for senior!");
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Schedule New Medication</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={26} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formScroll}>
            <Text style={styles.label}>Medication Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Lisinopril, Eye Drops"
              placeholderTextColor="#94A3B8"
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>Dosage / Form *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 10mg - 1 Tablet, 1 Drop"
              placeholderTextColor="#94A3B8"
              value={dosage}
              onChangeText={setDosage}
            />

            <Text style={styles.label}>Time of Day</Text>
            <View style={styles.timeOfDayRow}>
              {(['Morning', 'Afternoon', 'Evening', 'Night'] as TimeOfDay[]).map(t => (
                <TouchableOpacity
                  key={t}
                  style={[styles.timeChip, timeOfDay === t && styles.timeChipActive]}
                  onPress={() => setTimeOfDay(t)}
                >
                  <Text style={[styles.timeChipText, timeOfDay === t && styles.timeChipTextActive]}>
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Scheduled Time</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 08:00 AM"
              placeholderTextColor="#94A3B8"
              value={scheduledTime}
              onChangeText={setScheduledTime}
            />

            <Text style={styles.label}>Senior Intake Instructions</Text>
            <TextInput
              style={[styles.input, { minHeight: 80, textAlignVertical: 'top' }]}
              placeholder="e.g. Take after meal with 1 glass of water."
              placeholderTextColor="#94A3B8"
              value={instructions}
              onChangeText={setInstructions}
              multiline
            />
          </ScrollView>

          <View style={styles.footerRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Ionicons name="checkmark" size={20} color="#FFFFFF" />
              <Text style={styles.saveBtnText}>Save & Schedule</Text>
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
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.medium,
    padding: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 12,
    marginBottom: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  formScroll: {
    maxHeight: 400,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginTop: 10,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#0F172A',
  },
  timeOfDayRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  timeChipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  timeChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  timeChipTextActive: {
    color: '#FFFFFF',
  },
  footerRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 14,
  },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    color: '#475569',
    fontWeight: '700',
    fontSize: 15,
  },
  saveBtn: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
