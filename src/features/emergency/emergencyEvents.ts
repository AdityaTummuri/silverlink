import { seniorEventService } from '../../services/senior/eventService';
import { SeniorEvent, SosTriggeredPayload } from '../../types/events';

export type EmergencyState = 'IDLE' | 'CONFIRMING' | 'ACTIVE' | 'RESOLVED';

export interface EmergencyStatus {
  state: EmergencyState;
  sosId?: string;
  activeSince?: string;
  customMessage?: string;
}

class EmergencyService {
  private status: EmergencyStatus = { state: 'IDLE' };
  private listeners: Set<(status: EmergencyStatus) => void> = new Set();

  public getStatus(): EmergencyStatus {
    return this.status;
  }

  public subscribe(listener: (status: EmergencyStatus) => void): () => void {
    this.listeners.add(listener);
    listener(this.status);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.status));
  }

  public createEmergencyEvent(
    seniorId: string = 'senior_eleanor_1',
    customMessage?: string,
    source: 'manual_button' | 'voice_command' | 'wellbeing_check_escalation' = 'manual_button'
  ): SeniorEvent {
    const sosId = `sos-${Date.now()}`;
    const timestamp = new Date().toISOString();

    const payload: SosTriggeredPayload = {
      sosId,
      customMessage: customMessage || 'Senior pressed Emergency SOS and confirmed request for help.',
      locationName: 'Home - Oakridge Residence',
      source,
    };

    const event: SeniorEvent = {
      id: `evt-sos-${Date.now()}`,
      seniorId,
      eventType: 'SOS_TRIGGERED',
      timestamp,
      payload,
    };

    // Emit event for Person 2 & Firebase sync
    seniorEventService.emit(event);

    // Set state to ACTIVE
    this.status = {
      state: 'ACTIVE',
      sosId,
      activeSince: timestamp,
      customMessage: payload.customMessage,
    };
    this.notify();

    return event;
  }

  public resolveEmergencyEvent(sosId?: string): void {
    this.status = { state: 'RESOLVED' };
    this.notify();

    // Reset to IDLE after 2 seconds
    setTimeout(() => {
      this.status = { state: 'IDLE' };
      this.notify();
    }, 2000);
  }

  public setConfirming(): void {
    this.status = { state: 'CONFIRMING' };
    this.notify();
  }

  public resetToIdle(): void {
    this.status = { state: 'IDLE' };
    this.notify();
  }
}

export const emergencyService = new EmergencyService();

export const emitSosTriggered = (
  seniorId: string,
  customMessage?: string,
  source: 'manual_button' | 'voice_command' | 'wellbeing_check_escalation' = 'manual_button'
): SeniorEvent => {
  return emergencyService.createEmergencyEvent(seniorId, customMessage, source);
};
