import React from 'react';
import { Check, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useSearchParams } from 'react-router-dom';
import SubscriptionButton from '../components/SubscriptionButton';
import { STRIPE_PRODUCTS } from '../stripe-config';

export default function Pricing() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const success = searchParams.get('success') === 'true';
  const canceled = searchParams.get('canceled') === 'true';
  
  const { features, price, name, description } = STRIPE_PRODUCTS.MONTHLY_SUBSCRIPTION;

  return (
    <div className="min-h-screen bg-[#FDFFEE]">
      {/* Header with Return Button */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <Link
              to={user ? "/dashboard" : "/"}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              {user ? "Voltar ao Dashboard" : "Voltar à Página Inicial"}
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {success && (
          <div className="mb-8 rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Check className="h-5 w-5 text-green-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Assinatura realizada com sucesso</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Sua assinatura foi processada com sucesso. Aproveite todos os recursos do CS Labz!</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {canceled && (
          <div className="mb-8 rounded-md bg-yellow-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <ArrowLeft className="h-5 w-5 text-yellow-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Assinatura cancelada</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>Você cancelou o processo de assinatura. Você pode tentar novamente quando quiser.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="sm:align-center sm:flex sm:flex-col">
          <h1 className="text-5xl font-extrabold text-[#002b28] text-center sm:text-6xl">
            Planos e Preços
          </h1>
          <p className="mt-5 text-xl text-gray-500 text-center max-w-3xl mx-auto">
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
            <div className="rounded-2xl border border-[#00FFC6]/20 bg-white p-8 shadow-sm ring-1 ring-[#00FFC6]/5 relative">
              <h3 className="text-2xl font-semibold leading-7 text-[#002b28]">
                {name}
              </h3>

              <p className="mt-4 flex items-baseline gap-x-2">
                <span className="text-5xl font-bold tracking-tight text-[#002b28]">
                  R$ {price}
                </span>
                <span className="text-base text-gray-500">/mês</span>
              </p>

              <p className="mt-6 text-base leading-7 text-gray-600">
                {description}
              </p>

              <div className="mt-8">
                {user ? (
                  <SubscriptionButton />
                ) : (
                  <Link
                    to="/auth/login"
                    className="inline-flex w-full items-center justify-center rounded-md bg-[#00FFC6] px-3.5 py-2.5 text-center text-sm font-semibold text-[#002b28] hover:bg-[#00FFC6]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00FFC6]"
                  >
                    Comece agora
                  </Link>
                )}
              </div>

              <ul role="list" className="mt-10 space-y-4 text-sm leading-6 text-gray-600">
                {features.map((feature) => (
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
  );
}