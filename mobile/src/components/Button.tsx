import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients } from '../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'available';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconRight,
  style,
  textStyle,
  fullWidth = false,
}: ButtonProps) => {
  const isDisabled = disabled || loading;

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { paddingVertical: 10, paddingHorizontal: 16, fontSize: 14 };
      case 'lg':
        return { paddingVertical: 18, paddingHorizontal: 32, fontSize: 18 };
      case 'xl':
        return { paddingVertical: 22, paddingHorizontal: 40, fontSize: 20 };
      default:
        return { paddingVertical: 14, paddingHorizontal: 24, fontSize: 16 };
    }
  };

  const getGradientColors = (): [string, string] => {
    switch (variant) {
      case 'secondary':
        return gradients.secondary as [string, string];
      case 'available':
        return gradients.available as [string, string];
      default:
        return gradients.primary as [string, string];
    }
  };

  const sizeStyles = getSizeStyles();

  if (variant === 'outline') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        style={[
          styles.buttonBase,
          styles.outline,
          fullWidth && styles.fullWidth,
          {
            paddingVertical: sizeStyles.paddingVertical,
            paddingHorizontal: sizeStyles.paddingHorizontal,
            opacity: isDisabled ? 0.6 : 1,
          },
          style,
        ]}
        activeOpacity={0.7}
      >
        {loading ? (
          <ActivityIndicator color={colors.primary[600]} />
        ) : (
          <>
            {icon}
            <Text style={[styles.textOutline, { fontSize: sizeStyles.fontSize }, textStyle]}>
              {title}
            </Text>
            {iconRight}
          </>
        )}
      </TouchableOpacity>
    );
  }

  if (variant === 'ghost') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        style={[
          styles.buttonBase,
          styles.ghost,
          fullWidth && styles.fullWidth,
          {
            paddingVertical: sizeStyles.paddingVertical,
            paddingHorizontal: sizeStyles.paddingHorizontal,
            opacity: isDisabled ? 0.6 : 1,
          },
          style,
        ]}
        activeOpacity={0.7}
      >
        {loading ? (
          <ActivityIndicator color={colors.primary[600]} />
        ) : (
          <>
            {icon}
            <Text style={[styles.textGhost, { fontSize: sizeStyles.fontSize }, textStyle]}>
              {title}
            </Text>
            {iconRight}
          </>
        )}
      </TouchableOpacity>
    );
  }

  // Gradient buttons (primary, secondary, available)
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      style={[styles.buttonBase, fullWidth && styles.fullWidth, { opacity: isDisabled ? 0.6 : 1 }, style]}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.gradient,
          { paddingVertical: sizeStyles.paddingVertical, paddingHorizontal: sizeStyles.paddingHorizontal },
        ]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            {icon}
            <Text style={[styles.textPrimary, { fontSize: sizeStyles.fontSize }, textStyle]}>
              {title}
            </Text>
            {iconRight}
          </>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonBase: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  fullWidth: {
    width: '100%',
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  outline: {
    borderWidth: 2,
    borderColor: colors.primary[600],
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  ghost: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  textPrimary: {
    color: '#fff',
    fontWeight: '700',
  },
  textOutline: {
    color: colors.primary[600],
    fontWeight: '700',
  },
  textGhost: {
    color: colors.primary[600],
    fontWeight: '600',
  },
});
