import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, AlertCircle, Home } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setMessage('');
      setLoading(true);
      await resetPassword(email);
      setMessage(
        'Um e-mail com instruções para redefinir sua senha foi enviado. Por favor, verifique sua caixa de entrada.'
      );
    } catch (err) {
      setError(
        'Ocorreu um erro ao enviar o e-mail de redefinição. Por favor, tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-dark to-black flex flex-col">
      <nav className="bg-brand-dark/90 backdrop-blur-sm border-b border-brand-light/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <img
              src="https://i.postimg.cc/0Q32pZbR/logo-png.png"
              alt="CS LABZ"
              className="h-8 md:h-12"
            />
            <div className="flex items-center space-x-4">
              <LanguageToggle />
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 text-brand-light hover:text-white transition-colors"
              >
                <Home className="w-5 h-5 mr-2" />
                {t('Página Inicial')}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-center text-3xl font-extrabold text-white">
            {t('Recuperar Senha')}
          </h2>
          <p className="mt-2 text-center text-sm text-brand-light/70">
            {t('Digite seu e-mail para receber as instruções de recuperação')}
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-brand-dark/40 backdrop-blur-sm py-8 px-4 shadow-xl ring-1 ring-brand-light/10 sm:rounded-lg sm:px-10">
            {message ? (
              <div className="rounded-md bg-green-500/10 border border-green-500/20 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-200">
                      {message}
                    </h3>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="rounded-md bg-red-500/10 border border-red-500/20 p-4">
                    <div className="flex">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-200">
                          {error}
                        </h3>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-brand-light"
                  >
                    {t('E-mail')}
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-brand-light/50" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 bg-brand-dark/50 border border-brand-light/20 rounded-md focus:ring-brand-light focus:border-brand-light text-white placeholder-brand-light/50"
                      placeholder={t('Digite seu e-mail')}
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-brand-dark bg-brand-light hover:bg-brand-light/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-light disabled:opacity-50"
                  >
                    {loading ? t('Enviando...') : t('Enviar E-mail')}
                  </button>
                </div>

                <div className="text-center">
                  <Link
                    to="/auth/login"
                    className="text-sm text-brand-light hover:text-brand-light/80"
                  >
                    {t('Voltar para o Login')}
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
