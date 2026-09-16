import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme/theme';

interface SeniorButtonProps {
  title: string;
  subtitle?: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: 'primary' | 'secondary' | 'sos' | 'success' | 'outline';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const SeniorButton: React.FC<SeniorButtonProps> = ({
  title,
  subtitle,
  onPress,
  icon,
  variant = 'primary',
  style,
  textStyle,
}) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'sos':
        return theme.colors.sosRed;
      case 'secondary':
        return '#334155';
      case 'success':
        return theme.colors.statusTaken;
      case 'outline':
        return 'transparent';
      case 'primary':
      default:
        return theme.colors.seniorPrimary;
    }
  };

  const getTextColor = () => {
    if (variant === 'outline') return theme.colors.seniorPrimary;
    return '#FFFFFF';
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: getBackgroundColor() },
        variant === 'outline' && styles.outlineBorder,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.contentRow}>
        {icon && (
          <View style={styles.iconWrapper}>
            <Ionicons name={icon} size={32} color={getTextColor()} />
          </View>
        )}
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: getTextColor() }, textStyle]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: variant === 'outline' ? theme.colors.textMuted : 'rgba(255,255,255,0.85)' }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: theme.touchTargets.seniorButtonHeight,
    borderRadius: theme.borderRadius.medium,
    paddingHorizontal: 20,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  outlineBorder: {
    borderWidth: 3,
    borderColor: theme.colors.seniorPrimary,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  iconWrapper: {
    marginRight: 14,
  },
  textContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  title: {
    fontSize: theme.typography.seniorSubheader.fontSize,
    fontWeight: theme.typography.seniorSubheader.fontWeight,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 2,
  },
});
