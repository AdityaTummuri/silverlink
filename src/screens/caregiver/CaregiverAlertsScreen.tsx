import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { theme } from '../../theme/theme';

export const CaregiverAlertsScreen: React.FC = () => {
  const { alerts, acknowledgeAlert } = useApp();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Alerts & Notifications</Text>
      <Text style={styles.sub}>Safety alerts, missed dose notifications, and SOS dispatches</Text>

      {alerts.map(alert => (
        <View
          key={alert.id}
          style={[
            styles.alertCard,
            alert.severity === 'critical' && styles.cardCritical,
            alert.acknowledged && styles.cardAcknowledged,
          ]}
        >
          <View style={styles.alertHeaderRow}>
            <Ionicons
              name={
                alert.type === 'sos' ? 'alarm' :
                alert.type === 'missed_medicine' ? 'time' : 'heart'
              }
              size={24}
              color={alert.acknowledged ? '#64748B' : alert.severity === 'critical' ? '#DC2626' : '#D97706'}
            />
            <Text style={[styles.alertTitle, alert.acknowledged && styles.textMuted]}>
              {alert.title}
            </Text>
            <View style={[
              styles.severityChip,
              { backgroundColor: alert.acknowledged ? '#E2E8F0' : alert.severity === 'critical' ? '#FEE2E2' : '#FEF3C7' }
            ]}>
              <Text style={[
                styles.severityText,
                { color: alert.acknowledged ? '#64748B' : alert.severity === 'critical' ? '#991B1B' : '#92400E' }
              ]}>
                {alert.acknowledged ? 'RESOLVED' : alert.severity.toUpperCase()}
              </Text>
            </View>
          </View>

          <Text style={[styles.alertMessage, alert.acknowledged && styles.textMuted]}>
            {alert.message}
          </Text>

          <View style={styles.alertFooter}>
            <Text style={styles.timestampText}>
              Logged at {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
            {!alert.acknowledged ? (
              <TouchableOpacity
                style={styles.ackBtn}
                onPress={() => acknowledgeAlert(alert.id)}
              >
                <Text style={styles.ackBtnText}>Mark Acknowledged</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.ackLabel}>✓ Acknowledged</Text>
            )}
          </View>
        </View>
      ))}
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  sub: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 16,
  },
  alertCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.medium,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#F59E0B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardCritical: {
    borderLeftColor: '#DC2626',
    backgroundColor: '#FEF2F2',
  },
  cardAcknowledged: {
    borderLeftColor: '#94A3B8',
    backgroundColor: '#FAFAFA',
  },
  alertHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    marginLeft: 10,
    flex: 1,
  },
  textMuted: {
    color: '#64748B',
  },
  severityChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  severityText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  alertMessage: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
    marginTop: 2,
  },
  alertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  timestampText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  ackBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  ackBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  ackLabel: {
    color: '#10B981',
    fontWeight: 'bold',
    fontSize: 13,
  },
});
