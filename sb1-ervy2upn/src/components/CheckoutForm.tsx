import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Button } from './ui/button';
import { AlertCircle, CheckCircle, CreditCard } from 'lucide-react';

interface CheckoutFormProps {
  clientSecret: string;
  onSuccess: () => void;
  amount: number;
  currency: string;
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Inter", sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

export default function CheckoutForm({ clientSecret, onSuccess, amount, currency }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const formatAmount = (amount: number, currency: string) => {
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency.toUpperCase(),
    });
    
    // Stripe amounts are in cents, so divide by 100
    return formatter.format(amount / 100);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    const cardElement = elements.getElement(CardElement);
    
    if (!cardElement) {
      setError('Erro ao processar o pagamento. Por favor, tente novamente.');
      setProcessing(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (error) {
      setError(error.message || 'Erro ao processar o pagamento');
      setProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      setSucceeded(true);
      setError(null);
      onSuccess();
    } else {
      setError('Erro inesperado ao processar o pagamento');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {succeeded && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-green-700">Pagamento processado com sucesso!</p>
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600 mb-2">Total a pagar:</p>
        <p className="text-2xl font-bold text-gray-900">{formatAmount(amount, currency)}</p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Dados do Cartão
        </label>
        <div className="border border-gray-300 rounded-md p-4 bg-white">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={processing || !stripe || succeeded}
        className="w-full bg-[#00FFC6] text-[#002b28] hover:bg-[#00FFC6]/90 flex items-center justify-center"
      >
        <CreditCard className="w-5 h-5 mr-2" />
        {processing ? 'Processando...' : 'Finalizar Pagamento'}
      </Button>
    </form>
  );
}