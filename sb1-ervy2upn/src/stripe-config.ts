export const STRIPE_PRODUCTS = {
  MONTHLY_SUBSCRIPTION: {
    priceId: 'price_1QjryLRuQ4kDNGWRS9pH8lTi',
    name: 'Assinatura mensal CS Labz',
    description:
      'Democratizando o sucesso do cliente através de uma plataforma intuitiva e poderosa que transforma dados em resultados.',
    price: 1,
    interval: 'month',
    currency: 'BRL',
    features: [
      'Análise de Cohort',
      'Gestão de Risco',
      'Cobertura de Carteira',
      'Matriz RFV',
      'Importação de Dados',
      'Suporte Prioritário',
      'Atualizações Ilimitadas',
      'Exportação de Relatórios',
    ],
    mode: 'subscription' as const,
  },
};
