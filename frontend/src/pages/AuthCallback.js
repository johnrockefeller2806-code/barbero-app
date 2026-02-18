import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH

const AuthCallback = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processAuth = async () => {
      try {
        // Get session_id from URL fragment
        const hash = window.location.hash;
        const sessionId = hash.split('session_id=')[1]?.split('&')[0];

        if (!sessionId) {
          console.error('No session_id found');
          navigate('/auth');
          return;
        }

        // Exchange session_id for session data
        const response = await fetch(
          'https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data',
          {
            headers: {
              'X-Session-ID': sessionId
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to get session data');
        }

        const sessionData = await response.json();

        // Send to our backend to create/update user and set cookie
        const backendResponse = await fetch(`${API}/auth/google-callback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(sessionData)
        });

        if (!backendResponse.ok) {
          throw new Error('Backend auth failed');
        }

        const userData = await backendResponse.json();

        // Store token
        localStorage.setItem('token', userData.token);
        
        // Update auth context
        setUser(userData.user);

        // Navigate based on user type
        if (userData.user.user_type === 'barber') {
          navigate('/barber', { state: { user: userData.user } });
        } else {
          navigate('/client', { state: { user: userData.user } });
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/auth');
      }
    };

    processAuth();
  }, [navigate, setUser]);

  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-lg">Autenticando com Google...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
