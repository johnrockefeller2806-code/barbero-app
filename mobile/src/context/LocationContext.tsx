import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as Location from 'expo-location';

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

interface LocationContextType {
  location: LocationData | null;
  isLoading: boolean;
  error: string | null;
  refreshLocation: () => Promise<void>;
  requestPermission: () => Promise<boolean>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initLocation();
  }, []);

  const initLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        setIsLoading(false);
        return;
      }

      await refreshLocation();
    } catch (err) {
      setError('Failed to get location');
    } finally {
      setIsLoading(false);
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  };

  const refreshLocation = async () => {
    try {
      setIsLoading(true);
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Get address from coordinates
      const [address] = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        address: address ? `${address.street || ''}, ${address.city || ''}` : undefined,
      });
      setError(null);
    } catch (err) {
      setError('Failed to refresh location');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        isLoading,
        error,
        refreshLocation,
        requestPermission,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
