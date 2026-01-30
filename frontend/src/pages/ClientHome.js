import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'sonner';
import { Scissors, MapPin, Star, Zap, Search, Filter, Home, Calendar, Heart, User, Clock } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;
const LOGO_URL = "https://customer-assets.emergentagent.com/job_f16b93ce-5ac3-4503-bae3-65d25ede4a91/artifacts/kkaa9c50_WhatsApp%20Image%202026-01-30%20at%2021.59.32.jpeg";

export const ClientHome = () => {
  const navigate = useNavigate();
  const { user, token, logout, isAuthenticated, isLoading } = useAuth();
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('available');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    fetchBarbers();
  }, [filter]);

  const fetchBarbers = async () => {
    try {
      const endpoint = filter === 'available' ? '/api/barbers/available' : '/api/barbers';
      const response = await axios.get(`${API_URL}${endpoint}`);
      setBarbers(response.data);
    } catch (error) {
      console.error('Error fetching barbers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filters = [
    { id: 'available', label: 'Disponíveis', icon: Zap },
    { id: 'all', label: 'Todos', icon: Scissors },
    { id: 'top', label: 'Top Avaliados', icon: Star },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative">
      {/* Background Glow */}
      <div className="orb orb-purple w-[300px] h-[300px] -top-24 -right-24 fixed" />
      <div className="orb orb-cyan w-[250px] h-[250px] bottom-48 -left-32 fixed" />

      <div className="relative z-10 pb-24">
        {/* Header */}
        <div className="p-6 pb-0">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <img src={LOGO_URL} alt="ClikBarber" className="h-10" />
            </div>
            <button 
              onClick={() => navigate('/bookings')}
              className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#d4af37] to-[#f4d03f] flex items-center justify-center"
            >
              <span className="text-[#0a0a0f] font-bold">{user?.name?.charAt(0) || 'U'}</span>
            </button>
          </div>

          {/* Hero Card */}
          <div className="glass-card p-6 mb-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/30 to-[#f4d03f]/20" />
            <div className="relative z-10">
              <div className="available-badge mb-4" style={{ background: 'rgba(212,175,55,0.15)', color: '#d4af37' }}>
                <div className="pulse-dot" style={{ background: '#d4af37' }} />
                <span>{barbers.filter(b => b.is_available).length} Disponíveis Agora</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Encontre seu<br />corte perfeito</h2>
              <p className="text-[#a1a1aa] text-sm">Agende instantaneamente com os melhores</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="glass-card flex items-center p-1 mb-6">
            <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center">
              <Search className="w-5 h-5 text-[#71717a]" />
            </div>
            <input
              type="text"
              placeholder="Buscar barbeiros, estilos..."
              className="flex-1 bg-transparent border-none text-white px-3 focus:outline-none"
            />
            <button className="w-11 h-11 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f4d03f] flex items-center justify-center">
              <Filter className="w-5 h-5 text-[#0a0a0f]" />
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-3 overflow-x-auto pb-2 mb-6 -mx-6 px-6">
            {filters.map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
                  filter === f.id
                    ? 'bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-[#0a0a0f]'
                    : 'glass-card text-[#71717a] hover:text-white'
                }`}
              >
                <f.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{f.label}</span>
              </button>
            ))}
          </div>

          {/* Section Title */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white">Barbeiros Perto de Você</h3>
            <button className="text-sm text-[#d4af37] font-medium">Ver todos</button>
          </div>
        </div>

        {/* Barber Cards */}
        <div className="px-6 space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-[#7c3aed] border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : barbers.length === 0 ? (
            <div className="text-center py-12">
              <Scissors className="w-12 h-12 text-[#52525e] mx-auto mb-4" />
              <p className="text-[#71717a]">No barbers found</p>
            </div>
          ) : (
            barbers.map(barber => (
              <div
                key={barber.id}
                onClick={() => navigate(`/barber/${barber.id}`)}
                className="glass-card overflow-hidden card-hover cursor-pointer"
                data-testid={`barber-card-${barber.id}`}
              >
                {/* Available Badge */}
                {barber.is_available && (
                  <div className="gradient-green py-2 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-1.5 h-1.5 bg-[#0a0a0f] rounded-full" />
                      <span className="text-[11px] font-bold text-[#0a0a0f] tracking-wider">AVAILABLE NOW</span>
                    </div>
                  </div>
                )}

                <div className="p-5 flex items-center gap-4">
                  {/* Avatar */}
                  <div className="relative">
                    <img
                      src={barber.avatar || `https://ui-avatars.com/api/?name=${barber.name}&background=7c3aed&color=fff`}
                      alt={barber.name}
                      className="w-[72px] h-[72px] rounded-2xl object-cover"
                    />
                    {barber.is_available && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#00ff88] rounded-full border-[3px] border-[#1a1a24]" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-white">{barber.name}</h4>
                    <p className="text-[#71717a] text-sm mb-2">{barber.shop_name}</p>
                    
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-[#fbbf24]" />
                        <span className="text-white text-sm font-medium">{barber.rating}</span>
                        <span className="text-[#52525e] text-xs">({barber.reviews_count})</span>
                      </div>
                      {barber.distance && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-[#22d3ee]" />
                          <span className="text-white text-sm">{barber.distance}</span>
                        </div>
                      )}
                    </div>

                    {/* Specialties */}
                    <div className="flex gap-1.5 flex-wrap">
                      {barber.specialties?.slice(0, 3).map(spec => (
                        <span key={spec} className="px-2 py-0.5 rounded-md bg-[#7c3aed]/20 text-[#c084fc] text-[11px] font-medium">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="text-right">
                    <div className="text-[11px] text-[#52525e]">From</div>
                    <div className="text-xl font-bold text-white">€{barber.price_range_min}</div>
                    {barber.is_available ? (
                      <button className="mt-2 px-4 py-2 rounded-xl gradient-purple text-white text-sm font-medium flex items-center gap-1">
                        <Zap className="w-4 h-4" />
                        Book
                      </button>
                    ) : (
                      <div className="mt-2 px-3 py-2 rounded-xl bg-white/5 text-[#71717a] text-sm flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Soon
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/90 to-transparent h-28 -top-8" />
        <div className="relative glass-card mx-4 mb-6 p-2">
          <div className="flex justify-around">
            <button className="w-12 h-12 rounded-xl gradient-purple flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </button>
            <button className="w-12 h-12 rounded-xl flex items-center justify-center text-[#52525e] hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button 
              onClick={() => navigate('/bookings')}
              className="w-12 h-12 rounded-xl flex items-center justify-center text-[#52525e] hover:text-white transition-colors"
            >
              <Calendar className="w-5 h-5" />
            </button>
            <button className="w-12 h-12 rounded-xl flex items-center justify-center text-[#52525e] hover:text-white transition-colors">
              <Heart className="w-5 h-5" />
            </button>
            <button 
              onClick={logout}
              className="w-12 h-12 rounded-xl flex items-center justify-center text-[#52525e] hover:text-white transition-colors"
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
