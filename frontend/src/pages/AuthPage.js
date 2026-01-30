import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import { Scissors, User, Mail, Lock, Phone, MapPin, ArrowRight, ArrowLeft } from 'lucide-react';

const AuthPage = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const { t } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    user_type: '',
    specialty: '',
    address: '',
    latitude: 53.3498,
    longitude: -6.2603
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(formData.email, formData.password);
      navigate(user.user_type === 'barber' ? '/barber' : '/client');
    } catch (err) {
      setError(err.response?.data?.detail || 'Credenciais inválidas');
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
      const user = await register(data);
      navigate(user.user_type === 'barber' ? '/barber' : '/client');
    } catch (err) {
      setError(err.response?.data?.detail || 'Erro ao cadastrar');
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
            <Scissors className="w-16 h-16 text-amber-500" />
          </div>
          <h1 className="font-heading text-6xl font-bold text-white uppercase tracking-tighter mb-4">
            Barber<span className="text-amber-500">X</span>
          </h1>
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
            <Scissors className="w-10 h-10 text-amber-500" />
            <span className="font-heading text-3xl font-bold text-white">BARBER<span className="text-amber-500">X</span></span>
          </div>

          {isLogin ? (
            /* LOGIN FORM */
            <form onSubmit={handleLogin} className="space-y-6" data-testid="login-form">
              <div className="text-center mb-8">
                <h2 className="font-heading text-3xl font-bold text-white uppercase">{t('auth_login')}</h2>
                <p className="text-zinc-500 mt-2">{t('auth_login_subtitle')}</p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-sm text-sm" data-testid="error-message">
                  {error}
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
                    className="w-full bg-zinc-900 border border-zinc-800 text-white pl-12 pr-4 py-4 focus:border-amber-500 transition-colors"
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
                    className="w-full bg-zinc-900 border border-zinc-800 text-white pl-12 pr-4 py-4 focus:border-amber-500 transition-colors"
                    data-testid="input-password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 text-black font-heading uppercase tracking-widest py-4 hover:bg-amber-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                data-testid="btn-login"
              >
                {loading ? t('auth_logging_in') : t('auth_btn_login')}
                <ArrowRight className="w-5 h-5" />
              </button>

              <p className="text-center text-zinc-500">
                {t('auth_no_account')}{' '}
                <button type="button" onClick={() => setIsLogin(false)} className="text-amber-500 hover:underline" data-testid="btn-goto-register">
                  {t('auth_signup')}
                </button>
              </p>
            </form>
          ) : (
            /* REGISTER FORM */
            <div data-testid="register-form">
              {!userType ? (
                /* Step 1: Choose User Type */
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="font-heading text-3xl font-bold text-white uppercase">{t('auth_register')}</h2>
                    <p className="text-zinc-500 mt-2">{t('auth_register_subtitle')}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => { setUserType('client'); getLocation(); }}
                      className="bg-zinc-900 border border-zinc-800 p-8 hover:border-amber-500 transition-all group"
                      data-testid="btn-type-client"
                    >
                      <User className="w-12 h-12 text-zinc-500 group-hover:text-amber-500 mx-auto mb-4 transition-colors" />
                      <p className="font-heading text-lg text-white uppercase">{t('auth_type_client')}</p>
                      <p className="text-zinc-500 text-sm mt-1">{t('auth_type_client_desc')}</p>
                    </button>
                    <button
                      onClick={() => { setUserType('barber'); getLocation(); }}
                      className="bg-zinc-900 border border-zinc-800 p-8 hover:border-amber-500 transition-all group"
                      data-testid="btn-type-barber"
                    >
                      <Scissors className="w-12 h-12 text-zinc-500 group-hover:text-amber-500 mx-auto mb-4 transition-colors" />
                      <p className="font-heading text-lg text-white uppercase">{t('auth_type_barber')}</p>
                      <p className="text-zinc-500 text-sm mt-1">{t('auth_type_barber_desc')}</p>
                    </button>
                  </div>

                  <p className="text-center text-zinc-500">
                    {t('auth_has_account')}{' '}
                    <button type="button" onClick={() => setIsLogin(true)} className="text-amber-500 hover:underline" data-testid="btn-goto-login">
                      {t('auth_signin')}
                    </button>
                  </p>
                </div>
              ) : (
                /* Step 2: Fill Form */
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
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-sm text-sm">
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
                        className="w-full bg-zinc-900 border border-zinc-800 text-white pl-12 pr-4 py-4 focus:border-amber-500 transition-colors"
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
                        className="w-full bg-zinc-900 border border-zinc-800 text-white pl-12 pr-4 py-4 focus:border-amber-500 transition-colors"
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
                        className="w-full bg-zinc-900 border border-zinc-800 text-white pl-12 pr-4 py-4 focus:border-amber-500 transition-colors"
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
                        className="w-full bg-zinc-900 border border-zinc-800 text-white pl-12 pr-4 py-4 focus:border-amber-500 transition-colors"
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
                            className="w-full bg-zinc-900 border border-zinc-800 text-white pl-12 pr-4 py-4 focus:border-amber-500 transition-colors"
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
                            className="w-full bg-zinc-900 border border-zinc-800 text-white pl-12 pr-4 py-4 focus:border-amber-500 transition-colors"
                            data-testid="input-address"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-amber-500 text-black font-heading uppercase tracking-widest py-4 hover:bg-amber-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    data-testid="btn-register"
                  >
                    {loading ? t('auth_registering') : t('auth_btn_register')}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
