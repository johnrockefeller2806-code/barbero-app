import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// API Base URL
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log('Error getting token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('token');
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  register: (data: any) =>
    api.post('/auth/register', data),
  
  getProfile: () => api.get('/auth/me'),
};

// Barbers API
export const barbersAPI = {
  getAvailable: (lat: number, lng: number, radius: number = 5) =>
    api.get(`/barbers/available?lat=${lat}&lng=${lng}&radius=${radius}`),
  
  getById: (id: string) => api.get(`/barbers/${id}`),
  
  setAvailability: (available: boolean) =>
    api.post('/barbers/availability', { available }),
  
  updateLocation: (lat: number, lng: number) =>
    api.post('/barbers/location', { lat, lng }),
    
  getServices: (barberId: string) =>
    api.get(`/barbers/${barberId}/services`),
};

// Bookings API
export const bookingsAPI = {
  create: (data: any) => api.post('/bookings', data),
  
  getMyBookings: () => api.get('/bookings/my'),
  
  getBarberBookings: () => api.get('/bookings/barber'),
  
  updateStatus: (id: string, status: string) =>
    api.patch(`/bookings/${id}/status`, { status }),
  
  cancel: (id: string) => api.delete(`/bookings/${id}`),
};

// Payments API
export const paymentsAPI = {
  createPaymentIntent: (bookingId: string) =>
    api.post('/payments/create-intent', { booking_id: bookingId }),
  
  confirmPayment: (paymentIntentId: string) =>
    api.post('/payments/confirm', { payment_intent_id: paymentIntentId }),
};
