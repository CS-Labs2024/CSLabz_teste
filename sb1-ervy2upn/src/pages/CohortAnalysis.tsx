import React, { useState, useMemo, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  BarChart2,
  Upload,
  Users,
  Calendar,
  TrendingUp,
  Filter,
  Plus,
  ChevronDown,
  Search,
  FileText,
  Settings,
  Save,
  AlertCircle,
} from 'lucide-react';
import { Customer, FilterState } from '../types';
import { useConfig } from '../contexts/ConfigContext';
import { useClientData } from '../contexts/ClientDataContext';
import CustomerForm from '../components/CustomerForm';
import CustomerTable from '../components/CustomerTable';
import CohortMatrix from '../components/CohortMatrix';
import CustomerStats from '../components/CustomerStats';
import ChurnAnalysis from '../components/ChurnAnalysis';
import TierKPIsModal from '../components/TierKPIsModal';
import SegmentKPIsModal from '../components/SegmentKPIsModal';
import Filters from '../components/Filters';
import LTVGraph from '../components/LTVGraph';
import HelpButton from '../components/HelpButton';
import MyCohorts from '../components/MyCohorts/MyCohorts';
import { calculateCohortMatrix } from '../utils/cohortAnalysis';
import { calculateCustomerLifetimeStats } from '../utils/customerStats';
import { calculateChurnStats } from '../utils/churnAnalysis';
import { analyzeTierMetrics } from '../utils/tierAnalysis';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

export default function CohortAnalysis() {
  const { earlyChurnMonths } = useConfig();
  const { clients } = useClientData();
  const navigate = useNavigate();
  const [isTierKPIsOpen, setIsTierKPIsOpen] = useState(false);
  const [isSegmentKPIsOpen, setIsSegmentKPIsOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    dateRange: {
      start: '',
      end: '',
    },
    segment: '',
    tier: '',
  });

  // Convert clients to the Customer format needed for analysis
  const customers = useMemo(() => {
    return clients.map((client) => {
      // Use existing cohort fields if available, otherwise extract from other fields
      const entryDate = client.entryDate
        ? new Date(client.entryDate)
        : client.UltimoContato
        ? new Date(client.UltimoContato)
        : new Date();

      const exitDate = client.exitDate
        ? new Date(client.exitDate)
        : client.DataCancelamento
        ? new Date(client.DataCancelamento)
        : null;

      return {
        id: client.id || client.Nome || uuidv4(),
        name: client.name || client.Nome || '',
        entryDate,
        exitDate,
        segment: client.segment || client.Produto || '',
        tier: client.tier || client.Tier || '',
      };
    });
  }, [clients]);

  const segments = useMemo(() => {
    const uniqueSegments = new Set(
      customers
        .map((customer) => customer.segment)
        .filter((segment): segment is string => !!segment)
    );
    return Array.from(uniqueSegments).sort();
  }, [customers]);

  const tiers = useMemo(() => {
    const uniqueTiers = new Set(
      customers
        .map((customer) => customer.tier)
        .filter((tier): tier is string => !!tier)
    );
    return Array.from(uniqueTiers).sort();
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const customerDate = new Date(customer.entryDate);
      const startDate = filters.dateRange.start
        ? new Date(filters.dateRange.start)
        : null;
      const endDate = filters.dateRange.end
        ? new Date(filters.dateRange.end)
        : null;

      if (startDate && customerDate < startDate) return false;
      if (endDate && customerDate > endDate) return false;
      if (filters.segment && customer.segment !== filters.segment) return false;
      if (filters.tier && customer.tier !== filters.tier) return false;

      return true;
    });
  }, [customers, filters]);

  const cohortData = useMemo(
    () => calculateCohortMatrix(filteredCustomers),
    [filteredCustomers]
  );

  const lifetimeStats = useMemo(
    () => calculateCustomerLifetimeStats(filteredCustomers),
    [filteredCustomers]
  );

  const churnStats = useMemo(
    () => calculateChurnStats(filteredCustomers, earlyChurnMonths),
    [filteredCustomers, earlyChurnMonths]
  );

  const tierAnalysis = useMemo(
    () => analyzeTierMetrics(filteredCustomers),
    [filteredCustomers]
  );

  const handleGoToClientTable = () => {
    navigate('/dashboard/clients');
  };

  const hasCohortData =
    customers.length > 0 && customers.some((c) => c.entryDate);

  return (
    <div className="min-h-screen bg-[#FDFFEE]">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col space-y-4">
            {/* Top Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-[#00FFC6]/10 p-2 rounded-lg">
                  <BarChart2 className="h-7 w-7 text-[#00FFC6]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[#002b28]">
                    Análise de Cohort
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Analise o comportamento e retenção dos seus clientes
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {hasCohortData && (
                  <button
                    onClick={() => setIsTierKPIsOpen(true)}
                    className="flex items-center px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Análise por Tier
                  </button>
                )}
              </div>
            </div>

            {/* Stats Bar */}
            {hasCohortData && (
              <div className="grid grid-cols-4 gap-4 py-4 border-t border-gray-100">
                <div className="flex items-center gap-3 px-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total de Clientes</p>
                    <p className="text-lg font-semibold">
                      {lifetimeStats.totalCustomers}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-4">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tempo Médio</p>
                    <p className="text-lg font-semibold">
                      {lifetimeStats.averageLifetimeMonths} meses
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-4">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Taxa de Retenção</p>
                    <p className="text-lg font-semibold">
                      {Math.round(
                        (1 - churnStats.earlyChurn.percentage / 100) * 100
                      )}
                      %
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-4">
                  <div className="p-2 bg-red-50 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Early Churn</p>
                    <p className="text-lg font-semibold">
                      {churnStats.earlyChurn.percentage}%
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Filter className="w-5 h-5 text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
              </div>

              <Filters
                filters={filters}
                onFilterChange={setFilters}
                segments={segments}
                tiers={tiers}
              />
            </div>
          </div>

          {hasCohortData ? (
            <div className="space-y-8">
              {/* Cohort Matrix */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <BarChart2 className="w-5 h-5 text-[#00FFC6] mr-2" />
                    Matriz de Cohort
                  </h2>
                  <CohortMatrix data={cohortData} />
                </div>
              </div>

              {/* Churn Analysis */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <TrendingUp className="w-5 h-5 text-[#00FFC6] mr-2" />
                    Análise de Churn
                  </h2>
                  <ChurnAnalysis
                    stats={churnStats}
                    onOpenSegmentAnalysis={() => setIsSegmentKPIsOpen(true)}
                  />
                </div>
              </div>

              {/* LTV Graph */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Calendar className="w-5 h-5 text-[#00FFC6] mr-2" />
                    Análise de LTV
                  </h2>
                  <LTVGraph customers={filteredCustomers} />
                </div>
              </div>

              {/* Saved Analyses */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Save className="w-5 h-5 text-[#00FFC6] mr-2" />
                    Análises Salvas
                  </h2>
                  <MyCohorts
                    currentFilters={filters}
                    customers={filteredCustomers}
                  />
                </div>
              </div>
            </div>
          ) : (
            <Card className="p-8 bg-white shadow-sm border-gray-200 text-center">
              <div className="max-w-md mx-auto">
                <div className="bg-[#00FFC6]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-8 h-8 text-[#00FFC6]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Dados insuficientes para análise de cohort
                </h3>
                <p className="text-gray-500 mb-6">
                  Para realizar análises de cohort, você precisa importar dados
                  que incluam datas de entrada (Entry Date) e, opcionalmente,
                  datas de saída (Exit Date).
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
        </div>
      </main>

      {/* Modals */}
      {hasCohortData && (
        <>
          <TierKPIsModal
            isOpen={isTierKPIsOpen}
            onClose={() => setIsTierKPIsOpen(false)}
            tiers={tierAnalysis.tiers}
            totalCustomers={tierAnalysis.totalCustomers}
          />

          <SegmentKPIsModal
            isOpen={isSegmentKPIsOpen}
            onClose={() => setIsSegmentKPIsOpen(false)}
            stats={churnStats}
          />
        </>
      )}

      <HelpButton />
    </div>
  );
}
