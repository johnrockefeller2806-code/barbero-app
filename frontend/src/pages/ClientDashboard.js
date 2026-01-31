import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, MapPin, Star, Clock, Users, LogOut, Filter, Navigation, Scissors, User, Home, Car, Banknote, CreditCard, Share2, Gift, Instagram, Radio, MapPinOff, Calendar, CalendarClock, Heart, X } from 'lucide-react';
import ShareButton from '../components/ShareButton';
import ReviewModal from '../components/ReviewModal';
import ReferralSection from '../components/ReferralSection';
import TipModal from '../components/TipModal';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const LOGO_URL = "https://customer-assets.emergentagent.com/job_f16b93ce-5ac3-4503-bae3-65d25ede4a91/artifacts/7tsbrqqb_WhatsApp%20Image%202026-01-30%20at%2021.59.32.jpeg";

// Fix Leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons
const createIcon = (color, size = 30) => L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background: ${color}; width: ${size}px; height: ${size}px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
    <svg width="${size/2}" height="${size/2}" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M21.8 16c-.2 0-.4 0-.6-.1C12.8 13.4 4.4 13.4 2.8 16c-.2 0-.4.1-.6.1-1.2 0-2.2-1-2.2-2.2 0-.8.4-1.5 1.1-1.9C3.9 10.3 8 9 12 9s8.1 1.3 10.9 3c.7.4 1.1 1.1 1.1 1.9 0 1.2-1 2.1-2.2 2.1zM12 7c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3z"/>
    </svg>
  </div>`,
  iconSize: [size, size],
  iconAnchor: [size/2, size/2],
});

const onlineIcon = createIcon('#22C55E', 36);  // Verde para online
const offlineIcon = createIcon('#EF4444', 32);  // Vermelho para offline
const userIcon = createIcon('#F59E0B', 28);  // Amarelo para usuário

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [barbers, setBarbers] = useState([]);
  const [filteredBarbers, setFilteredBarbers] = useState([]);
  const [search, setSearch] = useState('');
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [userLocation, setUserLocation] = useState({ lat: 53.3498, lng: -6.2603 });
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [myQueue, setMyQueue] = useState([]);
  const [view, setView] = useState('map'); // 'map' or 'list'
  const [loading, setLoading] = useState(true);
  
  // Home service state
  const [showHomeServiceModal, setShowHomeServiceModal] = useState(false);
  const [showHomeRequestModal, setShowHomeRequestModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [homeServiceAddress, setHomeServiceAddress] = useState('');
  const [isHomeService, setIsHomeService] = useState(false);
  const [calculatedFee, setCalculatedFee] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash' or 'card'
  const [isTracking, setIsTracking] = useState(false);
  const [trackingStatus, setTrackingStatus] = useState('idle'); // idle, tracking, arrived
  
  // Home Service Request Modal - service selection
  const [homeServiceSelected, setHomeServiceSelected] = useState('');
  
  // Scheduling state
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  
  // Barber tracking state (for home service)
  const [barberLocation, setBarberLocation] = useState(null);
  const [showBarberTracking, setShowBarberTracking] = useState(false);
  
  // Tips state
  const [completedServices, setCompletedServices] = useState([]);
  const [showTipModal, setShowTipModal] = useState(false);
  const [selectedTipEntry, setSelectedTipEntry] = useState(null);

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => console.log('Location denied')
      );

    }
    
    fetchBarbers();
    fetchMyQueue();
    fetchCompletedServices();
    
    // Atualizar lista de barbeiros a cada 10 segundos para sincronizar status online/offline
    const interval = setInterval(() => {
      fetchBarbers();
      fetchMyQueue();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  // Live location tracking for queue
  useEffect(() => {
    let watchId = null;
    
    if (isTracking && myQueue.length > 0) {
      if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ lat: latitude, lng: longitude });
            
            // Send location to server
            try {
              await axios.put(`${API}/queue/update-location?latitude=${latitude}&longitude=${longitude}&is_moving=true`);
            } catch (e) {
              console.error('Error updating location:', e);
            }
          },
          (error) => console.log('Location error:', error),
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
        );
      }
    }
    
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isTracking, myQueue.length]);

  // Track barber location for home service
  useEffect(() => {
    let interval = null;
    
    const homeServiceEntry = myQueue.find(q => q.is_home_service && q.barber_is_moving);
    
    if (homeServiceEntry) {
      setShowBarberTracking(true);
      
      const fetchBarberLocation = async () => {
        try {
          const res = await axios.get(`${API}/queue/track/${homeServiceEntry.id}`);
          if (res.data.barber_live_latitude && res.data.barber_live_longitude) {
            setBarberLocation({
              lat: res.data.barber_live_latitude,
              lng: res.data.barber_live_longitude,
              isMoving: res.data.barber_is_moving
            });
          }
        } catch (e) {
          console.error('Error fetching barber location:', e);
        }
      };
      
      fetchBarberLocation();
      interval = setInterval(fetchBarberLocation, 3000);
    } else {
      setShowBarberTracking(false);
      setBarberLocation(null);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [myQueue]);

  const startTracking = () => {
    setIsTracking(true);
    setTrackingStatus('tracking');
  };

  const stopTracking = async () => {
    setIsTracking(false);
    setTrackingStatus('arrived');
    try {
      await axios.put(`${API}/queue/stop-tracking`);
    } catch (e) {
      console.error('Error stopping tracking:', e);
    }
  };

  useEffect(() => {
    let filtered = barbers;
    if (search) {
      filtered = filtered.filter(b => 
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.specialty?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (onlineOnly) {
      filtered = filtered.filter(b => b.is_online);
    }
    setFilteredBarbers(filtered);
  }, [barbers, search, onlineOnly]);

  const fetchBarbers = async () => {
    try {
      const res = await axios.get(`${API}/barbers?lat=${userLocation.lat}&lon=${userLocation.lng}`);
      setBarbers(res.data);
      setFilteredBarbers(res.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const fetchMyQueue = async () => {
    try {
      const res = await axios.get(`${API}/queue/my-position`);
      setMyQueue(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCompletedServices = async () => {
    try {
      const res = await axios.get(`${API}/queue/completed`);
      // Filter services that haven't been tipped yet
      const untipped = res.data.filter(s => !s.tip_given);
      setCompletedServices(untipped);
      
      // Auto-show tip modal for most recent untipped service
      if (untipped.length > 0 && !showTipModal) {
        setSelectedTipEntry(untipped[0]);
        setShowTipModal(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleTipGiven = () => {
    fetchCompletedServices();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Calculate distance between two points
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const openServiceModal = (barber, service) => {
    setSelectedService(service);
    setIsHomeService(false);
    setHomeServiceAddress('');
    setPaymentMethod('cash');
    setIsScheduled(false);
    setScheduledDate('');
    setScheduledTime('');
    
    // Calculate travel fee if home service
    if (barber.offers_home_service) {
      const distance = calculateDistance(
        barber.latitude, barber.longitude,
        userLocation.lat, userLocation.lng
      );
      setCalculatedFee(Math.round(distance * barber.home_service_fee_per_km * 100) / 100);
    }
    
    setShowHomeServiceModal(true);
  };

  const handleJoinQueue = async () => {
    if (!selectedBarber || !selectedService) return;
    
    // Validate scheduling
    if (isScheduled && (!scheduledDate || !scheduledTime)) {
      alert('Por favor, selecione data e horário');
      return;
    }
    
    try {
      const params = new URLSearchParams({
        barber_id: selectedBarber.id,
        is_home_service: isHomeService,
        payment_method: paymentMethod,
        is_scheduled: isScheduled
      });
      
      if (isScheduled) {
        params.append('scheduled_date', scheduledDate);
        params.append('scheduled_time', scheduledTime);
      }
      
      if (isHomeService) {
        params.append('client_address', homeServiceAddress || 'My Location');
        params.append('client_latitude', userLocation.lat);
        params.append('client_longitude', userLocation.lng);
      }
      
      await axios.post(`${API}/queue/join?${params.toString()}`, selectedService);
      fetchMyQueue();
      setSelectedBarber(null);
      setShowHomeServiceModal(false);
      
      if (isScheduled) {
        alert(`Agendamento confirmado para ${scheduledDate} às ${scheduledTime}!`);
      } else {
        alert(isHomeService ? 'Home service booked!' : 'You joined the queue!');
      }
    } catch (e) {
      alert(e.response?.data?.detail || 'Error joining queue');
    }
  };

  const handleLeaveQueue = async (entryId) => {
    try {
      await axios.delete(`${API}/queue/${entryId}`);
      fetchMyQueue();
    } catch (e) {
      alert('Erro ao sair da fila');
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] pb-24" data-testid="client-dashboard">
      {/* Header */}
      <header className="bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={LOGO_URL} alt="ClickBarber" className="h-12 w-auto object-contain" />
              <span className="font-heading text-2xl text-white uppercase tracking-wider">Click<span className="text-amber-500">Barber</span></span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-zinc-400 hidden sm:block">Olá, {user?.name}</span>
              <button onClick={handleLogout} className="text-zinc-500 hover:text-white transition-colors" data-testid="btn-logout">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* My Queue Status */}
        {myQueue.length > 0 && (
          <div className="mb-6 bg-amber-500/10 border border-amber-500/30 p-4 rounded-sm" data-testid="my-queue-status">
            <h3 className="font-heading text-lg text-amber-500 uppercase mb-3">Você está na fila</h3>
            {myQueue.map((entry) => (
              <div key={entry.id} className="bg-zinc-900 p-4 rounded-sm mb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
                      <User className="w-6 h-6 text-zinc-500" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{entry.barber?.name}</p>
                      <p className="text-zinc-500 text-sm">{entry.service?.name}</p>
                      {entry.is_home_service ? (
                        <p className="text-green-400 text-xs flex items-center gap-1">
                          <Home className="w-3 h-3" /> Home Service
                        </p>
                      ) : (
                        <p className="text-zinc-500 text-xs flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {entry.barber?.address || 'Barbearia'}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-amber-500 font-heading text-2xl">#{entry.position}</p>
                    <p className="text-zinc-500 text-sm">~{entry.estimated_wait} min</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Navigate to barber button - only for non-home-service */}
                    {!entry.is_home_service && entry.barber?.latitude && entry.barber?.longitude && (
                      <button
                        onClick={() => {
                          const url = `https://www.google.com/maps/dir/?api=1&destination=${entry.barber.latitude},${entry.barber.longitude}&travelmode=driving`;
                          window.open(url, '_blank');
                        }}
                        className="bg-blue-500 hover:bg-blue-400 text-white px-3 py-2 rounded flex items-center gap-1 transition-colors"
                        data-testid="btn-navigate-to-barber"
                      >
                        <Navigation className="w-4 h-4" />
                        <span className="text-sm">Ir</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleLeaveQueue(entry.id)}
                      className="text-red-500 hover:text-red-400 text-sm px-2"
                      data-testid="btn-leave-queue"
                    >
                      Sair
                    </button>
                  </div>
                </div>
                
                {/* Live Tracking Section - Show when NOT home service (client going to barber) */}
                {!entry.is_home_service && (
                  <div className="mt-4 pt-4 border-t border-zinc-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-zinc-400 text-sm flex items-center gap-2">
                          <Navigation className="w-4 h-4" />
                          Compartilhe sua localização com o barbeiro
                        </p>
                        <p className="text-zinc-600 text-xs mt-1">
                          O barbeiro poderá ver quando você estiver a caminho
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {!isTracking ? (
                          <button
                            onClick={startTracking}
                            className="bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
                            data-testid="btn-start-tracking"
                          >
                            <Radio className="w-4 h-4" />
                            <span className="text-sm">Estou indo</span>
                          </button>
                        ) : (
                          <>
                            <div className="flex items-center gap-2 text-green-400 text-sm">
                              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                              Compartilhando localização
                            </div>
                            <button
                              onClick={stopTracking}
                              className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded flex items-center gap-2 transition-colors"
                              data-testid="btn-stop-tracking"
                            >
                              <MapPinOff className="w-4 h-4" />
                              <span className="text-sm">Cheguei</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Barber Tracking Section - Show when Home Service and barber is moving */}
                {entry.is_home_service && entry.barber_is_moving && (
                  <div className="mt-4 pt-4 border-t border-zinc-800">
                    <div className="bg-green-500/10 border border-green-500/30 p-4 rounded">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                          <Car className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-green-400 font-medium flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            Barbeiro a caminho!
                          </p>
                          <p className="text-zinc-400 text-sm">{entry.barber?.name} está indo até você</p>
                        </div>
                      </div>
                      
                      {/* Mini map showing barber location */}
                      {barberLocation && (
                        <div className="h-[200px] rounded overflow-hidden border border-zinc-700">
                          <MapContainer
                            center={[barberLocation.lat, barberLocation.lng]}
                            zoom={14}
                            style={{ height: '100%', width: '100%' }}
                          >
                            <TileLayer
                              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                              attribution='&copy; OpenStreetMap'
                            />
                            {/* Barber marker */}
                            <Marker position={[barberLocation.lat, barberLocation.lng]}>
                              <Popup>
                                <div className="text-black">
                                  <p className="font-bold">🚗 {entry.barber?.name}</p>
                                  <p className="text-sm text-green-600">A caminho</p>
                                </div>
                              </Popup>
                            </Marker>
                            {/* Client marker */}
                            {entry.client_latitude && entry.client_longitude && (
                              <>
                                <Marker position={[entry.client_latitude, entry.client_longitude]}>
                                  <Popup>
                                    <div className="text-black">
                                      <p className="font-bold">📍 Seu endereço</p>
                                      <p className="text-sm">{entry.client_address}</p>
                                    </div>
                                  </Popup>
                                </Marker>
                                <Polyline
                                  positions={[
                                    [barberLocation.lat, barberLocation.lng],
                                    [entry.client_latitude, entry.client_longitude]
                                  ]}
                                  color="#22C55E"
                                  weight={4}
                                  opacity={0.8}
                                  dashArray="5, 10"
                                />
                              </>
                            )}
                          </MapContainer>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pending Tips Section */}
        {completedServices.length > 0 && (
          <div className="mb-6 bg-pink-500/10 border border-pink-500/30 p-4 rounded-sm" data-testid="pending-tips">
            <h3 className="font-heading text-lg text-pink-400 uppercase mb-3 flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Dar Gorjeta
            </h3>
            <p className="text-zinc-400 text-sm mb-3">Gostou do serviço? Deixe uma gorjeta para agradecer!</p>
            {completedServices.slice(0, 2).map((entry) => (
              <div key={entry.id} className="flex items-center justify-between bg-zinc-900 p-4 rounded-sm mb-2">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
                    <Scissors className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{entry.barber?.name}</p>
                    <p className="text-zinc-500 text-sm">{entry.service?.name}</p>
                    <p className="text-amber-500 text-sm">€{entry.total_price || entry.service?.price}</p>
                  </div>
                </div>
                <button
                  onClick={() => { setSelectedTipEntry(entry); setShowTipModal(true); }}
                  className="bg-pink-500 hover:bg-pink-400 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
                  data-testid={`btn-give-tip-${entry.id}`}
                >
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">Dar Gorjeta</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Buscar barbeiro ou especialidade..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-white pl-12 pr-4 py-3 focus:border-amber-500 transition-colors"
              data-testid="input-search"
            />
          </div>
          <div className="flex gap-2">
            {/* Home Service Request Button */}
            <button
              onClick={() => setShowHomeRequestModal(true)}
              className="px-4 py-3 bg-green-500 hover:bg-green-400 text-white transition-colors flex items-center gap-2 font-medium"
              data-testid="btn-request-home-service"
            >
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline">Quero ser atendido em casa</span>
              <span className="sm:hidden">Home</span>
            </button>
            
            <button
              onClick={() => setOnlineOnly(!onlineOnly)}
              className={`px-4 py-3 border transition-colors flex items-center gap-2 ${
                onlineOnly ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-zinc-900 border-zinc-800 text-zinc-400'
              }`}
              data-testid="btn-online-filter"
            >
              <div className={`w-2 h-2 rounded-full ${onlineOnly ? 'bg-green-500' : 'bg-zinc-500'}`}></div>
              Online
            </button>
            <button
              onClick={() => setView(view === 'map' ? 'list' : 'map')}
              className="px-4 py-3 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
              data-testid="btn-toggle-view"
            >
              {view === 'map' ? 'Lista' : 'Mapa'}
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map or List */}
          <div className="lg:col-span-2">
            {view === 'map' ? (
              <div className="h-[500px] rounded-sm overflow-hidden border border-zinc-800" data-testid="map-container">
                <MapContainer
                  center={[userLocation.lat, userLocation.lng]}
                  zoom={14}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  
                  {/* User Location */}
                  <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                    <Popup>
                      <span className="text-black font-medium">Você está aqui</span>
                    </Popup>
                  </Marker>

                  {/* Barber Markers */}
                  {filteredBarbers.map((barber) => (
                    barber.latitude && barber.longitude && (
                      <Marker
                        key={barber.id}
                        position={[barber.latitude, barber.longitude]}
                        icon={barber.is_online ? onlineIcon : offlineIcon}
                        eventHandlers={{
                          click: () => setSelectedBarber(barber)
                        }}
                      >
                        <Popup>
                          <div className="text-black">
                            <p className="font-bold">{barber.name}</p>
                            <p className="text-sm text-gray-600">{barber.specialty}</p>
                            <p className="text-sm">⭐ {barber.rating}</p>
                            <p className={`text-sm font-medium ${barber.is_online ? 'text-green-600' : 'text-red-600'}`}>
                              {barber.is_online ? '🟢 Online' : '🔴 Offline'}
                            </p>
                          </div>
                        </Popup>
                      </Marker>
                    )
                  ))}
                </MapContainer>
              </div>
            ) : (
              <div className="space-y-4" data-testid="barber-list">
                {filteredBarbers.map((barber) => (
                  <div
                    key={barber.id}
                    onClick={() => setSelectedBarber(barber)}
                    className="bg-zinc-900 border border-zinc-800 p-4 cursor-pointer hover:border-amber-500/50 transition-all"
                    data-testid={`barber-card-${barber.id}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <img
                          src={barber.photo_url || 'https://via.placeholder.com/80'}
                          alt={barber.name}
                          className="w-20 h-20 rounded-sm object-cover"
                        />
                        <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-zinc-900 ${
                          barber.is_online ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-white font-medium text-lg">{barber.name}</h3>
                            <p className="text-zinc-500 text-sm">{barber.specialty}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-amber-500">
                              <Star className="w-4 h-4 fill-current" />
                              <span>{barber.rating}</span>
                            </div>
                            <p className="text-zinc-500 text-xs">{barber.total_reviews} avaliações</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-sm">
                          <span className="flex items-center gap-1 text-zinc-400">
                            <MapPin className="w-4 h-4" />
                            {barber.distance ? `${barber.distance} km` : 'N/A'}
                          </span>
                          <span className="flex items-center gap-1 text-zinc-400">
                            <Users className="w-4 h-4" />
                            {barber.queue_count} na fila
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Barber Details Sidebar */}
          <div className="lg:col-span-1">
            {selectedBarber ? (
              <div className="bg-zinc-900 border border-zinc-800 p-6 sticky top-24" data-testid="barber-details">
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <img
                      src={selectedBarber.photo_url || 'https://via.placeholder.com/120'}
                      alt={selectedBarber.name}
                      className="w-24 h-24 rounded-full object-cover mx-auto"
                    />
                    <div className={`absolute bottom-0 right-0 w-6 h-6 rounded-full border-4 border-zinc-900 ${
                      selectedBarber.is_online ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                  </div>
                  <h3 className="font-heading text-xl text-white uppercase mt-4">{selectedBarber.name}</h3>
                  <p className="text-amber-500">{selectedBarber.specialty}</p>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <Star className="w-5 h-5 text-amber-500 fill-current" />
                    <span className="text-white font-bold">{selectedBarber.rating}</span>
                    <span className="text-zinc-500">({selectedBarber.total_reviews})</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-zinc-400">
                    <MapPin className="w-5 h-5" />
                    <span className="text-sm">{selectedBarber.address || 'Address not provided'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-400">
                    <Users className="w-5 h-5" />
                    <span className="text-sm">{selectedBarber.queue_count} in queue</span>
                  </div>
                  {selectedBarber.instagram && (
                    <a 
                      href={`https://instagram.com/${selectedBarber.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-pink-400 hover:text-pink-300 transition-colors"
                    >
                      <Instagram className="w-5 h-5" />
                      <span className="text-sm">@{selectedBarber.instagram.replace('@', '')}</span>
                    </a>
                  )}
                  
                  {/* Navigate to barber button */}
                  {selectedBarber.latitude && selectedBarber.longitude && (
                    <button
                      onClick={() => {
                        const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedBarber.latitude},${selectedBarber.longitude}&travelmode=driving`;
                        window.open(url, '_blank');
                      }}
                      className="flex items-center gap-3 text-blue-400 hover:text-blue-300 transition-colors w-full"
                      data-testid="btn-navigate-barber-profile"
                    >
                      <Navigation className="w-5 h-5" />
                      <span className="text-sm">Como chegar (Google Maps)</span>
                    </button>
                  )}
                  
                  {selectedBarber.offers_home_service && (
                    <div className="flex items-center gap-3 text-green-400">
                      <Home className="w-5 h-5" />
                      <span className="text-sm">Home service available (€{selectedBarber.home_service_fee_per_km}/km)</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-zinc-800 pt-4">
                  <h4 className="font-heading text-sm text-zinc-400 uppercase mb-3">Services</h4>
                  <div className="space-y-2">
                    {selectedBarber.services?.map((service) => (
                      <div
                        key={service.id}
                        className="flex items-center justify-between p-3 bg-zinc-800/50 hover:bg-zinc-800 transition-colors cursor-pointer group"
                        onClick={() => {
                          if (selectedBarber.is_online) {
                            openServiceModal(selectedBarber, service);
                          }
                        }}
                        data-testid={`service-${service.id}`}
                      >
                        <div>
                          <p className="text-white">{service.name}</p>
                          <p className="text-zinc-500 text-xs">{service.duration} min</p>
                        </div>
                        <div className="text-right">
                          <p className="text-amber-500 font-bold">€{service.price}</p>
                          {selectedBarber.is_online && (
                            <p className="text-xs text-green-500 opacity-0 group-hover:opacity-100 transition-opacity">Book now</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {!selectedBarber.is_online && (
                  <div className="mt-4 p-3 bg-zinc-800 text-center">
                    <p className="text-zinc-500 text-sm">This barber is offline</p>
                  </div>
                )}

                <button
                  onClick={() => setSelectedBarber(null)}
                  className="w-full mt-4 py-3 border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="bg-zinc-900 border border-zinc-800 p-6 text-center" data-testid="no-barber-selected">
                <Scissors className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-500">Select a barber on the map or list to see details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Home Service Modal */}
      {showHomeServiceModal && selectedBarber && selectedService && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" data-testid="home-service-modal">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md p-6 max-h-[85vh] overflow-y-auto pb-20">
            <h3 className="font-heading text-xl text-white uppercase mb-4">Book Service</h3>
            
            <div className="bg-zinc-800/50 p-4 mb-6">
              <p className="text-white font-medium">{selectedService.name}</p>
              <p className="text-zinc-500 text-sm">{selectedService.duration} min</p>
              <p className="text-amber-500 font-bold mt-2">€{selectedService.price}</p>
            </div>

            {/* Service Type Selection */}
            <div className="space-y-3 mb-6">
              <p className="text-zinc-400 text-sm uppercase tracking-wider">Where do you want the service?</p>
              
              <button
                onClick={() => setIsHomeService(false)}
                className={`w-full p-4 border transition-all flex items-center gap-4 ${
                  !isHomeService ? 'border-amber-500 bg-amber-500/10' : 'border-zinc-700 hover:border-zinc-600'
                }`}
                data-testid="btn-at-shop"
              >
                <MapPin className={`w-6 h-6 ${!isHomeService ? 'text-amber-500' : 'text-zinc-500'}`} />
                <div className="text-left">
                  <p className={`font-medium ${!isHomeService ? 'text-white' : 'text-zinc-400'}`}>At the barbershop</p>
                  <p className="text-zinc-500 text-sm">{selectedBarber.address}</p>
                </div>
              </button>

              {/* Home Service Option - Always show */}
              <button
                onClick={() => selectedBarber.offers_home_service && setIsHomeService(true)}
                disabled={!selectedBarber.offers_home_service}
                className={`w-full p-4 border transition-all flex items-center gap-4 ${
                  isHomeService ? 'border-green-500 bg-green-500/10' : 
                  selectedBarber.offers_home_service ? 'border-zinc-700 hover:border-green-500/50' : 'border-zinc-800 opacity-50'
                }`}
                data-testid="btn-home-service"
              >
                <Home className={`w-6 h-6 ${isHomeService ? 'text-green-500' : selectedBarber.offers_home_service ? 'text-green-400' : 'text-zinc-500'}`} />
                <div className="text-left flex-1">
                  <p className={`font-medium ${isHomeService ? 'text-white' : selectedBarber.offers_home_service ? 'text-green-400' : 'text-zinc-400'}`}>
                    Home Service
                    {selectedBarber.offers_home_service ? (
                      <span className="text-green-400 text-xs ml-2">✓ Disponível</span>
                    ) : (
                      <span className="text-red-400 text-xs ml-2">(Indisponível)</span>
                    )}
                  </p>
                  <p className="text-zinc-500 text-sm">
                    {selectedBarber.offers_home_service ? 'Barbeiro atende em domicílio' : 'Este barbeiro não atende em casa'}
                  </p>
                </div>
                {selectedBarber.offers_home_service && (
                  <div className="text-right">
                    <p className="text-green-400 text-sm">+€{calculatedFee}</p>
                    <p className="text-zinc-600 text-xs">taxa deslocamento</p>
                  </div>
                )}
              </button>

              {/* Interest Button - Show when barber doesn't offer home service */}
              {!selectedBarber.offers_home_service && (
                <button
                  onClick={async () => {
                    const address = prompt('Digite seu endereço para registrar interesse em atendimento em casa:');
                    if (address) {
                      try {
                        await axios.post(`${API}/home-service-interest?barber_id=${selectedBarber.id}&client_address=${encodeURIComponent(address)}&client_latitude=${userLocation.lat}&client_longitude=${userLocation.lng}&service_name=${encodeURIComponent(selectedService.name)}&service_price=${selectedService.price}`);
                        alert('✅ Interesse registrado! O barbeiro será notificado e poderá entrar em contato.');
                      } catch (e) {
                        alert(e.response?.data?.detail || 'Erro ao registrar interesse');
                      }
                    }
                  }}
                  className="w-full p-3 bg-purple-500/20 border border-purple-500/50 text-purple-400 hover:bg-purple-500/30 transition-colors flex items-center justify-center gap-2"
                  data-testid="btn-register-interest"
                >
                  <Heart className="w-5 h-5" />
                  <span className="text-sm font-medium">Tenho interesse em atendimento em casa</span>
                </button>
              )}
            </div>

            {/* Address input for home service */}
            {isHomeService && (
              <div className="mb-6">
                <label className="text-zinc-400 text-sm uppercase tracking-wider block mb-2">Your Address</label>
                <input
                  type="text"
                  value={homeServiceAddress}
                  onChange={(e) => setHomeServiceAddress(e.target.value)}
                  placeholder="Enter your address..."
                  className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 focus:border-amber-500 transition-colors"
                  data-testid="input-home-address"
                />
                <p className="text-zinc-600 text-xs mt-2">
                  <Car className="w-3 h-3 inline mr-1" />
                  Distance: ~{selectedBarber.distance || calculateDistance(selectedBarber.latitude, selectedBarber.longitude, userLocation.lat, userLocation.lng).toFixed(1)} km
                </p>
              </div>
            )}

            {/* Scheduling Option */}
            <div className="space-y-3 mb-6">
              <p className="text-zinc-400 text-sm uppercase tracking-wider">Quando?</p>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setIsScheduled(false)}
                  className={`p-4 border transition-all flex flex-col items-center gap-2 ${
                    !isScheduled ? 'border-amber-500 bg-amber-500/10' : 'border-zinc-700 hover:border-zinc-600'
                  }`}
                  data-testid="btn-now"
                >
                  <Clock className={`w-8 h-8 ${!isScheduled ? 'text-amber-500' : 'text-zinc-500'}`} />
                  <span className={`font-medium ${!isScheduled ? 'text-white' : 'text-zinc-400'}`}>Agora</span>
                  <span className="text-zinc-500 text-xs">Entrar na fila</span>
                </button>
                
                <button
                  onClick={() => setIsScheduled(true)}
                  className={`p-4 border transition-all flex flex-col items-center gap-2 ${
                    isScheduled ? 'border-purple-500 bg-purple-500/10' : 'border-zinc-700 hover:border-zinc-600'
                  }`}
                  data-testid="btn-schedule"
                >
                  <CalendarClock className={`w-8 h-8 ${isScheduled ? 'text-purple-500' : 'text-zinc-500'}`} />
                  <span className={`font-medium ${isScheduled ? 'text-white' : 'text-zinc-400'}`}>Agendar</span>
                  <span className="text-zinc-500 text-xs">Escolher horário</span>
                </button>
              </div>
            </div>

            {/* Date/Time Selection for Scheduling */}
            {isScheduled && (
              <div className="mb-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-zinc-400 text-sm block mb-2">Data</label>
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-zinc-800 border border-zinc-700 text-white px-3 py-2 focus:border-purple-500 transition-colors"
                      data-testid="input-schedule-date"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-400 text-sm block mb-2">Horário</label>
                    <input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 text-white px-3 py-2 focus:border-purple-500 transition-colors"
                      data-testid="input-schedule-time"
                    />
                  </div>
                </div>
                {scheduledDate && scheduledTime && (
                  <p className="text-purple-400 text-sm mt-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Agendado para {new Date(scheduledDate).toLocaleDateString('pt-BR')} às {scheduledTime}
                  </p>
                )}
              </div>
            )}

            {/* Payment Method */}
            <div className="space-y-3 mb-6">
              <p className="text-zinc-400 text-sm uppercase tracking-wider">Payment Method</p>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-4 border transition-all flex flex-col items-center gap-2 ${
                    paymentMethod === 'cash' ? 'border-green-500 bg-green-500/10' : 'border-zinc-700 hover:border-zinc-600'
                  }`}
                  data-testid="btn-pay-cash"
                >
                  <Banknote className={`w-8 h-8 ${paymentMethod === 'cash' ? 'text-green-500' : 'text-zinc-500'}`} />
                  <span className={`font-medium ${paymentMethod === 'cash' ? 'text-white' : 'text-zinc-400'}`}>Cash</span>
                </button>
                
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 border transition-all flex flex-col items-center gap-2 ${
                    paymentMethod === 'card' ? 'border-blue-500 bg-blue-500/10' : 'border-zinc-700 hover:border-zinc-600'
                  }`}
                  data-testid="btn-pay-card"
                >
                  <CreditCard className={`w-8 h-8 ${paymentMethod === 'card' ? 'text-blue-500' : 'text-zinc-500'}`} />
                  <span className={`font-medium ${paymentMethod === 'card' ? 'text-white' : 'text-zinc-400'}`}>Card</span>
                </button>
              </div>
            </div>

            {/* Total */}
            <div className="bg-zinc-800 p-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Service</span>
                <span className="text-white">€{selectedService.price}</span>
              </div>
              {isHomeService && (
                <div className="flex justify-between items-center mt-2">
                  <span className="text-zinc-400">Travel fee</span>
                  <span className="text-white">€{calculatedFee}</span>
                </div>
              )}
              <div className="flex justify-between items-center mt-2">
                <span className="text-zinc-400">Payment</span>
                <span className={`flex items-center gap-1 ${paymentMethod === 'cash' ? 'text-green-400' : 'text-blue-400'}`}>
                  {paymentMethod === 'cash' ? <Banknote className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                  {paymentMethod === 'cash' ? 'Cash' : 'Card'}
                </span>
              </div>
              <div className="border-t border-zinc-700 mt-3 pt-3 flex justify-between items-center">
                <span className="text-white font-heading uppercase">Total</span>
                <span className="text-amber-500 font-heading text-2xl">€{(selectedService.price + (isHomeService ? calculatedFee : 0)).toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-4">
              <button
                onClick={() => setShowHomeServiceModal(false)}
                className="flex-1 py-3 border border-zinc-700 text-zinc-400 hover:text-white transition-colors"
                data-testid="btn-cancel-modal"
              >
                Cancel
              </button>
              <button
                onClick={handleJoinQueue}
                className="flex-1 bg-amber-500 text-black font-heading uppercase py-3 hover:bg-amber-400 transition-colors"
                data-testid="btn-confirm-booking"
              >
                {isHomeService ? 'Book Home Service' : 'Join Queue'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Home Service Request Modal - General Request */}
      {showHomeRequestModal && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4" data-testid="home-request-modal">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-lg overflow-hidden max-h-[85vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-green-500 p-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Home className="w-6 h-6 text-white" />
                  <h3 className="text-white font-bold text-lg">Atendimento em Casa</h3>
                </div>
                <button 
                  onClick={() => {
                    setShowHomeRequestModal(false);
                    setHomeServiceAddress('');
                    setHomeServiceSelected('');
                  }}
                  className="text-white/80 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-5 space-y-5 overflow-y-auto flex-1">
              {/* Address Input */}
              <div>
                <label className="text-zinc-400 text-sm mb-2 block">📍 Seu endereço</label>
                <input
                  type="text"
                  value={homeServiceAddress}
                  onChange={(e) => setHomeServiceAddress(e.target.value)}
                  placeholder="Cole ou digite seu endereço aqui..."
                  className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-lg focus:border-green-500 transition-colors"
                  data-testid="input-home-address"
                />
              </div>

              {/* Service Selection */}
              <div>
                <label className="text-zinc-400 text-sm mb-3 block">💈 Escolha o serviço</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'barba', name: 'Barba', price: 15, icon: '🧔' },
                    { id: 'corte', name: 'Corte', price: 30, icon: '✂️' },
                    { id: 'corte-barba', name: 'Corte e Barba', price: 40, icon: '💈' },
                    { id: 'combo', name: 'Combo', price: 50, icon: '⭐' }
                  ].map((service) => (
                    <button
                      key={service.id}
                      onClick={() => setHomeServiceSelected(service.name)}
                      className={`p-3 rounded-lg border-2 transition-all text-left ${
                        homeServiceSelected === service.name
                          ? 'border-green-500 bg-green-500/10'
                          : 'border-zinc-700 bg-zinc-800 hover:border-zinc-600'
                      }`}
                      data-testid={`btn-service-${service.id}`}
                    >
                      <div className="text-xl mb-1">{service.icon}</div>
                      <div className="text-white font-medium text-sm">{service.name}</div>
                      <div className="text-green-400 text-xs">€{service.price}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={async () => {
                  if (!homeServiceAddress) {
                    alert('Por favor, informe seu endereço');
                    return;
                  }
                  if (!homeServiceSelected) {
                    alert('Por favor, escolha um serviço');
                    return;
                  }
                  try {
                    const res = await axios.post(`${API}/home-service-interest?client_address=${encodeURIComponent(homeServiceAddress)}&client_latitude=${userLocation.lat}&client_longitude=${userLocation.lng}&service_name=${encodeURIComponent(homeServiceSelected)}`);
                    alert(`✅ Pedido enviado!\n\n${res.data.online_barbers} barbeiro(s) online para home service receberão sua solicitação.`);
                    setShowHomeRequestModal(false);
                    setHomeServiceAddress('');
                    setHomeServiceSelected('');
                  } catch (e) {
                    alert(e.response?.data?.detail || 'Erro ao enviar pedido');
                  }
                }}
                disabled={!homeServiceAddress || !homeServiceSelected}
                className="w-full bg-green-500 hover:bg-green-400 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                data-testid="btn-submit-home-service"
              >
                <Home className="w-5 h-5" />
                Solicitar Atendimento
              </button>

              <p className="text-zinc-500 text-xs text-center pb-2">
                Os barbeiros online receberão seu pedido.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tip Modal */}
      {showTipModal && selectedTipEntry && (
        <TipModal
          entry={selectedTipEntry}
          onClose={() => { setShowTipModal(false); setSelectedTipEntry(null); }}
          onTipGiven={handleTipGiven}
        />
      )}
    </div>
  );
};

export default ClientDashboard;
