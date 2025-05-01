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
  Check,
  AlertTriangle,
  Target,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { STRIPE_PRODUCTS } from '../stripe-config';

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
              src="https://i.postimg.cc/0Q32pZbR/logo-png.png"
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
        className="relative min-h-[100svh] flex items-center justify-center pt-20 lg:pt-32"
        style={{
          backgroundImage: 'url(https://i.postimg.cc/5NcQT5mN/IMG-3849-2.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-[#002b28]/80" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="max-w-4xl">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#FDFFEE] leading-tight mb-6 md:mb-8">
                Há quem veja sucesso como uma linha de chegada.
                <span className="text-[#00FFC6]">
                  {' '}
                  Nós vemos como um círculo.
                </span>
              </h1>
              <p className="text-lg md:text-xl text-[#FDFFEE]/90 mb-8 md:mb-12 max-w-2xl">
                Democratizando o sucesso do cliente através de uma plataforma
                intuitiva e poderosa que transforma dados em resultados.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/auth/signup"
                  className="bg-[#00FFC6] text-[#002b28] px-6 py-3 md:px-8 md:py-4 rounded-full font-semibold hover:bg-[#00FFC6]/90 transition-colors flex items-center justify-center gap-2"
                >
                  Começar Agora <ArrowRight size={20} />
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-[#FDFFEE] text-[#FDFFEE] rounded-lg font-medium hover:bg-[#FDFFEE]/10 transition-colors"
                >
                  Ver preços
                </Link>
              </div>
            </div>
            <img
              src="https://i.postimg.cc/6TxBXNcY/image-21-Photoroom.png"
              alt="Macbook Mockup"
              className="w-full lg:w-3/4 max-w-2xl opacity-80"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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

      {/* Pricing Section */}
      <div id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#002b28] sm:text-4xl">
              Planos e Preços
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Escolha o plano ideal para o seu negócio e comece a transformar dados em resultados hoje mesmo.
            </p>
          </div>

          <div className="mt-16 flex justify-center">
            <div className="relative w-full max-w-xl">
              {/* Popular Badge */}
              <div className="absolute -top-4 inset-x-0 flex justify-center">
                <div className="inline-flex rounded-full bg-[#00FFC6]/10 px-4 py-1 text-sm font-semibold leading-5 text-[#00FFC6] ring-1 ring-inset ring-[#00FFC6]/20">
                  Mais Popular
                </div>
              </div>

              {/* Pricing Card */}
              <div className="rounded-2xl border border-[#00FFC6]/20 bg-white p-8 shadow-xl ring-1 ring-[#00FFC6]/5 relative">
                <h3 className="text-2xl font-semibold leading-7 text-[#002b28]">
                  {STRIPE_PRODUCTS.MONTHLY_SUBSCRIPTION.name}
                </h3>

                <p className="mt-4 flex items-baseline gap-x-2">
                  <span className="text-5xl font-bold tracking-tight text-[#002b28]">
                    R$ {STRIPE_PRODUCTS.MONTHLY_SUBSCRIPTION.price}
                  </span>
                  <span className="text-base text-gray-500">/mês</span>
                </p>

                <p className="mt-6 text-base leading-7 text-gray-600">
                  {STRIPE_PRODUCTS.MONTHLY_SUBSCRIPTION.description}
                </p>

                <div className="mt-8">
                  {user ? (
                    <Link
                      to="/pricing"
                      className="inline-flex w-full items-center justify-center rounded-lg bg-[#00FFC6] px-3.5 py-2.5 text-center text-sm font-semibold text-[#002b28] hover:bg-[#00FFC6]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00FFC6]"
                    >
                      Ver preços
                    </Link>
                  ) : (
                    <Link
                      to="/auth/signup"
                      className="inline-flex w-full items-center justify-center rounded-lg bg-[#00FFC6] px-3.5 py-2.5 text-center text-sm font-semibold text-[#002b28] hover:bg-[#00FFC6]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00FFC6]"
                    >
                      Começar Agora
                    </Link>
                  )}
                </div>

                <ul role="list" className="mt-10 space-y-4 text-sm leading-6 text-gray-600">
                  {STRIPE_PRODUCTS.MONTHLY_SUBSCRIPTION.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <Check className="h-6 w-5 flex-none text-[#00FFC6]" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mx-auto mt-24 max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-[#002b28] sm:text-4xl">
              Perguntas Frequentes
            </h2>
            <dl className="mt-10 space-y-8 divide-y divide-gray-900/10">
              <div className="pt-8 lg:grid lg:grid-cols-12 lg:gap-8">
                <dt className="text-base font-semibold leading-7 text-[#002b28] lg:col-span-5">
                  Como funciona o período de teste?
                </dt>
                <dd className="mt-4 lg:col-span-7 lg:mt-0">
                  <p className="text-base leading-7 text-gray-600">
                    Você tem acesso completo a todas as funcionalidades por 7 dias, sem compromisso.
                    Cancele a qualquer momento durante o período de teste.
                  </p>
                </dd>
              </div>
              <div className="pt-8 lg:grid lg:grid-cols-12 lg:gap-8">
                <dt className="text-base font-semibold leading-7 text-[#002b28] lg:col-span-5">
                  Posso cancelar a qualquer momento?
                </dt>
                <dd className="mt-4 lg:col-span-7 lg:mt-0">
                  <p className="text-base leading-7 text-gray-600">
                    Sim, você pode cancelar sua assinatura a qualquer momento. O acesso continua até o final do período pago.
                  </p>
                </dd>
              </div>
              <div className="pt-8 lg:grid lg:grid-cols-12 lg:gap-8">
                <dt className="text-base font-semibold leading-7 text-[#002b28] lg:col-span-5">
                  Quais formas de pagamento são aceitas?
                </dt>
                <dd className="mt-4 lg:col-span-7 lg:mt-0">
                  <p className="text-base leading-7 text-gray-600">
                    Aceitamos todos os principais cartões de crédito: Visa, Mastercard, American Express e Elo.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#002b28] border-t border-[#FDFFEE]/10 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <img
                src="https://i.postimg.cc/HcwgmwwB/image-name.png"
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