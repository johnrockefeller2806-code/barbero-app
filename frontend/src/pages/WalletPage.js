import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { 
  Wallet, ArrowLeft, TrendingUp, ArrowDownCircle, ArrowUpCircle,
  Clock, CheckCircle, AlertCircle, Loader2, RefreshCw, Settings,
  Calendar, DollarSign, CreditCard, Zap, Building, ChevronRight
} from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const LOGO_URL = "https://customer-assets.emergentagent.com/job_f16b93ce-5ac3-4503-bae3-65d25ede4a91/artifacts/7tsbrqqb_WhatsApp%20Image%202026-01-30%20at%2021.59.32.jpeg";

const WalletPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [walletData, setWalletData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [payoutHistory, setPayoutHistory] = useState([]);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [showAutoPayoutModal, setShowAutoPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutType, setPayoutType] = useState('standard');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // overview, transactions, payouts

  // Auto payout config
  const [autoPayoutConfig, setAutoPayoutConfig] = useState({
    enabled: false,
    frequency: 'weekly',
    minimum_amount: 50
  });

  useEffect(() => {
    fetchWalletData();
    fetchTransactions();
    fetchPayoutHistory();
  }, []);

  const fetchWalletData = async () => {
    try {
      const res = await axios.get(`${API}/wallet/balance`);
      setWalletData(res.data);
      if (res.data.auto_payout) {
        setAutoPayoutConfig(res.data.auto_payout);
      }
    } catch (err) {
      console.error('Error fetching wallet:', err);
    }
    setLoading(false);
  };

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(`${API}/wallet/transactions?limit=50`);
      setTransactions(res.data.transactions || []);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  const fetchPayoutHistory = async () => {
    try {
      const res = await axios.get(`${API}/wallet/payouts`);
      setPayoutHistory(res.data.payouts || []);
    } catch (err) {
      console.error('Error fetching payouts:', err);
    }
  };

  const handlePayout = async () => {
    if (!payoutAmount || parseFloat(payoutAmount) < 1) {
      setError('Valor mínimo para saque é €1');
      return;
    }

    if (parseFloat(payoutAmount) > (walletData?.available_balance || 0)) {
      setError('Saldo insuficiente');
      return;
    }

    setProcessing(true);
    setError('');
    setSuccess('');

    try {
      const res = await axios.post(`${API}/wallet/payout`, {
        amount: parseFloat(payoutAmount),
        payout_type: payoutType
      });

      setSuccess(res.data.message);
      setShowPayoutModal(false);
      setPayoutAmount('');
      fetchWalletData();
      fetchPayoutHistory();
      fetchTransactions();
    } catch (err) {
      setError(err.response?.data?.detail || 'Erro ao processar saque');
    }
    setProcessing(false);
  };

  const handleSaveAutoPayout = async () => {
    setProcessing(true);
    try {
      await axios.post(`${API}/wallet/auto-payout`, autoPayoutConfig);
      setSuccess('Configuração salva com sucesso!');
      setShowAutoPayoutModal(false);
      fetchWalletData();
    } catch (err) {
      setError(err.response?.data?.detail || 'Erro ao salvar configuração');
    }
    setProcessing(false);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      paid: { color: 'bg-green-500/20 text-green-500', label: 'Pago' },
      pending: { color: 'bg-amber-500/20 text-amber-500', label: 'Pendente' },
      in_transit: { color: 'bg-blue-500/20 text-blue-500', label: 'Em trânsito' },
      failed: { color: 'bg-red-500/20 text-red-500', label: 'Falhou' },
      completed: { color: 'bg-green-500/20 text-green-500', label: 'Concluído' }
    };
    const badge = badges[status] || { color: 'bg-zinc-500/20 text-zinc-500', label: status };
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-20">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-4 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/barber')}
              className="text-zinc-500 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <img src={LOGO_URL} alt="ClickBarber" className="h-8" />
            <div>
              <h1 className="text-white font-bold">Minha Carteira</h1>
              <p className="text-zinc-500 text-xs">Gerencie seus ganhos</p>
            </div>
          </div>
          <button
            onClick={() => { fetchWalletData(); fetchTransactions(); fetchPayoutHistory(); }}
            className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5 text-zinc-400" />
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="max-w-2xl mx-auto px-4 pt-4">
          <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            {success}
          </div>
        </div>
      )}

      {error && (
        <div className="max-w-2xl mx-auto px-4 pt-4">
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Not Connected Warning */}
        {!walletData?.connected && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-amber-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-amber-500 font-bold">Configure sua Conta</h3>
                <p className="text-zinc-400 text-sm">
                  Conecte sua conta Stripe para receber pagamentos e fazer saques.
                </p>
              </div>
              <button
                onClick={() => navigate('/barber')}
                className="bg-amber-500 text-black px-4 py-2 rounded-lg font-bold hover:bg-amber-400 transition-colors"
              >
                Configurar
              </button>
            </div>
          </div>
        )}

        {/* Balance Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Available Balance */}
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-5">
            <p className="text-amber-100 text-sm mb-1">Saldo Disponível</p>
            <p className="text-white text-3xl font-bold">
              €{(walletData?.available_balance || 0).toFixed(2)}
            </p>
            <p className="text-amber-100 text-xs mt-2">Pronto para saque</p>
          </div>

          {/* Pending Balance */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <p className="text-zinc-500 text-sm mb-1">Saldo Pendente</p>
            <p className="text-white text-3xl font-bold">
              €{(walletData?.pending_balance || 0).toFixed(2)}
            </p>
            <p className="text-zinc-500 text-xs mt-2">Aguardando liberação</p>
          </div>
        </div>

        {/* Earnings Summary */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-6">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Resumo de Ganhos
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-zinc-500 text-sm">Esta Semana</p>
              <p className="text-green-500 text-xl font-bold">
                €{(walletData?.week_earnings || 0).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-zinc-500 text-sm">Este Mês</p>
              <p className="text-green-500 text-xl font-bold">
                €{(walletData?.month_earnings || 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setShowPayoutModal(true)}
            disabled={!walletData?.connected || (walletData?.available_balance || 0) < 1}
            className="bg-green-500 text-white font-bold py-4 rounded-xl hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            data-testid="btn-payout"
          >
            <ArrowDownCircle className="w-5 h-5" />
            Sacar
          </button>
          <button
            onClick={() => setShowAutoPayoutModal(true)}
            disabled={!walletData?.connected}
            className="bg-zinc-800 text-white font-bold py-4 rounded-xl hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            data-testid="btn-auto-payout"
          >
            <Settings className="w-5 h-5" />
            Saque Automático
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {[
            { id: 'overview', label: 'Visão Geral' },
            { id: 'transactions', label: 'Transações' },
            { id: 'payouts', label: 'Saques' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-black font-bold'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Recent Transactions */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                <h3 className="text-white font-bold">Transações Recentes</h3>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className="text-amber-500 text-sm hover:underline"
                >
                  Ver todas
                </button>
              </div>
              <div className="divide-y divide-zinc-800">
                {transactions.slice(0, 5).map((t, i) => (
                  <div key={i} className="p-4 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      t.type === 'earning' ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}>
                      {t.type === 'earning' ? (
                        <ArrowUpCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <ArrowDownCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">{t.description}</p>
                      <p className="text-zinc-500 text-xs">{formatDate(t.date)}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${t.amount >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {t.amount >= 0 ? '+' : ''}€{Math.abs(t.amount).toFixed(2)}
                      </p>
                      {getStatusBadge(t.status)}
                    </div>
                  </div>
                ))}
                {transactions.length === 0 && (
                  <div className="p-8 text-center text-zinc-500">
                    Nenhuma transação ainda
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="divide-y divide-zinc-800">
              {transactions.map((t, i) => (
                <div key={i} className="p-4 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    t.type === 'earning' ? 'bg-green-500/20' : 'bg-red-500/20'
                  }`}>
                    {t.type === 'earning' ? (
                      <ArrowUpCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <ArrowDownCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm truncate">{t.description}</p>
                    <p className="text-zinc-500 text-xs">{formatDate(t.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${t.amount >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {t.amount >= 0 ? '+' : ''}€{Math.abs(t.amount).toFixed(2)}
                    </p>
                    {getStatusBadge(t.status)}
                  </div>
                </div>
              ))}
              {transactions.length === 0 && (
                <div className="p-8 text-center text-zinc-500">
                  Nenhuma transação ainda
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'payouts' && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="divide-y divide-zinc-800">
              {payoutHistory.map((p, i) => (
                <div key={i} className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Building className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm">
                      Saque {p.payout_type === 'instant' ? 'Instantâneo' : 'Standard'}
                    </p>
                    <p className="text-zinc-500 text-xs">{formatDate(p.created_at)}</p>
                    {p.arrival_date && (
                      <p className="text-zinc-500 text-xs">
                        Previsão: {formatDate(p.arrival_date)}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">€{p.amount.toFixed(2)}</p>
                    {p.fee > 0 && (
                      <p className="text-zinc-500 text-xs">Taxa: €{p.fee.toFixed(2)}</p>
                    )}
                    {getStatusBadge(p.status)}
                  </div>
                </div>
              ))}
              {payoutHistory.length === 0 && (
                <div className="p-8 text-center text-zinc-500">
                  Nenhum saque realizado ainda
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Payout Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-2xl max-w-md w-full overflow-hidden">
            <div className="bg-zinc-800 px-6 py-4 flex items-center justify-between">
              <h3 className="text-white font-bold text-lg">Solicitar Saque</h3>
              <button
                onClick={() => { setShowPayoutModal(false); setError(''); }}
                className="text-zinc-500 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="bg-zinc-800 rounded-lg p-4 mb-6">
                <p className="text-zinc-500 text-sm">Saldo Disponível</p>
                <p className="text-amber-500 text-2xl font-bold">
                  €{(walletData?.available_balance || 0).toFixed(2)}
                </p>
              </div>

              {/* Amount Input */}
              <div className="mb-6">
                <label className="block text-zinc-400 text-sm mb-2">Valor do Saque</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">€</span>
                  <input
                    type="number"
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 pl-8 text-white text-xl focus:outline-none focus:border-amber-500"
                    min="1"
                    max={walletData?.available_balance || 0}
                  />
                </div>
                <button
                  onClick={() => setPayoutAmount((walletData?.available_balance || 0).toString())}
                  className="text-amber-500 text-sm mt-2 hover:underline"
                >
                  Sacar tudo
                </button>
              </div>

              {/* Payout Type */}
              <div className="mb-6">
                <label className="block text-zinc-400 text-sm mb-2">Tipo de Saque</label>
                <div className="space-y-3">
                  <label className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer border ${
                    payoutType === 'instant' ? 'border-amber-500 bg-amber-500/10' : 'border-zinc-700 bg-zinc-800'
                  }`}>
                    <input
                      type="radio"
                      name="payoutType"
                      value="instant"
                      checked={payoutType === 'instant'}
                      onChange={(e) => setPayoutType(e.target.value)}
                      className="hidden"
                    />
                    <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center">
                      <Zap className="w-5 h-5 text-amber-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">Saque Instantâneo</p>
                      <p className="text-zinc-500 text-sm">Receba em minutos</p>
                    </div>
                    <div className="text-right">
                      <p className="text-amber-500 font-bold">1.5%</p>
                      <p className="text-zinc-500 text-xs">taxa</p>
                    </div>
                  </label>

                  <label className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer border ${
                    payoutType === 'standard' ? 'border-green-500 bg-green-500/10' : 'border-zinc-700 bg-zinc-800'
                  }`}>
                    <input
                      type="radio"
                      name="payoutType"
                      value="standard"
                      checked={payoutType === 'standard'}
                      onChange={(e) => setPayoutType(e.target.value)}
                      className="hidden"
                    />
                    <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">Saque Standard</p>
                      <p className="text-zinc-500 text-sm">2-3 dias úteis</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-500 font-bold">Grátis</p>
                      <p className="text-zinc-500 text-xs">sem taxa</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Summary */}
              {payoutAmount && parseFloat(payoutAmount) > 0 && (
                <div className="bg-zinc-800 rounded-lg p-4 mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-zinc-400">Valor</span>
                    <span className="text-white">€{parseFloat(payoutAmount).toFixed(2)}</span>
                  </div>
                  {payoutType === 'instant' && (
                    <div className="flex justify-between mb-2">
                      <span className="text-zinc-400">Taxa (1.5%)</span>
                      <span className="text-red-400">-€{(parseFloat(payoutAmount) * 0.015).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-zinc-700 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-white font-bold">Você recebe</span>
                      <span className="text-green-500 font-bold">
                        €{(payoutType === 'instant' 
                          ? parseFloat(payoutAmount) * 0.985 
                          : parseFloat(payoutAmount)
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm mb-4">
                  {error}
                </div>
              )}

              <button
                onClick={handlePayout}
                disabled={processing || !payoutAmount || parseFloat(payoutAmount) < 1}
                className="w-full bg-green-500 text-white font-bold py-4 rounded-lg hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {processing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <ArrowDownCircle className="w-5 h-5" />
                    Confirmar Saque
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auto Payout Modal */}
      {showAutoPayoutModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-2xl max-w-md w-full overflow-hidden">
            <div className="bg-zinc-800 px-6 py-4 flex items-center justify-between">
              <h3 className="text-white font-bold text-lg">Saque Automático</h3>
              <button
                onClick={() => setShowAutoPayoutModal(false)}
                className="text-zinc-500 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-white font-medium">Ativar Saque Automático</p>
                  <p className="text-zinc-500 text-sm">Receba seus ganhos automaticamente</p>
                </div>
                <button
                  onClick={() => setAutoPayoutConfig(prev => ({ ...prev, enabled: !prev.enabled }))}
                  className={`w-14 h-8 rounded-full transition-colors ${
                    autoPayoutConfig.enabled ? 'bg-green-500' : 'bg-zinc-700'
                  }`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full transition-transform ${
                    autoPayoutConfig.enabled ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {autoPayoutConfig.enabled && (
                <>
                  <div className="mb-6">
                    <label className="block text-zinc-400 text-sm mb-2">Frequência</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 'daily', label: 'Diário' },
                        { value: 'weekly', label: 'Semanal' },
                        { value: 'monthly', label: 'Mensal' }
                      ].map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => setAutoPayoutConfig(prev => ({ ...prev, frequency: opt.value }))}
                          className={`py-2 rounded-lg text-sm transition-colors ${
                            autoPayoutConfig.frequency === opt.value
                              ? 'bg-amber-500 text-black font-bold'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-zinc-400 text-sm mb-2">Valor Mínimo para Saque</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">€</span>
                      <input
                        type="number"
                        value={autoPayoutConfig.minimum_amount}
                        onChange={(e) => setAutoPayoutConfig(prev => ({ 
                          ...prev, 
                          minimum_amount: parseFloat(e.target.value) || 10 
                        }))}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 pl-8 text-white focus:outline-none focus:border-amber-500"
                        min="10"
                      />
                    </div>
                    <p className="text-zinc-500 text-xs mt-1">Mínimo €10</p>
                  </div>
                </>
              )}

              <button
                onClick={handleSaveAutoPayout}
                disabled={processing}
                className="w-full bg-amber-500 text-black font-bold py-4 rounded-lg hover:bg-amber-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {processing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Salvar Configuração'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletPage;
