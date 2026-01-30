import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'sonner';
import { ArrowLeft, Star, MapPin, Clock, Zap, Calendar, Check } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export const BarberDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();
  const [barber, setBarber] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    fetchBarber();
    fetchServices();
  }, [id]);

  const fetchBarber = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/barbers/${id}`);
      setBarber(response.data);
    } catch (error) {
      toast.error('Barber not found');
      navigate('/home');
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/barbers/${id}/services`);
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleBook = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to book');
      navigate('/login');
      return;
    }

    if (!selectedService || !selectedDate || !selectedTime) {
      toast.error('Please select service, date and time');
      return;
    }

    setBooking(true);
    try {
      await axios.post(
        `${API_URL}/api/bookings`,
        {
          barber_id: id,
          service_id: selectedService.id,
          date: selectedDate,
          time: selectedTime
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Booking confirmed!');
      navigate('/bookings');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  // Generate available times
  const times = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];

  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      value: date.toISOString().split('T')[0],
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.getDate()
    };
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#7c3aed] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!barber) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative pb-32">
      {/* Background */}
      <div className="orb orb-purple w-[300px] h-[300px] -top-24 -right-24 fixed" />

      {/* Header */}
      <div className="p-6">
        <button
          onClick={() => navigate(-1)}
          className="w-12 h-12 rounded-2xl glass-card flex items-center justify-center mb-6"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        {/* Barber Card */}
        <div className="glass-card p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="relative">
              <img
                src={barber.avatar || `https://ui-avatars.com/api/?name=${barber.name}&background=7c3aed&color=fff`}
                alt={barber.name}
                className="w-24 h-24 rounded-2xl object-cover"
              />
              {barber.is_available && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#00ff88] rounded-full border-[3px] border-[#1a1a24] flex items-center justify-center">
                  <Check className="w-3 h-3 text-[#0a0a0f]" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {barber.is_available && (
                  <span className="px-2 py-0.5 rounded-full bg-[#00ff88]/20 text-[#00ff88] text-[10px] font-bold">
                    AVAILABLE
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-white">{barber.name}</h1>
              <p className="text-[#71717a]">{barber.shop_name}</p>

              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-[#fbbf24]" />
                  <span className="text-white font-medium">{barber.rating}</span>
                  <span className="text-[#52525e] text-sm">({barber.reviews_count} reviews)</span>
                </div>
              </div>

              <div className="flex items-center gap-1 mt-2 text-[#71717a]">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{barber.address}</span>
              </div>
            </div>
          </div>

          {/* Specialties */}
          <div className="flex gap-2 flex-wrap mt-4 pt-4 border-t border-[#24242e]">
            {barber.specialties?.map(spec => (
              <span key={spec} className="px-3 py-1.5 rounded-lg bg-[#7c3aed]/20 text-[#c084fc] text-sm font-medium">
                {spec}
              </span>
            ))}
          </div>
        </div>

        {/* Services */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-white mb-4">Services</h2>
          <div className="space-y-3">
            {services.map(service => (
              <button
                key={service.id}
                onClick={() => setSelectedService(service)}
                className={`w-full glass-card p-4 text-left transition-all ${
                  selectedService?.id === service.id
                    ? 'border-[#7c3aed] ring-2 ring-[#7c3aed]/30'
                    : 'hover:bg-white/5'
                }`}
                data-testid={`service-${service.id}`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-white font-medium">{service.name}</h3>
                    <div className="flex items-center gap-2 mt-1 text-[#71717a] text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{service.duration_minutes} min</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-white">€{service.price}</div>
                    {selectedService?.id === service.id && (
                      <div className="w-6 h-6 rounded-full gradient-purple flex items-center justify-center mt-1 ml-auto">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Date Selection */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-white mb-4">Select Date</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6">
            {dates.map(d => (
              <button
                key={d.value}
                onClick={() => setSelectedDate(d.value)}
                className={`flex-shrink-0 w-16 py-3 rounded-2xl text-center transition-all ${
                  selectedDate === d.value
                    ? 'gradient-purple'
                    : 'glass-card hover:bg-white/10'
                }`}
              >
                <div className={`text-xs ${selectedDate === d.value ? 'text-white/70' : 'text-[#71717a]'}`}>
                  {d.day}
                </div>
                <div className={`text-xl font-bold ${selectedDate === d.value ? 'text-white' : 'text-white'}`}>
                  {d.date}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Time Selection */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-white mb-4">Select Time</h2>
          <div className="grid grid-cols-4 gap-2">
            {times.map(time => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`py-3 rounded-xl text-sm font-medium transition-all ${
                  selectedTime === time
                    ? 'gradient-purple text-white'
                    : 'glass-card text-[#a1a1aa] hover:text-white'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Book Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f] to-transparent pt-12">
        <button
          onClick={handleBook}
          disabled={booking || !selectedService || !selectedDate || !selectedTime}
          className="btn-green w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="book-button"
        >
          {booking ? (
            <div className="flex gap-1 justify-center">
              <div className="w-2 h-2 bg-[#0a0a0f] rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-[#0a0a0f] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-[#0a0a0f] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Book Now {selectedService && `- €${selectedService.price}`}
            </>
          )}
        </button>
      </div>
    </div>
  );
};
