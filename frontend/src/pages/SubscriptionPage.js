import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { Crown, Check, Zap, Users, BarChart, HeadsetIcon, ArrowLeft, CreditCard } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const LOGO_URL = "https://customer-assets.emergentagent.com/job_f16b93ce-5ac3-4503-bae3-65d25ede4a91/artifacts/7tsbrqqb_WhatsApp%20Image%202026-01-30%20at%2021.59.32.jpeg";

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [plans, setPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [plansRes, statusRes] = await Promise.all([
        axios.get(`${API}/subscription/plans`),
        axios.get(`${API}/subscription/status`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setPlans(plansRes.data.plans);
      setCurrentPlan(statusRes.data);
    } catch (error) {
      console.error('Error fetching subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId) => {
    setProcessingPlan(planId);
    try {
      const res = await axios.post(
        `${API}/subscription/checkout?plan_id=${planId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Redirect to Stripe checkout
      window.location.href = res.data.checkout_url;
    } catch (error) {
      console.error('Error creating checkout:', error);
      alert('Erro ao processar assinatura');
    } finally {
      setProcessingPlan(null);
    }
  };

  const getFeatureIcon = (feature) => {
    if (feature.includes('Perfil')) return <Crown className="w-4 h-4" />;
    if (feature.includes('clientes')) return <Users className="w-4 h-4" />;
    if (feature.includes('Relatórios')) return <BarChart className="w-4 h-4" />;
    if (feature.includes('Suporte')) return <HeadsetIcon className="w-4 h-4" />;
    return <Check className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090B]" data-testid="subscription-page">
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
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Escolha seu Plano</h1>
          <p className="text-zinc-400">
            {currentPlan?.status === 'trial' 
              ? `Você está no período de teste gratuito. Assine para continuar!`
              : 'Aumente sua visibilidade e conquiste mais clientes'}
          </p>
        </div>

        {/* Current Plan Status */}
        {currentPlan && (
          <div className="bg-zinc-900 rounded-xl p-4 mb-8 border border-zinc-800">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-zinc-400 text-sm">Plano atual</div>
                <div className="text-white font-medium capitalize">{currentPlan.plan || 'Nenhum'}</div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                currentPlan.status === 'active' ? 'bg-green-500/20 text-green-400' :
                currentPlan.status === 'trial' ? 'bg-amber-500/20 text-amber-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {currentPlan.status === 'active' ? 'Ativo' :
                 currentPlan.status === 'trial' ? 'Período de Teste' : 'Expirado'}
              </div>
            </div>
          </div>
        )}

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-zinc-900 rounded-2xl p-6 border-2 transition-all ${
                plan.id === 'premium' 
                  ? 'border-amber-500 relative' 
                  : 'border-zinc-800 hover:border-zinc-700'
              }`}
              data-testid={`plan-${plan.id}`}
            >
              {plan.id === 'premium' && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-black px-4 py-1 rounded-full text-sm font-bold">
                  POPULAR
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  plan.id === 'premium' ? 'bg-amber-500' : 'bg-zinc-800'
                }`}>
                  {plan.id === 'premium' ? (
                    <Crown className="w-6 h-6 text-black" />
                  ) : (
                    <Zap className="w-6 h-6 text-amber-500" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <div className="text-zinc-400 text-sm">{plan.trial_days} dias grátis</div>
                </div>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-white">€{plan.price.toFixed(2)}</span>
                <span className="text-zinc-400">/mês</span>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      plan.id === 'premium' ? 'bg-amber-500/20 text-amber-500' : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {getFeatureIcon(feature)}
                    </div>
                    <span className="text-zinc-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={processingPlan === plan.id || currentPlan?.plan === plan.id && currentPlan?.status === 'active'}
                className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                  plan.id === 'premium'
                    ? 'bg-amber-500 text-black hover:bg-amber-400'
                    : 'bg-zinc-800 text-white hover:bg-zinc-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                data-testid={`subscribe-${plan.id}`}
              >
                {processingPlan === plan.id ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : currentPlan?.plan === plan.id && currentPlan?.status === 'active' ? (
                  <>
                    <Check className="w-5 h-5" />
                    Plano Atual
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Assinar
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="mt-8 text-center text-zinc-500 text-sm">
          <p>Pagamento seguro via Stripe. Cancele quando quiser.</p>
        </div>
      </main>
    </div>
  );
};

export default SubscriptionPage;
