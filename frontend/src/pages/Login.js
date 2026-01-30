import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Fingerprint } from 'lucide-react';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_f16b93ce-5ac3-4503-bae3-65d25ede4a91/artifacts/kkaa9c50_WhatsApp%20Image%202026-01-30%20at%2021.59.32.jpeg";

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}!`);
      if (user.role === 'barber') {
        navigate('/dashboard');
      } else {
        navigate('/home');
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden flex items-center justify-center px-6">
      {/* Animated Orbs */}
      <div className="orb orb-purple w-[400px] h-[400px] -top-36 -right-36" />
      <div className="orb orb-cyan w-[300px] h-[300px] bottom-24 -left-36" />
      <div className="orb orb-pink w-[200px] h-[200px] -bottom-12 -right-12" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="h-px bg-white my-16" />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-10">
          <img 
            src={LOGO_URL} 
            alt="ClikBarber" 
            className="h-24 mx-auto mb-4"
          />
          <p className="text-[#71717a] mt-2">Agende seu corte perfeito</p>
        </div>

        {/* Login Card */}
        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
          <p className="text-[#71717a] mb-8">Sign in to continue</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71717a]">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-dark pl-12"
                data-testid="email-input"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71717a]">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-dark pl-12 pr-12"
                data-testid="password-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#71717a] hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="text-right">
              <button type="button" className="text-sm text-[#a855f7] hover:text-[#c084fc] font-medium">
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center text-lg py-4"
              data-testid="login-submit"
            >
              {loading ? (
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-[#24242e]" />
            <span className="text-sm text-[#71717a]">or continue with</span>
            <div className="flex-1 h-px bg-[#24242e]" />
          </div>

          {/* Social Login */}
          <div className="flex justify-center gap-4">
            <button className="w-14 h-14 rounded-2xl glass-card flex items-center justify-center hover:bg-white/10 transition-colors">
              <svg className="w-6 h-6" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            </button>
            <button className="w-14 h-14 rounded-2xl glass-card flex items-center justify-center hover:bg-white/10 transition-colors">
              <svg className="w-6 h-6" viewBox="0 0 24 24"><path fill="currentColor" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
            </button>
            <button className="w-14 h-14 rounded-2xl glass-card flex items-center justify-center hover:bg-white/10 transition-colors">
              <Fingerprint className="w-6 h-6 text-[#00ff88]" />
            </button>
          </div>
        </div>

        {/* Register Link */}
        <div className="text-center mt-8">
          <p className="text-[#71717a] mb-4">Don't have an account?</p>
          <div className="flex justify-center gap-3">
            <Link
              to="/register"
              className="px-6 py-3 rounded-xl bg-[#7c3aed]/20 border border-[#7c3aed]/30 text-[#a855f7] font-medium hover:bg-[#7c3aed]/30 transition-colors flex items-center gap-2"
              data-testid="register-client-link"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              I'm a Client
            </Link>
            <Link
              to="/register/barber"
              className="px-6 py-3 rounded-xl bg-[#00ff88]/20 border border-[#00ff88]/30 text-[#00ff88] font-medium hover:bg-[#00ff88]/30 transition-colors flex items-center gap-2"
              data-testid="register-barber-link"
            >
              <Scissors className="w-5 h-5" />
              I'm a Barber
            </Link>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center justify-center gap-2 mt-8 text-[#71717a]">
          <div className="w-2 h-2 bg-[#00ff88] rounded-full" />
          <span>Dublin, Ireland 🇮🇪</span>
        </div>
      </div>
    </div>
  );
};
