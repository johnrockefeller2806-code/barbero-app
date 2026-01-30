import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, MapPin, Star, Clock, Users, LogOut, Filter, Navigation, Scissors, User, Home, Car, Banknote, CreditCard } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Fix Leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons
const createIcon = (color) => L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background: ${color}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const onlineIcon = createIcon('#22C55E');
const offlineIcon = createIcon('#6B7280');
const userIcon = createIcon('#F59E0B');

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
  const [selectedService, setSelectedService] = useState(null);
  const [homeServiceAddress, setHomeServiceAddress] = useState('');
  const [isHomeService, setIsHomeService] = useState(false);
  const [calculatedFee, setCalculatedFee] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash' or 'card'

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
  }, []);

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
    
    try {
      const params = new URLSearchParams({
        barber_id: selectedBarber.id,
        is_home_service: isHomeService,
        payment_method: paymentMethod
      });
      
      if (isHomeService) {
        params.append('client_address', homeServiceAddress || 'My Location');
        params.append('client_latitude', userLocation.lat);
        params.append('client_longitude', userLocation.lng);
      }
      
      await axios.post(`${API}/queue/join?${params.toString()}`, selectedService);
      fetchMyQueue();
      setSelectedBarber(null);
      setShowHomeServiceModal(false);
      alert(isHomeService ? 'Home service booked!' : 'You joined the queue!');
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
    <div className="min-h-screen bg-[#09090B]" data-testid="client-dashboard">
      {/* Header */}
      <header className="bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Scissors className="w-8 h-8 text-amber-500" />
              <span className="font-heading text-2xl font-bold text-white">BARBER<span className="text-amber-500">X</span></span>
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
              <div key={entry.id} className="flex items-center justify-between bg-zinc-900 p-4 rounded-sm mb-2">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
                    <User className="w-6 h-6 text-zinc-500" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{entry.barber?.name}</p>
                    <p className="text-zinc-500 text-sm">{entry.service?.name}</p>
                  </div>
                </div>
                        <div className="text-right">
                          <p className="text-amber-500 font-heading text-2xl">#{entry.position}</p>
                          <p className="text-zinc-500 text-sm">~{entry.estimated_wait} min</p>
                        </div>
                <button
                  onClick={() => handleLeaveQueue(entry.id)}
                  className="text-red-500 hover:text-red-400 text-sm"
                  data-testid="btn-leave-queue"
                >
                  Sair
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
                            <p className="text-sm">{barber.specialty}</p>
                            <p className="text-sm">⭐ {barber.rating}</p>
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
                          barber.is_online ? 'bg-green-500' : 'bg-zinc-500'
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
                      selectedBarber.is_online ? 'bg-green-500' : 'bg-zinc-500'
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
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md p-6">
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

              {selectedBarber.offers_home_service && (
                <button
                  onClick={() => setIsHomeService(true)}
                  className={`w-full p-4 border transition-all flex items-center gap-4 ${
                    isHomeService ? 'border-amber-500 bg-amber-500/10' : 'border-zinc-700 hover:border-zinc-600'
                  }`}
                  data-testid="btn-home-service"
                >
                  <Home className={`w-6 h-6 ${isHomeService ? 'text-amber-500' : 'text-zinc-500'}`} />
                  <div className="text-left flex-1">
                    <p className={`font-medium ${isHomeService ? 'text-white' : 'text-zinc-400'}`}>Home Service</p>
                    <p className="text-zinc-500 text-sm">Barber comes to you</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 text-sm">+€{calculatedFee}</p>
                    <p className="text-zinc-600 text-xs">travel fee</p>
                  </div>
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
            <div className="bg-zinc-800 p-4 mb-6">
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
                <span className="text-amber-500 font-heading text-xl">€{(selectedService.price + (isHomeService ? calculatedFee : 0)).toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
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
    </div>
  );
};

export default ClientDashboard;
