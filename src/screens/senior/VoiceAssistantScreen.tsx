import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { SpeechService, SpeechResult } from '../../services/speechService';
import { theme } from '../../theme/theme';

export const VoiceAssistantScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { triggerSos, currentUser } = useApp();
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('Press the microphone button or pick a command below...');
  const [assistantReply, setAssistantReply] = useState<string>('How can I help you today, Eleanor?');
  const [executedCommand, setExecutedCommand] = useState<string | null>(null);

  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    if (isListening) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.25, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isListening]);

  const executeResult = (result: SpeechResult) => {
    setTranscript(`"${result.transcript}"`);
    setAssistantReply(result.feedbackResponse);
    setExecutedCommand(result.commandExecuted || null);

    if (result.action === 'SHOW_MEDS') {
      setTimeout(() => navigation.navigate('Medicines'), 1800);
    } else if (result.action === 'CALL_DAUGHTER') {
      setTimeout(() => {
        alert("Simulated Phone Call: Dialing Sarah Vance ((555) 234-5678)...");
      }, 1500);
    } else if (result.action === 'TRIGGER_SOS') {
      setTimeout(() => triggerSos("Voice Assistant triggered Emergency SOS"), 1200);
    } else if (result.action === 'CHECK_IN') {
      setTimeout(() => navigation.navigate('DailyCheckIn'), 1800);
    }
  };

  const handleStartListening = () => {
    setIsListening(true);
    setTranscript('Listening... Speak now into your microphone');

    // Check if web speech is supported
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      try {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
          const spoken = event.results[0][0].transcript;
          setIsListening(false);
          const res = SpeechService.parseCommand(spoken);
          executeResult(res);
        };

        recognition.onerror = () => {
          setIsListening(false);
          // Fallback simulation
          const res = SpeechService.parseCommand("Show my medicines");
          executeResult(res);
        };

        recognition.onend = () => setIsListening(false);

        recognition.start();
        return;
      } catch (e) {
        console.warn('Speech recognition error:', e);
      }
    }

    // Default simulation if web speech api is not supported by environment
    setTimeout(() => {
      setIsListening(false);
      const res = SpeechService.parseCommand("Show my medicines");
      executeResult(res);
    }, 2500);
  };

  const handleQuickCommand = (cmdText: string) => {
    setIsListening(false);
    const res = SpeechService.parseCommand(cmdText);
    executeResult(res);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#0F766E" />
        <Text style={styles.backBtnText}>Back to Home</Text>
      </TouchableOpacity>

      <View style={styles.micBanner}>
        <Text style={styles.title}>Voice Assistant</Text>
        <Text style={styles.subtitle}>Speak naturally or tap a suggested command below</Text>

        <View style={styles.micCircleContainer}>
          <Animated.View style={[styles.pulseRing, { transform: [{ scale: pulseAnim }] }]} />
          <TouchableOpacity
            style={[styles.mainMicButton, isListening && styles.mainMicButtonListening]}
            onPress={handleStartListening}
            activeOpacity={0.8}
          >
            <Ionicons name={isListening ? "mic" : "mic-outline"} size={56} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <Text style={styles.statusText}>
          {isListening ? '🎙️ Listening... Speak now' : 'Tap Microphone to Speak'}
        </Text>
      </View>

      {/* Transcript & Response Area */}
      <View style={styles.dialogCard}>
        <View style={styles.userSpeechRow}>
          <Ionicons name="person-circle-outline" size={32} color="#0F766E" />
          <View style={styles.speechBubbleUser}>
            <Text style={styles.userSpeechText}>{transcript}</Text>
          </View>
        </View>

        <View style={styles.assistantSpeechRow}>
          <View style={styles.assistantAvatar}>
            <Ionicons name="sparkles" size={20} color="#FFFFFF" />
          </View>
          <View style={styles.speechBubbleAssistant}>
            <Text style={styles.assistantSpeechText}>{assistantReply}</Text>
            {executedCommand && (
              <View style={styles.actionExecutedChip}>
                <Ionicons name="checkmark-done" size={16} color="#065F46" />
                <Text style={styles.actionExecutedText}>{executedCommand}</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Suggested Quick Commands */}
      <View style={styles.quickCommandsSection}>
        <Text style={styles.quickHeading}>Quick Voice Commands:</Text>
        <TouchableOpacity
          style={styles.commandChip}
          onPress={() => handleQuickCommand("Remind me to take my medicine at 8 PM.")}
        >
          <Ionicons name="chatbubble-ellipses-outline" size={24} color="#0F766E" />
          <Text style={styles.commandChipText}>"Remind me to take my medicine at 8 PM."</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.commandChip}
          onPress={() => handleQuickCommand("Call my daughter.")}
        >
          <Ionicons name="call-outline" size={24} color="#0F766E" />
          <Text style={styles.commandChipText}>"Call my daughter."</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.commandChip}
          onPress={() => handleQuickCommand("Show my medicines.")}
        >
          <Ionicons name="medical-outline" size={24} color="#0F766E" />
          <Text style={styles.commandChipText}>"Show my medicines."</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.commandChip, { borderColor: '#FECACA', backgroundColor: '#FEF2F2' }]}
          onPress={() => handleQuickCommand("I need help.")}
        >
          <Ionicons name="warning-outline" size={24} color="#DC2626" />
          <Text style={[styles.commandChipText, { color: '#991B1B' }]}>"I need help."</Text>
        </TouchableOpacity>
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
  micBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.large,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 16,
    color: '#475569',
    marginTop: 4,
    textAlign: 'center',
  },
  micCircleContainer: {
    marginVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#CCFBF1',
  },
  mainMicButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#0F766E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  mainMicButtonListening: {
    backgroundColor: '#DC2626',
  },
  statusText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F766E',
  },
  dialogCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.medium,
    padding: 18,
    gap: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  userSpeechRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  speechBubbleUser: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 14,
  },
  userSpeechText: {
    fontSize: 18,
    color: '#1E293B',
    fontStyle: 'italic',
    fontWeight: '500',
  },
  assistantSpeechRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  assistantAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0F766E',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  speechBubbleAssistant: {
    flex: 1,
    backgroundColor: '#E6FFFA',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#99F6E4',
  },
  assistantSpeechText: {
    fontSize: 18,
    color: '#0F766E',
    fontWeight: '600',
    lineHeight: 24,
  },
  actionExecutedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
    gap: 4,
  },
  actionExecutedText: {
    color: '#065F46',
    fontWeight: 'bold',
    fontSize: 14,
  },
  quickCommandsSection: {
    gap: 10,
  },
  quickHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  commandChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.small,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: '#CBD5E1',
  },
  commandChipText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    flex: 1,
  },
});
