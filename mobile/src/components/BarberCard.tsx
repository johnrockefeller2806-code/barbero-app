import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, shadows, gradients } from '../theme';

interface BarberCardProps {
  id: string;
  name: string;
  shopName: string;
  rating: number;
  reviewsCount: number;
  distance: string;
  avatar?: string;
  isAvailable: boolean;
  services?: { name: string; price: number }[];
  onPress: () => void;
  onBookNow?: () => void;
}

export const BarberCard = ({
  name,
  shopName,
  rating,
  reviewsCount,
  distance,
  avatar,
  isAvailable,
  services,
  onPress,
  onBookNow,
}: BarberCardProps) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Available Badge */}
      {isAvailable && (
        <LinearGradient
          colors={gradients.available as [string, string]}
          style={styles.availableBadge}
        >
          <View style={styles.pulse} />
          <Text style={styles.availableText}>Available Now</Text>
        </LinearGradient>
      )}

      <View style={styles.content}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <LinearGradient
              colors={gradients.primary as [string, string]}
              style={styles.avatarPlaceholder}
            >
              <Ionicons name="person" size={32} color="#fff" />
            </LinearGradient>
          )}
        </View>

        {/* Info */}
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          <Text style={styles.shopName} numberOfLines={1}>{shopName}</Text>
          
          <View style={styles.statsRow}>
            {/* Rating */}
            <View style={styles.rating}>
              <Ionicons name="star" size={14} color="#fbbf24" />
              <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
              <Text style={styles.reviewsText}>({reviewsCount})</Text>
            </View>
            
            {/* Distance */}
            <View style={styles.distance}>
              <Ionicons name="location" size={14} color={colors.gray[400]} />
              <Text style={styles.distanceText}>{distance}</Text>
            </View>
          </View>

          {/* Services Preview */}
          {services && services.length > 0 && (
            <View style={styles.servicesPreview}>
              <Text style={styles.serviceItem}>
                {services[0].name} • €{services[0].price}
              </Text>
            </View>
          )}
        </View>

        {/* Action */}
        <View style={styles.action}>
          {isAvailable && onBookNow ? (
            <TouchableOpacity
              style={styles.bookButton}
              onPress={(e) => {
                e.stopPropagation();
                onBookNow();
              }}
            >
              <LinearGradient
                colors={gradients.secondary as [string, string]}
                style={styles.bookButtonGradient}
              >
                <Ionicons name="flash" size={18} color="#fff" />
                <Text style={styles.bookButtonText}>Book</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <Ionicons name="chevron-forward" size={24} color={colors.gray[400]} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    ...shadows.md,
    marginBottom: 16,
  },
  availableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  pulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  availableText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  content: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 14,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 16,
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: 2,
  },
  shopName: {
    fontSize: 14,
    color: colors.gray[500],
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray[800],
  },
  reviewsText: {
    fontSize: 12,
    color: colors.gray[400],
  },
  distance: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distanceText: {
    fontSize: 13,
    color: colors.gray[500],
  },
  servicesPreview: {
    marginTop: 8,
  },
  serviceItem: {
    fontSize: 13,
    color: colors.primary[600],
    fontWeight: '500',
  },
  action: {
    marginLeft: 8,
  },
  bookButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  bookButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 6,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});
