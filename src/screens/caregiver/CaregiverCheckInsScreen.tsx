import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { theme } from '../../theme/theme';

export const CaregiverCheckInsScreen: React.FC = () => {
  const { checkIns } = useApp();

  const goodCount = checkIns.filter(c => c.mood === 'good').length;
  const okayCount = checkIns.filter(c => c.mood === 'okay').length;
  const badCount = checkIns.filter(c => c.mood === 'bad').length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Senior Wellness Logs</Text>
      <Text style={styles.sub}>Check-in history & mood trends for Eleanor Vance</Text>

      {/* Mood Summary Trend Card */}
      <View style={styles.trendCard}>
        <Text style={styles.cardHeading}>Mood Overview (Recent Logs)</Text>
        <View style={styles.trendGrid}>
          <View style={[styles.trendBox, { backgroundColor: '#D1FAE5' }]}>
            <Text style={styles.trendEmoji}>😊</Text>
            <Text style={[styles.trendCount, { color: '#065F46' }]}>{goodCount}</Text>
            <Text style={[styles.trendLabel, { color: '#065F46' }]}>Good Days</Text>
          </View>

          <View style={[styles.trendBox, { backgroundColor: '#FEF3C7' }]}>
            <Text style={styles.trendEmoji}>😐</Text>
            <Text style={[styles.trendCount, { color: '#92400E' }]}>{okayCount}</Text>
            <Text style={[styles.trendLabel, { color: '#92400E' }]}>Okay Days</Text>
          </View>

          <View style={[styles.trendBox, { backgroundColor: '#FEE2E2' }]}>
            <Text style={styles.trendEmoji}>😟</Text>
            <Text style={[styles.trendCount, { color: '#991B1B' }]}>{badCount}</Text>
            <Text style={[styles.trendLabel, { color: '#991B1B' }]}>Unwell Days</Text>
          </View>
        </View>
      </View>

      {/* Check-in History Timeline */}
      <Text style={styles.sectionTitle}>Check-In Timeline</Text>
      {checkIns.map(item => (
        <View key={item.id} style={styles.logCard}>
          <View style={styles.logHeader}>
            <Text style={styles.logEmoji}>
              {item.mood === 'good' ? '😊' : item.mood === 'okay' ? '😐' : '😟'}
            </Text>
            <View style={styles.logTextCol}>
              <Text style={styles.logMoodTitle}>
                {item.mood === 'good' ? 'Feeling Good' : item.mood === 'okay' ? 'Feeling Okay' : 'Not Feeling Well'}
              </Text>
              <Text style={styles.logDate}>{item.dateString} • {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </View>
          </View>

          {item.symptoms && item.symptoms.length > 0 ? (
            <View style={styles.symptomsRow}>
              {item.symptoms.map(s => (
                <View key={s} style={styles.symptomChip}>
                  <Text style={styles.symptomText}>{s}</Text>
                </View>
              ))}
            </View>
          ) : null}

          {item.note ? (
            <View style={styles.noteBox}>
              <Ionicons name="chatbox-ellipses-outline" size={16} color="#64748B" />
              <Text style={styles.noteText}>"{item.note}"</Text>
            </View>
          ) : null}
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
  trendCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.medium,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 12,
  },
  trendGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  trendBox: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  trendEmoji: {
    fontSize: 28,
  },
  trendCount: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
  },
  trendLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 12,
  },
  logCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.medium,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logEmoji: {
    fontSize: 38,
    marginRight: 14,
  },
  logTextCol: {
    flex: 1,
  },
  logMoodTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  logDate: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  symptomsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  symptomChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  symptomText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  noteText: {
    fontSize: 14,
    color: '#334155',
    fontStyle: 'italic',
    flex: 1,
  },
});
