import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { Scissors, Mail, Lock, User, Phone, MapPin, ArrowRight, Building, Tag } from 'lucide-react';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_f16b93ce-5ac3-4503-bae3-65d25ede4a91/artifacts/kkaa9c50_WhatsApp%20Image%202026-01-30%20at%2021.59.32.jpeg";

export const Register = ({ isBarber: isBarberProp }) => {
  const location = useLocation();
  const isBarber = isBarberProp || location.pathname.includes('barber');
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    // Barber fields
    shop_name: '',
    address: '',
    specialties: []
  });

  const specialtyOptions = ['Fade', 'Beard', 'Classic', 'Skin Fade', 'Design', 'Color', 'Razor', 'Hot Towel'];

  const toggleSpecialty = (spec) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(spec)
        ? prev.specialties.filter(s => s !== spec)
        : [...prev.specialties, spec]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (isBarber && (!formData.shop_name || !formData.address)) {
      toast.error('Please fill in shop name and address');
      return;
    }

    setLoading(true);
    try {
      const data = isBarber ? formData : {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone
      };
      
      const user = await register(data);
      toast.success(`Welcome to QuickCut, ${user.name}!`);
      
      if (user.role === 'barber') {
        navigate('/dashboard');
      } else {
        navigate('/home');
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden flex items-center justify-center px-6 py-12">
      {/* Animated Orbs */}
      <div className={`orb ${isBarber ? 'orb-cyan' : 'orb-purple'} w-[400px] h-[400px] -top-36 -right-36`} />
      <div className="orb orb-pink w-[300px] h-[300px] bottom-24 -left-36" />

      <div className="relative z-10 w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className={`w-20 h-20 rounded-3xl ${isBarber ? 'gradient-green' : 'gradient-purple'} flex items-center justify-center mx-auto mb-4 ${isBarber ? 'glow-green' : 'glow-purple'}`}>
            <Scissors className={`w-10 h-10 ${isBarber ? 'text-[#0a0a0f]' : 'text-white'}`} />
          </div>
          <h1 className="text-3xl font-extrabold text-white">Join QuickCut</h1>
          <p className="text-[#71717a] mt-2">
            {isBarber ? 'Start getting bookings today' : 'Find your perfect barber'}
          </p>
        </div>

        {/* Role Toggle */}
        <div className="glass-card p-1 mb-6 flex">
          <Link
            to="/register"
            className={`flex-1 py-3 rounded-xl text-center font-medium transition-all ${
              !isBarber ? 'gradient-purple text-white' : 'text-[#71717a] hover:text-white'
            }`}
          >
            <User className="w-4 h-4 inline mr-2" />
            Client
          </Link>
          <Link
            to="/register/barber"
            className={`flex-1 py-3 rounded-xl text-center font-medium transition-all ${
              isBarber ? 'gradient-green text-[#0a0a0f]' : 'text-[#71717a] hover:text-white'
            }`}
          >
            <Scissors className="w-4 h-4 inline mr-2" />
            Barber
          </Link>
        </div>

        {/* Register Card */}
        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71717a]">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Full Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-dark pl-12"
                data-testid="name-input"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71717a]">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                placeholder="Email *"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                type="password"
                placeholder="Password *"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input-dark pl-12"
                data-testid="password-input"
              />
            </div>

            {/* Phone */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71717a]">
                <Phone className="w-5 h-5" />
              </div>
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input-dark pl-12"
                data-testid="phone-input"
              />
            </div>

            {/* Barber Fields */}
            {isBarber && (
              <>
                <div className="pt-4 border-t border-[#24242e]">
                  <h3 className="text-white font-medium mb-4">Shop Details</h3>
                </div>

                {/* Shop Name */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71717a]">
                    <Building className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Shop Name *"
                    value={formData.shop_name}
                    onChange={(e) => setFormData({ ...formData, shop_name: e.target.value })}
                    className="input-dark pl-12"
                    data-testid="shop-name-input"
                  />
                </div>

                {/* Address */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71717a]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Shop Address *"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="input-dark pl-12"
                    data-testid="address-input"
                  />
                </div>

                {/* Specialties */}
                <div>
                  <div className="flex items-center gap-2 mb-3 text-[#71717a]">
                    <Tag className="w-5 h-5" />
                    <span className="text-sm">Specialties</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {specialtyOptions.map(spec => (
                      <button
                        key={spec}
                        type="button"
                        onClick={() => toggleSpecialty(spec)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          formData.specialties.includes(spec)
                            ? 'gradient-purple text-white'
                            : 'bg-[#24242e] text-[#a1a1aa] hover:bg-[#2e2e3a]'
                        }`}
                      >
                        {spec}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`${isBarber ? 'btn-green' : 'btn-primary'} w-full justify-center text-lg py-4 mt-6`}
              data-testid="register-submit"
            >
              {loading ? (
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              ) : (
                <>
                  {isBarber ? 'Start Getting Bookings' : 'Create Account'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Login Link */}
        <p className="text-center mt-6 text-[#71717a]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#a855f7] hover:text-[#c084fc] font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
