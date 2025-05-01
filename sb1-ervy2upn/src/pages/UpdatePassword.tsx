import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {Lock, AlertCircle, Home, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';

export default function UpdatePassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { updatePassword } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate('/auth/login', { replace: true });
      }
    };

    checkSession();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError(t('As senhas não coincidem'));
      return;
    }

    if (password.length < 8) {
      setError(t('A senha deve ter pelo menos 8 caracteres'));
      return;
    }

    try {
      setError('');
      setLoading(true);
      await updatePassword(password);
      await supabase.auth.signOut();
      navigate('/auth/login', { replace: true });
    } catch (err) {
      setError(t('Falha ao atualizar a senha'));
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
            {t('Nova Senha')}
          </h2>
          <p className="mt-2 text-center text-sm text-brand-light/70">
            {t('Digite sua nova senha')}
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-brand-dark/40 backdrop-blur-sm py-8 px-4 shadow-xl ring-1 ring-brand-light/10 sm:rounded-lg sm:px-10">
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
                  htmlFor="password"
                  className="block text-sm font-medium text-brand-light"
                >
                  {t('Nova Senha')}
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-brand-light/50" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 bg-brand-dark/50 border border-brand-light/20 rounded-md focus:ring-brand-light focus:border-brand-light text-white placeholder-brand-light/50"
                    placeholder={t('Digite sua nova senha')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-brand-light/50" />
                    ) : (
                      <Eye className="h-5 w-5 text-brand-light/50" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-brand-light"
                >
                  {t('Confirme a Nova Senha')}
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-brand-light/50" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 bg-brand-dark/50 border border-brand-light/20 rounded-md focus:ring-brand-light focus:border-brand-light text-white placeholder-brand-light/50"
                    placeholder={t('Confirme sua nova senha')}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-brand-dark bg-brand-light hover:bg-brand-light/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-light disabled:opacity-50"
                >
                  {t('Atualizar Senha')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
