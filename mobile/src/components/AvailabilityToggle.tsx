import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, shadows } from '../theme';

interface AvailabilityToggleProps {
  isAvailable: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export const AvailabilityToggle = ({
  isAvailable,
  onToggle,
  disabled = false,
}: AvailabilityToggleProps) => {
  return (
    <TouchableOpacity
      onPress={onToggle}
      disabled={disabled}
      activeOpacity={0.9}
      style={[styles.container, disabled && styles.disabled]}
    >
      <LinearGradient
        colors={isAvailable ? (gradients.available as [string, string]) : ['#6b7280', '#4b5563']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Pulse Animation Background */}
        {isAvailable && (
          <View style={styles.pulseContainer}>
            <View style={[styles.pulse, styles.pulse1]} />
            <View style={[styles.pulse, styles.pulse2]} />
          </View>
        )}

        {/* Main Content */}
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={isAvailable ? 'radio-button-on' : 'radio-button-off'}
              size={32}
              color="#fff"
            />
          </View>
          
          <View style={styles.textContainer}>
            <Text style={styles.statusText}>
              {isAvailable ? 'AVAILABLE NOW' : 'NOT AVAILABLE'}
            </Text>
            <Text style={styles.subtitleText}>
              {isAvailable
                ? 'Clients can find you on the map'
                : 'Tap to go online'}
            </Text>
          </View>

          <View style={styles.toggleIndicator}>
            <View style={[
              styles.toggleDot,
              isAvailable ? styles.toggleDotOn : styles.toggleDotOff
            ]} />
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    overflow: 'hidden',
    ...shadows.lg,
  },
  disabled: {
    opacity: 0.7,
  },
  gradient: {
    padding: 24,
    position: 'relative',
  },
  pulseContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulse: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  pulse1: {
    transform: [{ scale: 1 }],
  },
  pulse2: {
    transform: [{ scale: 1.3 }],
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    zIndex: 1,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  statusText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
  },
  subtitleText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  toggleIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  toggleDotOn: {
    backgroundColor: '#fff',
  },
  toggleDotOff: {
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
});
