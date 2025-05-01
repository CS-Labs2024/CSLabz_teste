import React from 'react';
import { Card } from '../../components/ui/card';
import SubscriptionStatus from '../../components/SubscriptionStatus';
import { Link } from 'react-router-dom';
import { CreditCard, ArrowRight } from 'lucide-react';

export default function SubscriptionInfo() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Sua Assinatura</h2>
        <Link 
          to="/pricing" 
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          Ver planos
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SubscriptionStatus />
        
        <Card className="p-6 bg-gradient-to-br from-[#00FFC6]/10 to-[#00FFC6]/5">
          <div className="flex items-center mb-4">
            <CreditCard className="h-5 w-5 text-[#00FFC6] mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Gerenciar Assinatura</h3>
          </div>
          
          <p className="text-gray-600 mb-6">
            Atualize seu plano, método de pagamento ou cancele sua assinatura a qualquer momento.
          </p>
          
          <Link
            to="/pricing"
            className="inline-flex items-center px-4 py-2 bg-[#00FFC6] text-[#002b28] rounded-lg hover:bg-[#00FFC6]/90 transition-colors"
          >
            Gerenciar Plano
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Card>
      </div>
    </div>
  );
}