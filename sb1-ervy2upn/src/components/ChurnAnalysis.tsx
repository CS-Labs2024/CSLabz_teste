import React from 'react';
import { AlertCircle, Users, TrendingDown, ArrowRight, PieChart } from 'lucide-react';
import { ChurnStats } from '../types/churn';
import { useConfig } from '../contexts/ConfigContext';
import EarlyChurnConfig from './EarlyChurnConfig';

interface ChurnAnalysisProps {
  stats: ChurnStats;
  onOpenSegmentAnalysis: () => void;
}

export default function ChurnAnalysis({ stats, onOpenSegmentAnalysis }: ChurnAnalysisProps) {
  const { earlyChurnMonths } = useConfig();

  return (
    <div className="space-y-8">
      {/* Early Churn Card */}
      <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="bg-red-100 p-2 rounded-full mr-3">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Early Churn Analysis (Primeiros {earlyChurnMonths} Meses)
            </h3>
          </div>
          <EarlyChurnConfig />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-500">Clientes em Early Churn</h4>
              <span className="text-xs text-gray-400">Total</span>
            </div>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold text-red-600">{stats.earlyChurn.count}</div>
              <div className="text-sm font-medium text-red-500 bg-red-50 px-2 py-1 rounded-full">
                {stats.earlyChurn.percentage}% do total
              </div>
            </div>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full" 
                style={{ width: `${stats.earlyChurn.percentage}%` }}
              ></div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-500">Impacto por Segmento</h4>
              <button
                onClick={onOpenSegmentAnalysis}
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
              >
                Ver detalhes
                <ArrowRight className="w-3 h-3 ml-1" />
              </button>
            </div>
            
            <div className="space-y-4">
              {Object.entries(stats.segmentChurn)
                .slice(0, 3)
                .map(([segment, data]) => (
                  <div key={segment} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-sm font-medium text-gray-700">{segment}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">{data.total} clientes</span>
                      <span className="text-sm font-medium text-red-500">{data.percentage}% churn</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Segment Summary Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <PieChart className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Visão Geral por Segmento
            </h3>
          </div>
          <button
            onClick={onOpenSegmentAnalysis}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            Ver Análise Detalhada
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(stats.segmentChurn)
            .slice(0, 3)
            .map(([segment, data]) => (
              <div key={segment} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">{segment}</h4>
                  <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                    {Math.round((data.total / Object.values(stats.segmentChurn).reduce((sum, s) => sum + s.total, 0)) * 100)}% do total
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-blue-500 mr-2" />
                      <div className="text-blue-600 font-semibold">{data.total}</div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Total de Clientes</div>
                  </div>
                  
                  <div>
                    <div className="flex items-center">
                      <TrendingDown className="w-4 h-4 text-red-500 mr-2" />
                      <div className="text-red-600 font-semibold">{data.percentage}%</div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Taxa de Churn</div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Retenção</span>
                    <span>{100 - data.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-green-500 h-1.5 rounded-full" 
                      style={{ width: `${100 - data.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}