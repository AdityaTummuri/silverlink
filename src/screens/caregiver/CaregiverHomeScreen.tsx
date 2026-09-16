import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { AddMedicineModal } from '../../components/caregiver/AddMedicineModal';
import { theme } from '../../theme/theme';

export const CaregiverHomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const {
    currentUser,
    medications,
    checkIns,
    alerts,
    seniorStatus,
    acknowledgeAlert,
    contacts,
    switchRole,
  } = useApp();

  const [isAddMedModalVisible, setIsAddMedModalVisible] = useState(false);

  const seniorContact = contacts.find(c => c.id === 'contact_1') || contacts[0];
  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);

  const takenMeds = medications.filter(m => m.status === 'taken');
  const adherenceRate = medications.length > 0 ? Math.round((takenMeds.length / medications.length) * 100) : 100;

  const todayCheckIn = checkIns[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Banner */}
      <View style={styles.caregiverHeader}>
        <View style={styles.welcomeTextCol}>
          <Text style={styles.welcomeTitle}>Family Caregiver Dashboard</Text>
          <Text style={styles.welcomeSub}>Monitoring Eleanor Vance</Text>
        </View>
        <TouchableOpacity style={styles.switchChipBtn} onPress={() => switchRole('senior')}>
          <Ionicons name="swap-horizontal" size={18} color="#2563EB" />
          <Text style={styles.switchChipText}>Senior UI</Text>
        </TouchableOpacity>
      </View>

      {/* Active Critical Alerts Notice Banner */}
      {unacknowledgedAlerts.length > 0 ? (
        <View style={styles.alertBannerContainer}>
          <View style={styles.alertBannerHeader}>
            <Ionicons name="warning-sharp" size={24} color="#DC2626" />
            <Text style={styles.alertBannerTitle}>
              {unacknowledgedAlerts.length} Active Alert{unacknowledgedAlerts.length > 1 ? 's' : ''} Requires Attention
            </Text>
          </View>
          {unacknowledgedAlerts.map(alert => (
            <View key={alert.id} style={styles.alertCardItem}>
              <View style={styles.alertTextCol}>
                <Text style={styles.alertItemTitle}>{alert.title}</Text>
                <Text style={styles.alertItemMessage}>{alert.message}</Text>
                <Text style={styles.alertItemTime}>
                  {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.ackBtn}
                onPress={() => acknowledgeAlert(alert.id)}
              >
                <Text style={styles.ackBtnText}>Acknowledge</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.allClearBanner}>
          <Ionicons name="checkmark-circle-sharp" size={24} color="#10B981" />
          <Text style={styles.allClearText}>All status clear. No active emergency alerts.</Text>
        </View>
      )}

      {/* Senior Status Overview Card */}
      <View style={styles.statusOverviewCard}>
        <View style={styles.seniorProfileRow}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80' }}
            style={styles.seniorAvatar}
          />
          <View style={styles.seniorInfoCol}>
            <Text style={styles.seniorName}>Eleanor Vance (Age 78)</Text>
            <View style={styles.locationBadgeRow}>
              <Ionicons name="location" size={16} color="#059669" />
              <Text style={styles.locationBadgeText}>{seniorStatus.locationName}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.callSeniorCircleBtn}
            onPress={() => alert("Calling Eleanor Vance ((555) 123-4567)...")}
          >
            <Ionicons name="call" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.metricsGrid}>
          <View style={styles.metricBox}>
            <Ionicons name="shield-checkmark" size={22} color="#10B981" />
            <Text style={styles.metricLabel}>Geofence</Text>
            <Text style={styles.metricValue}>Safe at Home</Text>
          </View>

          <View style={styles.metricBox}>
            <Ionicons name="battery-charging" size={22} color="#2563EB" />
            <Text style={styles.metricLabel}>Phone Battery</Text>
            <Text style={styles.metricValue}>{seniorStatus.batteryLevel}%</Text>
          </View>

          <View style={styles.metricBox}>
            <Ionicons name="time-outline" size={22} color="#D97706" />
            <Text style={styles.metricLabel}>Last Active</Text>
            <Text style={styles.metricValue}>{seniorStatus.lastActiveTime}</Text>
          </View>
        </View>
      </View>

      {/* Daily Check-In Wellness Summary Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="heart-sharp" size={22} color="#EF4444" />
          <Text style={styles.cardTitle}>Today's Wellness Check-In</Text>
          <TouchableOpacity onPress={() => navigation.navigate('CaregiverCheckIns')}>
            <Text style={styles.viewHistoryText}>History →</Text>
          </TouchableOpacity>
        </View>

        {todayCheckIn ? (
          <View style={styles.checkInDetailBox}>
            <View style={styles.moodBadgeRow}>
              <Text style={styles.largeEmoji}>
                {todayCheckIn.mood === 'good' ? '😊' : todayCheckIn.mood === 'okay' ? '😐' : '😟'}
              </Text>
              <View style={styles.moodTextCol}>
                <Text style={styles.moodTitle}>
                  {todayCheckIn.mood === 'good' ? 'Feeling Good & Energetic' : todayCheckIn.mood === 'okay' ? 'Feeling Okay' : 'Not Feeling Well'}
                </Text>
                <Text style={styles.moodTime}>Logged today at {new Date(todayCheckIn.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
              </View>
            </View>

            {todayCheckIn.note ? (
              <View style={styles.noteBox}>
                <Text style={styles.noteLabel}>Senior Note:</Text>
                <Text style={styles.noteText}>"{todayCheckIn.note}"</Text>
              </View>
            ) : null}
          </View>
        ) : (
          <View style={styles.noCheckInBox}>
            <Ionicons name="time" size={24} color="#D97706" />
            <Text style={styles.noCheckInText}>Check-in pending for today.</Text>
          </View>
        )}
      </View>

      {/* Medication Adherence Progress Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="medical-sharp" size={22} color="#2563EB" />
          <Text style={styles.cardTitle}>Medication Adherence ({adherenceRate}%)</Text>
          <TouchableOpacity onPress={() => setIsAddMedModalVisible(true)}>
            <Text style={styles.addMedLink}>+ Add Med</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${adherenceRate}%` }]} />
        </View>
        <Text style={styles.adherenceSubText}>{takenMeds.length} of {medications.length} scheduled doses confirmed taken</Text>

        <View style={styles.medListPreview}>
          {medications.map(med => (
            <View key={med.id} style={styles.medPreviewRow}>
              <Ionicons
                name={med.status === 'taken' ? 'checkmark-circle' : 'time-outline'}
                size={20}
                color={med.status === 'taken' ? '#10B981' : '#D97706'}
              />
              <Text style={styles.medPreviewName}>{med.name} ({med.dosage})</Text>
              <Text style={styles.medPreviewTime}>{med.scheduledTime}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Add Medicine Modal */}
      <AddMedicineModal
        visible={isAddMedModalVisible}
        onClose={() => setIsAddMedModalVisible(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  caregiverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeTextCol: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  welcomeSub: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  switchChipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  switchChipText: {
    color: '#2563EB',
    fontWeight: 'bold',
    fontSize: 13,
  },
  alertBannerContainer: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: theme.borderRadius.medium,
    padding: 16,
    marginBottom: 16,
  },
  alertBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  alertBannerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  alertCardItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  alertTextCol: {
    flex: 1,
  },
  alertItemTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  alertItemMessage: {
    fontSize: 13,
    color: '#475569',
    marginTop: 2,
  },
  alertItemTime: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },
  ackBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 10,
  },
  ackBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  allClearBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.medium,
    marginBottom: 16,
    gap: 10,
  },
  allClearText: {
    color: '#065F46',
    fontWeight: '600',
    fontSize: 14,
  },
  statusOverviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.medium,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  seniorProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 14,
    marginBottom: 14,
  },
  seniorAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },
  seniorInfoCol: {
    flex: 1,
  },
  seniorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  locationBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  locationBadgeText: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '600',
  },
  callSeniorCircleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  metricBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
    marginTop: 2,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.medium,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#0F172A',
    marginLeft: 8,
    flex: 1,
  },
  viewHistoryText: {
    color: '#2563EB',
    fontWeight: '600',
    fontSize: 14,
  },
  addMedLink: {
    color: '#2563EB',
    fontWeight: 'bold',
    fontSize: 14,
  },
  checkInDetailBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
  },
  moodBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  largeEmoji: {
    fontSize: 36,
    marginRight: 12,
  },
  moodTextCol: {
    flex: 1,
  },
  moodTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  moodTime: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  noteBox: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  noteLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  noteText: {
    fontSize: 14,
    color: '#334155',
    fontStyle: 'italic',
    marginTop: 2,
  },
  noCheckInBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  noCheckInText: {
    color: '#D97706',
    fontWeight: '600',
    fontSize: 15,
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: '#E2E8F0',
    borderRadius: 6,
    overflow: 'hidden',
    marginTop: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 6,
  },
  adherenceSubText: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 6,
    fontWeight: '500',
  },
  medListPreview: {
    marginTop: 14,
    gap: 8,
  },
  medPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
  },
  medPreviewName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
    marginLeft: 8,
  },
  medPreviewTime: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
});
