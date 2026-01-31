import React, { useState } from 'react';
import axios from 'axios';
import { Heart, Banknote, CreditCard, X, DollarSign, Sparkles } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const TipModal = ({ entry, onClose, onTipGiven }) => {
  const [tipAmount, setTipAmount] = useState(5);
  const [customTip, setCustomTip] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const tipOptions = [2, 5, 10, 15, 20];

  const handleTip = async () => {
    const amount = customTip ? parseFloat(customTip) : tipAmount;
    
    if (!amount || amount <= 0) {
      alert('Por favor, selecione um valor');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API}/tips?queue_entry_id=${entry.id}&amount=${amount}&payment_method=${paymentMethod}`);
      setSuccess(true);
      setTimeout(() => {
        onTipGiven && onTipGiven();
        onClose();
      }, 2000);
    } catch (e) {
      alert(e.response?.data?.detail || 'Erro ao enviar gorjeta');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md p-8 text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h3 className="font-heading text-2xl text-white uppercase mb-2">Obrigado!</h3>
          <p className="text-zinc-400">Sua gorjeta foi enviada com sucesso</p>
          <p className="text-green-400 font-bold text-xl mt-2">€{customTip || tipAmount}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4" data-testid="tip-modal">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white z-10"
          data-testid="btn-close-tip"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-4">
          <div className="w-14 h-14 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-7 h-7 text-amber-500" />
          </div>
          <h3 className="font-heading text-lg text-white uppercase">Dar Gorjeta</h3>
          <p className="text-zinc-400 text-sm">{entry.barber?.name || 'o barbeiro'}</p>
        </div>

        {/* Service Info */}
        <div className="bg-zinc-800/50 p-3 mb-4 rounded">
          <p className="text-white font-medium text-sm">{entry.service?.name}</p>
          <p className="text-amber-500 font-bold">€{entry.total_price || entry.service?.price}</p>
        </div>

        {/* Tip Amount Selection */}
        <div className="mb-4">
          <p className="text-zinc-400 text-xs uppercase tracking-wider mb-2">Valor da gorjeta</p>
          <div className="grid grid-cols-5 gap-2 mb-2">
            {tipOptions.map((amount) => (
              <button
                key={amount}
                onClick={() => { setTipAmount(amount); setCustomTip(''); }}
                className={`py-2 border transition-all text-center text-sm ${
                  tipAmount === amount && !customTip
                    ? 'border-amber-500 bg-amber-500/20 text-amber-500'
                    : 'border-zinc-700 text-zinc-400 hover:border-zinc-600'
                }`}
                data-testid={`btn-tip-${amount}`}
              >
                €{amount}
              </button>
            ))}
          </div>
          
          {/* Custom Amount */}
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="number"
              value={customTip}
              onChange={(e) => { setCustomTip(e.target.value); setTipAmount(0); }}
              placeholder="Outro valor..."
              className="w-full bg-zinc-800 border border-zinc-700 text-white pl-10 pr-4 py-2 text-sm focus:border-amber-500 transition-colors"
              data-testid="input-custom-tip"
            />
          </div>
        </div>

        {/* Payment Method */}
        <div className="mb-4">
          <p className="text-zinc-400 text-xs uppercase tracking-wider mb-2">Forma de pagamento</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setPaymentMethod('cash')}
              className={`p-3 border transition-all flex items-center justify-center gap-2 ${
                paymentMethod === 'cash' ? 'border-green-500 bg-green-500/10' : 'border-zinc-700 hover:border-zinc-600'
              }`}
              data-testid="btn-tip-cash"
            >
              <Banknote className={`w-5 h-5 ${paymentMethod === 'cash' ? 'text-green-500' : 'text-zinc-500'}`} />
              <span className={`font-medium text-sm ${paymentMethod === 'cash' ? 'text-white' : 'text-zinc-400'}`}>Cash</span>
            </button>
            
            <button
              onClick={() => setPaymentMethod('card')}
              className={`p-3 border transition-all flex items-center justify-center gap-2 ${
                paymentMethod === 'card' ? 'border-blue-500 bg-blue-500/10' : 'border-zinc-700 hover:border-zinc-600'
              }`}
              data-testid="btn-tip-card"
            >
              <CreditCard className={`w-5 h-5 ${paymentMethod === 'card' ? 'text-blue-500' : 'text-zinc-500'}`} />
              <span className={`font-medium text-sm ${paymentMethod === 'card' ? 'text-white' : 'text-zinc-400'}`}>Card</span>
            </button>
          </div>
        </div>

        {/* Total */}
        <div className="bg-amber-500/10 border border-amber-500/30 p-3 mb-4 rounded">
          <div className="flex justify-between items-center">
            <span className="text-white text-sm">Gorjeta</span>
            <span className="text-amber-500 font-heading text-xl">€{customTip || tipAmount || 0}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onClose}
            className="bg-zinc-800 text-white py-3 font-heading uppercase hover:bg-zinc-700 transition-colors"
            data-testid="btn-skip-tip"
          >
            Pular
          </button>
          <button
            onClick={handleTip}
            disabled={loading || (!tipAmount && !customTip)}
            className="bg-amber-500 text-black py-3 font-heading uppercase hover:bg-amber-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            data-testid="btn-send-tip"
          >
            {loading ? (
              <span className="animate-spin">⏳</span>
            ) : (
              <>
                <Heart className="w-5 h-5" />
                Enviar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TipModal;
