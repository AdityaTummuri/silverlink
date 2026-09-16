import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { SeniorButton } from '../../components/common/SeniorButton';
import { SpeechService } from '../../services/speechService';
import { MoodRating } from '../../types';
import { theme } from '../../theme/theme';

export const DailyCheckInScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { submitCheckIn, currentUser } = useApp();

  const [selectedMood, setSelectedMood] = useState<MoodRating | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [noteText, setNoteText] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const symptomOptions = ['Feeling Great', 'Slept Well', 'Tired', 'Knee Pain', 'Dizzy', 'Headache', 'Stiffness'];

  const handleSelectMood = (mood: MoodRating) => {
    setSelectedMood(mood);
    const text = mood === 'good' ? "I'm feeling good!" : mood === 'okay' ? "I'm feeling okay." : "I'm not feeling well.";
    SpeechService.speakText(text);
  };

  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedMood) return;
    await submitCheckIn(selectedMood, noteText, selectedSymptoms);
    setIsSubmitted(true);
    SpeechService.speakText("Thank you! Your check-in has been sent to your daughter Sarah.");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#0F766E" />
        <Text style={styles.backBtnText}>Back to Home</Text>
      </TouchableOpacity>

      {!isSubmitted ? (
        <>
          <View style={styles.promptHeader}>
            <Text style={styles.questionTitle}>How are you feeling today?</Text>
            <Text style={styles.questionSub}>
              Hi {currentUser.name.split(' ')[0]}, select an option below to let your family know how you are doing.
            </Text>
          </View>

          {/* Massive Mood Options */}
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
              <Text style={[styles.moodLabel, selectedMood === 'good' && styles.selectedLabelText]}>Good</Text>
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
              <Text style={[styles.moodLabel, selectedMood === 'okay' && styles.selectedLabelText]}>Okay</Text>
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
              <Text style={[styles.moodLabel, selectedMood === 'bad' && styles.selectedLabelText]}>Not Feeling Well</Text>
            </TouchableOpacity>
          </View>

          {/* Optional Symptom Chips */}
          {selectedMood && (
            <View style={styles.detailsBox}>
              <Text style={styles.sectionHeading}>Any specific feelings or symptoms?</Text>
              <View style={styles.chipsRow}>
                {symptomOptions.map(item => {
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
                placeholder="e.g., Slept 8 hours, went for a short morning walk."
                placeholderTextColor="#94A3B8"
                value={noteText}
                onChangeText={setNoteText}
                multiline
                numberOfLines={3}
              />

              <SeniorButton
                title="SUBMIT CHECK-IN"
                icon="checkmark-circle"
                variant="primary"
                onPress={handleSubmit}
                style={{ marginTop: 20 }}
              />
            </View>
          )}
        </>
      ) : (
        <View style={styles.successCard}>
          <Ionicons name="checkmark-circle-sharp" size={80} color="#10B981" />
          <Text style={styles.successTitle}>Check-In Saved!</Text>
          <Text style={styles.successSub}>
            Your daily check-in has been updated and shared with your family caregiver Sarah.
          </Text>
          <SeniorButton
            title="Return to Home"
            icon="home"
            variant="primary"
            onPress={() => navigation.navigate('Home')}
            style={{ marginTop: 24, width: '100%' }}
          />
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
    marginBottom: 16,
  },
  backBtnText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F766E',
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
    gap: 14,
    marginBottom: 20,
  },
  moodCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.medium,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  moodCardGood: {
    borderColor: '#A7F3D0',
  },
  moodCardOkay: {
    borderColor: '#FDE68A',
  },
  moodCardBad: {
    borderColor: '#FECACA',
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
    marginRight: 20,
  },
  moodLabel: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  selectedLabelText: {
    color: '#0F172A',
  },
  detailsBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.medium,
    padding: 20,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionHeading: {
    fontSize: 18,
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
    padding: 30,
    alignItems: 'center',
    marginVertical: 20,
  },
  successTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#0F766E',
    marginTop: 16,
  },
  successSub: {
    fontSize: 18,
    color: '#475569',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 26,
  },
});
