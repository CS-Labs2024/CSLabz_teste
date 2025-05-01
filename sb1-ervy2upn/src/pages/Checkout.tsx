import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '../lib/stripe';
import CheckoutForm from '../components/CheckoutForm';
import { Card } from '../components/ui/card';
import { ArrowLeft, ShieldCheck, CreditCard, CheckCircle } from 'lucide-react';

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [amount, setAmount] = useState(0);
  const [currency, setCurrency] = useState('brl');
  
  const priceId = searchParams.get('price_id');
  const productName = searchParams.get('product_name');
  
  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
      return;
    }
    
    if (!priceId) {
      setError('ID do produto não fornecido');
      setLoading(false);
      return;
    }
    
    const createPaymentIntent = async () => {
      try {
        setLoading(true);
        
        // Call your Supabase Edge Function to create a payment intent
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment-intent`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
            },
            body: JSON.stringify({
              price_id: priceId,
            }),
          }
        );
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        setClientSecret(data.clientSecret);
        setAmount(data.amount);
        setCurrency(data.currency);
        setLoading(false);
      } catch (err) {
        console.error('Error creating payment intent:', err);
        setError('Erro ao iniciar o pagamento. Por favor, tente novamente.');
        setLoading(false);
      }
    };
    
    createPaymentIntent();
  }, [user, priceId, navigate]);
  
  const handlePaymentSuccess = () => {
    setSuccess(true);
    // Redirect to success page after a short delay
    setTimeout(() => {
      navigate('/dashboard?payment_success=true');
    }, 2000);
  };
  
  return (
    <div className="min-h-screen bg-[#FDFFEE] py-12">
      <div className="max-w-md mx-auto px-4">
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </button>
        </div>
        
        <Card className="p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Finalizar Compra</h1>
            {productName && (
              <p className="text-gray-600 mt-2">Produto: {productName}</p>
            )}
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00FFC6] mx-auto"></div>
              <p className="mt-4 text-gray-600">Preparando seu pagamento...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-red-700">{error}</p>
              <button
                onClick={() => navigate('/pricing')}
                className="mt-4 px-4 py-2 bg-[#00FFC6] text-[#002b28] rounded-lg"
              >
                Voltar para Planos
              </button>
            </div>
          ) : success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Pagamento Confirmado!
              </h2>
              <p className="text-gray-600">
                Redirecionando para o dashboard...
              </p>
            </div>
          ) : clientSecret ? (
            <div>
              <Elements
                stripe={stripePromise}
                options={{ clientSecret, appearance: { theme: 'stripe' } }}
              >
                <CheckoutForm 
                  clientSecret={clientSecret} 
                  onSuccess={handlePaymentSuccess}
                  amount={amount}
                  currency={currency}
                />
              </Elements>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center text-sm text-gray-500">
                  <ShieldCheck className="w-4 h-4 mr-2 text-gray-400" />
                  <span>Pagamento seguro via Stripe</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <CreditCard className="w-4 h-4 mr-2 text-gray-400" />
                  <span>Aceitamos os principais cartões de crédito</span>
                </div>
              </div>
            </div>
          ) : null}
        </Card>
      </div>
    </div>
  );
}