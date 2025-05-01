import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/button';

export default function SuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const success = searchParams.get('success') === 'true';
  
  useEffect(() => {
    if (!success) {
      navigate('/dashboard');
    }
    
    // Clear the success parameter after 5 seconds
    const timer = setTimeout(() => {
      navigate('/dashboard', { replace: true });
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [success, navigate]);
  
  if (!success) return null;
  
  return (
    <div className="min-h-screen bg-[#FDFFEE] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Assinatura Confirmada!
        </h2>
        
        <p className="text-gray-600 mb-8">
          Sua assinatura foi processada com sucesso. Agora você tem acesso a todos os recursos do CS Labz!
        </p>
        
        <Button 
          onClick={() => navigate('/dashboard')}
          className="bg-[#00FFC6] text-[#002b28] hover:bg-[#00FFC6]/90"
        >
          Ir para o Dashboard
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}