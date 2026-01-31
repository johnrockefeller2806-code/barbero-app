import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import { authAPI } from '../services/api';

export type UserRole = 'client' | 'barber';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar_url?: string;
  // Barber specific
  shop_name?: string;
  bio?: string;
  rating?: number;
  reviews_count?: number;
  is_available?: boolean;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasBiometrics: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: any) => Promise<User>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasBiometrics, setHasBiometrics] = useState(false);

  useEffect(() => {
    checkAuthStatus();
    checkBiometrics();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        const response = await authAPI.getProfile();
        setUser(response.data);
      }
    } catch (error) {
      await SecureStore.deleteItemAsync('token');
    } finally {
      setIsLoading(false);
    }
  };

  const checkBiometrics = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    setHasBiometrics(compatible && enrolled);
  };

  const login = async (email: string, password: string): Promise<User> => {
    const response = await authAPI.login(email, password);
    const { access_token, user: userData } = response.data;
    
    await SecureStore.setItemAsync('token', access_token);
    setUser(userData);
    
    return userData;
  };

  const register = async (data: any): Promise<User> => {
    const response = await authAPI.register(data);
    const { access_token, user: userData } = response.data;
    
    await SecureStore.setItemAsync('token', access_token);
    setUser(userData);
    
    return userData;
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('token');
    setUser(null);
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        hasBiometrics,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
