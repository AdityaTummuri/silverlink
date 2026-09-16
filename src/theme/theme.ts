export const theme = {
  colors: {
    // Primary palette
    seniorPrimary: '#0F766E', // Warm Teal - accessible, trustworthy
    seniorPrimaryDark: '#115E59',
    seniorPrimaryLight: '#CCFBF1',
    seniorAccent: '#D97706', // Warm Amber
    
    // Emergency palette
    sosRed: '#DC2626',
    sosRedDark: '#991B1B',
    sosRedLight: '#FEE2E2',

    // Caregiver palette
    caregiverPrimary: '#2563EB', // Modern Indigo / Blue
    caregiverBackground: '#F8FAFC',
    caregiverCard: '#FFFFFF',

    // Status colors
    statusTaken: '#10B981', // Emerald
    statusTakenBg: '#D1FAE5',
    statusPending: '#F59E0B', // Amber
    statusPendingBg: '#FEF3C7',
    statusMissed: '#EF4444', // Red
    statusMissedBg: '#FEE2E2',

    // Neutral colors - High contrast for Senior UI
    textDark: '#0F172A',
    textMuted: '#475569',
    textLight: '#F8FAFC',
    bgLight: '#F1F5F9',
    bgWhite: '#FFFFFF',
    border: '#CBD5E1',
    borderDark: '#94A3B8',
  },

  // Senior Accessibility Typography
  typography: {
    seniorHeader: {
      fontSize: 32,
      fontWeight: 'bold' as const,
      lineHeight: 40,
    },
    seniorSubheader: {
      fontSize: 24,
      fontWeight: '700' as const,
      lineHeight: 32,
    },
    seniorBodyLarge: {
      fontSize: 22,
      fontWeight: '600' as const,
      lineHeight: 30,
    },
    seniorBody: {
      fontSize: 20,
      fontWeight: '500' as const,
      lineHeight: 28,
    },
    seniorButtonText: {
      fontSize: 24,
      fontWeight: 'bold' as const,
      lineHeight: 32,
    },

    // Caregiver Typography
    caregiverTitle: {
      fontSize: 24,
      fontWeight: 'bold' as const,
    },
    caregiverHeader: {
      fontSize: 18,
      fontWeight: '600' as const,
    },
    caregiverBody: {
      fontSize: 15,
      fontWeight: '400' as const,
    },
    caregiverCaption: {
      fontSize: 13,
      fontWeight: '400' as const,
    }
  },

  // Touch Targets (Senior targets >= 64px height)
  touchTargets: {
    seniorButtonHeight: 68,
    seniorIconButtonSize: 64,
    minTargetHeight: 54,
  },

  borderRadius: {
    small: 12,
    medium: 20,
    large: 28,
    full: 9999,
  }
};
