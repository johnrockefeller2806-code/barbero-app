import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentRequestButtonElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { CreditCard, Smartphone, Loader2, CheckCircle, Apple } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Initialize Stripe with publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_TYooMQauvdEDq54NiTphI7jx');

// Payment Form Component
const PaymentForm = ({ enrollment, onSuccess, onCancel, language }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [canMakePayment, setCanMakePayment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingApplePay, setCheckingApplePay] = useState(true);

  useEffect(() => {
    if (!stripe || !enrollment) return;

    const pr = stripe.paymentRequest({
      country: 'IE',
      currency: 'eur',
      total: {
        label: `${enrollment.course_name} - ${enrollment.school_name}`,
        amount: Math.round(enrollment.price * 100), // Stripe uses cents
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    // Check if the Payment Request API is available
    pr.canMakePayment().then(result => {
      setCheckingApplePay(false);
      if (result) {
        setPaymentRequest(pr);
        setCanMakePayment(true);
      }
    });

    // Handle payment success
    pr.on('paymentmethod', async (ev) => {
      setLoading(true);
      try {
        // Create checkout session with the payment method
        const response = await axios.post(`${API}/payments/checkout`, {
          enrollment_id: enrollment.id,
          origin_url: window.location.origin,
          payment_method_id: ev.paymentMethod.id
        });

        // If we got a URL, redirect (fallback)
        if (response.data.url) {
          ev.complete('success');
          window.location.href = response.data.url;
        } else {
          ev.complete('success');
          onSuccess && onSuccess();
        }
      } catch (error) {
        ev.complete('fail');
        toast.error(language === 'pt' ? 'Erro no pagamento' : 'Payment error');
      } finally {
        setLoading(false);
      }
    });
  }, [stripe, enrollment]);

  // Handle traditional card payment (redirect to Stripe Checkout)
  const handleCardPayment = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API}/payments/checkout`, {
        enrollment_id: enrollment.id,
        origin_url: window.location.origin
      });

      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || (language === 'pt' ? 'Erro ao processar pagamento' : 'Error processing payment'));
      setLoading(false);
    }
  };

  const platformFee = (enrollment.price * 0.15).toFixed(2);
  const schoolReceives = (enrollment.price * 0.85).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <Card className="border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-serif">
            {language === 'pt' ? 'Resumo do Pedido' : 'Order Summary'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium text-slate-900">{enrollment.course_name}</p>
              <p className="text-sm text-slate-500">{enrollment.school_name}</p>
            </div>
            <p className="font-bold text-lg text-emerald-700">€{enrollment.price?.toFixed(2)}</p>
          </div>
          
          <Separator />
          
          <div className="bg-slate-50 rounded-lg p-3 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>{language === 'pt' ? 'Taxa STUFF (15%)' : 'STUFF Fee (15%)'}</span>
              <span>€{platformFee}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>{language === 'pt' ? 'Escola recebe' : 'School receives'}</span>
              <span>€{schoolReceives}</span>
            </div>
          </div>

          <Separator />
          
          <div className="flex justify-between items-center font-bold text-lg">
            <span>{language === 'pt' ? 'Total a pagar' : 'Total to pay'}</span>
            <span className="text-emerald-700">€{enrollment.price?.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <div className="space-y-4">
        <p className="font-medium text-slate-900">
          {language === 'pt' ? 'Escolha como pagar:' : 'Choose how to pay:'}
        </p>

        {/* Apple Pay / Google Pay Button */}
        {checkingApplePay ? (
          <div className="flex items-center justify-center p-4 bg-slate-50 rounded-xl">
            <Loader2 className="h-5 w-5 animate-spin text-slate-400 mr-2" />
            <span className="text-slate-500 text-sm">
              {language === 'pt' ? 'Verificando Apple Pay / Google Pay...' : 'Checking Apple Pay / Google Pay...'}
            </span>
          </div>
        ) : canMakePayment && paymentRequest ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
              <Smartphone className="h-4 w-4" />
              <span>{language === 'pt' ? 'Pagamento rápido pelo celular' : 'Quick payment by phone'}</span>
            </div>
            <div className="rounded-xl overflow-hidden border border-slate-200">
              <PaymentRequestButtonElement
                options={{
                  paymentRequest,
                  style: {
                    paymentRequestButton: {
                      type: 'buy',
                      theme: 'dark',
                      height: '56px',
                    },
                  },
                }}
              />
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
              <Apple className="h-4 w-4" />
              <span>Apple Pay</span>
              <span>•</span>
              <span>Google Pay</span>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
            <p>
              {language === 'pt' 
                ? 'Apple Pay / Google Pay não disponível neste dispositivo. Use o pagamento por cartão abaixo.'
                : 'Apple Pay / Google Pay not available on this device. Use card payment below.'}
            </p>
          </div>
        )}

        {/* Divider */}
        <div className="flex items-center gap-4 my-4">
          <div className="flex-1 h-px bg-slate-200"></div>
          <span className="text-sm text-slate-400">
            {language === 'pt' ? 'ou' : 'or'}
          </span>
          <div className="flex-1 h-px bg-slate-200"></div>
        </div>

        {/* Card Payment Button */}
        <Button
          onClick={handleCardPayment}
          disabled={loading}
          className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-lg"
          data-testid="card-payment-btn"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
          ) : (
            <CreditCard className="h-5 w-5 mr-2" />
          )}
          {language === 'pt' ? 'Pagar com Cartão' : 'Pay with Card'}
        </Button>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mt-4">
          <CheckCircle className="h-4 w-4" />
          <span>{language === 'pt' ? 'Pagamento seguro via Stripe' : 'Secure payment via Stripe'}</span>
        </div>
      </div>

      {/* Cancel Button */}
      <Button
        variant="ghost"
        onClick={onCancel}
        className="w-full text-slate-500"
        disabled={loading}
      >
        {language === 'pt' ? 'Cancelar' : 'Cancel'}
      </Button>
    </div>
  );
};

// Main Payment Checkout Component with Elements wrapper
export const PaymentCheckout = ({ enrollment, onSuccess, onCancel, language = 'pt' }) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm 
        enrollment={enrollment} 
        onSuccess={onSuccess} 
        onCancel={onCancel}
        language={language}
      />
    </Elements>
  );
};

export default PaymentCheckout;
