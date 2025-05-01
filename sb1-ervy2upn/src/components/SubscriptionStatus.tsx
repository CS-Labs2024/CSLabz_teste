import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface Subscription {
  subscription_status: string;
  current_period_end: number;
  cancel_at_period_end: boolean;
  payment_method_brand?: string;
  payment_method_last4?: string;
}

export default function SubscriptionStatus() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getSubscription() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('stripe_user_subscriptions')
          .select('*')
          .maybeSingle();

        if (error) throw error;
        setSubscription(data);
      } catch (err) {
        console.error('Error fetching subscription:', err);
        setError('Falha ao carregar status da assinatura');
      } finally {
        setLoading(false);
      }
    }

    getSubscription();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-3">
          <Clock className="h-5 w-5 text-gray-400 animate-pulse" />
          <p className="text-gray-500">Carregando informações da assinatura...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!subscription || subscription.subscription_status === 'not_started') {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Status da Assinatura</h3>
        <div className="flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-yellow-500" />
          <p className="text-gray-600">Você ainda não possui uma assinatura ativa</p>
        </div>
      </div>
    );
  }

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    trialing: 'bg-blue-100 text-blue-800',
    past_due: 'bg-yellow-100 text-yellow-800',
    canceled: 'bg-red-100 text-red-800',
    incomplete: 'bg-orange-100 text-orange-800',
    incomplete_expired: 'bg-gray-100 text-gray-800',
    unpaid: 'bg-red-100 text-red-800',
    paused: 'bg-purple-100 text-purple-800',
  };

  const formatStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      active: 'Ativa',
      trialing: 'Período de Teste',
      past_due: 'Pagamento Atrasado',
      canceled: 'Cancelada',
      incomplete: 'Incompleta',
      incomplete_expired: 'Expirada',
      unpaid: 'Não Paga',
      paused: 'Pausada',
    };
    return statusMap[status] || status;
  };

  const isActive = subscription.subscription_status === 'active' || 
                   subscription.subscription_status === 'trialing';

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Status da Assinatura</h3>
      
      <div className="space-y-4">
        <div className="flex items-center">
          {isActive ? (
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
          ) : (
            <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
          )}
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            statusColors[subscription.subscription_status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
          }`}>
            {formatStatus(subscription.subscription_status)}
          </span>
        </div>

        {subscription.current_period_end && (
          <div>
            <p className="text-sm text-gray-500">Próxima cobrança</p>
            <p className="text-sm font-medium text-gray-900">
              {new Date(subscription.current_period_end * 1000).toLocaleDateString('pt-BR')}
            </p>
          </div>
        )}

        {subscription.payment_method_brand && (
          <div>
            <p className="text-sm text-gray-500">Método de Pagamento</p>
            <p className="text-sm font-medium text-gray-900">
              {subscription.payment_method_brand.toUpperCase()} •••• {subscription.payment_method_last4}
            </p>
          </div>
        )}

        {subscription.cancel_at_period_end && (
          <div className="text-sm text-red-600 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            Assinatura será cancelada ao final do período atual
          </div>
        )}
      </div>
    </div>
  );
}