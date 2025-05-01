import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Home, ArrowRight, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { user, signIn, signInWithGoogle } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      if (err?.message?.includes('Invalid login credentials')) {
        setError('Email ou senha inválidos. Por favor, tente novamente.');
      } else if (err?.message?.includes('Email not confirmed')) {
        setError(
          'Por favor, confirme seu email antes de fazer login. Verifique sua caixa de entrada.'
        );
      } else {
        setError('Erro ao fazer login. Por favor, tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setGoogleLoading(true);
      await signInWithGoogle();
      // No need to navigate here as the OAuth flow will redirect the user
    } catch (err: any) {
      console.error('Google login error:', err);
      setError('Erro ao fazer login com Google. Por favor, tente novamente.');
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Left Panel - Login Form */}
      <div className="w-full lg:w-[45%] xl:w-[40%] bg-[#002b28] p-8 flex flex-col justify-between relative">
        <div>
          <Link to="/" className="inline-block">
            <img
              src="https://i.postimg.cc/0Q32pZbR/logo-png.png"
              alt="CS LABZ"
              className="h-12"
            />
          </Link>
        </div>

        <div className="my-auto w-full max-w-md mx-auto py-12">
          <h1 className="text-[#00FFC6] text-4xl font-bold mb-2">Bem-vindo</h1>
          <p className="text-gray-400 mb-8">
            Entre com suas credenciais para acessar sua conta
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#00FFC6]">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="
                  w-full bg-[#001a18]
                  text-white                  /* texto digitado em branco           */
                  placeholder-white           /* placeholder em branco (opcional)   */
                  pl-12 pr-4 py-3 rounded-lg
                  border border-gray-800
                  focus:border-[#00FFC6] focus:ring-1 focus:ring-[#00FFC6]
                  transition-colors
                "
                  placeholder="Digite seu e-mail"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#00FFC6]">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#001a18] text-white pl-12 pr-4 py-3 rounded-lg border border-gray-800 focus:border-[#00FFC6] focus:ring-1 focus:ring-[#00FFC6] transition-colors"
                  placeholder="Digite sua senha"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-800 text-[#00FFC6] focus:ring-[#00FFC6]"
                />
                <span className="ml-2 text-sm text-gray-400">Lembrar-me</span>
              </label>

              <Link
                to="/auth/reset-password"
                className="text-sm text-[#00FFC6] hover:text-[#00FFC6]/80 transition-colors"
              >
                Esqueceu a senha?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00FFC6] text-[#002b28] py-3 rounded-lg font-medium hover:bg-[#00FFC6]/90 transition-colors flex items-center justify-center group"
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5"
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
              ) : (
                <>
                  Entrar
                  <ArrowRight className="ml-2 h-5 w-5 transform transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#002b28] text-gray-400">
                  Ou continue com
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                {googleLoading ? (
                  <svg
                    className="animate-spin h-5 w-5"
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
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                    >
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                      <path fill="none" d="M1 1h22v22H1z" />
                    </svg>
                    Google
                  </>
                )}
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-gray-400">
            Não tem uma conta?{' '}
            <Link
              to="/auth/signup"
              className="text-[#00FFC6] hover:text-[#00FFC6]/80 transition-colors font-medium"
            >
              Criar conta
            </Link>
          </p>
        </div>

        <div className="text-center text-sm text-gray-400">
          © {new Date().getFullYear()} CS LABZ. Todos os direitos reservados.
        </div>
      </div>

      {/* Right Panel - Hero Image */}
      <div className="hidden lg:block lg:w-[55%] xl:w-[60%] bg-[#001a18] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#002b28] to-transparent opacity-90" />
        <img
          src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Office"
          className="object-cover w-full h-full"
        />

        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-xl text-center">
            <h2 className="text-4xl font-bold text-[#00FFC6] mb-6">
              Transforme dados em resultados
            </h2>
            <p className="text-xl text-gray-300">
              Gerencie seus clientes de forma inteligente e tome decisões
              baseadas em dados reais
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}