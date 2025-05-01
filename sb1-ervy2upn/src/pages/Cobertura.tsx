import React, { useState } from 'react';
import {
  BarChart3,
  Users,
  Calendar,
  AlertTriangle,
  PhoneCall,
  HelpCircle,
  X,
  Upload,
} from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { useToast } from '../hooks/use-toast';
import CustomerTable from '../components/CustomerTable';
import Analytics from '../components/Analytics';
import { Customer, RiskConfig } from '../types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '/src/components/ui/dialog';
import { Label } from '../components/ui/label';
import { useClientData } from '../contexts/ClientDataContext';
import { useNavigate } from 'react-router-dom';

function Cobertura() {
  const { clients, setClients } = useClientData();
  const [riskConfig, setRiskConfig] = useState<RiskConfig>({
    diasSemContato: 30,
    tierRisks: {},
  });
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Verificar se temos dados de cobertura
  const hasCoverageData = clients.some(client => 
    client.UltimoContato || 
    client.CategoriaContato || 
    client.ProximoContato || 
    client.DiasSemTouch
  );

  const uniqueTiers = [...new Set(clients.map((c) => c.Tier))].filter(
    Boolean
  );

  const processedCustomers = clients.map((customer) => {
    // Se não tiver UltimoContato, não podemos calcular o risco
    if (!customer.UltimoContato) {
      return {
        ...customer,
        emRisco: false,
        atividades: customer.atividades || [],
      };
    }
    
    const lastContact = new Date(customer.UltimoContato);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastContact.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const tierRiskDays = customer.Tier
      ? riskConfig.tierRisks[customer.Tier]
      : null;
    const riskThreshold = tierRiskDays ?? riskConfig.diasSemContato;

    return {
      ...customer,
      emRisco: diffDays > riskThreshold,
      atividades: customer.atividades || [],
    };
  });

  const handleUpdateCustomer = (updatedCustomer: Customer) => {
    setClients((prev) =>
      prev.map((customer) =>
        customer.Nome === updatedCustomer.Nome ? updatedCustomer : customer
      )
    );
    toast({
      title: 'Sucesso',
      description: 'Atividade registrada com sucesso',
    });
  };

  const updateRiskConfig = (tier: string, days: number) => {
    setRiskConfig((prev) => {
      const newConfig = {
        ...prev,
        tierRisks: {
          ...prev.tierRisks,
          [tier]: days,
        },
      };

      return newConfig;
    });
  };

  const handleGoToClientTable = () => {
    navigate('/dashboard/clients');
  };

  return (
    <div className="min-h-screen bg-[#FDFFEE]">
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Users className="h-7 w-7 text-[#00FFC6]" />
              <h1 className="text-2xl font-bold text-[#002b28]">
                Cobertura de Portfólio
              </h1>
            </div>
            {hasCoverageData && (
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
                  <AlertTriangle className="h-5 w-5 text-[#002b28]" />
                  <span className="text-sm font-medium whitespace-nowrap text-[#002b28]">
                    Risco padrão após
                  </span>
                  <Input
                    type="number"
                    value={riskConfig.diasSemContato}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 30;
                      setRiskConfig((prev) => ({
                        ...prev,
                        diasSemContato: value,
                      }));
                    }}
                    className="w-20 h-8 text-center bg-white text-[#002b28] border-gray-200"
                  />
                  <span className="text-sm font-medium whitespace-nowrap text-[#002b28]">
                    dias sem contato
                  </span>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9 bg-white text-[#002b28] border-[#00FFC6] hover:bg-[#00FFC6]/10">
                      Configurar Risco por Tier
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Configuração de Risco por Tier</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      {uniqueTiers.map((tier) => (
                        <div
                          key={tier}
                          className="grid grid-cols-4 items-center gap-4"
                        >
                          <Label className="text-right col-span-2">{tier}</Label>
                          <Input
                            type="number"
                            value={riskConfig.tierRisks[tier] || ''}
                            onChange={(e) =>
                              updateRiskConfig(
                                tier,
                                parseInt(e.target.value) ||
                                  riskConfig.diasSemContato
                              )
                            }
                            className="col-span-2"
                            placeholder={`${riskConfig.diasSemContato} (padrão)`}
                          />
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={showAnalytics} onOpenChange={setShowAnalytics}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 h-9 bg-[#00FFC6] text-[#002b28] border-transparent hover:bg-[#00FFC6]/90">
                      <PhoneCall className="h-4 w-4" />
                      Análise de Contatos
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Análise de Contatos</DialogTitle>
                    </DialogHeader>
                    <Analytics customers={processedCustomers} />
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 -mb-px">
            <Tabs defaultValue="table" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0">
                <TabsTrigger
                  value="table"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#00FFC6] px-6 py-3"
                >
                  Lista de Clientes
                </TabsTrigger>
                <TabsTrigger
                  value="analytics"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#00FFC6] px-6 py-3"
                >
                  Análises
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {hasCoverageData ? (
          <div className="grid gap-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="bg-white shadow-sm border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="h-5 w-5 text-[#00FFC6]" />
                  <h3 className="font-semibold text-[#002b28]">Total de Clientes</h3>
                </div>
                <p className="text-2xl font-bold text-[#002b28]">{clients.length}</p>
                <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  {processedCustomers.filter((c) => c.emRisco).length} em risco
                </p>
              </Card>

              <Card className="bg-white shadow-sm border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <BarChart3 className="h-5 w-5 text-[#00FFC6]" />
                  <h3 className="font-semibold text-[#002b28]">MRR Total</h3>
                </div>
                <p className="text-2xl font-bold text-[#002b28]">
                  R${' '}
                  {clients
                    .reduce((sum, c) => sum + (parseFloat(c.MRR) || 0), 0)
                    .toLocaleString('pt-BR')}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Receita mensal recorrente
                </p>
              </Card>

              <Card className="bg-white shadow-sm border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="h-5 w-5 text-[#00FFC6]" />
                  <h3 className="font-semibold text-[#002b28]">Taxa de Cobertura</h3>
                </div>
                <p className="text-2xl font-bold text-[#002b28]">
                  {Math.round(
                    (clients.filter((c) => {
                      if (!c.UltimoContato) return false;
                      const lastContact = new Date(c.UltimoContato);
                      const now = new Date();
                      const diffTime = Math.abs(
                        now.getTime() - lastContact.getTime()
                      );
                      const diffDays = Math.ceil(
                        diffTime / (1000 * 60 * 60 * 24)
                      );
                      return diffDays <= 30;
                    }).length /
                      Math.max(clients.length, 1)) *
                      100
                  )}
                  %
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  últimos 30 dias
                </p>
              </Card>
            </div>

            <Card className="bg-white shadow-sm border-gray-200 overflow-hidden">
              <Tabs defaultValue="table" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0">
                  <TabsTrigger
                    value="table"
                    className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#00FFC6] px-6 py-3"
                  >
                    Lista de Clientes
                  </TabsTrigger>
                  <TabsTrigger
                    value="analytics"
                    className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#00FFC6] px-6 py-3"
                  >
                    Análises
                  </TabsTrigger>
                </TabsList>
                <div className="p-6">
                  <TabsContent value="table" className="mt-0">
                    <CustomerTable
                      customers={processedCustomers}
                      onUpdateCustomer={handleUpdateCustomer}
                    />
                  </TabsContent>
                  <TabsContent value="analytics" className="mt-0">
                    <Analytics customers={processedCustomers} />
                  </TabsContent>
                </div>
              </Tabs>
            </Card>
          </div>
        ) : (
          <Card className="p-8 bg-white shadow-sm border-gray-200 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-[#00FFC6]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-8 h-8 text-[#00FFC6]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Dados insuficientes para análise de cobertura
              </h3>
              <p className="text-gray-500 mb-6">
                Para analisar a cobertura de portfólio, você precisa importar dados que incluam informações de contato como data do último contato, categoria de contato e próximo contato agendado.
              </p>
              <Button
                onClick={handleGoToClientTable}
                className="bg-[#00FFC6] text-[#002b28] hover:bg-[#00FFC6]/90 inline-flex items-center"
              >
                <Upload className="w-5 h-5 mr-2" />
                Ir para Importação de Dados
              </Button>
            </div>
          </Card>
        )}
      </main>

      {/* Help Button - Fixed position at bottom right */}
      <button
        onClick={() => setShowGuide(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 transition-colors"
        aria-label="Ajuda"
      >
        <HelpCircle className="w-6 h-6" />
      </button>

      {/* Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Instruções de Uso</h2>
                <button
                  onClick={() => setShowGuide(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4 text-gray-900 overflow-y-auto max-h-[70vh]">
                <section>
                  <h3 className="font-medium text-lg mb-2 text-gray-900">Configuração de Risco</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-900">
                    <li>Defina o número de dias sem contato que considera um cliente em risco</li>
                    <li>Configure limites específicos por Tier para personalizar o monitoramento</li>
                    <li>Clientes em risco são destacados automaticamente na tabela</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-medium text-lg mb-2 text-gray-900">Registro de Atividades</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-900">
                    <li>Clique no ícone "+" na tabela para registrar uma nova atividade</li>
                    <li>Registre diferentes tipos de contato: Reunião, Ligação, Email, etc.</li>
                    <li>Visualize o histórico de atividades clicando no ícone de histórico</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-medium text-lg mb-2 text-gray-900">Análise de Contatos</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-900">
                    <li>Acesse a análise detalhada clicando no botão "Análise de Contatos"</li>
                    <li>Visualize a distribuição de contatos por período e tipo</li>
                    <li>Analise a cobertura por Tier para identificar gaps de atendimento</li>
                    <li>Monitore tendências de contato para otimizar sua estratégia</li>
                  </ul>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cobertura;