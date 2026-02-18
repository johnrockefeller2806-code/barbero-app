import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'sonner';
import { ArrowLeft, Calendar, Clock, MapPin, Check, X, Scissors } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;
const LOGO_URL = "https://customer-assets.emergentagent.com/job_f16b93ce-5ac3-4503-bae3-65d25ede4a91/artifacts/kkaa9c50_WhatsApp%20Image%202026-01-30%20at%2021.59.32.jpeg";

export const Bookings = () => {
  const navigate = useNavigate();
  const { token, isAuthenticated, isLoading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (token) fetchBookings();
  }, [token]);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/bookings/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      await axios.delete(`${API_URL}/api/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Booking cancelled');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to cancel booking');
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (filter === 'all') return true;
    return b.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-[#00ff88]/20 text-[#00ff88]';
      case 'pending': return 'bg-[#ffb800]/20 text-[#ffb800]';
      case 'completed': return 'bg-[#7c3aed]/20 text-[#a855f7]';
      case 'cancelled': return 'bg-[#ff3366]/20 text-[#ff3366]';
      default: return 'bg-white/10 text-white';
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
    <div className="min-h-screen bg-[#0a0a0f] relative">
      <div className="orb w-[300px] h-[300px] -top-24 -right-24 fixed" style={{ background: '#d4af37', filter: 'blur(80px)', opacity: 0.3 }} />

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/home')}
              className="w-12 h-12 rounded-2xl glass-card flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-2xl font-bold text-white">Meus Agendamentos</h1>
          </div>
          <img src={LOGO_URL} alt="ClikBarber" className="h-10" />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                filter === f
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-[#0a0a0f]'
                  : 'glass-card text-[#71717a] hover:text-white'
              }`}
            >
              {f === 'all' ? 'Todos' : f === 'pending' ? 'Pendente' : f === 'confirmed' ? 'Confirmado' : f === 'completed' ? 'Concluído' : 'Cancelado'}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-[#52525e] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Nenhum agendamento</h3>
            <p className="text-[#71717a] mb-6">Encontre um barbeiro e faça seu primeiro agendamento!</p>
            <button
              onClick={() => navigate('/home')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-[#0a0a0f] font-bold"
            >
              Encontrar Barbeiros
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map(booking => (
              <div key={booking.id} className="glass-card p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{booking.barber_name}</h3>
                    <p className="text-[#71717a] text-sm">{booking.shop_name}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(booking.status)}`}>
                    {booking.status === 'pending' ? 'Pendente' : booking.status === 'confirmed' ? 'Confirmado' : booking.status === 'completed' ? 'Concluído' : 'Cancelado'}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-[#a1a1aa]">
                    <Scissors className="w-4 h-4" />
                    <span>{booking.service_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#a1a1aa]">
                    <Calendar className="w-4 h-4" />
                    <span>{booking.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#a1a1aa]">
                    <Clock className="w-4 h-4" />
                    <span>{booking.time}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-[#24242e]">
                  <div className="text-xl font-bold text-white">€{booking.service_price}</div>
                  
                  {booking.status === 'pending' && (
                    <button
                      onClick={() => cancelBooking(booking.id)}
                      className="px-4 py-2 rounded-xl bg-[#ff3366]/20 text-[#ff3366] text-sm font-medium hover:bg-[#ff3366]/30 transition-colors"
                    >
                      Cancelar
                    </button>
                  )}
                  
                  {booking.status === 'completed' && (
                    <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-[#0a0a0f] text-sm font-bold">
                      Avaliar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
