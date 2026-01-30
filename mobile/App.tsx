import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { LocationProvider } from './src/context/LocationContext';
import {
  LoginScreen,
  RegisterScreen,
  ClientHomeScreen,
  BarberHomeScreen,
} from './src/screens';

const Stack = createNativeStackNavigator();

// Auth Navigator
const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

// Client Navigator
const ClientNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ClientHome" component={ClientHomeScreen} />
  </Stack.Navigator>
);

// Barber Navigator
const BarberNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="BarberHome" component={BarberHomeScreen} />
  </Stack.Navigator>
);

// Main App Navigator
const AppNavigator = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return null; // Splash screen will show
  }

  if (!isAuthenticated) {
    return <AuthNavigator />;
  }

  // Route based on user role
  if (user?.role === 'barber') {
    return <BarberNavigator />;
  }

  return <ClientNavigator />;
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <LocationProvider>
          <NavigationContainer>
            <StatusBar style="light" />
            <AppNavigator />
          </NavigationContainer>
        </LocationProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
