import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { SeniorButton } from '../../components/common/SeniorButton';
import { SpeechService } from '../../services/speechService';
import { MoodRating } from '../../types';
import { theme } from '../../theme/theme';

export const DailyCheckInScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { submitCheckIn, currentUser, checkIns } = useApp();

  const [selectedMood, setSelectedMood] = useState<MoodRating | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [noteText, setNoteText] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [lastSubmittedMood, setLastSubmittedMood] = useState<MoodRating | null>(null);

  const symptomOptions = ['Feeling Great', 'Slept Well', 'Tired', 'Knee Pain', 'Dizzy', 'Headache', 'Stiffness'];

  const handleSelectMood = async (mood: MoodRating) => {
    setSelectedMood(mood);
    const speechText =
      mood === 'good'
        ? "I'm feeling good today!"
        : mood === 'okay'
        ? "I'm feeling okay today."
        : "I'm not feeling well today.";
    SpeechService.speakText(speechText);

    // Immediate submission as per prompt workflow
    await submitCheckIn(mood, noteText, selectedSymptoms);
    setLastSubmittedMood(mood);
    setIsSubmitted(true);
    SpeechService.speakText("Check-in completed! Thank you.");
  };

  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleDemoPreset = async (mood: MoodRating) => {
    setSelectedMood(mood);
    await submitCheckIn(mood, 'Demo log', mood === 'good' ? ['Feeling Great'] : mood === 'bad' ? ['Tired'] : []);
    setLastSubmittedMood(mood);
    setIsSubmitted(true);
  };

  const handleResetCheckIn = () => {
    setIsSubmitted(false);
    setSelectedMood(null);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#0F766E" />
        <Text style={styles.backBtnText}>Back to Home</Text>
      </TouchableOpacity>

      {/* Demo Quick Simulator Bar */}
      <View style={styles.demoBar}>
        <Text style={styles.demoTitle}>Demo Quick Simulator:</Text>
        <View style={styles.demoBtnRow}>
          <TouchableOpacity style={[styles.demoChip, { backgroundColor: '#D1FAE5' }]} onPress={() => handleDemoPreset('good')}>
            <Text style={[styles.demoChipText, { color: '#065F46' }]}>Set GOOD</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.demoChip, { backgroundColor: '#FEF3C7' }]} onPress={() => handleDemoPreset('okay')}>
            <Text style={[styles.demoChipText, { color: '#92400E' }]}>Set OKAY</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.demoChip, { backgroundColor: '#FEE2E2' }]} onPress={() => handleDemoPreset('bad')}>
            <Text style={[styles.demoChipText, { color: '#991B1B' }]}>Set NOT WELL</Text>
          </TouchableOpacity>
        </View>
      </View>

      {!isSubmitted ? (
        <>
          <View style={styles.promptHeader}>
            <Text style={styles.questionTitle}>How are you feeling today?</Text>
            <Text style={styles.questionSub}>
              Hi {currentUser.name.split(' ')[0]}, select an option below to log your daily wellbeing.
            </Text>
          </View>

          {/* 3 Massive Touch-Friendly Choice Cards */}
          <View style={styles.moodOptionsContainer}>
            <TouchableOpacity
              style={[
                styles.moodCard,
                styles.moodCardGood,
                selectedMood === 'good' && styles.moodCardSelectedGood,
              ]}
              onPress={() => handleSelectMood('good')}
              activeOpacity={0.8}
            >
              <Text style={styles.emojiText}>😊</Text>
              <View style={styles.labelCol}>
                <Text style={styles.moodLabel}>I'm feeling good</Text>
                <Text style={styles.moodSubLabel}>Energetic, happy & active</Text>
              </View>
              <Ionicons name="chevron-forward" size={28} color="#10B981" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.moodCard,
                styles.moodCardOkay,
                selectedMood === 'okay' && styles.moodCardSelectedOkay,
              ]}
              onPress={() => handleSelectMood('okay')}
              activeOpacity={0.8}
            >
              <Text style={styles.emojiText}>😐</Text>
              <View style={styles.labelCol}>
                <Text style={styles.moodLabel}>I'm okay</Text>
                <Text style={styles.moodSubLabel}>Usual routine, doing alright</Text>
              </View>
              <Ionicons name="chevron-forward" size={28} color="#F59E0B" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.moodCard,
                styles.moodCardBad,
                selectedMood === 'bad' && styles.moodCardSelectedBad,
              ]}
              onPress={() => handleSelectMood('bad')}
              activeOpacity={0.8}
            >
              <Text style={styles.emojiText}>😟</Text>
              <View style={styles.labelCol}>
                <Text style={styles.moodLabel}>I'm not feeling well</Text>
                <Text style={styles.moodSubLabel}>Tired, in pain, or unwell</Text>
              </View>
              <Ionicons name="chevron-forward" size={28} color="#DC2626" />
            </TouchableOpacity>
          </View>

          {/* Optional Symptoms & Note */}
          <View style={styles.detailsBox}>
            <Text style={styles.sectionHeading}>Any specific feelings or symptoms? (Optional)</Text>
            <View style={styles.chipsRow}>
              {symptomOptions.map((item) => {
                const active = selectedSymptoms.includes(item);
                return (
                  <TouchableOpacity
                    key={item}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => toggleSymptom(item)}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{item}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={[styles.sectionHeading, { marginTop: 16 }]}>Add a short note (optional):</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., Slept well, went for a short morning walk."
              placeholderTextColor="#94A3B8"
              value={noteText}
              onChangeText={setNoteText}
              multiline
              numberOfLines={3}
            />
          </View>
        </>
      ) : (
        <View style={styles.successCard}>
          <Ionicons name="checkmark-circle-sharp" size={88} color="#10B981" />
          <Text style={styles.successTitle}>Check-in completed ✓</Text>

          <View style={styles.submittedBadgeRow}>
            <Text style={styles.submittedBadgeText}>
              Status:{' '}
              {lastSubmittedMood === 'good'
                ? 'Feeling Good ✓'
                : lastSubmittedMood === 'okay'
                ? 'Feeling Okay ✓'
                : 'Not Feeling Well ⚠'}
            </Text>
          </View>

          <Text style={styles.successSub}>
            Your daily check-in timestamp ({new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}) has been recorded safely.
          </Text>

          <SeniorButton
            title="RETURN TO HOME"
            icon="home"
            variant="primary"
            onPress={() => navigation.navigate('SeniorHome')}
            style={{ marginTop: 24, width: '100%' }}
          />

          <TouchableOpacity style={styles.reLogBtn} onPress={handleResetCheckIn}>
            <Text style={styles.reLogBtnText}>Update Check-in Response</Text>
          </TouchableOpacity>
        </View>
      )}
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
  demoBar: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  demoTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#78350F',
    marginBottom: 6,
  },
  demoBtnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  demoChip: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  demoChipText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  promptHeader: {
    marginBottom: 20,
  },
  questionTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  questionSub: {
    fontSize: 18,
    color: '#475569',
    marginTop: 6,
    lineHeight: 26,
  },
  moodOptionsContainer: {
    gap: 16,
    marginBottom: 20,
  },
  moodCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.large,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#CBD5E1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    minHeight: 90,
  },
  moodCardGood: {
    borderColor: '#A7F3D0',
    borderLeftWidth: 8,
    borderLeftColor: '#10B981',
  },
  moodCardOkay: {
    borderColor: '#FDE68A',
    borderLeftWidth: 8,
    borderLeftColor: '#F59E0B',
  },
  moodCardBad: {
    borderColor: '#FECACA',
    borderLeftWidth: 8,
    borderLeftColor: '#DC2626',
  },
  moodCardSelectedGood: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
  },
  moodCardSelectedOkay: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  moodCardSelectedBad: {
    backgroundColor: '#FEE2E2',
    borderColor: '#DC2626',
  },
  emojiText: {
    fontSize: 54,
    marginRight: 16,
  },
  labelCol: {
    flex: 1,
  },
  moodLabel: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  moodSubLabel: {
    fontSize: 15,
    color: '#475569',
    marginTop: 2,
  },
  detailsBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.medium,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 12,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  chipActive: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  chipText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    padding: 14,
    fontSize: 18,
    color: '#0F172A',
    minHeight: 90,
    textAlignVertical: 'top',
  },
  successCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.large,
    padding: 28,
    alignItems: 'center',
    marginVertical: 10,
  },
  successTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0F766E',
    marginTop: 16,
  },
  submittedBadgeRow: {
    backgroundColor: '#CCFBF1',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginVertical: 12,
  },
  submittedBadgeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F766E',
  },
  successSub: {
    fontSize: 17,
    color: '#475569',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 24,
  },
  reLogBtn: {
    marginTop: 16,
    padding: 10,
  },
  reLogBtnText: {
    color: '#0F766E',
    fontSize: 16,
    fontWeight: '700',
  },
});
