import { seniorEventService } from '../../services/senior/eventService';
import { SeniorEvent, CheckInEventPayload } from '../../types/events';

export type CheckInResponse = 'GOOD' | 'OKAY' | 'NOT_WELL';

export const mapMoodToResponse = (mood: 'good' | 'okay' | 'bad'): CheckInResponse => {
  if (mood === 'good') return 'GOOD';
  if (mood === 'okay') return 'OKAY';
  return 'NOT_WELL';
};

export const emitCheckInCompleted = (
  seniorId: string,
  mood: 'good' | 'okay' | 'bad',
  note?: string,
  symptoms?: string[]
): SeniorEvent => {
  const response = mapMoodToResponse(mood);
  const payload: CheckInEventPayload = {
    response,
    mood,
    note,
    symptoms,
  };

  const event: SeniorEvent = {
    id: `checkin-${Date.now()}`,
    seniorId,
    eventType: 'CHECKIN_COMPLETED',
    timestamp: new Date().toISOString(),
    payload,
  };

  return seniorEventService.emit(event);
};
