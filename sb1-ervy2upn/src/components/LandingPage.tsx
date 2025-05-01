import React, { useState } from 'react';
import {
  CircleDot,
  Users,
  BarChart3,
  Rocket,
  ArrowRight,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#FDFFEE]">
      {/* Header/Navigation */}
      <nav className="fixed w-full bg-[#002b28]/95 backdrop-blur-sm z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <img
              src="https://i.postimg.com/0Q32pZbR/logo-png.png"
              alt="CS LABZ"
              className="h-8 md:h-12"
            />

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-[#FDFFEE] hover:text-[#00FFC6] transition-colors"
              >
                Recursos
              </a>
              <a
                href="#about"
                className="text-[#FDFFEE] hover:text-[#00FFC6] transition-colors"
              >
                Sobre
              </a>
              <Link
                to="/pricing"
                className="text-[#FDFFEE] hover:text-[#00FFC6] transition-colors"
              >
                Preços
              </Link>
              {user ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-4 py-2 bg-[#00FFC6] text-[#002b28] rounded-lg hover:bg-[#00FFC6]/90 transition-colors"
                >
                  Dashboard
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              ) : (
                <Link
                  to="/auth/login"
                  className="inline-flex items-center px-4 py-2 bg-[#00FFC6] text-[#002b28] rounded-lg hover:bg-[#00FFC6]/90 transition-colors"
                >
                  Entrar
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-[#FDFFEE]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-[#FDFFEE]/10">
              <div className="flex flex-col gap-4">
                <a
                  href="#features"
                  className="text-[#FDFFEE] hover:text-[#00FFC6] transition-colors"
                >
                  Recursos
                </a>
                <a
                  href="#about"
                  className="text-[#FDFFEE] hover:text-[#00FFC6] transition-colors"
                >
                  Sobre
                </a>
                <Link
                  to="/pricing"
                  className="text-[#FDFFEE] hover:text-[#00FFC6] transition-colors"
                >
                  Preços
                </Link>
                {user ? (
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center px-4 py-2 bg-[#00FFC6] text-[#002b28] rounded-lg hover:bg-[#00FFC6]/90 transition-colors"
                  >
                    Dashboard
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                ) : (
                  <Link
                    to="/auth/login"
                    className="inline-flex items-center px-4 py-2 bg-[#00FFC6] text-[#002b28] rounded-lg hover:bg-[#00FFC6]/90 transition-colors"
                  >
                    Entrar
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div
        className="relative min-h-screen flex items-center justify-center pt-20 lg:pt-32"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-[#002b28]/80" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="max-w-4xl">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#FDFFEE] leading-tight">
                Transforme dados em resultados com nossa plataforma de Customer Success
              </h1>
              <p className="mt-6 text-lg text-[#FDFFEE]/80">
                Tome decisões baseadas em dados, preveja churn e aumente a retenção dos seus clientes com nossa plataforma completa de análise e gestão.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/auth/signup"
                  className="inline-flex items-center justify-center px-6 py-3 bg-[#00FFC6] text-[#002b28] rounded-lg font-medium hover:bg-[#00FFC6]/90 transition-colors"
                >
                  Comece agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-[#FDFFEE] text-[#FDFFEE] rounded-lg font-medium hover:bg-[#FDFFEE]/10 transition-colors"
                >
                  Ver preços
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#002b28] sm:text-4xl">
              Tudo que você precisa para o sucesso dos seus clientes
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Uma plataforma completa para ajudar você a entender, reter e crescer sua base de clientes.
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: 'Análise de Cohort',
                description:
                  'Entenda o comportamento dos seus clientes ao longo do tempo e identifique padrões de retenção.',
                icon: BarChart3,
              },
              {
                name: 'Gestão de Risco',
                description:
                  'Identifique sinais de churn antecipadamente e tome ações preventivas.',
                icon: AlertTriangle,
              },
              {
                name: 'Cobertura de Carteira',
                description:
                  'Acompanhe e otimize o relacionamento com seus clientes de forma eficiente.',
                icon: Target,
              },
            ].map((feature) => (
              <div
                key={feature.name}
                className="relative p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-[#00FFC6]/10 rounded-lg mb-4">
                  <feature.icon className="h-6 w-6 text-[#00FFC6]" />
                </div>
                <h3 className="text-lg font-semibold text-[#002b28]">
                  {feature.name}
                </h3>
                <p className="mt-2 text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#002b28] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative isolate overflow-hidden rounded-3xl bg-[#00FFC6]/10 px-6 py-24 text-center shadow-2xl sm:px-16">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Comece a transformar seus dados em resultados hoje mesmo
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
              Experimente gratuitamente por 7 dias e descubra como podemos ajudar sua empresa a crescer.
            </p>
            <div className="mt-10 flex items-center justify-center gap-6">
              <Link
                to="/auth/signup"
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-[#002b28] shadow-sm hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Começar agora
              </Link>
              <Link
                to="/pricing"
                className="text-sm font-semibold leading-6 text-white"
              >
                Ver preços <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#002b28] border-t border-[#FDFFEE]/10 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <img
                src="https://i.postimg.com/HcwgmwwB/image-name.png"
                alt="CS LABZ"
                className="h-8"
              />
              <p className="mt-4 text-sm text-[#FDFFEE]/60">
                Transformando dados em sucesso para seus clientes.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#FDFFEE]">Produto</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    to="/pricing"
                    className="text-sm text-[#FDFFEE]/60 hover:text-[#00FFC6]"
                  >
                    Preços
                  </Link>
                </li>
                <li>
                  <a
                    href="#features"
                    className="text-sm text-[#FDFFEE]/60 hover:text-[#00FFC6]"
                  >
                    Recursos
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#FDFFEE]">Empresa</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a
                    href="#about"
                    className="text-sm text-[#FDFFEE]/60 hover:text-[#00FFC6]"
                  >
                    Sobre
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-[#FDFFEE]/60 hover:text-[#00FFC6]"
                  >
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#FDFFEE]">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-sm text-[#FDFFEE]/60 hover:text-[#00FFC6]"
                  >
                    Termos de Uso
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-[#FDFFEE]/60 hover:text-[#00FFC6]"
                  >
                    Privacidade
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-[#FDFFEE]/10 pt-8">
            <p className="text-sm text-[#FDFFEE]/60 text-center">
              © {new Date().getFullYear()} CS LABZ. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;