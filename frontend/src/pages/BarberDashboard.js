import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Power, Users, Clock, Star, DollarSign, LogOut, Scissors, CheckCircle, XCircle, User, Home, MapPin, Car, Banknote, CreditCard, Crown, History, Gift, Instagram, Edit2, Save, Navigation, Map, MapPinOff, CalendarClock, Heart, Camera, Upload, Image, Bell, Phone, X, Volume2, VolumeX, Share2 } from 'lucide-react';
import ReferralSection from '../components/ReferralSection';
import Footer from '../components/Footer';

// Sound notification system
const useNotificationSound = () => {
  const audioContextRef = useRef(null);
  
  const playNotificationSound = useCallback(() => {
    try {
      // Create audio context on demand (required by browsers)
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      
      // Resume audio context if suspended
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      
      // Create a pleasant notification sound
      const now = ctx.currentTime;
      
      // First tone - higher pitch
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.frequency.setValueAtTime(880, now); // A5
      osc1.type = 'sine';
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc1.start(now);
      osc1.stop(now + 0.3);
      
      // Second tone - medium pitch
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.frequency.setValueAtTime(1174.66, now + 0.15); // D6
      osc2.type = 'sine';
      gain2.gain.setValueAtTime(0, now);
      gain2.gain.setValueAtTime(0.3, now + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
      osc2.start(now + 0.15);
      osc2.stop(now + 0.45);
      
      // Third tone - highest pitch (completion)
      const osc3 = ctx.createOscillator();
      const gain3 = ctx.createGain();
      osc3.connect(gain3);
      gain3.connect(ctx.destination);
      osc3.frequency.setValueAtTime(1318.51, now + 0.3); // E6
      osc3.type = 'sine';
      gain3.gain.setValueAtTime(0, now);
      gain3.gain.setValueAtTime(0.3, now + 0.3);
      gain3.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
      osc3.start(now + 0.3);
      osc3.stop(now + 0.6);
      
    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  }, []);
  
  return { playNotificationSound };
};

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const LOGO_URL = "https://customer-assets.emergentagent.com/job_f16b93ce-5ac3-4503-bae3-65d25ede4a91/artifacts/7tsbrqqb_WhatsApp%20Image%202026-01-30%20at%2021.59.32.jpeg";

// Dublin Metropolitan Region Configuration
const DUBLIN_METRO = {
  center: { lat: 53.3244, lng: -6.2514 }, // Centro da região metropolitana
  zoom: 11, // Zoom para mostrar toda a região metropolitana
  bounds: {
    north: 53.52,  // Swords e norte
    south: 53.10,  // Bray, Greystones
    east: -5.95,   // Costa leste
    west: -6.55    // Lucan, Rathcoole
  }
};

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
      ${color === '#22C55E' ? '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>' : '<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>'}
    </svg>
  </div>`,
  iconSize: [size, size],
  iconAnchor: [size/2, size/2],
});

const barberIcon = createIcon('#22C55E', 40); // Green for barber (online)
const barberOfflineIcon = createIcon('#6B7280', 40); // Gray for offline
const clientIcon = createIcon('#F59E0B', 30); // Amber for client (home service destination)
const clientMovingIcon = createIcon('#3B82F6', 30); // Blue for client moving/tracking

const BarberDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, setUser } = useAuth();
  const [isOnline, setIsOnline] = useState(user?.is_online || false);
  const [isHomeServiceOnline, setIsHomeServiceOnline] = useState(user?.is_home_service_online || false);
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    todayClients: 0,
    todayEarnings: 0,
    avgWait: 0
  });
  
  // Instagram edit state
  const [editingInstagram, setEditingInstagram] = useState(false);
  const [instagramValue, setInstagramValue] = useState(user?.instagram || '');
  
  // Location edit state
  const [editingLocation, setEditingLocation] = useState(false);
  const [locationForm, setLocationForm] = useState({
    address: user?.address || '',
    latitude: user?.latitude || '',
    longitude: user?.longitude || ''
  });
  const [savingLocation, setSavingLocation] = useState(false);
  const [gettingCurrentLocation, setGettingCurrentLocation] = useState(false);
  
  // Map state
  const [showMap, setShowMap] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  
  // Barber tracking state
  const [trackingEntryId, setTrackingEntryId] = useState(null);
  const [isBarberTracking, setIsBarberTracking] = useState(false);
  
  // Schedules state
  const [schedules, setSchedules] = useState([]);
  
  // Tips state
  const [tipsData, setTipsData] = useState({ tips: [], total_tips: 0, today_tips: 0, tips_count: 0 });
  
  // Photo upload state
  const fileInputRef = useRef(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  
  // Home Service Interests state
  const [homeServiceInterests, setHomeServiceInterests] = useState({ interests: [], unread_count: 0, total_count: 0 });
  
  // Sound notification state
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('barberSoundEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const previousQueueRef = useRef([]);
  const previousInterestsRef = useRef([]);
  const { playNotificationSound } = useNotificationSound();
  
  // Save sound preference
  useEffect(() => {
    localStorage.setItem('barberSoundEnabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    fetchQueue();
    fetchSchedules();
    fetchTips();
    fetchHomeServiceInterests();
    // Faster refresh when map is open to track live location (every 3s)
    const interval = setInterval(() => {
      fetchQueue();
      fetchSchedules();
      fetchHomeServiceInterests();
    }, showMap ? 3000 : 10000);
    return () => clearInterval(interval);
  }, [showMap]);
  
  // Check for new clients and play sound
  useEffect(() => {
    if (!soundEnabled) return;
    
    // Check for new queue entries
    const previousIds = previousQueueRef.current.map(q => q.id);
    const newClients = queue.filter(q => !previousIds.includes(q.id));
    
    if (newClients.length > 0 && previousQueueRef.current.length > 0) {
      playNotificationSound();
      // Show browser notification if permitted (check if API exists first)
      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        new Notification('🔔 Novo cliente!', {
          body: `${newClients[0].client_name} entrou na fila`,
          icon: LOGO_URL
        });
      }
    }
    
    previousQueueRef.current = queue;
  }, [queue, soundEnabled, playNotificationSound]);
  
  // Check for new home service interests
  useEffect(() => {
    if (!soundEnabled) return;
    
    const previousIds = previousInterestsRef.current.map(i => i.id);
    const newInterests = (homeServiceInterests.interests || []).filter(i => !previousIds.includes(i.id));
    
    if (newInterests.length > 0 && previousInterestsRef.current.length > 0) {
      playNotificationSound();
      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        new Notification('🏠 Interesse em Home Service!', {
          body: `${newInterests[0].client_name} quer atendimento em casa`,
          icon: LOGO_URL
        });
      }
    }
    
    previousInterestsRef.current = homeServiceInterests.interests || [];
  }, [homeServiceInterests, soundEnabled, playNotificationSound]);
  
  // Request notification permission (only if API exists)
  useEffect(() => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const fetchHomeServiceInterests = async () => {
    try {
      const res = await axios.get(`${API}/home-service-interest/barber`);
      setHomeServiceInterests(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRespondToInterest = async (interestId, action) => {
    try {
      await axios.put(`${API}/home-service-interest/${interestId}/respond?action=${action}`);
      fetchHomeServiceInterests();
      alert(action === 'accept' ? '✅ Interesse aceito! Entre em contato com o cliente.' : 'Interesse recusado.');
    } catch (e) {
      alert('Erro ao responder');
    }
  };

  const fetchTips = async () => {
    try {
      const res = await axios.get(`${API}/tips/barber`);
      setTipsData(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchSchedules = async () => {
    try {
      const res = await axios.get(`${API}/queue/schedules`);
      setSchedules(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchQueue = async () => {
    try {
      const res = await axios.get(`${API}/queue/barber`);
      setQueue(res.data);
      
      // Calculate stats
      const waiting = res.data.filter(q => q.status === 'waiting');
      const avgDuration = waiting.reduce((acc, q) => acc + (q.service?.duration || 30), 0) / (waiting.length || 1);
      setStats(prev => ({
        ...prev,
        avgWait: Math.round(avgDuration)
      }));
    } catch (e) {
      console.error(e);
    }
  };

  const toggleOnline = async () => {
    setLoading(true);
    try {
      const newStatus = !isOnline;
      await axios.put(`${API}/barbers/status?is_online=${newStatus}`);
      setIsOnline(newStatus);
      setUser({ ...user, is_online: newStatus });
    } catch (e) {
      alert('Erro ao atualizar status');
    }
    setLoading(false);
  };

  const toggleHomeServiceOnline = async () => {
    try {
      const newStatus = !isHomeServiceOnline;
      await axios.put(`${API}/barbers/home-service-status?is_home_service_online=${newStatus}`);
      setIsHomeServiceOnline(newStatus);
      setUser({ ...user, is_home_service_online: newStatus, offers_home_service: newStatus });
      
      if (newStatus) {
        fetchHomeServiceInterests();
      }
    } catch (e) {
      alert('Erro ao atualizar status');
    }
  };

  const handleAcceptInterest = async (interestId) => {
    try {
      const res = await axios.put(`${API}/home-service-interest/${interestId}/accept`);
      alert(`✅ Você aceitou o pedido!\n\n📞 Telefone: ${res.data.client_phone}\n📍 Endereço: ${res.data.client_address}`);
      fetchHomeServiceInterests();
    } catch (e) {
      alert(e.response?.data?.detail || 'Erro ao aceitar');
    }
  };

  const handleClientAction = async (entryId, action) => {
    try {
      if (action === 'start') {
        await axios.put(`${API}/queue/${entryId}/status?status=in_progress`);
      } else if (action === 'complete') {
        await axios.put(`${API}/queue/${entryId}/status?status=completed`);
        setStats(prev => ({
          ...prev,
          todayClients: prev.todayClients + 1,
          todayEarnings: prev.todayEarnings + (queue.find(q => q.id === entryId)?.service?.price || 0)
        }));
      } else if (action === 'cancel') {
        await axios.put(`${API}/queue/${entryId}/status?status=cancelled`);
      }
      fetchQueue();
    } catch (e) {
      alert('Erro ao processar ação');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSaveInstagram = async () => {
    try {
      await axios.put(`${API}/barbers/profile?instagram=${encodeURIComponent(instagramValue)}`);
      setUser({ ...user, instagram: instagramValue });
      setEditingInstagram(false);
    } catch (e) {
      alert('Erro ao salvar Instagram');
    }
  };

  // Location functions
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocalização não suportada pelo navegador');
      return;
    }
    
    setGettingCurrentLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocationForm(prev => ({
          ...prev,
          latitude: latitude.toFixed(6),
          longitude: longitude.toFixed(6)
        }));
        setGettingCurrentLocation(false);
      },
      (error) => {
        console.error('Erro ao obter localização:', error);
        alert('Erro ao obter sua localização. Verifique as permissões do navegador.');
        setGettingCurrentLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSaveLocation = async () => {
    if (!locationForm.address.trim()) {
      alert('Por favor, informe o endereço');
      return;
    }
    if (!locationForm.latitude || !locationForm.longitude) {
      alert('Por favor, informe as coordenadas ou use "Usar Minha Localização"');
      return;
    }

    setSavingLocation(true);
    try {
      const params = new URLSearchParams();
      params.append('address', locationForm.address);
      params.append('latitude', parseFloat(locationForm.latitude));
      params.append('longitude', parseFloat(locationForm.longitude));
      
      await axios.put(`${API}/barbers/profile?${params.toString()}`);
      
      setUser({ 
        ...user, 
        address: locationForm.address,
        latitude: parseFloat(locationForm.latitude),
        longitude: parseFloat(locationForm.longitude)
      });
      setEditingLocation(false);
      alert('✅ Localização atualizada com sucesso!');
    } catch (e) {
      alert('Erro ao salvar localização');
    } finally {
      setSavingLocation(false);
    }
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Imagem muito grande. Máximo 5MB');
      return;
    }

    setUploadingPhoto(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await axios.post(`${API}/barbers/upload-photo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Update user with new photo
      setUser({ ...user, photo_url: res.data.photo_url });
      alert('Foto atualizada com sucesso!');
    } catch (e) {
      alert(e.response?.data?.detail || 'Erro ao fazer upload da foto');
    }
    
    setUploadingPhoto(false);
  };

  // Start barber tracking for home service
  const startBarberTracking = (entryId) => {
    setTrackingEntryId(entryId);
    setIsBarberTracking(true);
    
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            await axios.put(`${API}/queue/barber-location?entry_id=${entryId}&latitude=${latitude}&longitude=${longitude}&is_moving=true`);
          } catch (e) {
            console.error('Error updating barber location:', e);
          }
        },
        (error) => console.log('Location error:', error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 3000 }
      );
      
      // Store watchId in window for cleanup
      window.barberWatchId = watchId;
    }
  };

  const stopBarberTracking = async (entryId) => {
    setIsBarberTracking(false);
    setTrackingEntryId(null);
    
    if (window.barberWatchId) {
      navigator.geolocation.clearWatch(window.barberWatchId);
      window.barberWatchId = null;
    }
    
    try {
      await axios.put(`${API}/queue/barber-stop-tracking/${entryId}`);
    } catch (e) {
      console.error('Error stopping tracking:', e);
    }
  };

  // Get home service clients with location
  const homeServiceClients = queue.filter(q => q.is_home_service && q.client_latitude && q.client_longitude);
  
  // Get clients that are tracking their location (going to barbershop)
  const trackingClients = queue.filter(q => !q.is_home_service && q.client_is_moving && q.client_live_latitude && q.client_live_longitude);
  
  // All clients with location (for map display)
  const allClientsWithLocation = [
    ...homeServiceClients.map(c => ({ ...c, locationType: 'home_service' })),
    ...trackingClients.map(c => ({ ...c, locationType: 'tracking' }))
  ];
  
  // Open Google Maps navigation
  const openNavigation = (client) => {
    const destLat = client.client_live_latitude || client.client_latitude;
    const destLng = client.client_live_longitude || client.client_longitude;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${user?.latitude},${user?.longitude}&destination=${destLat},${destLng}&travelmode=driving`;
    window.open(url, '_blank');
  };

  const waitingClients = queue.filter(q => q.status === 'waiting');
  const inProgressClient = queue.find(q => q.status === 'in_progress');

  return (
    <div className="min-h-screen bg-[#09090B]" data-testid="barber-dashboard">
      {/* Header */}
      <header className="bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={LOGO_URL} alt="ClickBarber" className="h-12 w-auto object-contain" />
              <span className="font-heading text-2xl text-white uppercase tracking-wider">Click<span className="text-amber-500">Barber</span></span>
            </div>
            <div className="flex items-center gap-3">
              {/* Share Button */}
              <button 
                onClick={() => {
                  const shareText = '💈 Sou barbeiro no ClickBarber! Faça seu agendamento comigo em Dublin! 🇮🇪\n\n✂️ Atendimento na barbearia ou em casa\n📍 Me encontre no mapa em tempo real\n\nAcesse: ' + window.location.origin;
                  if (navigator.share) {
                    navigator.share({
                      title: 'ClickBarber',
                      text: shareText,
                      url: window.location.origin
                    });
                  } else {
                    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
                  }
                }}
                className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-full transition-colors"
                title="Compartilhar"
                data-testid="btn-share"
              >
                <Share2 className="w-5 h-5 text-green-400" />
              </button>
              {/* Refresh Button */}
              <button 
                onClick={() => window.location.reload()}
                className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-full transition-colors"
                title="Atualizar página"
                data-testid="btn-refresh"
              >
                <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              {/* Sound Toggle Button */}
              <button 
                onClick={() => {
                  setSoundEnabled(!soundEnabled);
                  if (!soundEnabled) {
                    // Play test sound when enabling
                    playNotificationSound();
                  }
                }}
                className={`p-2 rounded-lg transition-all ${
                  soundEnabled 
                    ? 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30' 
                    : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700'
                }`}
                title={soundEnabled ? 'Som ativado - Clique para desativar' : 'Som desativado - Clique para ativar'}
                data-testid="btn-sound-toggle"
              >
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
              <span className="text-zinc-400 hidden sm:block">{user?.name}</span>
              <button onClick={handleLogout} className="text-zinc-500 hover:text-white transition-colors" data-testid="btn-logout">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Profile Photo Section */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 mb-6" data-testid="profile-photo-section">
          <div className="flex items-center gap-6">
            {/* Photo */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-zinc-700">
                {user?.photo_url ? (
                  <img 
                    src={user.photo_url} 
                    alt={user?.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                    <User className="w-10 h-10 text-zinc-600" />
                  </div>
                )}
              </div>
              
              {/* Upload overlay */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                data-testid="btn-upload-photo"
              >
                {uploadingPhoto ? (
                  <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  <Camera className="w-8 h-8 text-white" />
                )}
              </button>
              
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                data-testid="input-photo-upload"
              />
            </div>
            
            {/* Info */}
            <div className="flex-1">
              <h2 className="font-heading text-2xl text-white uppercase">{user?.name}</h2>
              <p className="text-amber-500">{user?.specialty}</p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-500 fill-current" />
                  <span className="text-white">{user?.rating?.toFixed(1) || '5.0'}</span>
                  <span className="text-zinc-500 text-sm">({user?.total_reviews || 0})</span>
                </div>
                {user?.instagram && (
                  <a 
                    href={`https://instagram.com/${user.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-400 text-sm flex items-center gap-1 hover:text-pink-300"
                  >
                    <Instagram className="w-4 h-4" />
                    @{user.instagram.replace('@', '')}
                  </a>
                )}
              </div>
              
              {/* Buttons Row */}
              <div className="flex items-center gap-3 mt-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 text-sm rounded flex items-center gap-2 transition-colors"
                  data-testid="btn-change-photo"
                >
                  <Image className="w-4 h-4" />
                  Trocar foto
                </button>
                
                {/* Home Service Toggle */}
                <button
                  onClick={toggleHomeServiceOnline}
                  className={`px-4 py-2 text-sm rounded flex items-center gap-2 transition-all ${
                    isHomeServiceOnline 
                      ? 'bg-green-500 hover:bg-green-400 text-white' 
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400'
                  }`}
                  data-testid="btn-toggle-home-service"
                >
                  <Home className="w-4 h-4" />
                  {isHomeServiceOnline ? '🟢 Home Service ON' : '⚫ Home Service OFF'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Home Service Interests Section - Only show when online for home service */}
        {isHomeServiceOnline && (
          <div className="bg-green-500/10 border border-green-500/30 p-6 mb-6 relative" data-testid="interests-section">
            {/* Notification Badge */}
            {homeServiceInterests.unread_count > 0 && (
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-white font-bold text-sm">{homeServiceInterests.unread_count}</span>
              </div>
            )}
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <Bell className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h2 className="font-heading text-lg text-green-400 uppercase">
                  Clientes Querem Home Service
                </h2>
                <p className="text-zinc-500 text-sm">
                  {homeServiceInterests.total_count > 0 
                    ? `${homeServiceInterests.total_count} cliente(s) aguardando atendimento em casa`
                    : 'Nenhum cliente aguardando no momento'}
                </p>
              </div>
            </div>

            {homeServiceInterests.total_count === 0 ? (
              <div className="text-center py-6 bg-zinc-900/50 rounded">
                <Home className="w-10 h-10 text-zinc-600 mx-auto mb-2" />
                <p className="text-zinc-500 text-sm">Aguardando clientes...</p>
                <p className="text-zinc-600 text-xs mt-1">Quando alguém solicitar, aparecerá aqui</p>
              </div>
            ) : (
              <div className="space-y-3">
                {homeServiceInterests.interests.map((interest) => (
                  <div 
                    key={interest.id}
                    className="p-4 rounded border bg-zinc-800/50 border-zinc-700 hover:border-green-500/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-green-500">
                          {interest.client_photo_url ? (
                            <img 
                              src={interest.client_photo_url} 
                              alt={interest.client_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-green-500 flex items-center justify-center">
                              <User className="w-6 h-6 text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-white font-medium flex items-center gap-2">
                            {interest.client_name}
                            <span className="text-xs bg-green-500/30 text-green-400 px-2 py-0.5 rounded">
                              {interest.distance_km} km
                            </span>
                          </p>
                          <p className="text-zinc-400 text-sm flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {interest.client_phone || 'Não informado'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {interest.service_name && (
                          <p className="text-amber-500 text-sm">{interest.service_name}</p>
                        )}
                        {interest.service_price && (
                          <p className="text-white font-bold">€{interest.service_price}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-zinc-900/50 p-3 rounded mb-3">
                      <p className="text-zinc-400 text-sm flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {interest.client_address}
                      </p>
                    </div>

                    <button
                      onClick={() => handleAcceptInterest(interest.id)}
                      className="w-full bg-green-500 hover:bg-green-400 text-white py-3 rounded flex items-center justify-center gap-2 transition-colors font-medium"
                      data-testid={`btn-accept-${interest.id}`}
                    >
                      <CheckCircle className="w-5 h-5" />
                      ACEITAR ATENDIMENTO
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Message when Home Service is OFF */}
        {!isHomeServiceOnline && (
          <div className="bg-zinc-800/50 border border-zinc-700 p-4 mb-6 rounded">
            <div className="flex items-center gap-3">
              <Home className="w-6 h-6 text-zinc-500" />
              <div>
                <p className="text-zinc-400 text-sm">Home Service está <span className="text-red-400">desativado</span></p>
                <p className="text-zinc-600 text-xs">Ative para receber solicitações de atendimento em casa</p>
              </div>
            </div>
          </div>
        )}

        {/* Online Toggle */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 mb-6" data-testid="online-toggle-section">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-2xl text-white uppercase">Status</h2>
              <p className="text-zinc-500">
                {isOnline ? 'You are receiving clients' : 'You are invisible to clients'}
              </p>
              {user?.offers_home_service && (
                <p className="text-green-400 text-sm mt-1 flex items-center gap-1">
                  <Home className="w-4 h-4" /> Home service enabled (€{user?.home_service_fee_per_km}/km)
                </p>
              )}
            </div>
            <button
              onClick={toggleOnline}
              disabled={loading}
              className={`relative w-32 h-16 rounded-sm transition-all duration-300 ${
                isOnline ? 'bg-green-500' : 'bg-zinc-700'
              }`}
              data-testid="btn-toggle-online"
            >
              <div className={`absolute top-2 ${isOnline ? 'right-2' : 'left-2'} w-12 h-12 bg-white rounded-sm transition-all duration-300 flex items-center justify-center`}>
                <Power className={`w-6 h-6 ${isOnline ? 'text-green-500' : 'text-zinc-500'}`} />
              </div>
              <span className={`absolute ${isOnline ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 font-heading text-sm uppercase ${isOnline ? 'text-white' : 'text-zinc-400'}`}>
                {isOnline ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>
        </div>

        {/* Map Section - Location & Home Service Tracking */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 mb-6" data-testid="map-section">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-heading text-lg text-white uppercase flex items-center gap-2">
                <Map className="w-5 h-5 text-amber-500" />
                Sua Localização
              </h2>
              <p className="text-zinc-500 text-sm">
                {isOnline ? (
                  <span className="text-green-400 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Visível para clientes no mapa
                  </span>
                ) : (
                  'Você está offline - não aparece no mapa'
                )}
              </p>
            </div>
            <button
              onClick={() => setShowMap(!showMap)}
              className={`px-4 py-2 border transition-colors flex items-center gap-2 ${
                showMap ? 'bg-amber-500/20 border-amber-500 text-amber-400' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white'
              }`}
              data-testid="btn-toggle-map"
            >
              <Navigation className="w-4 h-4" />
              {showMap ? 'Ocultar Mapa' : 'Ver Mapa'}
            </button>
          </div>

          {showMap && user?.latitude && user?.longitude && (
            <div className="space-y-4">
              {/* Map */}
              <div className="h-[350px] rounded-sm overflow-hidden border border-zinc-700" data-testid="barber-map">
                <MapContainer
                  center={homeServiceClients.length > 0 
                    ? [(user.latitude + homeServiceClients[0].client_latitude) / 2, (user.longitude + homeServiceClients[0].client_longitude) / 2]
                    : [DUBLIN_METRO.center.lat, DUBLIN_METRO.center.lng]
                  }
                  zoom={homeServiceClients.length > 0 ? 12 : DUBLIN_METRO.zoom}
                  style={{ height: '100%', width: '100%' }}
                  maxBounds={[[DUBLIN_METRO.bounds.south, DUBLIN_METRO.bounds.west], [DUBLIN_METRO.bounds.north, DUBLIN_METRO.bounds.east]]}
                  minZoom={9}
                  maxZoom={18}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; OpenStreetMap | Dublin Metro'
                  />
                  
                  {/* Barber Location */}
                  <Marker 
                    position={[user.latitude, user.longitude]} 
                    icon={isOnline ? barberIcon : barberOfflineIcon}
                  >
                    <Popup>
                      <div className="text-black font-medium">
                        <p className="font-bold">📍 Você está aqui</p>
                        <p className="text-sm">{user.address}</p>
                        <p className={`text-sm ${isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                          {isOnline ? '🟢 Online' : '⚫ Offline'}
                        </p>
                      </div>
                    </Popup>
                  </Marker>

                  {/* Home Service Clients */}
                  {homeServiceClients.map((client) => (
                    <React.Fragment key={client.id}>
                      <Marker
                        position={[client.client_latitude, client.client_longitude]}
                        icon={clientIcon}
                        eventHandlers={{
                          click: () => setSelectedClient(client)
                        }}
                      >
                        <Popup>
                          <div className="text-black">
                            <p className="font-bold">🏠 {client.client_name}</p>
                            <p className="text-sm">{client.client_address || 'Home Service'}</p>
                            <p className="text-sm text-amber-600">{client.service?.name} - €{client.total_price}</p>
                            <p className="text-xs text-gray-500">{client.distance_km} km de distância</p>
                          </div>
                        </Popup>
                      </Marker>
                      {/* Line from barber to client */}
                      <Polyline
                        positions={[
                          [user.latitude, user.longitude],
                          [client.client_latitude, client.client_longitude]
                        ]}
                        color={client.status === 'in_progress' ? '#22C55E' : '#F59E0B'}
                        weight={3}
                        opacity={0.7}
                        dashArray={client.status === 'in_progress' ? '' : '10, 10'}
                      />
                    </React.Fragment>
                  ))}

                  {/* Tracking Clients (clients going to barbershop) */}
                  {trackingClients.map((client) => (
                    <React.Fragment key={`tracking-${client.id}`}>
                      <Marker
                        position={[client.client_live_latitude, client.client_live_longitude]}
                        icon={clientMovingIcon}
                        eventHandlers={{
                          click: () => setSelectedClient(client)
                        }}
                      >
                        <Popup>
                          <div className="text-black">
                            <p className="font-bold">🚗 {client.client_name}</p>
                            <p className="text-sm text-blue-600">Em deslocamento</p>
                            <p className="text-sm">{client.service?.name} - €{client.service?.price}</p>
                          </div>
                        </Popup>
                      </Marker>
                      {/* Animated line from client to barber */}
                      <Polyline
                        positions={[
                          [client.client_live_latitude, client.client_live_longitude],
                          [user.latitude, user.longitude]
                        ]}
                        color="#3B82F6"
                        weight={4}
                        opacity={0.8}
                        dashArray="5, 10"
                      />
                    </React.Fragment>
                  ))}
                </MapContainer>
              </div>

              {/* Tracking Clients List (clients coming to barbershop) */}
              {trackingClients.length > 0 && (
                <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-sm mb-4">
                  <h3 className="text-sm font-heading text-blue-400 uppercase mb-3 flex items-center gap-2">
                    <Car className="w-4 h-4" />
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                    Clientes a Caminho ({trackingClients.length})
                  </h3>
                  <div className="space-y-2">
                    {trackingClients.map((client) => (
                      <div 
                        key={client.id}
                        className="flex items-center justify-between p-3 bg-blue-500/10 rounded border border-blue-500/20"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center relative">
                            <User className="w-5 h-5 text-white" />
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse border-2 border-zinc-900"></span>
                          </div>
                          <div>
                            <p className="text-white font-medium flex items-center gap-2">
                              {client.client_name}
                              <span className="text-xs bg-blue-500/30 text-blue-400 px-2 py-0.5 rounded animate-pulse">
                                EM DESLOCAMENTO
                              </span>
                            </p>
                            <p className="text-zinc-400 text-sm">{client.service?.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-amber-500 font-bold">€{client.service?.price}</p>
                          <p className="text-blue-400 text-xs">#{client.position} na fila</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Home Service Clients List */}
              {homeServiceClients.length > 0 && (
                <div className="bg-zinc-800/50 p-4 rounded-sm">
                  <h3 className="text-sm font-heading text-amber-500 uppercase mb-3 flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    Clientes Home Service ({homeServiceClients.length})
                  </h3>
                  <div className="space-y-2">
                    {homeServiceClients.map((client) => (
                      <div 
                        key={client.id}
                        className={`flex items-center justify-between p-3 rounded transition-colors ${
                          client.status === 'in_progress' 
                            ? 'bg-green-500/20 border border-green-500/30' 
                            : 'bg-zinc-700/50 hover:bg-zinc-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            client.status === 'in_progress' ? 'bg-green-500' : 'bg-amber-500'
                          }`}>
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-white font-medium">{client.client_name}</p>
                            <p className="text-zinc-400 text-sm flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {client.client_address || 'Localização do cliente'}
                            </p>
                            <p className="text-zinc-500 text-xs">{client.distance_km} km • €{client.travel_fee} taxa</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right mr-2">
                            <p className="text-amber-500 font-bold">€{client.total_price}</p>
                            <p className={`text-xs ${client.status === 'in_progress' ? 'text-green-400' : 'text-zinc-500'}`}>
                              {client.status === 'in_progress' ? 'Em atendimento' : 'Aguardando'}
                            </p>
                          </div>
                          {/* Tracking buttons */}
                          {trackingEntryId === client.id ? (
                            <button
                              onClick={() => stopBarberTracking(client.id)}
                              className="bg-red-500 hover:bg-red-400 text-white px-3 py-2 rounded flex items-center gap-1 transition-colors"
                              data-testid={`btn-stop-tracking-${client.id}`}
                            >
                              <MapPinOff className="w-4 h-4" />
                              <span className="text-sm">Cheguei</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => startBarberTracking(client.id)}
                              className="bg-green-500 hover:bg-green-400 text-white px-3 py-2 rounded flex items-center gap-1 transition-colors animate-pulse"
                              data-testid={`btn-start-tracking-${client.id}`}
                            >
                              <Car className="w-4 h-4" />
                              <span className="text-sm">Indo</span>
                            </button>
                          )}
                          <button
                            onClick={() => openNavigation(client)}
                            className="bg-blue-500 hover:bg-blue-400 text-white px-3 py-2 rounded flex items-center gap-1 transition-colors"
                            data-testid={`btn-navigate-${client.id}`}
                          >
                            <Navigation className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {homeServiceClients.length === 0 && trackingClients.length === 0 && (
                <div className="bg-zinc-800/30 p-4 text-center rounded">
                  <MapPin className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                  <p className="text-zinc-500 text-sm">Nenhum cliente no mapa no momento</p>
                  <p className="text-zinc-600 text-xs mt-1">Clientes em deslocamento ou home service aparecerão aqui</p>
                </div>
              )}
            </div>
          )}

          {!showMap && (homeServiceClients.length > 0 || trackingClients.length > 0) && (
            <div className="space-y-2">
              {trackingClients.length > 0 && (
                <div className="bg-blue-500/10 border border-blue-500/30 p-3 rounded-sm flex items-center justify-between animate-pulse">
                  <p className="text-blue-400 text-sm flex items-center gap-2">
                    <Car className="w-4 h-4" />
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    {trackingClients.length} cliente(s) a caminho da barbearia
                  </p>
                  <button
                    onClick={() => setShowMap(true)}
                    className="text-blue-500 hover:text-blue-400 text-sm underline"
                  >
                    Acompanhar no mapa
                  </button>
                </div>
              )}
              {homeServiceClients.length > 0 && (
                <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-sm flex items-center justify-between">
                  <p className="text-amber-400 text-sm flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    {homeServiceClients.length} cliente(s) home service aguardando
                  </p>
                  <button
                    onClick={() => setShowMap(true)}
                    className="text-amber-500 hover:text-amber-400 text-sm underline"
                  >
                    Ver no mapa
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Scheduled Appointments Section */}
        {schedules.length > 0 && (
          <div className="bg-zinc-900 border border-zinc-800 p-6 mb-6" data-testid="schedules-section">
            <h2 className="font-heading text-lg text-white uppercase flex items-center gap-2 mb-4">
              <CalendarClock className="w-5 h-5 text-purple-500" />
              Agendamentos ({schedules.length})
            </h2>
            <div className="space-y-3">
              {schedules.map((schedule) => (
                <div 
                  key={schedule.id}
                  className={`p-4 rounded border ${
                    schedule.is_home_service 
                      ? 'bg-amber-500/10 border-amber-500/30' 
                      : 'bg-purple-500/10 border-purple-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        schedule.is_home_service ? 'bg-amber-500' : 'bg-purple-500'
                      }`}>
                        {schedule.is_home_service ? <Home className="w-6 h-6 text-white" /> : <User className="w-6 h-6 text-white" />}
                      </div>
                      <div>
                        <p className="text-white font-medium">{schedule.client_name}</p>
                        <p className="text-zinc-400 text-sm">{schedule.service?.name} - €{schedule.service?.price}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            schedule.is_home_service ? 'bg-amber-500/20 text-amber-400' : 'bg-purple-500/20 text-purple-400'
                          }`}>
                            {schedule.is_home_service ? 'Home Service' : 'Na barbearia'}
                          </span>
                          {schedule.is_home_service && schedule.client_address && (
                            <span className="text-zinc-500 text-xs flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {schedule.client_address}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-purple-400 font-bold text-lg">
                        {new Date(schedule.scheduled_date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                      </p>
                      <p className="text-white font-heading text-xl">{schedule.scheduled_time}</p>
                      {schedule.is_home_service && (
                        <p className="text-amber-500 text-sm">€{schedule.total_price} total</p>
                      )}
                    </div>
                  </div>
                  {/* Actions for home service scheduled appointments */}
                  {schedule.is_home_service && (
                    <div className="mt-3 pt-3 border-t border-zinc-700 flex justify-end gap-2">
                      {trackingEntryId === schedule.id ? (
                        <button
                          onClick={() => stopBarberTracking(schedule.id)}
                          className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
                        >
                          <MapPinOff className="w-4 h-4" />
                          Cheguei
                        </button>
                      ) : (
                        <button
                          onClick={() => startBarberTracking(schedule.id)}
                          className="bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
                        >
                          <Car className="w-4 h-4" />
                          Indo ao cliente
                        </button>
                      )}
                      <button
                        onClick={() => openNavigation(schedule)}
                        className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
                      >
                        <Navigation className="w-4 h-4" />
                        Navegar
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-zinc-900 border border-zinc-800 p-4" data-testid="stat-queue">
            <Users className="w-6 h-6 text-amber-500 mb-2" />
            <p className="font-heading text-3xl text-white">{waitingClients.length}</p>
            <p className="text-zinc-500 text-sm">Na fila</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-4" data-testid="stat-wait">
            <Clock className="w-6 h-6 text-amber-500 mb-2" />
            <p className="font-heading text-3xl text-white">{stats.avgWait}</p>
            <p className="text-zinc-500 text-sm">Min espera</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-4" data-testid="stat-clients">
            <Star className="w-6 h-6 text-amber-500 mb-2" />
            <p className="font-heading text-3xl text-white">{stats.todayClients}</p>
            <p className="text-zinc-500 text-sm">Atendidos hoje</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-4" data-testid="stat-earnings">
            <DollarSign className="w-6 h-6 text-amber-500 mb-2" />
            <p className="font-heading text-3xl text-white">€{stats.todayEarnings}</p>
            <p className="text-zinc-500 text-sm">Ganhos hoje</p>
          </div>
          <div className="bg-pink-500/10 border border-pink-500/30 p-4" data-testid="stat-tips">
            <Heart className="w-6 h-6 text-pink-500 mb-2" />
            <p className="font-heading text-3xl text-pink-400">€{tipsData.today_tips}</p>
            <p className="text-zinc-500 text-sm">Gorjetas hoje</p>
          </div>
        </div>

        {/* Tips Section */}
        {tipsData.tips.length > 0 && (
          <div className="bg-pink-500/10 border border-pink-500/30 p-6 mb-6" data-testid="tips-section">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-lg text-pink-400 uppercase flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Gorjetas Recebidas
              </h2>
              <div className="text-right">
                <p className="text-pink-400 text-sm">Total</p>
                <p className="text-white font-heading text-xl">€{tipsData.total_tips}</p>
              </div>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {tipsData.tips.slice(0, 5).map((tip, index) => (
                <div key={index} className="flex items-center justify-between bg-zinc-900/50 p-3 rounded">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-pink-500" />
                    </div>
                    <div>
                      <p className="text-white text-sm">{tip.client_name}</p>
                      <p className="text-zinc-500 text-xs">{tip.service?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      tip.tip_payment_method === 'cash' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {tip.tip_payment_method === 'cash' ? 'Cash' : 'Card'}
                    </span>
                    <span className="text-pink-400 font-bold">€{tip.tip_amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Current Client */}
          <div className="bg-zinc-900 border border-zinc-800 p-6" data-testid="current-client-section">
            <h3 className="font-heading text-lg text-zinc-400 uppercase mb-4">Current Client</h3>
            
            {inProgressClient ? (
              <div className={`p-4 rounded-sm ${inProgressClient.is_home_service ? 'bg-green-500/10 border border-green-500/30' : 'bg-amber-500/10 border border-amber-500/30'}`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center">
                    {inProgressClient.is_home_service ? (
                      <Home className="w-8 h-8 text-green-500" />
                    ) : (
                      <User className="w-8 h-8 text-zinc-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-heading text-xl">{inProgressClient.client_name}</p>
                    <p className="text-amber-500">{inProgressClient.service?.name}</p>
                    {inProgressClient.is_home_service && (
                      <div className="mt-2 p-2 bg-zinc-800/50 rounded">
                        <p className="text-green-400 text-xs flex items-center gap-1">
                          <Car className="w-3 h-3" /> HOME SERVICE
                        </p>
                        <p className="text-zinc-400 text-sm mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {inProgressClient.client_address || 'Client location'}
                        </p>
                        <p className="text-zinc-500 text-xs">{inProgressClient.distance_km} km • Travel fee: €{inProgressClient.travel_fee}</p>
                      </div>
                    )}
                    {/* Payment Method Badge */}
                    <div className={`mt-2 inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${
                      inProgressClient.payment_method === 'card' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                    }`}>
                      {inProgressClient.payment_method === 'card' ? <CreditCard className="w-3 h-3" /> : <Banknote className="w-3 h-3" />}
                      {inProgressClient.payment_method === 'card' ? 'Card' : 'Cash'}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-amber-500 font-bold text-lg">€{inProgressClient.total_price || inProgressClient.service?.price}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleClientAction(inProgressClient.id, 'complete')}
                    className="flex-1 bg-green-500 text-white font-heading uppercase py-3 hover:bg-green-400 transition-colors flex items-center justify-center gap-2"
                    data-testid="btn-complete"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Complete
                  </button>
                  <button
                    onClick={() => handleClientAction(inProgressClient.id, 'cancel')}
                    className="px-4 bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                    data-testid="btn-cancel-current"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 bg-zinc-800/30">
                <Scissors className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                <p className="text-zinc-500">No client in progress</p>
                {waitingClients.length > 0 && (
                  <button
                    onClick={() => handleClientAction(waitingClients[0].id, 'start')}
                    className="mt-4 bg-amber-500 text-black font-heading uppercase px-6 py-3 hover:bg-amber-400 transition-colors"
                    data-testid="btn-call-next"
                  >
                    Call Next
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Queue List */}
          <div className="bg-zinc-900 border border-zinc-800 p-6" data-testid="queue-section">
            <h3 className="font-heading text-lg text-zinc-400 uppercase mb-4">
              Waiting Queue ({waitingClients.length})
            </h3>
            
            {waitingClients.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {waitingClients.map((client, index) => (
                  <div
                    key={client.id}
                    className={`flex items-center justify-between p-3 transition-colors ${
                      client.is_home_service 
                        ? 'bg-green-500/10 border border-green-500/20 hover:bg-green-500/20' 
                        : 'bg-zinc-800/50 hover:bg-zinc-800'
                    }`}
                    data-testid={`queue-item-${client.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 font-heading font-bold flex items-center justify-center ${
                        client.is_home_service ? 'bg-green-500 text-white' : 'bg-amber-500 text-black'
                      }`}>
                        {client.is_home_service ? <Home className="w-4 h-4" /> : index + 1}
                      </span>
                      <div>
                        <p className="text-white flex items-center gap-2">
                          {client.client_name}
                          {client.is_home_service && (
                            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">HOME</span>
                          )}
                          <span className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 ${
                            client.payment_method === 'card' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                          }`}>
                            {client.payment_method === 'card' ? <CreditCard className="w-3 h-3" /> : <Banknote className="w-3 h-3" />}
                            {client.payment_method === 'card' ? 'Card' : 'Cash'}
                          </span>
                        </p>
                        <p className="text-zinc-500 text-sm">{client.service?.name}</p>
                        {client.is_home_service && (
                          <p className="text-zinc-600 text-xs flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {client.distance_km}km away
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <span className="text-amber-500 font-bold">€{client.total_price || client.service?.price}</span>
                        {client.is_home_service && client.travel_fee > 0 && (
                          <p className="text-green-400 text-xs">incl. €{client.travel_fee} travel</p>
                        )}
                      </div>
                      {!inProgressClient && index === 0 && (
                        <button
                          onClick={() => handleClientAction(client.id, 'start')}
                          className="ml-2 bg-green-500 text-white px-3 py-1 text-sm hover:bg-green-400 transition-colors"
                          data-testid="btn-start-first"
                        >
                          Start
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                <p className="text-zinc-500">Nenhum cliente na fila</p>
                {!isOnline && (
                  <p className="text-zinc-600 text-sm mt-2">Fique online para receber clientes</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Services */}
        <div className="mt-6 bg-zinc-900 border border-zinc-800 p-6" data-testid="services-section">
          <h3 className="font-heading text-lg text-zinc-400 uppercase mb-4">Seus Serviços</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {user?.services?.map((service) => (
              <div key={service.id} className="bg-zinc-800/50 p-4 flex justify-between items-center">
                <div>
                  <p className="text-white">{service.name}</p>
                  <p className="text-zinc-500 text-sm">{service.duration} min</p>
                </div>
                <p className="text-amber-500 font-heading text-xl">€{service.price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Instagram Card */}
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <Instagram className="w-8 h-8 text-pink-500" />
              {!editingInstagram ? (
                <button
                  onClick={() => setEditingInstagram(true)}
                  className="text-zinc-500 hover:text-white transition-colors"
                  data-testid="btn-edit-instagram"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSaveInstagram}
                  className="text-green-500 hover:text-green-400 transition-colors"
                  data-testid="btn-save-instagram"
                >
                  <Save className="w-4 h-4" />
                </button>
              )}
            </div>
            {editingInstagram ? (
              <input
                type="text"
                value={instagramValue}
                onChange={(e) => setInstagramValue(e.target.value)}
                placeholder="@seuperfil"
                className="w-full bg-zinc-800 border border-zinc-700 text-white px-3 py-2 text-sm rounded focus:border-pink-500 transition-colors"
                data-testid="input-instagram-edit"
              />
            ) : (
              <>
                <p className="text-white font-bold truncate">
                  {user?.instagram ? `@${user.instagram.replace('@', '')}` : 'Não definido'}
                </p>
                <p className="text-zinc-500 text-sm">Instagram</p>
              </>
            )}
          </div>

          <button
            onClick={() => navigate('/subscription')}
            className="bg-gradient-to-r from-amber-500 to-amber-600 p-4 rounded-xl flex items-center gap-3 hover:opacity-90 transition-opacity"
            data-testid="btn-subscription"
          >
            <Crown className="w-8 h-8 text-black" />
            <div className="text-left">
              <p className="text-black font-bold">Assinatura</p>
              <p className="text-black/70 text-sm">Gerenciar plano</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/barber/clients')}
            className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center gap-3 hover:border-zinc-700 transition-colors"
            data-testid="btn-clients"
          >
            <History className="w-8 h-8 text-amber-500" />
            <div className="text-left">
              <p className="text-white font-bold">Histórico</p>
              <p className="text-zinc-500 text-sm">Clientes atendidos</p>
            </div>
          </button>

          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center gap-3">
            <Star className="w-8 h-8 text-amber-500" />
            <div className="text-left">
              <p className="text-white font-bold">{user?.rating?.toFixed(1) || '5.0'}</p>
              <p className="text-zinc-500 text-sm">{user?.total_reviews || 0} avaliações</p>
            </div>
          </div>
        </div>

        {/* Referral Section */}
        <div className="mt-6 pb-16">
          <ReferralSection />
        </div>
      </div>
    </div>
  );
};

export default BarberDashboard;
