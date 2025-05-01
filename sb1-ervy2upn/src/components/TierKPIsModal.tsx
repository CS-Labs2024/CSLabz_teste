import React from 'react';
import { X, Users, Clock, TrendingDown, Percent } from 'lucide-react';
import { TierKPIs } from '../types/tier';

interface TierKPIsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tiers: TierKPIs[];
  totalCustomers: number;
}

export default function TierKPIsModal({
  isOpen,
  onClose,
  tiers,
  totalCustomers,
}: TierKPIsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Tier Analysis</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="overflow-auto max-h-[calc(90vh-120px)]">
            <div className="grid gap-6">
              {tiers.map((tier) => (
                <div
                  key={tier.name}
                  className="bg-white rounded-lg border border-gray-200 p-6"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {tier.name}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {Math.round((tier.totalCustomers / totalCustomers) * 100)}
                      % of total
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <Users className="w-5 h-5 text-blue-600 mr-2" />
                        <div>
                          <p className="text-sm text-gray-600">Customers</p>
                          <p className="text-xl font-semibold text-blue-700">
                            {tier.totalCustomers}
                          </p>
                          <p className="text-sm text-gray-500">
                            {tier.activeCustomers} active
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <Clock className="w-5 h-5 text-green-600 mr-2" />
                        <div>
                          <p className="text-sm text-gray-600">Avg. Lifetime</p>
                          <p className="text-xl font-semibold text-green-700">
                            {tier.averageLifetimeMonths} months
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <TrendingDown className="w-5 h-5 text-red-600 mr-2" />
                        <div>
                          <p className="text-sm text-gray-600">Early Churn</p>
                          <p className="text-xl font-semibold text-red-700">
                            {tier.earlyChurnRate}%
                          </p>
                          <p className="text-sm text-gray-500">
                            in first 3 months
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Percent className="w-5 h-5 text-purple-600 mr-2" />
                        <span className="text-sm text-gray-600">
                          Retention Rate
                        </span>
                      </div>
                      <span className="text-lg font-semibold text-purple-700">
                        {tier.retentionRate}%
                      </span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-purple-600 h-2.5 rounded-full"
                        style={{ width: `${tier.retentionRate}%` }}
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
