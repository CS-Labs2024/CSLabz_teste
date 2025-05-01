import React from 'react';
import { CustomerLifetimeStats } from '../types';
import { Clock, Users, TrendingUp } from 'lucide-react';

interface CustomerStatsProps {
  stats: CustomerLifetimeStats;
}

export default function CustomerStats({ stats }: CustomerStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <Clock className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Tempo Médio (Dias)</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.averageLifetimeDays}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-50 rounded-lg">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Tempo Médio (Meses)</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.averageLifetimeMonths}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-50 rounded-lg">
            <Users className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total de Clientes</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.totalCustomers}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}