import React from 'react';
import { X, Users, TrendingDown, Percent } from 'lucide-react';
import { ChurnStats } from '../types/churn';

interface SegmentKPIsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: ChurnStats;
}

export default function SegmentKPIsModal({ isOpen, onClose, stats }: SegmentKPIsModalProps) {
  if (!isOpen) return null;

  const totalCustomers = Object.values(stats.segmentChurn).reduce(
    (sum, segment) => sum + segment.total,
    0
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Análise por Segmento</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="overflow-auto max-h-[calc(90vh-120px)]">
            <div className="grid gap-6">
              {Object.entries(stats.segmentChurn).map(([segment, data]) => (
                <div
                  key={segment}
                  className="bg-white rounded-lg border border-gray-200 p-6"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {segment}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {Math.round((data.total / totalCustomers) * 100)}% do total
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <Users className="w-5 h-5 text-blue-600 mr-2" />
                        <div>
                          <p className="text-sm text-gray-600">Clientes</p>
                          <p className="text-xl font-semibold text-blue-700">
                            {data.total}
                          </p>
                          <p className="text-sm text-gray-500">
                            {data.total - data.churned} ativos
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <TrendingDown className="w-5 h-5 text-red-600 mr-2" />
                        <div>
                          <p className="text-sm text-gray-600">Churned</p>
                          <p className="text-xl font-semibold text-red-700">
                            {data.churned}
                          </p>
                          <p className="text-sm text-gray-500">
                            clientes
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <Percent className="w-5 h-5 text-purple-600 mr-2" />
                        <div>
                          <p className="text-sm text-gray-600">Taxa de Churn</p>
                          <p className="text-xl font-semibold text-purple-700">
                            {data.percentage}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Taxa de Retenção</span>
                      <span className="text-lg font-semibold text-green-700">
                        {100 - data.percentage}%
                      </span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-green-600 h-2.5 rounded-full"
                        style={{ width: `${100 - data.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}