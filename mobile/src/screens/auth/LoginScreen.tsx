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
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Defs, RadialGradient, Stop, Circle, Path } from 'react-native-svg';
import { useAuth } from '../../context/AuthContext';
import { colors, gradients } from '../../theme';

const { width, height } = Dimensions.get('window');

export const LoginScreen = ({ navigation }: any) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Background */}
      <LinearGradient
        colors={['#0a0a0f', '#12121a', '#0a0a0f']}
        style={StyleSheet.absoluteFill}
      />

      {/* Animated Orbs */}
      <View style={styles.orbsContainer}>
        <View style={[styles.orb, styles.orbPurple]} />
        <View style={[styles.orb, styles.orbCyan]} />
        <View style={[styles.orb, styles.orbPink]} />
      </View>

      {/* Grid Pattern */}
      <View style={styles.gridPattern}>
        {[...Array(20)].map((_, i) => (
          <View key={i} style={styles.gridLine} />
        ))}
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={['#7c3aed', '#a855f7', '#c084fc']}
                style={styles.logoGradient}
              >
                <Ionicons name="cut" size={44} color="#fff" />
              </LinearGradient>
              <View style={styles.logoGlow} />
            </View>
            <Text style={styles.logoText}>QuickCut</Text>
            <Text style={styles.tagline}>Book your perfect cut instantly</Text>
          </View>

          {/* Login Card */}
          <View style={styles.card}>
            {/* Glass Effect */}
            <View style={styles.cardGlass} />
            
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Welcome back</Text>
              <Text style={styles.cardSubtitle}>Sign in to continue</Text>

              {/* Email Input */}
              <View style={styles.inputWrapper}>
                <View style={styles.inputContainer}>
                  <View style={styles.inputIcon}>
                    <Ionicons name="mail" size={20} color={colors.gray[500]} />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Email address"
                    placeholderTextColor={colors.gray[500]}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputWrapper}>
                <View style={styles.inputContainer}>
                  <View style={styles.inputIcon}>
                    <Ionicons name="lock-closed" size={20} color={colors.gray[500]} />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor={colors.gray[500]}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={20}
                      color={colors.gray[500]}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Forgot Password */}
              <TouchableOpacity style={styles.forgotButton}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>

              {/* Error */}
              {error ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={18} color="#ff3366" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              {/* Login Button */}
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={['#7c3aed', '#a855f7']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.loginButtonGradient}
                >
                  {loading ? (
                    <View style={styles.loadingDots}>
                      <View style={[styles.dot, styles.dot1]} />
                      <View style={[styles.dot, styles.dot2]} />
                      <View style={[styles.dot, styles.dot3]} />
                    </View>
                  ) : (
                    <>
                      <Text style={styles.loginButtonText}>Sign In</Text>
                      <Ionicons name="arrow-forward" size={20} color="#fff" />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or continue with</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Social Buttons */}
              <View style={styles.socialButtons}>
                <TouchableOpacity style={styles.socialButton}>
                  <Ionicons name="logo-google" size={22} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <Ionicons name="logo-apple" size={22} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <Ionicons name="finger-print" size={22} color="#00ff88" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Register Section */}
          <View style={styles.registerSection}>
            <Text style={styles.registerText}>Don't have an account?</Text>
            <View style={styles.registerButtons}>
              <TouchableOpacity
                style={styles.registerButton}
                onPress={() => navigation.navigate('Register', { role: 'client' })}
              >
                <LinearGradient
                  colors={['rgba(124, 58, 237, 0.2)', 'rgba(124, 58, 237, 0.1)']}
                  style={styles.registerButtonGradient}
                >
                  <Ionicons name="person" size={18} color="#a855f7" />
                  <Text style={styles.registerButtonText}>I'm a Client</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.registerButton}
                onPress={() => navigation.navigate('Register', { role: 'barber' })}
              >
                <LinearGradient
                  colors={['rgba(0, 255, 136, 0.2)', 'rgba(0, 255, 136, 0.1)']}
                  style={styles.registerButtonGradient}
                >
                  <Ionicons name="cut" size={18} color="#00ff88" />
                  <Text style={[styles.registerButtonText, { color: '#00ff88' }]}>
                    I'm a Barber
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          {/* Location Badge */}
          <View style={styles.locationBadge}>
            <View style={styles.locationDot} />
            <Text style={styles.locationText}>Dublin, Ireland 🇮🇪</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  orbsContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.4,
  },
  orbPurple: {
    width: 400,
    height: 400,
    top: -150,
    right: -150,
    backgroundColor: '#7c3aed',
  },
  orbCyan: {
    width: 300,
    height: 300,
    bottom: 100,
    left: -150,
    backgroundColor: '#06b6d4',
  },
  orbPink: {
    width: 200,
    height: 200,
    bottom: -50,
    right: -50,
    backgroundColor: '#ec4899',
  },
  gridPattern: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.03,
  },
  gridLine: {
    height: 1,
    backgroundColor: '#fff',
    marginVertical: 30,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingTop: 60,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  logoGradient: {
    width: 88,
    height: 88,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoGlow: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 38,
    backgroundColor: '#7c3aed',
    opacity: 0.3,
    zIndex: -1,
  },
  logoText: {
    fontSize: 42,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 16,
    color: colors.gray[400],
    marginTop: 8,
  },
  card: {
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 24,
  },
  cardGlass: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  cardContent: {
    padding: 28,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 15,
    color: colors.gray[400],
    marginBottom: 28,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  inputIcon: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    height: 52,
    fontSize: 16,
    color: '#fff',
  },
  eyeButton: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotText: {
    fontSize: 14,
    color: colors.primary[400],
    fontWeight: '600',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 51, 102, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 20,
    gap: 10,
  },
  errorText: {
    color: '#ff3366',
    fontSize: 14,
    flex: 1,
  },
  loginButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  loginButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    gap: 10,
  },
  loginButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  dot1: { opacity: 0.4 },
  dot2: { opacity: 0.7 },
  dot3: { opacity: 1 },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 13,
    color: colors.gray[500],
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  registerText: {
    fontSize: 15,
    color: colors.gray[400],
    marginBottom: 16,
  },
  registerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  registerButton: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  registerButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 10,
  },
  registerButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#a855f7',
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  locationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00ff88',
  },
  locationText: {
    fontSize: 14,
    color: colors.gray[400],
  },
});
