import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API}/auth/me`);
      setUser(res.data);
    } catch (e) {
      logout();
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    const res = await axios.post(`${API}/auth/login`, { email, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('userEmail', email); // Save email for PIN login
    setToken(res.data.token);
    setUser(res.data.user);
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    return { user: res.data.user, pin_set: res.data.pin_set };
  };

  const loginWithPin = async (email, pin) => {
    const res = await axios.post(`${API}/auth/login-pin`, { email, pin });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('userEmail', email);
    setToken(res.data.token);
    setUser(res.data.user);
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    return res.data.user;
  };

  const register = async (data) => {
    const res = await axios.post(`${API}/auth/register`, data);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('userEmail', data.email);
    setToken(res.data.token);
    setUser(res.data.user);
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    // Keep email for quick PIN login
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, loginWithPin, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
