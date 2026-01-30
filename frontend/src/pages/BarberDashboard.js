import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'sonner';
import { Scissors, Home, Calendar, MessageCircle, Wallet, User, Settings, Check, Clock, DollarSign, Users, Star, ChevronRight } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;
const LOGO_URL = "https://customer-assets.emergentagent.com/job_f16b93ce-5ac3-4503-bae3-65d25ede4a91/artifacts/kkaa9c50_WhatsApp%20Image%202026-01-30%20at%2021.59.32.jpeg";

export const BarberDashboard = () => {
  const navigate = useNavigate();
  const { user, token, logout, isAuthenticated, isLoading } = useAuth();
  const [isAvailable, setIsAvailable] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isLoading && user?.role !== 'barber') {
      navigate('/home');
      return;
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  useEffect(() => {
    if (token && user?.role === 'barber') {
      fetchDashboard();
      setIsAvailable(user?.is_available || false);
    }
  }, [token, user]);

  const fetchDashboard = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/barber/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDashboard(response.data);
      setIsAvailable(response.data.is_available);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async () => {
    const newStatus = !isAvailable;
    setIsAvailable(newStatus);
    
    try {
      await axios.post(
        `${API_URL}/api/barbers/availability`,
        { available: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(newStatus ? "You're now online! Clients can find you." : "You're now offline.");
    } catch (error) {
      setIsAvailable(!newStatus);
      toast.error('Failed to update availability');
    }
  };

  const confirmBooking = async (bookingId) => {
    try {
      await axios.patch(
        `${API_URL}/api/bookings/${bookingId}/status?status=confirmed`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Booking confirmed!');
      fetchDashboard();
    } catch (error) {
      toast.error('Failed to confirm booking');
    }
  };

  const completeBooking = async (bookingId) => {
    try {
      await axios.patch(
        `${API_URL}/api/bookings/${bookingId}/status?status=completed`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Booking completed!');
      fetchDashboard();
    } catch (error) {
      toast.error('Failed to complete booking');
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative pb-24">
      {/* Background Glow */}
      <div className={`fixed -top-32 -right-32 w-[400px] h-[400px] rounded-full transition-colors duration-500`} style={{ background: isAvailable ? '#d4af37' : '#7c3aed', filter: 'blur(80px)', opacity: 0.3 }} />

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <img src={LOGO_URL} alt="ClikBarber" className="h-12" />
          <button className="w-12 h-12 rounded-2xl glass-card flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Olá, {user?.name?.split(' ')[0]} ✂️</h1>
          <p className="text-[#71717a]">{user?.shop_name || 'Sua Barbearia'}</p>
        </div>

        {/* AVAILABILITY TOGGLE - Main Feature */}
        <button
          onClick={toggleAvailability}
          className={`w-full rounded-3xl p-6 mb-6 transition-all duration-300 relative overflow-hidden ${
            isAvailable ? 'shadow-[0_0_40px_rgba(212,175,55,0.4)]' : ''
          }`}
          style={{
            background: isAvailable
              ? 'linear-gradient(135deg, #d4af37, #f4d03f)'
              : 'rgba(255,255,255,0.05)'
          }}
          data-testid="availability-toggle"
        >
          {/* Pulse Rings */}
          {isAvailable && (
            <>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-black/10 animate-ping" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full bg-black/5" />
            </>
          )}

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                isAvailable ? 'bg-black/20' : 'bg-white/10'
              }`}>
                <div className={`w-8 h-8 rounded-full ${
                  isAvailable ? 'bg-[#0a0a0f]' : 'bg-white/40'
                }`} />
              </div>
              <div className="text-left">
                <h2 className={`text-xl font-bold tracking-wide ${
                  isAvailable ? 'text-[#0a0a0f]' : 'text-white'
                }`}>
                  {isAvailable ? 'DISPONÍVEL AGORA' : 'OFFLINE'}
                </h2>
                <p className={`text-sm ${
                  isAvailable ? 'text-black/60' : 'text-white/60'
                }`}>
                  {isAvailable
                    ? 'Clientes podem te encontrar no mapa'
                    : 'Toque para ficar online e receber agendamentos'}
                </p>
              </div>
            </div>

            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isAvailable ? 'bg-black/20' : 'bg-white/20'
            }`}>
              <div className={`w-4 h-4 rounded-full ${
                isAvailable ? 'bg-[#0a0a0f]' : 'bg-white/40'
              }`} />
            </div>
          </div>
        </button>

        {/* Today's Stats */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-white mb-4">Desempenho de Hoje</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-card p-5 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/20 flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-6 h-6 text-[#d4af37]" />
              </div>
              <div className="text-2xl font-bold text-white">€{dashboard?.today?.earnings || 0}</div>
              <div className="text-[#71717a] text-sm">Ganhos</div>
            </div>
            <div className="glass-card p-5 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#a855f7]/20 flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-[#a855f7]" />
              </div>
              <div className="text-2xl font-bold text-white">{dashboard?.today?.clients || 0}</div>
              <div className="text-[#71717a] text-sm">Clientes</div>
            </div>
            <div className="glass-card p-5 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#fbbf24]/20 flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-[#fbbf24]" />
              </div>
              <div className="text-2xl font-bold text-white">{dashboard?.rating || 5.0}</div>
              <div className="text-[#71717a] text-sm">Avaliação</div>
            </div>
            <div className="glass-card p-5 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#22d3ee]/20 flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-[#22d3ee]" />
              </div>
              <div className="text-2xl font-bold text-white">{dashboard?.today?.pending || 0}</div>
              <div className="text-[#71717a] text-sm">Pendentes</div>
            </div>
          </div>
        </div>

        {/* Upcoming Bookings */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white">Próximos</h3>
            <button className="text-[#d4af37] text-sm font-medium">Ver todos</button>
          </div>

          {!dashboard?.today?.bookings?.length ? (
            <div className="glass-card p-8 text-center">
              <Calendar className="w-12 h-12 text-[#52525e] mx-auto mb-3" />
              <p className="text-[#71717a]">Sem agendamentos hoje</p>
            </div>
          ) : (
            <div className="space-y-3">
              {dashboard.today.bookings.map(booking => (
                <div key={booking.id} className="glass-card p-4">
                  <div className="flex items-center gap-4">
                    <div className="px-3 py-2 rounded-xl bg-[#d4af37]/20">
                      <span className="text-[#d4af37] font-bold text-sm">{booking.time}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{booking.client_name}</h4>
                      <p className="text-[#71717a] text-sm">{booking.service_name}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-[#d4af37] font-bold">€{booking.service_price}</div>
                    </div>
                    {booking.status === 'pending' && (
                      <button
                        onClick={() => confirmBooking(booking.id)}
                        className="w-11 h-11 rounded-xl bg-[#d4af37]/20 flex items-center justify-center hover:bg-[#d4af37]/30 transition-colors"
                      >
                        <Check className="w-5 h-5 text-[#d4af37]" />
                      </button>
                    )}
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => completeBooking(booking.id)}
                        className="w-11 h-11 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f4d03f] flex items-center justify-center"
                      >
                        <Check className="w-5 h-5 text-[#0a0a0f]" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-4 gap-3">
            <button className="flex flex-col items-center">
              <div className="w-full aspect-square rounded-2xl bg-gradient-to-r from-[#d4af37] to-[#f4d03f] flex items-center justify-center mb-2">
                <Calendar className="w-7 h-7 text-[#0a0a0f]" />
              </div>
              <span className="text-[#71717a] text-xs">Agenda</span>
            </button>
            <button className="flex flex-col items-center">
              <div className="w-full aspect-square rounded-2xl gradient-cyan flex items-center justify-center mb-2">
                <Scissors className="w-7 h-7 text-white" />
              </div>
              <span className="text-[#71717a] text-xs">Serviços</span>
            </button>
            <button className="flex flex-col items-center">
              <div className="w-full aspect-square rounded-2xl gradient-pink flex items-center justify-center mb-2">
                <Star className="w-7 h-7 text-white" />
              </div>
              <span className="text-[#71717a] text-xs">Analytics</span>
            </button>
            <button className="flex flex-col items-center">
              <div className="w-full aspect-square rounded-2xl bg-gradient-to-br from-[#f97316] to-[#fb923c] flex items-center justify-center mb-2">
                <Wallet className="w-7 h-7 text-white" />
              </div>
              <span className="text-[#71717a] text-xs">Ganhos</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/90 to-transparent h-28 -top-8" />
        <div className="relative glass-card mx-4 mb-6 p-2">
          <div className="flex justify-around">
            <button className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f4d03f] flex items-center justify-center">
              <Home className="w-5 h-5 text-[#0a0a0f]" />
            </button>
            <button className="w-12 h-12 rounded-xl flex items-center justify-center text-[#52525e]">
              <Calendar className="w-5 h-5" />
            </button>
            <button className="w-12 h-12 rounded-xl flex items-center justify-center text-[#52525e]">
              <MessageCircle className="w-5 h-5" />
            </button>
            <button className="w-12 h-12 rounded-xl flex items-center justify-center text-[#52525e]">
              <Wallet className="w-5 h-5" />
            </button>
            <button
              onClick={logout}
              className="w-12 h-12 rounded-xl flex items-center justify-center text-[#52525e]"
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
