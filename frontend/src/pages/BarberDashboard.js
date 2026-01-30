import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { Power, Users, Clock, Star, DollarSign, LogOut, Scissors, CheckCircle, XCircle, User, Home, MapPin, Car, Banknote, CreditCard } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const BarberDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, setUser } = useAuth();
  const [isOnline, setIsOnline] = useState(user?.is_online || false);
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    todayClients: 0,
    todayEarnings: 0,
    avgWait: 0
  });

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, []);

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

  const waitingClients = queue.filter(q => q.status === 'waiting');
  const inProgressClient = queue.find(q => q.status === 'in_progress');

  return (
    <div className="min-h-screen bg-[#09090B]" data-testid="barber-dashboard">
      {/* Header */}
      <header className="bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Scissors className="w-8 h-8 text-amber-500" />
              <span className="font-heading text-2xl font-bold text-white">BARBER<span className="text-amber-500">X</span></span>
              <span className="text-zinc-500 text-sm hidden sm:block">/ Painel do Barbeiro</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-zinc-400 hidden sm:block">{user?.name}</span>
              <button onClick={handleLogout} className="text-zinc-500 hover:text-white transition-colors" data-testid="btn-logout">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
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

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
            <p className="text-zinc-500 text-sm">Today's earnings</p>
          </div>
        </div>

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
      </div>
    </div>
  );
};

export default BarberDashboard;
