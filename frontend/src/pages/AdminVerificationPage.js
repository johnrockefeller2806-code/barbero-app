import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { 
  Shield, CheckCircle, XCircle, User, FileText, Clock, 
  ArrowLeft, Eye, Loader2, RefreshCw, AlertCircle, Mail, Phone
} from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const LOGO_URL = "https://customer-assets.emergentagent.com/job_f16b93ce-5ac3-4503-bae3-65d25ede4a91/artifacts/7tsbrqqb_WhatsApp%20Image%202026-01-30%20at%2021.59.32.jpeg";

const AdminVerificationPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pendingBarbers, setPendingBarbers] = useState([]);
  const [verifiedBarbers, setVerifiedBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [notes, setNotes] = useState('');
  const [tab, setTab] = useState('pending'); // pending, verified

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pendingRes, verifiedRes] = await Promise.all([
        axios.get(`${API}/admin/pending-verifications`),
        axios.get(`${API}/admin/verified-barbers`)
      ]);
      setPendingBarbers(pendingRes.data.pending_verifications || []);
      setVerifiedBarbers(verifiedRes.data.verified_barbers || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
    setLoading(false);
  };

  const handleVerify = async (barberId, action) => {
    setActionLoading(barberId);
    try {
      await axios.post(`${API}/admin/verify-barber`, {
        barber_id: barberId,
        action: action,
        notes: notes
      });
      setNotes('');
      setSelectedBarber(null);
      await fetchData();
    } catch (err) {
      console.error('Error:', err);
      alert(err.response?.data?.detail || 'Erro ao processar verificação');
    }
    setActionLoading(null);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/barber')}
              className="text-zinc-500 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <img src={LOGO_URL} alt="ClickBarber" className="h-10" />
            <div>
              <h1 className="text-white font-bold">Painel de Verificação</h1>
              <p className="text-zinc-500 text-sm">Gerenciar verificações de barbeiros</p>
            </div>
          </div>
          <button
            onClick={fetchData}
            className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
            disabled={loading}
          >
            <RefreshCw className={`w-5 h-5 text-zinc-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('pending')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              tab === 'pending' 
                ? 'bg-amber-500 text-black' 
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            <Clock className="w-4 h-4" />
            Pendentes ({pendingBarbers.length})
          </button>
          <button
            onClick={() => setTab('verified')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              tab === 'verified' 
                ? 'bg-green-500 text-white' 
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            Verificados ({verifiedBarbers.length})
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          </div>
        ) : (
          <>
            {/* Pending Verifications */}
            {tab === 'pending' && (
              <div className="space-y-4">
                {pendingBarbers.length === 0 ? (
                  <div className="bg-zinc-900 rounded-xl p-8 text-center">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <p className="text-zinc-400">Nenhuma verificação pendente</p>
                  </div>
                ) : (
                  pendingBarbers.map((barber) => (
                    <div
                      key={barber.id}
                      className="bg-zinc-900 rounded-xl overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                          {/* Avatar */}
                          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center overflow-hidden">
                            {barber.photo_url ? (
                              <img src={barber.photo_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-8 h-8 text-zinc-500" />
                            )}
                          </div>
                          
                          {/* Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-white font-bold text-lg">{barber.name}</h3>
                              <span className={`px-2 py-0.5 rounded-full text-xs ${
                                barber.verification_status === 'under_review'
                                  ? 'bg-amber-500/20 text-amber-500'
                                  : 'bg-zinc-700 text-zinc-400'
                              }`}>
                                {barber.verification_status === 'under_review' ? 'Em análise' : 'Pendente'}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-zinc-500">
                              <span className="flex items-center gap-1">
                                <Mail className="w-4 h-4" />
                                {barber.email}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone className="w-4 h-4" />
                                {barber.phone || 'N/A'}
                              </span>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div className="text-right">
                            <p className="text-zinc-500 text-xs">Enviado em</p>
                            <p className="text-zinc-400 text-sm">
                              {formatDate(barber.verification_submitted_at)}
                            </p>
                          </div>
                        </div>

                        {/* Contract Status */}
                        <div className="flex items-center gap-2 mb-4 p-3 bg-zinc-800 rounded-lg">
                          <FileText className="w-5 h-5 text-zinc-500" />
                          <span className="text-zinc-400 text-sm">Contrato:</span>
                          {barber.contract_accepted ? (
                            <span className="text-green-500 text-sm flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" />
                              Aceito em {formatDate(barber.contract_accepted_at)}
                            </span>
                          ) : (
                            <span className="text-red-500 text-sm flex items-center gap-1">
                              <XCircle className="w-4 h-4" />
                              Não aceito
                            </span>
                          )}
                        </div>

                        {/* Documents */}
                        {(barber.passport_photo_url || barber.passport_selfie_url) && (
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            {barber.passport_photo_url && (
                              <div>
                                <p className="text-zinc-500 text-xs mb-2">Foto do Passaporte</p>
                                <div className="relative group">
                                  <img
                                    src={barber.passport_photo_url}
                                    alt="Passport"
                                    className="w-full h-40 object-cover rounded-lg cursor-pointer"
                                    onClick={() => window.open(barber.passport_photo_url, '_blank')}
                                  />
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                    <Eye className="w-6 h-6 text-white" />
                                  </div>
                                </div>
                              </div>
                            )}
                            {barber.passport_selfie_url && (
                              <div>
                                <p className="text-zinc-500 text-xs mb-2">Selfie com Passaporte</p>
                                <div className="relative group">
                                  <img
                                    src={barber.passport_selfie_url}
                                    alt="Selfie"
                                    className="w-full h-40 object-cover rounded-lg cursor-pointer"
                                    onClick={() => window.open(barber.passport_selfie_url, '_blank')}
                                  />
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                    <Eye className="w-6 h-6 text-white" />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Action Buttons */}
                        {selectedBarber === barber.id ? (
                          <div className="space-y-4">
                            <textarea
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              placeholder="Notas (opcional) - ex: Motivo da rejeição"
                              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white text-sm resize-none"
                              rows={2}
                            />
                            <div className="flex gap-3">
                              <button
                                onClick={() => { setSelectedBarber(null); setNotes(''); }}
                                className="flex-1 bg-zinc-700 text-white py-3 rounded-lg hover:bg-zinc-600 transition-colors"
                              >
                                Cancelar
                              </button>
                              <button
                                onClick={() => handleVerify(barber.id, 'reject')}
                                disabled={actionLoading === barber.id}
                                className="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                              >
                                {actionLoading === barber.id ? (
                                  <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                  <>
                                    <XCircle className="w-5 h-5" />
                                    Rejeitar
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => handleVerify(barber.id, 'approve')}
                                disabled={actionLoading === barber.id}
                                className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                              >
                                {actionLoading === barber.id ? (
                                  <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                  <>
                                    <CheckCircle className="w-5 h-5" />
                                    Aprovar
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setSelectedBarber(barber.id)}
                            className="w-full bg-amber-500 text-black font-bold py-3 rounded-lg hover:bg-amber-400 transition-colors flex items-center justify-center gap-2"
                          >
                            <Shield className="w-5 h-5" />
                            Verificar
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Verified Barbers */}
            {tab === 'verified' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {verifiedBarbers.length === 0 ? (
                  <div className="col-span-full bg-zinc-900 rounded-xl p-8 text-center">
                    <AlertCircle className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
                    <p className="text-zinc-400">Nenhum barbeiro verificado ainda</p>
                  </div>
                ) : (
                  verifiedBarbers.map((barber) => (
                    <div
                      key={barber.id}
                      className="bg-zinc-900 rounded-xl p-4"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center overflow-hidden">
                          {barber.photo_url ? (
                            <img src={barber.photo_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-6 h-6 text-zinc-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-medium truncate">{barber.name}</h3>
                          <p className="text-zinc-500 text-sm truncate">{barber.email}</p>
                        </div>
                        <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        </div>
                      </div>
                      <div className="text-xs text-zinc-500">
                        Verificado em {formatDate(barber.verification_reviewed_at)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminVerificationPage;
