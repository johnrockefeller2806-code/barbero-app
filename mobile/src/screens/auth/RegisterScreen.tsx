import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, UserRole } from '../../context/AuthContext';
import { Button } from '../../components';
import { colors, gradients } from '../../theme';

export const RegisterScreen = ({ navigation, route }: any) => {
  const { register } = useAuth();
  const initialRole: UserRole = route.params?.role || 'client';
  
  const [role, setRole] = useState<UserRole>(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [shopName, setShopName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isBarber = role === 'barber';

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    if (isBarber && !shopName.trim()) {
      setError('Please enter your shop/business name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = {
        name,
        email,
        phone,
        password,
        role,
        ...(isBarber && { shop_name: shopName }),
      };
      
      await register(data);
      // Navigation handled by auth state
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={isBarber ? (gradients.secondary as [string, string]) : (gradients.primary as [string, string])}
      style={styles.container}
    >
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons
                name={isBarber ? 'cut' : 'person'}
                size={36}
                color="#fff"
              />
            </View>
            <Text style={styles.title}>
              {isBarber ? 'Join as Barber' : 'Create Account'}
            </Text>
            <Text style={styles.subtitle}>
              {isBarber
                ? 'Start getting clients today'
                : 'Find barbers near you instantly'}
            </Text>
          </View>

          {/* Role Toggle */}
          <View style={styles.roleToggle}>
            <TouchableOpacity
              style={[styles.roleButton, !isBarber && styles.roleButtonActive]}
              onPress={() => setRole('client')}
            >
              <Ionicons
                name="person"
                size={18}
                color={!isBarber ? '#fff' : 'rgba(255,255,255,0.6)'}
              />
              <Text style={[styles.roleText, !isBarber && styles.roleTextActive]}>
                Client
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleButton, isBarber && styles.roleButtonActive]}
              onPress={() => setRole('barber')}
            >
              <Ionicons
                name="cut"
                size={18}
                color={isBarber ? '#fff' : 'rgba(255,255,255,0.6)'}
              />
              <Text style={[styles.roleText, isBarber && styles.roleTextActive]}>
                Barber
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            {/* Name */}
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color={colors.gray[400]} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor={colors.gray[400]}
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Shop Name (Barber only) */}
            {isBarber && (
              <View style={styles.inputContainer}>
                <Ionicons name="storefront-outline" size={20} color={colors.gray[400]} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Shop/Business Name"
                  placeholderTextColor={colors.gray[400]}
                  value={shopName}
                  onChangeText={setShopName}
                />
              </View>
            )}

            {/* Email */}
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color={colors.gray[400]} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={colors.gray[400]}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Phone */}
            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={20} color={colors.gray[400]} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Phone (+353...)"
                placeholderTextColor={colors.gray[400]}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            {/* Password */}
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.gray[400]} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={colors.gray[400]}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={colors.gray[400]}
                />
              </TouchableOpacity>
            </View>

            {/* Error */}
            {error ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={16} color={colors.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Register Button */}
            <Button
              title={isBarber ? 'Start Getting Clients' : 'Create Account'}
              onPress={handleRegister}
              loading={loading}
              variant={isBarber ? 'secondary' : 'primary'}
              size="lg"
              fullWidth
              icon={<Ionicons name="checkmark-circle" size={20} color="#fff" />}
            />

            {/* Login Link */}
            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginText}>
                Already have an account? <Text style={styles.loginTextBold}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
  },
  roleToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14,
    padding: 4,
    marginBottom: 24,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  roleButtonActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  roleText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
  },
  roleTextActive: {
    color: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[50],
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.gray[200],
    marginBottom: 14,
  },
  inputIcon: {
    marginLeft: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    fontSize: 16,
    color: colors.gray[900],
  },
  eyeButton: {
    padding: 14,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    flex: 1,
  },
  loginLink: {
    alignItems: 'center',
    marginTop: 20,
  },
  loginText: {
    fontSize: 14,
    color: colors.gray[500],
  },
  loginTextBold: {
    color: colors.primary[600],
    fontWeight: '600',
  },
});
