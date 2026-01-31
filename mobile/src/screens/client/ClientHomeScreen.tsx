import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  Animated,
  StatusBar,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { colors, gradients, shadows } from '../../theme';

const { width, height } = Dimensions.get('window');

interface Barber {
  id: string;
  name: string;
  shop: string;
  rating: number;
  reviews: number;
  distance: string;
  avatar: string;
  available: boolean;
  nextSlot?: string;
  specialties: string[];
  price: number;
}

// Mock Data - Ultra Modern
const MOCK_BARBERS: Barber[] = [
  {
    id: '1',
    name: 'James Murphy',
    shop: 'Fade Factory Dublin',
    rating: 4.9,
    reviews: 324,
    distance: '0.3 km',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    available: true,
    specialties: ['Fade', 'Beard'],
    price: 25,
  },
  {
    id: '2',
    name: "Sean O'Connor",
    shop: 'The Crafted Cut',
    rating: 4.8,
    reviews: 256,
    distance: '0.5 km',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    available: true,
    nextSlot: '10 min',
    specialties: ['Classic', 'Styling'],
    price: 30,
  },
  {
    id: '3',
    name: 'Patrick Kelly',
    shop: 'Precision Barbers',
    rating: 4.7,
    reviews: 189,
    distance: '0.8 km',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    available: false,
    nextSlot: '45 min',
    specialties: ['Skin Fade', 'Design'],
    price: 35,
  },
];

export const ClientHomeScreen = ({ navigation }: any) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [selectedFilter, setSelectedFilter] = useState('available');

  const filters = [
    { id: 'available', label: 'Available Now', icon: 'flash' },
    { id: 'nearby', label: 'Nearby', icon: 'location' },
    { id: 'top', label: 'Top Rated', icon: 'star' },
  ];

  const filteredBarbers = selectedFilter === 'available'
    ? MOCK_BARBERS.filter(b => b.available)
    : MOCK_BARBERS;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={['#0a0a0f', '#12121a', '#1a1a24']}
        style={StyleSheet.absoluteFill}
      />

      {/* Animated Glow Effects */}
      <View style={styles.glowContainer}>
        <View style={[styles.glow, styles.glowPurple]} />
        <View style={[styles.glow, styles.glowCyan]} />
      </View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Good evening ✨</Text>
              <View style={styles.locationRow}>
                <View style={styles.locationDot} />
                <Text style={styles.location}>Dublin, Ireland</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.avatarButton}>
              <LinearGradient
                colors={['#7c3aed', '#a855f7']}
                style={styles.avatarGradient}
              >
                <Text style={styles.avatarText}>JD</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Hero Card */}
          <View style={styles.heroCard}>
            <LinearGradient
              colors={['rgba(124, 58, 237, 0.3)', 'rgba(6, 182, 212, 0.2)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroGradient}
            />
            <View style={styles.heroContent}>
              <View style={styles.heroLeft}>
                <View style={styles.availableBadge}>
                  <View style={styles.pulseDot} />
                  <Text style={styles.availableText}>
                    {MOCK_BARBERS.filter(b => b.available).length} Available Now
                  </Text>
                </View>
                <Text style={styles.heroTitle}>Find your{"\n"}perfect cut</Text>
                <Text style={styles.heroSubtitle}>Book instantly with top barbers</Text>
              </View>
              <View style={styles.heroRight}>
                <TouchableOpacity style={styles.mapButton}>
                  <LinearGradient
                    colors={['#00ff88', '#00d4aa']}
                    style={styles.mapButtonGradient}
                  >
                    <Ionicons name="map" size={24} color="#0a0a0f" />
                  </LinearGradient>
                </TouchableOpacity>
                <Text style={styles.mapText}>View Map</Text>
              </View>
            </View>
          </View>

          {/* Search Bar */}
          <TouchableOpacity style={styles.searchBar}>
            <View style={styles.searchIcon}>
              <Ionicons name="search" size={20} color={colors.gray[400]} />
            </View>
            <Text style={styles.searchPlaceholder}>Search barbers, styles...</Text>
            <View style={styles.searchFilter}>
              <Ionicons name="options" size={18} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              onPress={() => setSelectedFilter(filter.id)}
              style={[
                styles.filterChip,
                selectedFilter === filter.id && styles.filterChipActive,
              ]}
            >
              {selectedFilter === filter.id && (
                <LinearGradient
                  colors={['#7c3aed', '#a855f7']}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              )}
              <Ionicons
                name={filter.icon as any}
                size={16}
                color={selectedFilter === filter.id ? '#fff' : colors.gray[400]}
              />
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter.id && styles.filterTextActive,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Barbers Near You</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {/* Barber Cards */}
        <View style={styles.barbersContainer}>
          {filteredBarbers.map((barber, index) => (
            <TouchableOpacity
              key={barber.id}
              style={styles.barberCard}
              activeOpacity={0.9}
              onPress={() => navigation?.navigate('BarberDetail', { barber })}
            >
              {/* Card Background */}
              <LinearGradient
                colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)']}
                style={styles.cardGradient}
              />
              
              {/* Available Badge */}
              {barber.available && (
                <View style={styles.cardBadge}>
                  <LinearGradient
                    colors={['#00ff88', '#00d4aa']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.cardBadgeGradient}
                  >
                    <View style={styles.badgePulse} />
                    <Text style={styles.cardBadgeText}>AVAILABLE NOW</Text>
                  </LinearGradient>
                </View>
              )}

              <View style={styles.cardContent}>
                {/* Avatar */}
                <View style={styles.cardAvatar}>
                  <Image
                    source={{ uri: barber.avatar }}
                    style={styles.avatarImage}
                  />
                  {barber.available && <View style={styles.onlineIndicator} />}
                </View>

                {/* Info */}
                <View style={styles.cardInfo}>
                  <Text style={styles.cardName}>{barber.name}</Text>
                  <Text style={styles.cardShop}>{barber.shop}</Text>
                  
                  <View style={styles.cardStats}>
                    <View style={styles.statItem}>
                      <Ionicons name="star" size={14} color="#fbbf24" />
                      <Text style={styles.statText}>{barber.rating}</Text>
                      <Text style={styles.statMuted}>({barber.reviews})</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                      <Ionicons name="location" size={14} color={colors.secondary[400]} />
                      <Text style={styles.statText}>{barber.distance}</Text>
                    </View>
                  </View>

                  {/* Specialties */}
                  <View style={styles.specialties}>
                    {barber.specialties.map((spec, i) => (
                      <View key={i} style={styles.specialtyTag}>
                        <Text style={styles.specialtyText}>{spec}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Action */}
                <View style={styles.cardAction}>
                  <Text style={styles.priceLabel}>From</Text>
                  <Text style={styles.price}>€{barber.price}</Text>
                  {barber.available ? (
                    <TouchableOpacity style={styles.bookButton}>
                      <LinearGradient
                        colors={['#7c3aed', '#a855f7']}
                        style={styles.bookButtonGradient}
                      >
                        <Ionicons name="flash" size={16} color="#fff" />
                        <Text style={styles.bookButtonText}>Book</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.nextSlot}>
                      <Ionicons name="time" size={14} color={colors.gray[400]} />
                      <Text style={styles.nextSlotText}>{barber.nextSlot}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 100 }} />
      </Animated.ScrollView>

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
            <Ionicons name="search" size={22} color={colors.gray[500]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="calendar" size={22} color={colors.gray[500]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="heart" size={22} color={colors.gray[500]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
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
    backgroundColor: '#0a0a0f',
  },
  glowContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.3,
  },
  glowPurple: {
    top: -100,
    right: -100,
    backgroundColor: '#7c3aed',
  },
  glowCyan: {
    bottom: 200,
    left: -150,
    backgroundColor: '#06b6d4',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
  },
  headerTop: {
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
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00ff88',
  },
  location: {
    fontSize: 14,
    color: colors.gray[400],
  },
  avatarButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    overflow: 'hidden',
  },
  avatarGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  heroCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 24,
  },
  heroLeft: {
    flex: 1,
  },
  availableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 255, 136, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 8,
    marginBottom: 12,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00ff88',
  },
  availableText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#00ff88',
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 32,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: colors.gray[400],
  },
  heroRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapButton: {
    width: 56,
    height: 56,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 8,
  },
  mapButtonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapText: {
    fontSize: 12,
    color: colors.gray[400],
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    paddingLeft: 4,
    paddingRight: 4,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  searchIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchPlaceholder: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: colors.gray[500],
  },
  searchFilter: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtersContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 10,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginRight: 10,
    gap: 8,
    overflow: 'hidden',
  },
  filterChipActive: {
    borderColor: 'transparent',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray[400],
  },
  filterTextActive: {
    color: '#fff',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary[400],
  },
  barbersContainer: {
    paddingHorizontal: 20,
  },
  barberCard: {
    borderRadius: 24,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  cardGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  cardBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  cardBadgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  badgePulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0a0a0f',
  },
  cardBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0a0a0f',
    letterSpacing: 1,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 16,
    alignItems: 'center',
  },
  cardAvatar: {
    position: 'relative',
    marginRight: 16,
  },
  avatarImage: {
    width: 72,
    height: 72,
    borderRadius: 20,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#00ff88',
    borderWidth: 3,
    borderColor: '#1a1a24',
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  cardShop: {
    fontSize: 14,
    color: colors.gray[400],
    marginBottom: 10,
  },
  cardStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  statMuted: {
    fontSize: 12,
    color: colors.gray[500],
  },
  statDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.gray[600],
    marginHorizontal: 10,
  },
  specialties: {
    flexDirection: 'row',
    gap: 6,
  },
  specialtyTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(124, 58, 237, 0.2)',
  },
  specialtyText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary[300],
  },
  cardAction: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 11,
    color: colors.gray[500],
    marginBottom: 2,
  },
  price: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 10,
  },
  bookButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  bookButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 6,
  },
  bookButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  nextSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  nextSlotText: {
    fontSize: 13,
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
