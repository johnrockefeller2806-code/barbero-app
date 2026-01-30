import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { colors, gradients } from '../../theme';

const { width } = Dimensions.get('window');

export const BarberHomeScreen = ({ navigation }: any) => {
  const { user, logout } = useAuth();
  const [isAvailable, setIsAvailable] = useState(false);

  const todayStats = {
    earnings: 245,
    clients: 8,
    rating: 4.9,
    pending: 3,
  };

  const upcomingBookings = [
    { id: '1', client: 'John D.', service: 'Fade + Beard', time: '10:30 AM', price: 35 },
    { id: '2', client: 'Mike S.', service: 'Haircut', time: '11:15 AM', price: 25 },
    { id: '3', client: 'Tom B.', service: 'Premium Cut', time: '12:00 PM', price: 40 },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Background */}
      <LinearGradient
        colors={['#0a0a0f', '#12121a', '#1a1a24']}
        style={StyleSheet.absoluteFill}
      />

      {/* Glow Effects */}
      <View style={styles.glowContainer}>
        <View style={[styles.glow, isAvailable ? styles.glowGreen : styles.glowPurple]} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0]} ✂️</Text>
            <Text style={styles.shopName}>{user?.shop_name || 'Your Shop'}</Text>
          </View>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* AVAILABILITY TOGGLE - Main Feature */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setIsAvailable(!isAvailable)}
          style={styles.availabilityCard}
        >
          <LinearGradient
            colors={isAvailable ? ['#00ff88', '#00d4aa'] : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.availabilityGradient}
          >
            {/* Pulse Animation Ring */}
            {isAvailable && (
              <>
                <View style={[styles.pulseRing, styles.pulseRing1]} />
                <View style={[styles.pulseRing, styles.pulseRing2]} />
              </>
            )}

            <View style={styles.availabilityContent}>
              <View style={styles.availabilityLeft}>
                <View style={[
                  styles.statusIcon,
                  isAvailable ? styles.statusIconActive : styles.statusIconInactive
                ]}>
                  <Ionicons
                    name={isAvailable ? 'radio-button-on' : 'radio-button-off'}
                    size={32}
                    color={isAvailable ? '#0a0a0f' : '#fff'}
                  />
                </View>
                <View>
                  <Text style={[
                    styles.availabilityStatus,
                    isAvailable && styles.availabilityStatusActive
                  ]}>
                    {isAvailable ? 'AVAILABLE NOW' : 'OFFLINE'}
                  </Text>
                  <Text style={[
                    styles.availabilitySubtext,
                    isAvailable && styles.availabilitySubtextActive
                  ]}>
                    {isAvailable
                      ? 'Clients can find you on the map'
                      : 'Tap to go online and receive bookings'}
                  </Text>
                </View>
              </View>

              <View style={[
                styles.toggleIndicator,
                isAvailable && styles.toggleIndicatorActive
              ]}>
                <View style={[
                  styles.toggleDot,
                  isAvailable && styles.toggleDotActive
                ]} />
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Today's Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Today's Performance</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <LinearGradient
                colors={['rgba(0, 255, 136, 0.15)', 'rgba(0, 255, 136, 0.05)']}
                style={styles.statCardGradient}
              >
                <Ionicons name="cash" size={24} color="#00ff88" />
                <Text style={styles.statValue}>€{todayStats.earnings}</Text>
                <Text style={styles.statLabel}>Earnings</Text>
              </LinearGradient>
            </View>
            <View style={styles.statCard}>
              <LinearGradient
                colors={['rgba(124, 58, 237, 0.15)', 'rgba(124, 58, 237, 0.05)']}
                style={styles.statCardGradient}
              >
                <Ionicons name="people" size={24} color="#a855f7" />
                <Text style={styles.statValue}>{todayStats.clients}</Text>
                <Text style={styles.statLabel}>Clients</Text>
              </LinearGradient>
            </View>
            <View style={styles.statCard}>
              <LinearGradient
                colors={['rgba(251, 191, 36, 0.15)', 'rgba(251, 191, 36, 0.05)']}
                style={styles.statCardGradient}
              >
                <Ionicons name="star" size={24} color="#fbbf24" />
                <Text style={styles.statValue}>{todayStats.rating}</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </LinearGradient>
            </View>
            <View style={styles.statCard}>
              <LinearGradient
                colors={['rgba(6, 182, 212, 0.15)', 'rgba(6, 182, 212, 0.05)']}
                style={styles.statCardGradient}
              >
                <Ionicons name="time" size={24} color="#22d3ee" />
                <Text style={styles.statValue}>{todayStats.pending}</Text>
                <Text style={styles.statLabel}>Pending</Text>
              </LinearGradient>
            </View>
          </View>
        </View>

        {/* Upcoming Bookings */}
        <View style={styles.bookingsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          {upcomingBookings.map((booking, index) => (
            <View key={booking.id} style={styles.bookingCard}>
              <LinearGradient
                colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)']}
                style={styles.bookingGradient}
              />
              <View style={styles.bookingContent}>
                <View style={styles.bookingTime}>
                  <Text style={styles.timeText}>{booking.time}</Text>
                </View>
                <View style={styles.bookingInfo}>
                  <Text style={styles.clientName}>{booking.client}</Text>
                  <Text style={styles.serviceName}>{booking.service}</Text>
                </View>
                <View style={styles.bookingPrice}>
                  <Text style={styles.priceText}>€{booking.price}</Text>
                </View>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="checkmark" size={20} color="#00ff88" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard}>
              <LinearGradient
                colors={['#7c3aed', '#a855f7']}
                style={styles.actionCardGradient}
              >
                <Ionicons name="calendar" size={28} color="#fff" />
              </LinearGradient>
              <Text style={styles.actionLabel}>Schedule</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <LinearGradient
                colors={['#06b6d4', '#22d3ee']}
                style={styles.actionCardGradient}
              >
                <Ionicons name="pricetag" size={28} color="#fff" />
              </LinearGradient>
              <Text style={styles.actionLabel}>Services</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <LinearGradient
                colors={['#ec4899', '#f472b6']}
                style={styles.actionCardGradient}
              >
                <Ionicons name="stats-chart" size={28} color="#fff" />
              </LinearGradient>
              <Text style={styles.actionLabel}>Analytics</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <LinearGradient
                colors={['#f97316', '#fb923c']}
                style={styles.actionCardGradient}
              >
                <Ionicons name="wallet" size={28} color="#fff" />
              </LinearGradient>
              <Text style={styles.actionLabel}>Earnings</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <LinearGradient
          colors={['rgba(10,10,15,0)', 'rgba(10,10,15,0.9)', 'rgba(10,10,15,1)']}
          style={styles.bottomNavGradient}
        />
        <View style={styles.navBar}>
          <TouchableOpacity style={styles.navItem}>
            <LinearGradient
              colors={['#7c3aed', '#a855f7']}
              style={styles.navItemActive}
            >
              <Ionicons name="home" size={22} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="calendar" size={22} color={colors.gray[500]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="chatbubbles" size={22} color={colors.gray[500]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="wallet" size={22} color={colors.gray[500]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={logout}>
            <Ionicons name="person" size={22} color={colors.gray[500]} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  glowContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    top: -100,
    right: -100,
    opacity: 0.3,
  },
  glowPurple: {
    backgroundColor: '#7c3aed',
  },
  glowGreen: {
    backgroundColor: '#00ff88',
  },
  scrollContent: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  shopName: {
    fontSize: 15,
    color: colors.gray[400],
  },
  settingsButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  availabilityCard: {
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: 24,
  },
  availabilityGradient: {
    padding: 24,
    position: 'relative',
  },
  pulseRing: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginTop: -100,
    marginLeft: -100,
  },
  pulseRing1: {
    transform: [{ scale: 1 }],
  },
  pulseRing2: {
    transform: [{ scale: 1.3 }],
    opacity: 0.5,
  },
  availabilityContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  availabilityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statusIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIconActive: {
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  statusIconInactive: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  availabilityStatus: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
    marginBottom: 4,
  },
  availabilityStatusActive: {
    color: '#0a0a0f',
  },
  availabilitySubtext: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    maxWidth: 180,
  },
  availabilitySubtextActive: {
    color: 'rgba(0,0,0,0.6)',
  },
  toggleIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleIndicatorActive: {
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  toggleDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  toggleDotActive: {
    backgroundColor: '#0a0a0f',
  },
  statsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: (width - 52) / 2,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statCardGradient: {
    padding: 20,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginTop: 12,
  },
  statLabel: {
    fontSize: 13,
    color: colors.gray[400],
    marginTop: 4,
  },
  bookingsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary[400],
  },
  bookingCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  bookingGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  bookingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  bookingTime: {
    backgroundColor: 'rgba(124, 58, 237, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginRight: 14,
  },
  timeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#a855f7',
  },
  bookingInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  serviceName: {
    fontSize: 13,
    color: colors.gray[400],
  },
  bookingPrice: {
    marginRight: 12,
  },
  priceText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#00ff88',
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 255, 136, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionsSection: {
    marginBottom: 24,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    alignItems: 'center',
  },
  actionCardGradient: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray[400],
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomNavGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(18, 18, 26, 0.9)',
    marginHorizontal: 20,
    marginBottom: Platform.OS === 'ios' ? 34 : 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  navItem: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navItemActive: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
