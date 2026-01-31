import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import axios from 'axios';
import { Scissors, User, Mail, Lock, Phone, MapPin, ArrowRight, ArrowLeft, Instagram, KeyRound, RefreshCw } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const LOGO_URL = "https://customer-assets.emergentagent.com/job_f16b93ce-5ac3-4503-bae3-65d25ede4a91/artifacts/7tsbrqqb_WhatsApp%20Image%202026-01-30%20at%2021.59.32.jpeg";

// PIN Input Component
const PinInput = ({ value, onChange, disabled }) => {
  const inputRefs = useRef([]);
  
  const handleChange = (index, e) => {
    const val = e.target.value;
    if (val.length <= 1 && /^\d*$/.test(val)) {
      const newPin = value.split('');
      newPin[index] = val;
      onChange(newPin.join(''));
      
      // Auto focus next
      if (val && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };
  
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).replace(/\D/g, '');
    onChange(pastedData);
  };
  
  return (
    <div className="flex gap-2 justify-center" onPaste={handlePaste}>
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          disabled={disabled}
          className="w-12 h-14 text-center text-2xl font-bold bg-zinc-900 border border-zinc-700 text-white rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
          data-testid={`pin-input-${index}`}
        />
      ))}
    </div>
  );
};

const AuthPage = () => {
  const navigate = useNavigate();
  const { login, register, loginWithPin } = useAuth();
  const { t } = useLanguage();
  
  // View states
  const [view, setView] = useState('login'); // login, login-pin, register, forgot-password, reset-password, set-pin
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    user_type: '',
    specialty: '',
    address: '',
    instagram: '',
    latitude: 53.3498,
    longitude: -6.2603
  });
  
  // PIN states
  const [pin, setPin] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [hasPinSet, setHasPinSet] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);

  // Check if user has PIN when email changes
  useEffect(() => {
    const checkPin = async () => {
      if (formData.email && formData.email.includes('@')) {
        try {
          const res = await axios.get(`${API}/auth/check-pin?email=${formData.email}`);
          setHasPinSet(res.data.pin_set);
        } catch {
          setHasPinSet(false);
        }
      }
    };
    const timer = setTimeout(checkPin, 500);
    return () => clearTimeout(timer);
  }, [formData.email]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await login(formData.email, formData.password);
      
      // Check if PIN needs to be set
      if (!result.pin_set) {
        setPendingUser(result.user);
        setView('set-pin');
      } else {
        navigate(result.user.user_type === 'barber' ? '/barber' : '/client');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid credentials');
    }
    setLoading(false);
  };

  const handlePinLogin = async (e) => {
    e.preventDefault();
    if (pin.length !== 6) {
      setError('PIN must be 6 digits');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const user = await loginWithPin(formData.email, pin);
      navigate(user.user_type === 'barber' ? '/barber' : '/client');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid PIN');
      setPin('');
    }
    setLoading(false);
  };

  const handleSetPin = async (e) => {
    e.preventDefault();
    if (pin.length !== 6) {
      setError('PIN must be 6 digits');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await axios.post(`${API}/auth/set-pin`, { pin });
      navigate(pendingUser.user_type === 'barber' ? '/barber' : '/client');
    } catch (err) {
      setError(err.response?.data?.detail || 'Error setting PIN');
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post(`${API}/auth/forgot-password`, { email: formData.email });
      setSuccess('Reset code sent to your email!');
      setView('reset-password');
    } catch (err) {
      setError(err.response?.data?.detail || 'Error sending reset code');
    }
    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (resetCode.length !== 6) {
      setError('Code must be 6 digits');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await axios.post(`${API}/auth/reset-password`, {
        email: formData.email,
        code: resetCode,
        new_password: newPassword
      });
      setSuccess('Password reset successfully! Please login.');
      setView('login');
      setResetCode('');
      setNewPassword('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid or expired code');
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = { ...formData, user_type: userType };
      if (userType === 'barber') {
        data.services = [
          { id: '1', name: 'Corte', price: 45, duration: 30 },
          { id: '2', name: 'Barba', price: 35, duration: 25 },
          { id: '3', name: 'Combo', price: 70, duration: 50 }
        ];
      }
      const result = await register(data);
      setPendingUser(result);
      setView('set-pin');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration error');
    }
    setLoading(false);
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        () => console.log('Location denied')
      );
    }
  };

  const renderLoginForm = () => (
    <form onSubmit={handleLogin} className="space-y-6" data-testid="login-form">
      <div className="text-center mb-8">
        <h2 className="font-heading text-3xl font-bold text-white uppercase">{t('auth_login')}</h2>
        <p className="text-zinc-500 mt-2">{t('auth_login_subtitle')}</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm" data-testid="error-message">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg text-sm">
          {success}
        </div>
      )}

      <div className="space-y-4">
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="email"
            name="email"
            placeholder={t('auth_email')}
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full bg-zinc-900 border border-zinc-800 text-white pl-12 pr-4 py-4 rounded-lg focus:border-amber-500 transition-colors"
            data-testid="input-email"
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="password"
            name="password"
            placeholder={t('auth_password')}
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full bg-zinc-900 border border-zinc-800 text-white pl-12 pr-4 py-4 rounded-lg focus:border-amber-500 transition-colors"
            data-testid="input-password"
          />
        </div>
      </div>

      {/* Quick PIN Login Option */}
      {hasPinSet && formData.email && (
        <button
          type="button"
          onClick={() => { setView('login-pin'); setError(''); }}
          className="w-full flex items-center justify-center gap-2 text-amber-500 hover:text-amber-400 py-2 transition-colors"
          data-testid="btn-use-pin"
        >
          <KeyRound className="w-4 h-4" />
          Quick access with PIN
        </button>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-amber-500 text-black font-heading uppercase tracking-widest py-4 rounded-lg hover:bg-amber-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        data-testid="btn-login"
      >
        {loading ? t('auth_logging_in') : t('auth_btn_login')}
        <ArrowRight className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={() => { setView('forgot-password'); setError(''); setSuccess(''); }}
        className="w-full text-zinc-500 hover:text-amber-500 text-sm transition-colors"
        data-testid="btn-forgot-password"
      >
        Forgot your password?
      </button>

      <p className="text-center text-zinc-500">
        {t('auth_no_account')}{' '}
        <button type="button" onClick={() => setView('register')} className="text-amber-500 hover:underline" data-testid="btn-goto-register">
          {t('auth_signup')}
        </button>
      </p>
    </form>
  );

  const renderPinLogin = () => (
    <form onSubmit={handlePinLogin} className="space-y-6" data-testid="pin-login-form">
      <button
        type="button"
        onClick={() => { setView('login'); setPin(''); setError(''); }}
        className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to password login
      </button>

      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <KeyRound className="w-8 h-8 text-amber-500" />
        </div>
        <h2 className="font-heading text-2xl font-bold text-white uppercase">Quick Access</h2>
        <p className="text-zinc-500 mt-2">Enter your 6-digit PIN</p>
        <p className="text-zinc-600 text-sm mt-1">{formData.email}</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <PinInput value={pin} onChange={setPin} disabled={loading} />

      <button
        type="submit"
        disabled={loading || pin.length !== 6}
        className="w-full bg-amber-500 text-black font-heading uppercase tracking-widest py-4 rounded-lg hover:bg-amber-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        data-testid="btn-pin-login"
      >
        {loading ? 'Verifying...' : 'Enter'}
        <ArrowRight className="w-5 h-5" />
      </button>
    </form>
  );

  const renderSetPin = () => (
    <form onSubmit={handleSetPin} className="space-y-6" data-testid="set-pin-form">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <KeyRound className="w-8 h-8 text-amber-500" />
        </div>
        <h2 className="font-heading text-2xl font-bold text-white uppercase">Set Your PIN</h2>
        <p className="text-zinc-500 mt-2">Create a 6-digit PIN for quick access</p>
        <p className="text-zinc-600 text-sm mt-1">Like a bank app, use your PIN for faster logins</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <PinInput value={pin} onChange={setPin} disabled={loading} />

      <button
        type="submit"
        disabled={loading || pin.length !== 6}
        className="w-full bg-amber-500 text-black font-heading uppercase tracking-widest py-4 rounded-lg hover:bg-amber-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        data-testid="btn-set-pin"
      >
        {loading ? 'Setting PIN...' : 'Confirm PIN'}
        <ArrowRight className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={() => navigate(pendingUser?.user_type === 'barber' ? '/barber' : '/client')}
        className="w-full text-zinc-500 hover:text-white text-sm transition-colors"
      >
        Skip for now
      </button>
    </form>
  );

  const renderForgotPassword = () => (
    <form onSubmit={handleForgotPassword} className="space-y-6" data-testid="forgot-password-form">
      <button
        type="button"
        onClick={() => { setView('login'); setError(''); setSuccess(''); }}
        className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to login
      </button>

      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <RefreshCw className="w-8 h-8 text-amber-500" />
        </div>
        <h2 className="font-heading text-2xl font-bold text-white uppercase">Reset Password</h2>
        <p className="text-zinc-500 mt-2">Enter your email to receive a reset code</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="relative">
        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
        <input
          type="email"
          name="email"
          placeholder="Your email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full bg-zinc-900 border border-zinc-800 text-white pl-12 pr-4 py-4 rounded-lg focus:border-amber-500 transition-colors"
          data-testid="input-forgot-email"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-amber-500 text-black font-heading uppercase tracking-widest py-4 rounded-lg hover:bg-amber-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        data-testid="btn-send-code"
      >
        {loading ? 'Sending...' : 'Send Reset Code'}
        <ArrowRight className="w-5 h-5" />
      </button>
    </form>
  );

  const renderResetPassword = () => (
    <form onSubmit={handleResetPassword} className="space-y-6" data-testid="reset-password-form">
      <button
        type="button"
        onClick={() => { setView('forgot-password'); setResetCode(''); setError(''); }}
        className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="font-heading text-2xl font-bold text-white uppercase">Check Your Email</h2>
        <p className="text-zinc-500 mt-2">Enter the 6-digit code sent to</p>
        <p className="text-amber-500">{formData.email}</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="text-zinc-400 text-sm mb-2 block">Reset Code</label>
          <PinInput value={resetCode} onChange={setResetCode} disabled={loading} />
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
            className="w-full bg-zinc-900 border border-zinc-800 text-white pl-12 pr-4 py-4 rounded-lg focus:border-amber-500 transition-colors"
            data-testid="input-new-password"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || resetCode.length !== 6 || !newPassword}
        className="w-full bg-amber-500 text-black font-heading uppercase tracking-widest py-4 rounded-lg hover:bg-amber-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        data-testid="btn-reset-password"
      >
        {loading ? 'Resetting...' : 'Reset Password'}
        <ArrowRight className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={handleForgotPassword}
        disabled={loading}
        className="w-full text-zinc-500 hover:text-amber-500 text-sm transition-colors"
      >
        Didn't receive the code? Send again
      </button>
    </form>
  );

  const renderRegisterTypeSelection = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="font-heading text-3xl font-bold text-white uppercase">{t('auth_register')}</h2>
        <p className="text-zinc-500 mt-2">{t('auth_register_subtitle')}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => { setUserType('client'); getLocation(); }}
          className="bg-zinc-900 border border-zinc-800 p-8 rounded-lg hover:border-amber-500 transition-all group"
          data-testid="btn-type-client"
        >
          <User className="w-12 h-12 text-zinc-500 group-hover:text-amber-500 mx-auto mb-4 transition-colors" />
          <p className="font-heading text-lg text-white uppercase">{t('auth_type_client')}</p>
          <p className="text-zinc-500 text-sm mt-1">{t('auth_type_client_desc')}</p>
        </button>
        <button
          onClick={() => { setUserType('barber'); getLocation(); }}
          className="bg-zinc-900 border border-zinc-800 p-8 rounded-lg hover:border-amber-500 transition-all group"
          data-testid="btn-type-barber"
        >
          <Scissors className="w-12 h-12 text-zinc-500 group-hover:text-amber-500 mx-auto mb-4 transition-colors" />
          <p className="font-heading text-lg text-white uppercase">{t('auth_type_barber')}</p>
          <p className="text-zinc-500 text-sm mt-1">{t('auth_type_barber_desc')}</p>
        </button>
      </div>

      <p className="text-center text-zinc-500">
        {t('auth_has_account')}{' '}
        <button type="button" onClick={() => setView('login')} className="text-amber-500 hover:underline" data-testid="btn-goto-login">
          {t('auth_signin')}
        </button>
      </p>
    </div>
  );

  const renderRegisterForm = () => (
    <form onSubmit={handleRegister} className="space-y-6">
      <button
        type="button"
        onClick={() => setUserType(null)}
        className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('auth_back')}
      </button>

      <div className="text-center mb-4">
        <h2 className="font-heading text-2xl font-bold text-white uppercase">
          {t('auth_register')} - {userType === 'barber' ? t('auth_type_barber') : t('auth_type_client')}
        </h2>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            name="name"
            placeholder={t('auth_name')}
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full bg-zinc-900 border border-zinc-800 text-white pl-12 pr-4 py-4 rounded-lg focus:border-amber-500 transition-colors"
            data-testid="input-name"
          />
        </div>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="email"
            name="email"
            placeholder={t('auth_email')}
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full bg-zinc-900 border border-zinc-800 text-white pl-12 pr-4 py-4 rounded-lg focus:border-amber-500 transition-colors"
            data-testid="input-reg-email"
          />
        </div>
        <div className="relative">
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="tel"
            name="phone"
            placeholder={t('auth_phone')}
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full bg-zinc-900 border border-zinc-800 text-white pl-12 pr-4 py-4 rounded-lg focus:border-amber-500 transition-colors"
            data-testid="input-phone"
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="password"
            name="password"
            placeholder={t('auth_password')}
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            className="w-full bg-zinc-900 border border-zinc-800 text-white pl-12 pr-4 py-4 rounded-lg focus:border-amber-500 transition-colors"
            data-testid="input-reg-password"
          />
        </div>

        {userType === 'barber' && (
          <>
            <div className="relative">
              <Scissors className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="text"
                name="specialty"
                placeholder={t('auth_specialty')}
                value={formData.specialty}
                onChange={handleChange}
                className="w-full bg-zinc-900 border border-zinc-800 text-white pl-12 pr-4 py-4 rounded-lg focus:border-amber-500 transition-colors"
                data-testid="input-specialty"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="text"
                name="address"
                placeholder={t('auth_address')}
                value={formData.address}
                onChange={handleChange}
                className="w-full bg-zinc-900 border border-zinc-800 text-white pl-12 pr-4 py-4 rounded-lg focus:border-amber-500 transition-colors"
                data-testid="input-address"
              />
            </div>
            <div className="relative">
              <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="text"
                name="instagram"
                placeholder="Instagram (ex: @seuperfil)"
                value={formData.instagram}
                onChange={handleChange}
                className="w-full bg-zinc-900 border border-zinc-800 text-white pl-12 pr-4 py-4 rounded-lg focus:border-amber-500 transition-colors"
                data-testid="input-instagram"
              />
            </div>
          </>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-amber-500 text-black font-heading uppercase tracking-widest py-4 rounded-lg hover:bg-amber-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        data-testid="btn-register"
      >
        {loading ? t('auth_registering') : t('auth_btn_register')}
        <ArrowRight className="w-5 h-5" />
      </button>
    </form>
  );

  const renderContent = () => {
    switch (view) {
      case 'login':
        return renderLoginForm();
      case 'login-pin':
        return renderPinLogin();
      case 'set-pin':
        return renderSetPin();
      case 'forgot-password':
        return renderForgotPassword();
      case 'reset-password':
        return renderResetPassword();
      case 'register':
        return userType ? renderRegisterForm() : renderRegisterTypeSelection();
      default:
        return renderLoginForm();
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] flex" data-testid="auth-page">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-zinc-900 to-zinc-950 flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-96 h-96 bg-amber-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-amber-600 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <img src={LOGO_URL} alt="ClickBarber" className="h-32 w-auto object-contain" />
          </div>
          <p className="text-zinc-400 text-xl max-w-md">
            {t('hero_description')}
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8">
        {/* Language Toggle */}
        <div className="absolute top-4 right-4">
          <LanguageToggle />
        </div>
        
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <img src={LOGO_URL} alt="ClickBarber" className="h-20 w-auto object-contain" />
          </div>

          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
