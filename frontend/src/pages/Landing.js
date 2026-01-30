import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { MapPin, Zap, Star, Clock, Users, Scissors } from 'lucide-react';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_f16b93ce-5ac3-4503-bae3-65d25ede4a91/artifacts/kkaa9c50_WhatsApp%20Image%202026-01-30%20at%2021.59.32.jpeg";

export const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'barber') {
        navigate('/dashboard');
      } else {
        navigate('/home');
      }
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      {/* Animated Orbs */}
      <div className="orb orb-purple w-[500px] h-[500px] -top-48 -right-48" />
      <div className="orb orb-cyan w-[400px] h-[400px] bottom-20 -left-48" />
      <div className="orb orb-pink w-[300px] h-[300px] bottom-0 right-20" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="h-px bg-white my-12" />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Navbar */}
        <nav className="flex items-center justify-between mb-20">
          <div className="flex items-center gap-3">
            <img 
              src={LOGO_URL} 
              alt="ClikBarber" 
              className="h-14 w-auto object-contain"
            />
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="btn-secondary"
              data-testid="login-btn"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/register')}
              className="btn-primary"
              data-testid="register-btn"
            >
              Get Started
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[70vh]">
          <div className="animate-slide-up">
            <div className="available-badge mb-6">
              <div className="pulse-dot" />
              <span>Live in Dublin, Ireland</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
              Seu Barbeiro.
              <br />
              <span className="bg-gradient-to-r from-[#d4af37] to-[#f4d03f] bg-clip-text text-transparent">
                Em um Clik.
              </span>
            </h1>
            
            <p className="text-xl text-[#a1a1aa] mb-10 max-w-lg">
              Book instantly with top-rated barbers near you. No waiting, no hassle. 
              Just great cuts.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/register')}
                className="btn-green text-lg px-10 py-4"
                data-testid="find-barber-btn"
              >
                <Zap className="w-5 h-5" />
                Find a Barber
              </button>
              <button
                onClick={() => navigate('/register/barber')}
                className="btn-secondary text-lg px-10 py-4"
                data-testid="become-barber-btn"
              >
                <Scissors className="w-5 h-5" />
                I'm a Barber
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-12 mt-12 pt-12 border-t border-[#24242e]">
              <div>
                <div className="text-3xl font-bold text-white">500+</div>
                <div className="text-[#71717a]">Happy Clients</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">50+</div>
                <div className="text-[#71717a]">Pro Barbers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">4.9</div>
                <div className="text-[#71717a]">Avg Rating</div>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid gap-6">
            <div className="glass-card p-8 card-hover animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="w-14 h-14 rounded-2xl gradient-green flex items-center justify-center mb-4">
                <MapPin className="w-7 h-7 text-[#0a0a0f]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Real-Time Availability</h3>
              <p className="text-[#a1a1aa]">See which barbers are available right now on the map.</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="glass-card p-6 card-hover animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="w-12 h-12 rounded-xl gradient-purple flex items-center justify-center mb-3">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-white mb-1">Instant Booking</h4>
                <p className="text-sm text-[#71717a]">Book in seconds, no calls needed</p>
              </div>

              <div className="glass-card p-6 card-hover animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <div className="w-12 h-12 rounded-xl gradient-cyan flex items-center justify-center mb-3">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-white mb-1">Top Rated</h4>
                <p className="text-sm text-[#71717a]">Only verified professionals</p>
              </div>
            </div>

            <div className="glass-card p-8 card-hover animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="w-14 h-14 rounded-2xl gradient-pink flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">For Barbers Too</h3>
              <p className="text-[#a1a1aa]">Manage your schedule, go online when you're ready, get paid instantly.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-24 pt-12 border-t border-[#24242e] text-center">
          <div className="flex items-center justify-center gap-2 text-[#71717a]">
            <MapPin className="w-4 h-4 text-[#00ff88]" />
            <span>Dublin, Ireland 🇮🇪</span>
          </div>
          <p className="mt-4 text-[#52525e]">© 2025 QuickCut. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};
