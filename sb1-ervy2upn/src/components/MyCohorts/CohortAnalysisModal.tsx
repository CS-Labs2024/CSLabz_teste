import React from 'react';
import { X, Calendar, Users, TrendingDown, ArrowUpRight, ArrowDownRight, Filter } from 'lucide-react';
import { SavedCohort } from '../../types/savedCohort';

interface CohortAnalysisModalProps {
  cohort: SavedCohort;
  isOpen: boolean;
  onClose: () => void;
}

export default function CohortAnalysisModal({ cohort, isOpen, onClose }: CohortAnalysisModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {cohort.name}
              </h2>
              {cohort.description && (
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  {cohort.description}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {/* Date and Basic Info */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                <Calendar className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                Criado em: {new Date(cohort.dateCreated).toLocaleDateString()}
              </div>
              <div className="flex items-center px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                <Users className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                {cohort.stats.totalCustomers} clientes
              </div>
            </div>

            {/* Filters Applied */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2 text-gray-500" />
                Filtros Aplicados
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Período</p>
                  <p className="font-medium">
                    {cohort.filters.dateRange.start || 'Início'} até {cohort.filters.dateRange.end || 'Presente'}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Segmento</p>
                  <p className="font-medium">
                    {cohort.filters.segment ? (
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                        {cohort.filters.segment}
                      </span>
                    ) : (
                      'Todos os Segmentos'
                    )}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Tier</p>
                  <p className="font-medium">
                    {cohort.filters.tier ? (
                      <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-xs">
                        {cohort.filters.tier}
                      </span>
                    ) : (
                      'Todos os Tiers'
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    Tempo Médio
                  </h4>
                  <ArrowUpRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-2xl font-semibold text-blue-700 dark:text-blue-300">
                  {cohort.stats.averageLifetimeMonths} meses
                </p>
                <div className="mt-2 text-xs text-blue-500">
                  Média de permanência dos clientes
                </div>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-red-600 dark:text-red-400">
                    Taxa de Churn
                  </h4>
                  <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                </div>
                <p className="text-2xl font-semibold text-red-700 dark:text-red-300">
                  {cohort.stats.churnRate}%
                </p>
                <div className="mt-2 text-xs text-red-500">
                  Percentual de clientes perdidos
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-green-600 dark:text-green-400">
                    Taxa de Retenção
                  </h4>
                  <ArrowUpRight className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-2xl font-semibold text-green-700 dark:text-green-300">
                  {100 - cohort.stats.churnRate}%
                </p>
                <div className="mt-2 text-xs text-green-500">
                  Percentual de clientes ativos
                </div>
              </div>
            </div>

            {/* Retention Progress */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-4">
                Progresso de Retenção
              </h3>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-green-600 dark:bg-green-500 h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                  style={{ width: `${100 - cohort.stats.churnRate}%` }}
                >
                  <span className="text-xs font-medium text-white">
                    {100 - cohort.stats.churnRate}%
                  </span>
                </div>
              </div>
              <div className="mt-4 flex justify-between text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-600 mr-2"></div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Clientes Ativos: {Math.round(cohort.stats.totalCustomers * (100 - cohort.stats.churnRate) / 100)}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Churn: {cohort.stats.churnedCustomers} clientes
                  </span>
                </div>
                <span className="text-gray-600 dark:text-gray-400">
                  Total: {cohort.stats.totalCustomers}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}