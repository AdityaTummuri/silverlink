import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, Medication, DailyCheckIn, CaregiverAlert, FamilyContact, SeniorStatus } from '../types';
import { DataService, INITIAL_USER_SENIOR, INITIAL_USER_CAREGIVER } from '../services/dataService';
import { emitCheckInCompleted } from '../features/checkin/checkinEvents';

interface AppContextType {
  currentUser: UserProfile;
  role: UserRole;
  switchRole: (newRole: UserRole) => void;
  medications: Medication[];
  checkIns: DailyCheckIn[];
  alerts: CaregiverAlert[];
  contacts: FamilyContact[];
  seniorStatus: SeniorStatus;
  audioEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;
  highContrast: boolean;
  setHighContrast: (contrast: boolean) => void;
  isSosActive: boolean;
  triggerSos: (message?: string) => void;
  cancelSos: () => void;
  markMedicationTaken: (id: string) => Promise<void>;
  markMedicationSkipped: (id: string, reason?: string) => Promise<void>;
  markMedicationMissed: (id: string) => Promise<void>;
  markMedicationPending: (id: string) => Promise<void>;
  markMedicationStatus: (id: string, status: any) => Promise<void>;
  addMedication: (med: Omit<Medication, 'id' | 'seniorUid' | 'status'>) => Promise<void>;
  activeReminderMed: Medication | null;
  triggerReminderModal: (med: Medication) => void;
  closeReminderModal: () => void;
  submitCheckIn: (mood: 'good' | 'okay' | 'bad', note?: string, symptoms?: string[]) => Promise<void>;
  acknowledgeAlert: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('senior');
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USER_SENIOR);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [checkIns, setCheckIns] = useState<DailyCheckIn[]>([]);
  const [alerts, setAlerts] = useState<CaregiverAlert[]>([]);
  const [contacts, setContacts] = useState<FamilyContact[]>([]);
  const [seniorStatus, setSeniorStatus] = useState<SeniorStatus>({
    lastActiveTime: 'Just now',
    isSafeAtHome: true,
    batteryLevel: 88,
    locationName: 'Home - Oakridge Residence',
  });

  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [isSosActive, setIsSosActive] = useState<boolean>(false);
  const [activeReminderMed, setActiveReminderMed] = useState<Medication | null>(null);

  const loadData = async () => {
    const medsData = await DataService.getMedications();
    const checkInsData = await DataService.getCheckIns();
    const alertsData = await DataService.getAlerts();
    const contactsData = await DataService.getContacts();
    const statusData = await DataService.getSeniorStatus();

    setMedications(medsData);
    setCheckIns(checkInsData);
    setAlerts(alertsData);
    setContacts(contactsData);
    setSeniorStatus(statusData);
  };

  useEffect(() => {
    loadData();
  }, []);

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === 'senior') {
      setCurrentUser(INITIAL_USER_SENIOR);
    } else {
      setCurrentUser(INITIAL_USER_CAREGIVER);
    }
  };

  const markMedicationTaken = async (id: string) => {
    const updated = await DataService.updateMedicationStatus(id, 'taken');
    setMedications(updated);
  };

  const markMedicationSkipped = async (id: string, reason?: string) => {
    const updated = await DataService.updateMedicationStatus(id, 'skipped');
    setMedications(updated);
  };

  const markMedicationMissed = async (id: string) => {
    const updated = await DataService.updateMedicationStatus(id, 'missed');
    setMedications(updated);
  };

  const markMedicationPending = async (id: string) => {
    const updated = await DataService.updateMedicationStatus(id, 'pending');
    setMedications(updated);
  };

  const markMedicationStatus = async (id: string, status: any) => {
    const updated = await DataService.updateMedicationStatus(id, status);
    setMedications(updated);
  };

  const triggerReminderModal = (med: Medication) => {
    setActiveReminderMed(med);
  };

  const closeReminderModal = () => {
    setActiveReminderMed(null);
  };

  const addMedication = async (newMed: Omit<Medication, 'id' | 'seniorUid' | 'status'>) => {
    const updated = await DataService.addMedication(newMed);
    setMedications(updated);
  };

  const submitCheckIn = async (mood: 'good' | 'okay' | 'bad', note?: string, symptoms?: string[]) => {
    const updated = await DataService.addCheckIn({ mood, note, symptoms });
    setCheckIns(updated);

    // Emit senior event CHECKIN_COMPLETED
    emitCheckInCompleted(currentUser.uid, mood, note, symptoms);

    // If mood is bad, generate auto-alert for Caregiver
    if (mood === 'bad') {
      const alertUpdated = await DataService.addAlert({
        type: 'poor_checkin',
        severity: 'high',
        title: 'Senior Reported Feeling Unwell',
        message: `${currentUser.name} logged feeling "Not feeling well"${note ? `: "${note}"` : '.'}`,
      });
      setAlerts(alertUpdated);
    }
  };

  const acknowledgeAlert = async (id: string) => {
    const updated = await DataService.acknowledgeAlert(id);
    setAlerts(updated);
  };

  const triggerSos = async (customMessage?: string) => {
    setIsSosActive(true);
    const alertUpdated = await DataService.addAlert({
      type: 'sos',
      severity: 'critical',
      title: '🚨 EMERGENCY SOS TRIGGERED!',
      message: customMessage || `${INITIAL_USER_SENIOR.name} pressed the Emergency SOS button at ${new Date().toLocaleTimeString()}! Immediate attention required.`,
    });
    setAlerts(alertUpdated);
  };

  const cancelSos = () => {
    setIsSosActive(false);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        role,
        switchRole,
        medications,
        checkIns,
        alerts,
        contacts,
        seniorStatus,
        audioEnabled,
        setAudioEnabled,
        highContrast,
        setHighContrast,
        isSosActive,
        triggerSos,
        cancelSos,
        markMedicationTaken,
        markMedicationSkipped,
        markMedicationMissed,
        markMedicationPending,
        markMedicationStatus,
        addMedication,
        activeReminderMed,
        triggerReminderModal,
        closeReminderModal,
        submitCheckIn,
        acknowledgeAlert,
        refreshData: loadData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
