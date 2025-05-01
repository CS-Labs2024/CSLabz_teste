import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader, CheckCircle, XCircle } from 'lucide-react';

export default function AuthCallback() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setStatus('error');
          return;
        }
        
        if (data.session) {
          setStatus('success');
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            navigate('/dashboard');
          }, 1500);
        } else {
          setStatus('error');
        }
      } catch (err) {
        console.error('Error in auth callback:', err);
        setStatus('error');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#FDFFEE] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 text-center">
        {status === 'loading' && (
          <>
            <Loader className="w-16 h-16 text-[#00FFC6] mx-auto animate-spin mb-6" />
            <h2 className="text-2xl font-bold text-[#002b28] mb-2">
              Processando autenticação
            </h2>
            <p className="text-gray-600">
              Por favor, aguarde enquanto finalizamos o processo de login...
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-[#002b28] mb-2">
              Login realizado com sucesso!
            </h2>
            <p className="text-gray-600">
              Você será redirecionado para o dashboard em instantes...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-[#002b28] mb-2">
              Erro na autenticação
            </h2>
            <p className="text-gray-600 mb-6">
              Ocorreu um erro durante o processo de login. Por favor, tente novamente.
            </p>
            <button
              onClick={() => navigate('/auth/login')}
              className="px-6 py-2 bg-[#00FFC6] text-[#002b28] rounded-lg font-medium hover:bg-[#00FFC6]/90 transition-colors"
            >
              Voltar para o login
            </button>
          </>
        )}
      </div>
    </div>
  );
}