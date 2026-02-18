import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { Shield, Check, ArrowRight, X, Lock, Fingerprint } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const LOGO_URL = "https://customer-assets.emergentagent.com/job_dublin-study/artifacts/o9gnc0xi_WhatsApp%20Image%202026-01-11%20at%2023.59.07.jpeg";

export const PinSetup = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { language } = useLanguage();
  
  const [step, setStep] = useState(1); // 1: enter PIN, 2: confirm PIN
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const inputRefs = useRef([]);
  const confirmInputRefs = useRef([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    // Focus first confirm input when step changes
    if (step === 2 && confirmInputRefs.current[0]) {
      confirmInputRefs.current[0].focus();
    }
  }, [step]);

  const handlePinChange = (index, value, isConfirm = false) => {
    if (!/^\d*$/.test(value)) return; // Only digits
    
    const currentPin = isConfirm ? [...confirmPin] : [...pin];
    const refs = isConfirm ? confirmInputRefs : inputRefs;
    const setCurrentPin = isConfirm ? setConfirmPin : setPin;
    
    currentPin[index] = value.slice(-1); // Only last digit
    setCurrentPin(currentPin);
    setError('');
    
    // Auto focus next input
    if (value && index < 5) {
      refs.current[index + 1]?.focus();
    }
    
    // Check if PIN is complete
    if (currentPin.every(d => d !== '')) {
      if (isConfirm) {
        // Validate confirmation
        if (currentPin.join('') === pin.join('')) {
          handleSubmit(currentPin.join(''));
        } else {
          setError(language === 'pt' ? 'Os PINs não coincidem' : 'PINs do not match');
          setConfirmPin(['', '', '', '', '', '']);
          setTimeout(() => confirmInputRefs.current[0]?.focus(), 100);
        }
      } else {
        // Move to confirmation step
        setTimeout(() => setStep(2), 300);
      }
    }
  };

  const handleKeyDown = (index, e, isConfirm = false) => {
    const refs = isConfirm ? confirmInputRefs : inputRefs;
    const currentPin = isConfirm ? confirmPin : pin;
    const setCurrentPin = isConfirm ? setConfirmPin : setPin;
    
    if (e.key === 'Backspace' && !currentPin[index] && index > 0) {
      refs.current[index - 1]?.focus();
      const newPin = [...currentPin];
      newPin[index - 1] = '';
      setCurrentPin(newPin);
    }
  };

  const handleSubmit = async (finalPin) => {
    setLoading(true);
    
    try {
      await axios.post(`${API}/auth/pin/setup`, 
        { pin: finalPin },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      // Save email in localStorage for quick login
      localStorage.setItem('lastEmail', user.email);
      localStorage.setItem('pinEnabled', 'true');
      
      toast.success(language === 'pt' ? 'PIN configurado com sucesso!' : 'PIN setup successful!');
      
      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'school') {
        navigate('/school');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.response?.data?.detail || 'Erro ao configurar PIN');
      setConfirmPin(['', '', '', '', '', '']);
      setPin(['', '', '', '', '', '']);
      setStep(1);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    if (user.role === 'admin') {
      navigate('/admin');
    } else if (user.role === 'school') {
      navigate('/school');
    } else {
      navigate('/dashboard');
    }
  };

  const renderPinInputs = (currentPin, setCurrentPin, refs, isConfirm = false) => (
    <div className="flex justify-center gap-3">
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <input
          key={index}
          ref={(el) => refs.current[index] = el}
          type="password"
          inputMode="numeric"
          maxLength={1}
          value={currentPin[index]}
          onChange={(e) => handlePinChange(index, e.target.value, isConfirm)}
          onKeyDown={(e) => handleKeyDown(index, e, isConfirm)}
          className={`w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 transition-all
            ${currentPin[index] 
              ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
              : 'border-gray-200 bg-white'
            }
            focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none`}
          data-testid={`pin-input-${index}`}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {language === 'pt' ? 'Configure seu PIN' : 'Setup your PIN'}
            </h1>
            <p className="text-emerald-100">
              {language === 'pt' 
                ? 'Acesso rápido e seguro ao seu app' 
                : 'Quick and secure access to your app'}
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Step Indicator */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm
                ${step >= 1 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {step > 1 ? <Check className="h-5 w-5" /> : '1'}
              </div>
              <div className={`w-16 h-1 rounded ${step > 1 ? 'bg-emerald-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm
                ${step === 2 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                2
              </div>
            </div>

            {/* Step Content */}
            {step === 1 ? (
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Lock className="h-5 w-5 text-emerald-600" />
                  <h2 className="text-lg font-semibold text-gray-800">
                    {language === 'pt' ? 'Crie um PIN de 6 dígitos' : 'Create a 6-digit PIN'}
                  </h2>
                </div>
                <p className="text-gray-500 text-sm mb-6">
                  {language === 'pt' 
                    ? 'Use números que você vai lembrar facilmente' 
                    : 'Use numbers you will remember easily'}
                </p>
                
                {renderPinInputs(pin, setPin, inputRefs)}
                
                <p className="text-gray-400 text-xs mt-4">
                  {language === 'pt' ? 'Evite sequências como 123456' : 'Avoid sequences like 123456'}
                </p>
              </div>
            ) : (
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Fingerprint className="h-5 w-5 text-emerald-600" />
                  <h2 className="text-lg font-semibold text-gray-800">
                    {language === 'pt' ? 'Confirme seu PIN' : 'Confirm your PIN'}
                  </h2>
                </div>
                <p className="text-gray-500 text-sm mb-6">
                  {language === 'pt' 
                    ? 'Digite o PIN novamente para confirmar' 
                    : 'Enter the PIN again to confirm'}
                </p>
                
                {renderPinInputs(confirmPin, setConfirmPin, confirmInputRefs, true)}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="mt-6 flex items-center justify-center gap-2 text-emerald-600">
                <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                <span>{language === 'pt' ? 'Configurando...' : 'Setting up...'}</span>
              </div>
            )}

            {/* Benefits */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="h-4 w-4 text-emerald-600" />
                </div>
                <span>{language === 'pt' ? 'Login rápido em segundos' : 'Quick login in seconds'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="h-4 w-4 text-emerald-600" />
                </div>
                <span>{language === 'pt' ? 'Não precisa digitar senha toda vez' : 'No need to type password every time'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="h-4 w-4 text-emerald-600" />
                </div>
                <span>{language === 'pt' ? 'Seguro como app de banco' : 'Secure like a bank app'}</span>
              </div>
            </div>

            {/* Skip Button */}
            <div className="mt-8 text-center">
              <button
                onClick={handleSkip}
                className="text-gray-500 hover:text-gray-700 text-sm underline"
              >
                {language === 'pt' ? 'Configurar depois' : 'Setup later'}
              </button>
            </div>
          </div>
        </div>

        {/* Logo */}
        <div className="mt-6 text-center">
          <img 
            src={LOGO_URL} 
            alt="STUFF Intercâmbio" 
            className="h-10 w-auto mx-auto opacity-80"
          />
        </div>
      </div>
    </div>
  );
};
