import { seniorEventService } from '../../services/senior/eventService';
import { SeniorEvent, MedicineEventPayload } from '../../types/events';

export const emitMedicineTaken = (
  seniorId: string,
  medicineId: string,
  medicineName: string,
  dosage: string,
  scheduledTime: string
): SeniorEvent => {
  const payload: MedicineEventPayload = {
    medicineId,
    medicineName,
    dosage,
    scheduledTime,
  };
  const event: SeniorEvent = {
    id: `med-taken-${Date.now()}`,
    seniorId,
    eventType: 'MEDICINE_TAKEN',
    timestamp: new Date().toISOString(),
    payload,
  };
  return seniorEventService.emit(event);
};

export const emitMedicineSkipped = (
  seniorId: string,
  medicineId: string,
  medicineName: string,
  dosage: string,
  scheduledTime: string,
  reason?: string
): SeniorEvent => {
  const payload: MedicineEventPayload = {
    medicineId,
    medicineName,
    dosage,
    scheduledTime,
    reason,
  };
  const event: SeniorEvent = {
    id: `med-skipped-${Date.now()}`,
    seniorId,
    eventType: 'MEDICINE_SKIPPED',
    timestamp: new Date().toISOString(),
    payload,
  };
  return seniorEventService.emit(event);
};

export const emitMedicineMissed = (
  seniorId: string,
  medicineId: string,
  medicineName: string,
  dosage: string,
  scheduledTime: string
): SeniorEvent => {
  const payload: MedicineEventPayload = {
    medicineId,
    medicineName,
    dosage,
    scheduledTime,
  };
  const event: SeniorEvent = {
    id: `med-missed-${Date.now()}`,
    seniorId,
    eventType: 'MEDICINE_MISSED',
    timestamp: new Date().toISOString(),
    payload,
  };
  return seniorEventService.emit(event);
};
