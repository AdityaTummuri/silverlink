export type UserRole = 'senior' | 'caregiver';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  photoUrl?: string;
  seniorUid?: string; // If role is caregiver, points to senior user
  caregiverPhone?: string; // If role is senior, points to caregiver's phone
}

export type MedicineStatus = 'pending' | 'taken' | 'missed';
export type TimeOfDay = 'Morning' | 'Afternoon' | 'Evening' | 'Night';

export interface Medication {
  id: string;
  seniorUid: string;
  name: string;
  dosage: string; // e.g. "1 Tablet", "10mg"
  scheduledTime: string; // e.g. "08:00 AM"
  timeOfDay: TimeOfDay;
  frequency: string; // e.g. "Daily", "Every 12 hours"
  instructions: string; // e.g. "Take with food & full glass of water"
  status: MedicineStatus;
  lastTakenTime?: string;
  pillColor?: string;
  icon?: string;
}

export type MoodRating = 'good' | 'okay' | 'bad';

export interface DailyCheckIn {
  id: string;
  seniorUid: string;
  timestamp: string; // ISO String
  dateString: string; // e.g. "2026-09-16"
  mood: MoodRating;
  note?: string;
  symptoms?: string[];
}

export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';
export type AlertType = 'sos' | 'missed_medicine' | 'poor_checkin' | 'battery_low';

export interface CaregiverAlert {
  id: string;
  seniorUid: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
  acknowledgedAt?: string;
}

export interface FamilyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  photoUrl: string;
  isPrimary: boolean;
  canVideoCall?: boolean;
}

export interface SeniorStatus {
  lastActiveTime: string;
  isSafeAtHome: boolean;
  batteryLevel: number;
  locationName: string;
}
