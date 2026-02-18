import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { ArrowLeft, Users, DollarSign, Calendar, Scissors, Star, Search, User } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const LOGO_URL = "https://customer-assets.emergentagent.com/job_f16b93ce-5ac3-4503-bae3-65d25ede4a91/artifacts/7tsbrqqb_WhatsApp%20Image%202026-01-30%20at%2021.59.32.jpeg";

const ClientHistoryPage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ total: 0, totalSpent: 0 });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await axios.get(`${API}/barber/clients`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClients(res.data.clients);
      
      // Calculate stats
      const totalSpent = res.data.clients.reduce((sum, c) => sum + c.total_spent, 0);
      setStats({
        total: res.data.total_clients,
        totalSpent
      });
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client =>
    client.client_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090B]" data-testid="client-history-page">
      {/* Header */}
      <header className="bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <img src={LOGO_URL} alt="ClickBarber" className="h-10" />
              <span className="text-zinc-500 text-sm">/ Histórico de Clientes</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
            <div className="flex items-center gap-2 text-zinc-400 text-sm mb-2">
              <Users className="w-4 h-4" />
              <span>Total de Clientes</span>
            </div>
            <div className="text-3xl font-bold text-white">{stats.total}</div>
          </div>
          <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
            <div className="flex items-center gap-2 text-zinc-400 text-sm mb-2">
              <DollarSign className="w-4 h-4" />
              <span>Faturamento Total</span>
            </div>
            <div className="text-3xl font-bold text-green-400">€{stats.totalSpent.toFixed(2)}</div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
            data-testid="search-client"
          />
        </div>

        {/* Client List */}
        {filteredClients.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500">
              {searchTerm ? 'Nenhum cliente encontrado' : 'Você ainda não atendeu nenhum cliente'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredClients.map((client) => (
              <div
                key={client.client_id}
                className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 hover:border-zinc-700 transition-colors"
                data-testid={`client-${client.client_id}`}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-amber-500" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate">{client.client_name}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-zinc-400">
                      <div className="flex items-center gap-1">
                        <Scissors className="w-3 h-3" />
                        <span>{client.total_visits} visitas</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>Última: {formatDate(client.last_visit)}</span>
                      </div>
                    </div>

                    {/* Services */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {client.services.slice(0, 3).map((service, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded"
                        >
                          {service.name}
                        </span>
                      ))}
                      {client.services.length > 3 && (
                        <span className="text-xs text-zinc-500">
                          +{client.services.length - 3} mais
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Total Spent */}
                  <div className="text-right flex-shrink-0">
                    <div className="text-green-400 font-bold">€{client.total_spent.toFixed(2)}</div>
                    <div className="text-zinc-500 text-xs">total gasto</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ClientHistoryPage;
