import { seniorEventService } from '../../services/senior/eventService';
import {
  SeniorEvent,
  RoutineProfile,
  RoutineDeviationSeverity,
  RoutineDeviationPayload,
  WellbeingCheckPayload,
  WellbeingResolvedPayload,
  WellbeingHelpRequestedPayload,
} from '../../types/events';

export interface SilverPulseState {
  routineStatus: 'NORMAL' | 'DEVIATION_DETECTED';
  severity: RoutineDeviationSeverity;
  activeDeviationId?: string;
  reason?: string;
  wellbeingCheckActive: boolean;
  promptMessage?: string;
  lastEvaluated: string;
}

export class SilverPulseService {
  private seniorId: string = 'senior_eleanor_1';

  private profile: RoutineProfile = {
    seniorId: 'senior_eleanor_1',
    checkInWindow: {
      expectedHour: 9, // 9:00 AM
      toleranceMinutes: 30, // By 9:30 AM
    },
    medicationWindows: [
      {
        medicationId: 'med_1',
        medicationName: 'Morning Medicine (Lisinopril)',
        expectedTime: '08:00 AM',
        toleranceMinutes: 45,
      },
      {
        medicationId: 'med_2',
        medicationName: 'Afternoon Medicine (Metformin)',
        expectedTime: '01:00 PM',
        toleranceMinutes: 60,
      },
      {
        medicationId: 'med_3',
        medicationName: 'Evening Medicine (Calcium + D3)',
        expectedTime: '08:00 PM',
        toleranceMinutes: 60,
      },
    ],
    activityHistory: [],
    lastUpdated: new Date().toISOString(),
  };

  private currentState: SilverPulseState = {
    routineStatus: 'NORMAL',
    severity: 'NORMAL',
    wellbeingCheckActive: false,
    lastEvaluated: new Date().toISOString(),
  };

  private listeners: Set<(state: SilverPulseState) => void> = new Set();

  constructor(seniorId: string = 'senior_eleanor_1') {
    this.seniorId = seniorId;
  }

  public getRoutineProfile(): RoutineProfile {
    return this.profile;
  }

  public getCurrentState(): SilverPulseState {
    return this.currentState;
  }

  public subscribe(listener: (state: SilverPulseState) => void): () => void {
    this.listeners.add(listener);
    listener(this.currentState);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.currentState));
  }

  /**
   * Rule-based Routine Evaluation Engine
   */
  public evaluateCurrentRoutine(
    hasTodayCheckIn: boolean,
    missedMedCount: number,
    isSosActive: boolean
  ): SilverPulseState {
    // Rule 4: If SOS is already active, do not generate duplicate routine deviation alerts.
    if (isSosActive) {
      this.currentState = {
        routineStatus: 'NORMAL',
        severity: 'NORMAL',
        wellbeingCheckActive: false,
        lastEvaluated: new Date().toISOString(),
      };
      this.notify();
      return this.currentState;
    }

    // Rule 3: Multiple deviations
    if (!hasTodayCheckIn && missedMedCount > 0) {
      return this.triggerDeviation(
        'multiple',
        'HIGH',
        "Morning check-in and scheduled medication are both outside the senior's usual activity window."
      );
    }

    // Rule 1: Missing check-in
    if (!hasTodayCheckIn) {
      return this.triggerDeviation(
        'checkin',
        'MODERATE',
        "Morning check-in is outside the senior's usual activity window (expected by 9:30 AM)."
      );
    }

    // Rule 2: Missed medication
    if (missedMedCount > 0) {
      return this.triggerDeviation(
        'medication',
        'LOW',
        `Scheduled medication confirmation has passed the normal grace period.`
      );
    }

    // Routine Normal
    this.currentState = {
      routineStatus: 'NORMAL',
      severity: 'NORMAL',
      wellbeingCheckActive: false,
      lastEvaluated: new Date().toISOString(),
    };
    this.notify();
    return this.currentState;
  }

  /**
   * Trigger a transparent routine deviation & WELLBEING_CHECK_REQUIRED state
   */
  public triggerDeviation(
    targetType: 'checkin' | 'medication' | 'activity' | 'multiple',
    severity: RoutineDeviationSeverity,
    reason: string
  ): SilverPulseState {
    const deviationId = `dev-${Date.now()}`;
    const timestamp = new Date().toISOString();

    // 1. Emit ROUTINE_DEVIATION event
    const devPayload: RoutineDeviationPayload = {
      deviationId,
      targetEventType: targetType,
      expectedTime: '09:00 AM',
      observedTime: null,
      severity,
      reason,
    };

    const devEvent: SeniorEvent = {
      id: `evt-dev-${Date.now()}`,
      seniorId: this.seniorId,
      eventType: 'ROUTINE_DEVIATION',
      timestamp,
      payload: devPayload,
    };
    seniorEventService.emit(devEvent);

    // 2. Emit WELLBEING_CHECK_REQUIRED event
    const promptMessage = "We haven't heard from you as usual. Are you okay?";
    const wellbeingPayload: WellbeingCheckPayload = {
      deviationId,
      prompt: promptMessage,
      status: 'pending',
      severity,
      reason,
    };

    const wbEvent: SeniorEvent = {
      id: `evt-wb-${Date.now()}`,
      seniorId: this.seniorId,
      eventType: 'WELLBEING_CHECK_REQUIRED',
      timestamp,
      payload: wellbeingPayload,
    };
    seniorEventService.emit(wbEvent);

    // Update state
    this.currentState = {
      routineStatus: 'DEVIATION_DETECTED',
      severity,
      activeDeviationId: deviationId,
      reason,
      wellbeingCheckActive: true,
      promptMessage,
      lastEvaluated: timestamp,
    };
    this.notify();

    return this.currentState;
  }

  /**
   * Senior selects "I'm okay" -> Resolves wellbeing check & emits WELLBEING_CHECK_RESOLVED
   */
  public resolveSeniorIsOkay(): void {
    const deviationId = this.currentState.activeDeviationId || `dev-${Date.now()}`;
    const timestamp = new Date().toISOString();

    const resolvedPayload: WellbeingResolvedPayload = {
      deviationId: `res-${Date.now()}`,
      originalDeviationId: deviationId,
      status: 'resolved_okay',
    };

    const event: SeniorEvent = {
      id: `evt-res-${Date.now()}`,
      seniorId: this.seniorId,
      eventType: 'WELLBEING_CHECK_RESOLVED',
      timestamp,
      payload: resolvedPayload,
    };
    seniorEventService.emit(event);

    this.currentState = {
      routineStatus: 'NORMAL',
      severity: 'NORMAL',
      wellbeingCheckActive: false,
      lastEvaluated: timestamp,
    };
    this.notify();
  }

  /**
   * Senior selects "I need help" -> Emits WELLBEING_HELP_REQUESTED
   */
  public resolveSeniorNeedsHelp(): void {
    const deviationId = this.currentState.activeDeviationId || `dev-${Date.now()}`;
    const timestamp = new Date().toISOString();

    const helpPayload: WellbeingHelpRequestedPayload = {
      deviationId,
      status: 'escalated_help',
    };

    const event: SeniorEvent = {
      id: `evt-help-${Date.now()}`,
      seniorId: this.seniorId,
      eventType: 'WELLBEING_HELP_REQUESTED',
      timestamp,
      payload: helpPayload,
    };
    seniorEventService.emit(event);

    this.currentState = {
      routineStatus: 'NORMAL',
      severity: 'NORMAL',
      wellbeingCheckActive: false,
      lastEvaluated: timestamp,
    };
    this.notify();
  }

  /**
   * Reset routine to normal (for demo testing)
   */
  public resetToNormal(): void {
    this.currentState = {
      routineStatus: 'NORMAL',
      severity: 'NORMAL',
      wellbeingCheckActive: false,
      lastEvaluated: new Date().toISOString(),
    };
    this.notify();
  }
}

export const silverPulseService = new SilverPulseService('senior_eleanor_1');
