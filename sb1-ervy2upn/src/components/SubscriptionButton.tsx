import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { STRIPE_PRODUCTS } from '../stripe-config';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function SubscriptionButton() {
  const [loading, setLoading] = useState(false);
  const { session } = useAuth();
  const navigate = useNavigate();

  const handleSubscribe = async () => {
    try {
      if (!session?.access_token) {
        throw new Error('No authentication session found');
      }

      setLoading(true);

      const { priceId, mode } = STRIPE_PRODUCTS.MONTHLY_SUBSCRIPTION;
      
      // Get the Supabase URL from environment variables
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl) {
        throw new Error('VITE_SUPABASE_URL is not defined');
      }
      
      const response = await fetch(
        `${supabaseUrl}/functions/v1/stripe-checkout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            price_id: priceId,
            success_url: `${window.location.origin}/dashboard?success=true`,
            cancel_url: `${window.location.origin}/dashboard?canceled=true`,
            mode,
          }),
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const { error, url } = await response.json();

      if (error) throw new Error(error);
      if (!url) throw new Error('No checkout URL received');

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Erro ao criar sessão de checkout. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSubscribe}
      disabled={loading}
      className="inline-flex w-full items-center justify-center rounded-md bg-[#00FFC6] px-3.5 py-2.5 text-center text-sm font-semibold text-[#002b28] hover:bg-[#00FFC6]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00FFC6] disabled:opacity-50"
    >
      {loading ? (
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#002b28]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : null}
      Assinar Agora
    </button>
  );
}