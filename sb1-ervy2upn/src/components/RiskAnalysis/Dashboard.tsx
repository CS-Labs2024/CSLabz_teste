import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { KPIData, KPIConfig } from '../../utils/types';
import { Users, Clock, BarChart2, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface DashboardProps {
  kpiData: KPIData;
  kpiConfig: KPIConfig[];
}

export const Dashboard: React.FC<DashboardProps> = ({ kpiData, kpiConfig }) => {
  const squadData = Object.entries(kpiData.risksBySquad).map(([name, value]) => ({
    name,
    value
  }));

  const tierData = Object.entries(kpiData.risksByTier).map(([name, value]) => ({
    name,
    value
  }));

  const statusData = Object.entries(kpiData.statusDistribution).map(([name, value]) => ({
    name,
    value
  }));

  const monthlyData = Object.entries(kpiData.risksByMonth)
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .map(([name, value]) => ({
      name,
      value
    }));

  // Filter visible KPIs
  const visibleKpis = kpiConfig.filter(kpi => kpi.visible);

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {visibleKpis.map(kpi => {
          let value = null;
          let icon = null;

          switch (kpi.id) {
            case 'reversalRate':
              value = `${kpiData.reversalRate.toFixed(1)}%`;
              icon = <CheckCircle className="w-8 h-8 text-green-500" />;
              break;
            case 'averageDaysInRisk':
              value = kpiData.averageDaysInRisk.toFixed(1);
              icon = <Clock className="w-8 h-8 text-blue-500" />;
              break;
            case 'totalClients':
              value = kpiData.totalClients;
              icon = <Users className="w-8 h-8 text-purple-500" />;
              break;
            case 'activeRisks':
              value = kpiData.activeRisks;
              icon = <AlertTriangle className="w-8 h-8 text-yellow-500" />;
              break;
            case 'canceledContracts':
              value = kpiData.canceledContracts;
              icon = <XCircle className="w-8 h-8 text-red-500" />;
              break;
            case 'cancellationRate':
              value = `${kpiData.cancellationRate.toFixed(1)}%`;
              icon = <BarChart2 className="w-8 h-8 text-orange-500" />;
              break;
            default:
              return null;
          }

          if (value === null) return null;

          return (
            <div key={kpi.id} className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">{kpi.label}</p>
                  <p className="text-2xl font-bold">{value}</p>
                </div>
                {icon}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Riscos por Squad</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={squadData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Distribuição por Status</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Evolução Mensal de Riscos</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Distribuição por Tier</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tierData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {tierData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};