import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';
import { 
  Lock, ArrowRight, User, KeyRound, Fingerprint,
  Eye, EyeOff, ArrowLeft, Smartphone
} from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const LOGO_URL = "https://customer-assets.emergentagent.com/job_dublin-study/artifacts/o9gnc0xi_WhatsApp%20Image%202026-01-11%20at%2023.59.07.jpeg";

export const PinLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { language } = useLanguage();
  
  const [step, setStep] = useState('email'); // email, pin, password
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [hasPin, setHasPin] = useState(false);
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  
  const inputRefs = useRef([]);

  // Check for saved email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('lastEmail');
    const pinEnabled = localStorage.getItem('pinEnabled');
    
    if (savedEmail && pinEnabled === 'true') {
      setEmail(savedEmail);
      checkUserPin(savedEmail);
    }
  }, []);

  // Focus first PIN input when step changes
  useEffect(() => {
    if (step === 'pin' && inputRefs.current[0]) {
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [step]);

  const checkUserPin = async (userEmail) => {
    try {
      const response = await axios.get(`${API}/auth/check-pin/${encodeURIComponent(userEmail)}`);
      
      if (response.data.exists) {
        setUserName(response.data.name);
        setHasPin(response.data.has_pin);
        
        if (response.data.has_pin) {
          setStep('pin');
        } else {
          setStep('password');
        }
      } else {
        setError(language === 'pt' ? 'Email não cadastrado' : 'Email not registered');
      }
    } catch (error) {
      setStep('password');
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await checkUserPin(email);
    } catch (error) {
      setError(language === 'pt' ? 'Erro ao verificar email' : 'Error checking email');
    } finally {
      setLoading(false);
    }
  };

  const handlePinChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);
    setError('');
    
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    
    // Auto submit when complete
    if (newPin.every(d => d !== '')) {
      handlePinLogin(newPin.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const newPin = [...pin];
      newPin[index - 1] = '';
      setPin(newPin);
    }
  };

  const handlePinLogin = async (pinCode) => {
    setLoading(true);
    
    try {
      const response = await axios.post(`${API}/auth/pin/login`, {
        email: email,
        pin: pinCode
      });
      
      const { access_token, user } = response.data;
      
      // Save token and update auth context
      localStorage.setItem('token', access_token);
      localStorage.setItem('lastEmail', email);
      localStorage.setItem('pinEnabled', 'true');
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      toast.success(language === 'pt' ? `Bem-vindo, ${user.name}!` : `Welcome, ${user.name}!`);
      
      // Redirect based on role
      if (user.role === 'admin') {
        window.location.href = '/admin';
      } else if (user.role === 'school') {
        window.location.href = '/school';
      } else {
        window.location.href = '/dashboard';
      }
    } catch (error) {
      setAttempts(prev => prev + 1);
      setPin(['', '', '', '', '', '']);
      
      if (attempts >= 2) {
        setError(language === 'pt' 
          ? 'Muitas tentativas. Use sua senha.' 
          : 'Too many attempts. Use your password.');
        setStep('password');
      } else {
        setError(language === 'pt' ? 'PIN incorreto' : 'Incorrect PIN');
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const userData = await login(email, password);
      
      toast.success(language === 'pt' ? `Bem-vindo, ${userData.name}!` : `Welcome, ${userData.name}!`);
      localStorage.setItem('lastEmail', email);
      
      // Check if user has PIN, if not redirect to setup
      const pinStatus = await axios.get(`${API}/auth/pin/status`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (!pinStatus.data.pin_enabled) {
        navigate('/pin-setup');
      } else {
        localStorage.setItem('pinEnabled', 'true');
        if (userData.role === 'admin') {
          navigate('/admin');
        } else if (userData.role === 'school') {
          navigate('/school');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      setError(error.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleUsePassword = () => {
    setStep('password');
    setPin(['', '', '', '', '', '']);
    setError('');
  };

  const handleChangeEmail = () => {
    setStep('email');
    setPin(['', '', '', '', '', '']);
    setPassword('');
    setError('');
    setAttempts(0);
    localStorage.removeItem('lastEmail');
    localStorage.removeItem('pinEnabled');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/">
            <img 
              src={LOGO_URL} 
              alt="STUFF Intercâmbio" 
              className="h-16 w-auto mx-auto"
            />
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Email Step */}
          {step === 'email' && (
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-emerald-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  {language === 'pt' ? 'Entrar' : 'Sign In'}
                </h1>
                <p className="text-gray-500">
                  {language === 'pt' ? 'Digite seu email para continuar' : 'Enter your email to continue'}
                </p>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    className="h-14 rounded-xl text-lg"
                    data-testid="email-input"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
                    {error}
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      {language === 'pt' ? 'Continuar' : 'Continue'}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-500">
                  {language === 'pt' ? 'Não tem conta?' : "Don't have an account?"}{' '}
                  <Link to="/register" className="text-emerald-600 font-medium hover:underline">
                    {language === 'pt' ? 'Cadastre-se' : 'Sign up'}
                  </Link>
                </p>
              </div>
            </div>
          )}

          {/* PIN Step */}
          {step === 'pin' && (
            <div className="p-8">
              {/* User Info */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <h1 className="text-xl font-bold text-gray-800 mb-1">
                  {language === 'pt' ? `Olá, ${userName}!` : `Hello, ${userName}!`}
                </h1>
                <p className="text-gray-500 text-sm">{email}</p>
                <button 
                  onClick={handleChangeEmail}
                  className="text-emerald-600 text-sm hover:underline mt-1"
                >
                  {language === 'pt' ? 'Não é você?' : 'Not you?'}
                </button>
              </div>

              {/* PIN Header */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Fingerprint className="h-5 w-5 text-emerald-600" />
                  <span className="font-semibold text-gray-700">
                    {language === 'pt' ? 'Digite seu PIN' : 'Enter your PIN'}
                  </span>
                </div>
              </div>

              {/* PIN Inputs */}
              <div className="flex justify-center gap-3 mb-6">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <input
                    key={index}
                    ref={(el) => inputRefs.current[index] = el}
                    type="password"
                    inputMode="numeric"
                    maxLength={1}
                    value={pin[index]}
                    onChange={(e) => handlePinChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 transition-all
                      ${pin[index] 
                        ? 'border-emerald-500 bg-emerald-50' 
                        : 'border-gray-200 bg-gray-50'
                      }
                      ${error ? 'border-red-300 animate-shake' : ''}
                      focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none`}
                    data-testid={`pin-input-${index}`}
                  />
                ))}
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
                  {error}
                </div>
              )}

              {/* Loading */}
              {loading && (
                <div className="flex items-center justify-center gap-2 text-emerald-600 mb-4">
                  <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>{language === 'pt' ? 'Verificando...' : 'Verifying...'}</span>
                </div>
              )}

              {/* Use Password Link */}
              <div className="text-center mt-6">
                <button 
                  onClick={handleUsePassword}
                  className="text-gray-500 hover:text-gray-700 text-sm flex items-center justify-center gap-2 mx-auto"
                >
                  <KeyRound className="h-4 w-4" />
                  {language === 'pt' ? 'Usar senha em vez do PIN' : 'Use password instead'}
                </button>
              </div>

              {/* Forgot PIN */}
              <div className="text-center mt-3">
                <Link to="/forgot-password" className="text-emerald-600 text-sm hover:underline">
                  {language === 'pt' ? 'Esqueci meu PIN' : 'Forgot my PIN'}
                </Link>
              </div>
            </div>
          )}

          {/* Password Step */}
          {step === 'password' && (
            <div className="p-8">
              {/* Back Button */}
              <button 
                onClick={handleChangeEmail}
                className="flex items-center gap-1 text-gray-500 hover:text-gray-700 mb-6"
              >
                <ArrowLeft className="h-4 w-4" />
                {language === 'pt' ? 'Voltar' : 'Back'}
              </button>

              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Lock className="h-8 w-8 text-slate-600" />
                </div>
                <h1 className="text-xl font-bold text-gray-800 mb-1">
                  {language === 'pt' ? 'Digite sua senha' : 'Enter your password'}
                </h1>
                <p className="text-gray-500 text-sm">{email}</p>
              </div>

              <form onSubmit={handlePasswordLogin} className="space-y-4">
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="h-14 rounded-xl text-lg pr-12"
                    data-testid="password-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
                    {error}
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      {language === 'pt' ? 'Entrar' : 'Sign In'}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-4 text-center">
                <Link to="/forgot-password" className="text-emerald-600 text-sm hover:underline">
                  {language === 'pt' ? 'Esqueci minha senha' : 'Forgot password'}
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Security Note */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
            <Smartphone className="h-4 w-4" />
            <span>{language === 'pt' ? 'Conexão segura' : 'Secure connection'}</span>
          </div>
        </div>
      </div>

      {/* CSS for shake animation */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};
