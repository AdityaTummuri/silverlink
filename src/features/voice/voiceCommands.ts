import { seniorEventService } from '../../services/senior/eventService';
import { SeniorEvent } from '../../types/events';

export type VoiceIntent =
  | 'MEDICINES'
  | 'DAILY_STATUS'
  | 'MEDICINE_REMINDER'
  | 'CALL_FAMILY'
  | 'HELP_EMERGENCY'
  | 'UNKNOWN';

export interface ProcessedVoiceCommand {
  intent: VoiceIntent;
  rawText: string;
  assistantReply: string;
  actionSummary: string;
  navigationTarget?: 'Medicines' | 'Emergency' | 'SeniorHome' | 'FamilyContacts' | 'DailyCheckIn';
  contactToCall?: { name: string; phone: string };
  reminderDetails?: { medName?: string; time?: string };
}

export class VoiceCommandService {
  public static process(rawText: string, seniorId: string = 'senior_eleanor_1'): ProcessedVoiceCommand {
    const text = rawText.toLowerCase().trim();

    // 1. Explicit Help / Emergency (Safety rule: Ambiguous phrases like "I am tired" do NOT trigger SOS)
    const isExplicitHelp =
      text === 'i need help' ||
      text === 'help me' ||
      text === 'emergency' ||
      text === 'sos' ||
      text.includes('i need help') ||
      text.includes('call 911');

    if (isExplicitHelp) {
      const result: ProcessedVoiceCommand = {
        intent: 'HELP_EMERGENCY',
        rawText,
        assistantReply: 'Opening Emergency SOS Center. Please confirm if you need immediate assistance.',
        actionSummary: 'Navigating to Emergency SOS Confirmation',
        navigationTarget: 'Emergency',
      };
      this.emitVoiceEvents(seniorId, 'VOICE_HELP_REQUEST', rawText, result);
      return result;
    }

    // Ambiguous feeling handling (Safety rule check)
    if (text.includes('tired') || text.includes('rest') || text.includes('sleepy') || text.includes('slow')) {
      const result: ProcessedVoiceCommand = {
        intent: 'DAILY_STATUS',
        rawText,
        assistantReply: `I hear you feel tired. Make sure to rest well and drink water! Would you like to log your daily check-in?`,
        actionSummary: 'Showing Daily Check-In',
        navigationTarget: 'DailyCheckIn',
      };
      this.emitVoiceEvents(seniorId, 'VOICE_COMMAND_RECOGNIZED', rawText, result);
      return result;
    }

    // 2. Medicines Schedule & Overview
    if (
      text.includes('show my medicines') ||
      text.includes('what medicines do i have') ||
      text.includes('show medicines') ||
      text.includes('list medicines') ||
      text.includes('my pills')
    ) {
      const result: ProcessedVoiceCommand = {
        intent: 'MEDICINES',
        rawText,
        assistantReply: 'Opening your daily medicines schedule.',
        actionSummary: 'Navigating to Medicines Schedule',
        navigationTarget: 'Medicines',
      };
      this.emitVoiceEvents(seniorId, 'VOICE_MEDICATION_REQUEST', rawText, result);
      return result;
    }

    // 3. Medicine Reminder
    if (
      text.includes('remind me') ||
      text.includes('medicine reminder') ||
      text.includes('remind me to take my medicine')
    ) {
      const result: ProcessedVoiceCommand = {
        intent: 'MEDICINE_REMINDER',
        rawText,
        assistantReply: 'Got it! I have set a reminder for your medicine.',
        actionSummary: 'Medicine Reminder Created',
        navigationTarget: 'Medicines',
        reminderDetails: { time: '08:00 PM' },
      };
      this.emitVoiceEvents(seniorId, 'VOICE_MEDICATION_REQUEST', rawText, result);
      return result;
    }

    // 4. Call Family
    if (text.includes('call') || text.includes('daughter') || text.includes('son') || text.includes('sarah')) {
      const result: ProcessedVoiceCommand = {
        intent: 'CALL_FAMILY',
        rawText,
        assistantReply: 'Calling your daughter Sarah Vance ((555) 234-5678)...',
        actionSummary: 'Initiated Call to Sarah Vance',
        contactToCall: { name: 'Sarah Vance', phone: '(555) 234-5678' },
      };
      this.emitVoiceEvents(seniorId, 'VOICE_COMMAND_RECOGNIZED', rawText, result);
      return result;
    }

    // 5. What do I need to do today? (Daily Status)
    if (
      text.includes('what do i need to do') ||
      text.includes('today') ||
      text.includes('summary') ||
      text.includes('tasks')
    ) {
      const result: ProcessedVoiceCommand = {
        intent: 'DAILY_STATUS',
        rawText,
        assistantReply: "Today you have 1 pending medicine scheduled for 8:00 PM and your caregiver Sarah visits at 2:30 PM.",
        actionSummary: 'Displayed Senior Daily Summary',
        navigationTarget: 'SeniorHome',
      };
      this.emitVoiceEvents(seniorId, 'VOICE_COMMAND_RECOGNIZED', rawText, result);
      return result;
    }

    // Default Unknown
    const fallbackResult: ProcessedVoiceCommand = {
      intent: 'UNKNOWN',
      rawText,
      assistantReply: `Pardon me, I didn't recognize "${rawText}". Try saying "Show my medicines" or "I need help".`,
      actionSummary: 'Unrecognized Command',
    };
    this.emitVoiceEvents(seniorId, 'VOICE_COMMAND_RECOGNIZED', rawText, fallbackResult);
    return fallbackResult;
  }

  private static emitVoiceEvents(
    seniorId: string,
    eventType: 'VOICE_COMMAND_RECOGNIZED' | 'VOICE_MEDICATION_REQUEST' | 'VOICE_HELP_REQUEST',
    rawText: string,
    result: ProcessedVoiceCommand
  ): SeniorEvent {
    const event: SeniorEvent = {
      id: `voice-${Date.now()}`,
      seniorId,
      eventType,
      timestamp: new Date().toISOString(),
      payload: {
        rawText,
        commandType: result.intent,
        intentResolved: result.intent,
        actionTaken: result.actionSummary,
      },
    };
    return seniorEventService.emit(event);
  }
}
