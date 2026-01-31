import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import ClientDashboard from './pages/ClientDashboard';
import BarberDashboard from './pages/BarberDashboard';
import SubscriptionPage from './pages/SubscriptionPage';
import ClientHistoryPage from './pages/ClientHistoryPage';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children, allowedType }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedType && user.user_type !== allowedType) {
    return <Navigate to={user.user_type === 'barber' ? '/barber' : '/client'} replace />;
  }

  return children;
};

// Public Route - Redirect if already logged in
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to={user.user_type === 'barber' ? '/barber' : '/client'} replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={
        <PublicRoute>
          <LandingPage />
        </PublicRoute>
      } />
      <Route path="/auth" element={
        <PublicRoute>
          <AuthPage />
        </PublicRoute>
      } />
      <Route path="/client" element={
        <ProtectedRoute allowedType="client">
          <ClientDashboard />
        </ProtectedRoute>
      } />
      <Route path="/barber" element={
        <ProtectedRoute allowedType="barber">
          <BarberDashboard />
        </ProtectedRoute>
      } />
      <Route path="/subscription" element={
        <ProtectedRoute allowedType="barber">
          <SubscriptionPage />
        </ProtectedRoute>
      } />
      <Route path="/barber/clients" element={
        <ProtectedRoute allowedType="barber">
          <ClientHistoryPage />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
