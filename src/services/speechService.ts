export interface SpeechResult {
  transcript: string;
  commandExecuted?: string;
  feedbackResponse: string;
  action?: 'SHOW_MEDS' | 'CALL_DAUGHTER' | 'SET_REMINDER' | 'TRIGGER_SOS' | 'CHECK_IN' | 'UNKNOWN';
  payload?: any;
}

export class SpeechService {
  private static recognition: any = null;

  static isSpeechSupported(): boolean {
    if (typeof window !== 'undefined') {
      return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    }
    return false;
  }

  static speakText(text: string): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any active speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Slightly slower for senior readability
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }

  static parseCommand(rawText: string): SpeechResult {
    const text = rawText.toLowerCase().trim();

    // 1. Emergency / Help
    if (text.includes('help') || text.includes('emergency') || text.includes('sos') || text.includes('fall')) {
      const response = "Emergency alert triggered! I am notifying your daughter Sarah and preparing to dial emergency services.";
      this.speakText(response);
      return {
        transcript: rawText,
        action: 'TRIGGER_SOS',
        feedbackResponse: response,
        commandExecuted: 'Emergency SOS Triggered',
      };
    }

    // 2. Call Daughter / Contact
    if (text.includes('call') || text.includes('daughter') || text.includes('sarah') || text.includes('phone')) {
      const response = "Calling your daughter Sarah Vance now.";
      this.speakText(response);
      return {
        transcript: rawText,
        action: 'CALL_DAUGHTER',
        feedbackResponse: response,
        commandExecuted: 'Calling Sarah Vance (Daughter)',
      };
    }

    // 3. Medicines schedule
    if (text.includes('medicine') || text.includes('meds') || text.includes('pill') || text.includes('show my')) {
      const response = "Opening your medicines schedule. You have Calcium scheduled for 8:00 PM.";
      this.speakText(response);
      return {
        transcript: rawText,
        action: 'SHOW_MEDS',
        feedbackResponse: response,
        commandExecuted: 'Show Medicines Schedule',
      };
    }

    // 4. Remind medicine
    if (text.includes('remind') || text.includes('take') || text.includes('8 pm') || text.includes('reminder')) {
      const response = "Got it! I have set a reminder for your evening medicine at 8:00 PM.";
      this.speakText(response);
      return {
        transcript: rawText,
        action: 'SET_REMINDER',
        feedbackResponse: response,
        commandExecuted: 'Reminder set for 8:00 PM',
        payload: { time: '8:00 PM' },
      };
    }

    // 5. Daily Check-in
    if (text.includes('feeling') || text.includes('check in') || text.includes('good') || text.includes('how am i')) {
      const response = "Opening your daily check-in screen so you can log how you're feeling today.";
      this.speakText(response);
      return {
        transcript: rawText,
        action: 'CHECK_IN',
        feedbackResponse: response,
        commandExecuted: 'Open Daily Check-In',
      };
    }

    // Default Fallback
    const fallbackResponse = `I heard "${rawText}". You can say: "Show my medicines", "Call my daughter", or "I need help".`;
    this.speakText(fallbackResponse);
    return {
      transcript: rawText,
      action: 'UNKNOWN',
      feedbackResponse: fallbackResponse,
    };
  }
}
