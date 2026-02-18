import React, { useState, useEffect } from 'react';
import { Gift, Copy, Check, Users, DollarSign, Share2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ReferralSection = () => {
  const { token } = useAuth();
  const [referralInfo, setReferralInfo] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReferralInfo();
  }, []);

  const fetchReferralInfo = async () => {
    try {
      const res = await axios.get(`${API}/referral/info`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReferralInfo(res.data);
    } catch (error) {
      console.error('Error fetching referral info:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = async () => {
    if (referralInfo?.referral_code) {
      await navigator.clipboard.writeText(referralInfo.referral_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareText = `🎉 Conheça o ClickBarber! Use meu código ${referralInfo?.referral_code || ''} e ganhe €5 no primeiro corte! ✂️💈`;
  
  const shareOnWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 animate-pulse">
        <div className="h-6 bg-zinc-800 rounded w-1/3 mb-4"></div>
        <div className="h-20 bg-zinc-800 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 rounded-xl p-6 border border-amber-500/20" data-testid="referral-section">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
          <Gift className="w-5 h-5 text-black" />
        </div>
        <div>
          <h3 className="text-white font-bold">Indique e Ganhe</h3>
          <p className="text-zinc-400 text-sm">€5 para você e €5 para seu amigo!</p>
        </div>
      </div>

      {/* Referral Code */}
      <div className="bg-zinc-900 rounded-lg p-4 mb-4">
        <div className="text-zinc-400 text-xs mb-1">Seu código de indicação</div>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-mono font-bold text-amber-500" data-testid="referral-code">
            {referralInfo?.referral_code || '---'}
          </span>
          <button
            onClick={copyCode}
            className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors text-sm"
            data-testid="copy-referral"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-green-400">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-zinc-400" />
                <span className="text-zinc-400">Copiar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-zinc-900 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-zinc-400 text-sm mb-1">
            <Users className="w-4 h-4" />
            <span>Indicados</span>
          </div>
          <div className="text-2xl font-bold text-white">{referralInfo?.total_referrals || 0}</div>
        </div>
        <div className="bg-zinc-900 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-zinc-400 text-sm mb-1">
            <DollarSign className="w-4 h-4" />
            <span>Saldo</span>
          </div>
          <div className="text-2xl font-bold text-green-400">€{(referralInfo?.referral_balance || 0).toFixed(2)}</div>
        </div>
      </div>

      {/* Share Button */}
      <button
        onClick={shareOnWhatsApp}
        className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-500 transition-colors flex items-center justify-center gap-2"
        data-testid="share-whatsapp-btn"
      >
        <Share2 className="w-5 h-5" />
        Compartilhar no WhatsApp
      </button>

      {/* Info */}
      <p className="text-zinc-500 text-xs text-center mt-3">
        O saldo pode ser usado para pagar serviços no app.
      </p>
    </div>
  );
};

export default ReferralSection;
