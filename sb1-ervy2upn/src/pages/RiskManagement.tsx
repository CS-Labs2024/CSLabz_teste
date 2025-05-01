import React, { useState, useCallback, useMemo } from 'react';
import { FileUpload } from '../components/RiskAnalysis/FileUpload';
import { Dashboard } from '../components/RiskAnalysis/Dashboard';
import { DataTable } from '../components/RiskAnalysis/DataTable';
import { DataAnalysis } from '../components/RiskAnalysis/DataAnalysis';
import { SystemGuide } from '../components/RiskAnalysis/SystemGuide';
import { KPISelector } from '../components/RiskAnalysis/KPISelector';
import { calculateKPIs } from '../utils/dataProcessing';
import { RiskEntry, KPIData, KPIConfig } from '../utils/types';
import { BarChart2, Upload, HelpCircle, Plus, X, AlertCircle } from 'lucide-react';
import { useClientData } from '../contexts/ClientDataContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

const DEFAULT_KPI_CONFIG: KPIConfig[] = [
  {
    id: 'reversalRate',
    label: 'Taxa de Reversão',
    visible: true,
    category: 'performance',
    format: 'percentage',
  },
  {
    id: 'averageDaysInRisk',
    label: 'Média de Dias em Risco',
    visible: true,
    category: 'risk',
    format: 'days',
  },
  {
    id: 'totalClients',
    label: 'Total de Clientes',
    visible: true,
    category: 'performance',
    format: 'number',
  },
  {
    id: 'activeRisks',
    label: 'Riscos Ativos',
    visible: true,
    category: 'risk',
    format: 'number',
  },
  {
    id: 'canceledContracts',
    label: 'Contratos Cancelados',
    visible: true,
    category: 'risk',
    format: 'number',
  },
  {
    id: 'cancellationRate',
    label: 'Taxa de Cancelamento',
    visible: true,
    category: 'performance',
    format: 'percentage',
  },
];

type TabType = 'dashboard' | 'data' | 'analysis';

function RiskManagement() {
  const { clients } = useClientData();
  const navigate = useNavigate();
  const [kpiConfig, setKpiConfig] = useState<KPIConfig[]>(DEFAULT_KPI_CONFIG);
  const [showGuide, setShowGuide] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // Verificar se temos dados de risco
  const hasRiskData = useMemo(() => {
    return clients.some(client => 
      client.MesEntradaRisco || 
      client.DataEntradaRisco || 
      client.ClassificacaoRisco || 
      client.MotivoRisco || 
      client.StatusAtual
    );
  }, [clients]);

  // Convert clients to risk entries
  const data: RiskEntry[] = useMemo(() => {
    if (!hasRiskData) return [];
    
    return clients.map((client, index) => {
      // Calculate days in risk based on DataEntradaRisco or UltimoContato
      const riskEntryDate = client.DataEntradaRisco 
        ? new Date(client.DataEntradaRisco) 
        : client.UltimoContato 
          ? new Date(client.UltimoContato) 
          : new Date();
      
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - riskEntryDate.getTime());
      const diasEmRisco = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Extract month from DataEntradaRisco or UltimoContato
      const month = client.MesEntradaRisco || riskEntryDate.toLocaleString('pt-BR', { month: 'long' });
      
      return {
        mesEntrada: month,
        nomeCliente: client.Nome || `Cliente ${index + 1}`,
        squad: client.Squad || client.Produto || 'Não especificado',
        tier: client.Tier || 'Não especificado',
        classificacaoRisco: client.ClassificacaoRisco || 'Médio',
        dataEntrada: client.DataEntradaRisco || client.UltimoContato || new Date().toISOString(),
        dataSaida: client.DataSaidaRisco || '',
        dataCancelamento: client.DataCancelamento || '',
        motivoRisco: client.MotivoRisco || 'Tempo sem contato',
        statusAtual: client.StatusAtual || (diasEmRisco > 30 ? 'Em Risco' : 'Normal'),
        diasEmRisco: client.DiasEmRisco || diasEmRisco,
        comentarios: client.Comentarios || client.Atualizacoes || '',
        notas: client.atividades?.map((atividade, i) => ({
          id: `note-${index}-${i}`,
          texto: atividade.descricao,
          autor: atividade.responsavel,
          data: atividade.data,
          categoria: 'Atualização',
        })) || [],
      };
    });
  }, [clients, hasRiskData]);

  const kpiData = useMemo(() => {
    return calculateKPIs(data);
  }, [data]);

  const handleKPIConfigChange = useCallback((newConfig: KPIConfig[]) => {
    setKpiConfig(newConfig);
  }, []);

  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
  }, []);

  const toggleGuide = useCallback(() => {
    setShowGuide((prev) => !prev);
  }, []);

  const handleGoToClientTable = () => {
    navigate('/dashboard/clients');
  };

  const handleDataUpdate = useCallback((updatedData: RiskEntry[]) => {
    // This would normally update the data, but since we're using the centralized data source,
    // we don't need to implement this functionality here
    console.log('Data update requested:', updatedData);
  }, []);

  if (!hasRiskData) {
    return (
      <div className="min-h-screen bg-[#FDFFEE] flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-8">
          <div className="text-center mb-8">
            <AlertCircle className="w-12 h-12 text-[#00FFC6] mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-[#002b28] mb-2">
              Gestão de Risco
            </h1>
            <p className="text-gray-600 mb-8">
              Para analisar riscos, você precisa importar dados que incluam informações sobre status de risco, datas de entrada/saída de risco, motivos e classificações.
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFFEE]">
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <BarChart2 className="h-7 w-7 text-[#00FFC6]" />
              <h1 className="text-2xl font-bold text-[#002b28]">
                Gestão de Risco
              </h1>
            </div>
          </div>

          <div className="border-t border-gray-200 -mb-px">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => handleTabChange('dashboard')}
                className={`${
                  activeTab === 'dashboard'
                    ? 'border-[#00FFC6] text-[#002b28]'
                    : 'border-transparent text-gray-500 hover:text-[#002b28] hover:border-[#00FFC6]/50'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center space-x-2`}
              >
                <BarChart2 className="w-4 h-4 mr-2" />
                Dashboard
              </button>
              <button
                onClick={() => handleTabChange('data')}
                className={`${
                  activeTab === 'data'
                    ? 'border-[#00FFC6] text-[#002b28]'
                    : 'border-transparent text-gray-500 hover:text-[#002b28] hover:border-[#00FFC6]/50'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center space-x-2`}
              >
                <Upload className="w-4 h-4 mr-2" />
                Dados
              </button>
              <button
                onClick={() => handleTabChange('analysis')}
                className={`${
                  activeTab === 'analysis'
                    ? 'border-[#00FFC6] text-[#002b28]'
                    : 'border-transparent text-gray-500 hover:text-[#002b28] hover:border-[#00FFC6]/50'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center space-x-2`}
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Análise
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {activeTab === 'dashboard' && (
            <>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
                <KPISelector
                  kpiConfig={kpiConfig}
                  onConfigChange={handleKPIConfigChange}
                />
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <Dashboard kpiData={kpiData} kpiConfig={kpiConfig} />
              </div>
            </>
          )}

          {activeTab === 'data' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  Dados dos Clientes
                </h2>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <DataTable data={data} onUpdateData={handleDataUpdate} />
              </div>
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <DataAnalysis data={data} />
            </div>
          )}
        </div>
      </main>

      {/* Help Button - Fixed position at bottom right */}
      <button
        onClick={toggleGuide}
        className="fixed bottom-4 right-4 bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 transition-colors"
        aria-label="Ajuda"
      >
        <HelpCircle className="w-6 h-6" />
      </button>

      {/* Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center space-x-3">
                  <HelpCircle className="w-6 h-6 text-[#00FFC6]" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Guia do Sistema
                  </h2>
                </div>
                <button
                  onClick={toggleGuide}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <SystemGuide />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RiskManagement;