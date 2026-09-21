export type SeniorEventType =
  | 'MEDICINE_TAKEN'
  | 'MEDICINE_SKIPPED'
  | 'MEDICINE_MISSED'
  | 'CHECKIN_COMPLETED'
  | 'ROUTINE_DEVIATION'
  | 'WELLBEING_CHECK_REQUIRED'
  | 'WELLBEING_CHECK_RESOLVED'
  | 'WELLBEING_HELP_REQUESTED'
  | 'SOS_TRIGGERED'
  | 'VOICE_COMMAND_RECOGNIZED'
  | 'VOICE_MEDICATION_REQUEST'
  | 'VOICE_HELP_REQUEST';

export type RoutineDeviationSeverity = 'NORMAL' | 'LOW' | 'MODERATE' | 'HIGH';

export interface RoutineProfile {
  seniorId: string;
  checkInWindow: {
    expectedHour: number; // e.g., 9 for 9:00 AM
    toleranceMinutes: number; // e.g., 30
  };
  medicationWindows: Array<{
    medicationId: string;
    medicationName: string;
    expectedTime: string; // e.g. "08:00 AM"
    toleranceMinutes: number; // e.g. 45
  }>;
  activityHistory: SeniorEvent[];
  lastUpdated: string;
}

export interface BaseSeniorEvent {
  id: string;
  seniorId: string;
  eventType: SeniorEventType;
  timestamp: string; // ISO 8601 string
}

export interface MedicineEventPayload {
  medicineId: string;
  medicineName: string;
  dosage: string;
  scheduledTime: string;
  reason?: string;
}

export interface CheckInEventPayload {
  response: 'GOOD' | 'OKAY' | 'NOT_WELL';
  mood: 'good' | 'okay' | 'bad';
  note?: string;
  symptoms?: string[];
}

export interface RoutineDeviationPayload {
  deviationId: string;
  targetEventType: 'checkin' | 'medication' | 'activity' | 'multiple';
  expectedTime: string;
  observedTime: string | null;
  severity: RoutineDeviationSeverity;
  reason: string;
}

export interface WellbeingCheckPayload {
  deviationId: string;
  prompt: string;
  status: 'pending' | 'resolved_okay' | 'escalated_help';
  resolvedAt?: string;
  severity?: RoutineDeviationSeverity;
  reason?: string;
}

export interface WellbeingResolvedPayload {
  deviationId: string;
  originalDeviationId: string;
  status: 'resolved_okay';
}

export interface WellbeingHelpRequestedPayload {
  deviationId: string;
  status: 'escalated_help';
}

export interface SosTriggeredPayload {
  sosId: string;
  customMessage?: string;
  locationName?: string;
  source: 'manual_button' | 'voice_command' | 'wellbeing_check_escalation';
  status?: 'ACTIVE' | 'RESOLVED';
}

export interface VoiceCommandPayload {
  rawText: string;
  commandType: string;
  intentResolved: string;
  actionTaken: string;
}

export type SeniorEvent =
  | (BaseSeniorEvent & { eventType: 'MEDICINE_TAKEN' | 'MEDICINE_SKIPPED' | 'MEDICINE_MISSED'; payload: MedicineEventPayload })
  | (BaseSeniorEvent & { eventType: 'CHECKIN_COMPLETED'; payload: CheckInEventPayload })
  | (BaseSeniorEvent & { eventType: 'ROUTINE_DEVIATION'; payload: RoutineDeviationPayload })
  | (BaseSeniorEvent & { eventType: 'WELLBEING_CHECK_REQUIRED'; payload: WellbeingCheckPayload })
  | (BaseSeniorEvent & { eventType: 'WELLBEING_CHECK_RESOLVED'; payload: WellbeingResolvedPayload })
  | (BaseSeniorEvent & { eventType: 'WELLBEING_HELP_REQUESTED'; payload: WellbeingHelpRequestedPayload })
  | (BaseSeniorEvent & { eventType: 'SOS_TRIGGERED'; payload: SosTriggeredPayload })
  | (BaseSeniorEvent & { eventType: 'VOICE_COMMAND_RECOGNIZED' | 'VOICE_MEDICATION_REQUEST' | 'VOICE_HELP_REQUEST'; payload: VoiceCommandPayload });

export type SeniorEventListener = (event: SeniorEvent) => void;
