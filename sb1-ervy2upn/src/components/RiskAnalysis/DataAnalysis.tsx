import React, { useState, useMemo } from 'react';
import { RiskEntry } from '../../utils/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ComposedChart,
  Scatter,
} from 'recharts';
import {
  TrendingUp,
  Filter,
  Download,
  RefreshCcw,
  Clock,
  AlertTriangle,
  BarChart2,
  PieChartIcon,
  Activity,
} from 'lucide-react';

interface DataAnalysisProps {
  data: RiskEntry[];
}

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884d8',
  '#82ca9d',
  '#ffc658',
];

const monthOrder = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const sortByMonth = (a: { name: string }, b: { name: string }) => {
  const [monthA, yearA] = a.name.split(' ');
  const [monthB, yearB] = b.name.split(' ');

  if (yearA !== yearB) {
    return parseInt(yearA) - parseInt(yearB);
  }

  return monthOrder.indexOf(monthA) - monthOrder.indexOf(monthB);
};

export const DataAnalysis: React.FC<DataAnalysisProps> = ({ data }) => {
  const [timeRange, setTimeRange] = useState<'1m' | '3m' | '6m' | '1y' | 'all'>(
    'all'
  );
  const [selectedView, setSelectedView] = useState<
    'overview' | 'squad' | 'performance' | 'risks'
  >('overview');

  const filteredData = useMemo(() => {
    if (timeRange === 'all') return data;

    const now = new Date();
    const monthsAgo = new Date();
    const months =
      timeRange === '1m'
        ? 1
        : timeRange === '3m'
        ? 3
        : timeRange === '6m'
        ? 6
        : 12;
    monthsAgo.setMonth(now.getMonth() - months);

    return data.filter((entry) => new Date(entry.dataEntrada) >= monthsAgo);
  }, [data, timeRange]);

  const metrics = useMemo(() => {
    const squads = new Set(filteredData.map((entry) => entry.squad));
    const squadMetrics: { [key: string]: any } = {};

    // Análise de motivos de risco
    const riskReasons = filteredData.reduce(
      (acc: { [key: string]: number }, curr) => {
        if (curr.motivoRisco) {
          acc[curr.motivoRisco] = (acc[curr.motivoRisco] || 0) + 1;
        }
        return acc;
      },
      {}
    );

    // Ordenar motivos por frequência
    const sortedRiskReasons = Object.entries(riskReasons)
      .sort(([, a], [, b]) => b - a)
      .reduce((acc: { [key: string]: number }, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

    // Calcular percentuais
    const totalRisks = Object.values(riskReasons).reduce((a, b) => a + b, 0);
    const riskReasonsPercentage = Object.entries(sortedRiskReasons).map(
      ([reason, count]) => ({
        reason,
        count,
        percentage: ((count as number) / totalRisks) * 100,
      })
    );

    // Análise de motivos por squad
    const riskReasonsBySquad = Array.from(squads).reduce(
      (acc: { [key: string]: { [key: string]: number } }, squad) => {
        const squadData = filteredData.filter((entry) => entry.squad === squad);
        acc[squad] = squadData.reduce(
          (squadAcc: { [key: string]: number }, curr) => {
            if (curr.motivoRisco) {
              squadAcc[curr.motivoRisco] =
                (squadAcc[curr.motivoRisco] || 0) + 1;
            }
            return squadAcc;
          },
          {}
        );
        return acc;
      },
      {}
    );

    squads.forEach((squad) => {
      const squadData = filteredData.filter((entry) => entry.squad === squad);
      const totalCases = squadData.length;
      const resolvedCases = squadData.filter((entry) => entry.dataSaida).length;
      const canceledCases = squadData.filter(
        (entry) => entry.dataCancelamento
      ).length;
      const activeCases = totalCases - resolvedCases - canceledCases;

      const avgDaysToResolve =
        squadData
          .filter((entry) => entry.dataSaida)
          .reduce((acc, curr) => {
            const days = Math.ceil(
              (new Date(curr.dataSaida).getTime() -
                new Date(curr.dataEntrada).getTime()) /
                (1000 * 60 * 60 * 24)
            );
            return acc + days;
          }, 0) / (resolvedCases || 1);

      squadMetrics[squad] = {
        totalCases,
        resolvedCases,
        canceledCases,
        activeCases,
        resolutionRate: (resolvedCases / totalCases) * 100,
        cancellationRate: (canceledCases / totalCases) * 100,
        avgDaysToResolve,
      };
    });

    const riskTypesBySquad = Array.from(squads).map((squad) => {
      const squadData = filteredData.filter((entry) => entry.squad === squad);
      const riskTypes = squadData.reduce(
        (acc: { [key: string]: number }, curr) => {
          acc[curr.classificacaoRisco] =
            (acc[curr.classificacaoRisco] || 0) + 1;
          return acc;
        },
        {}
      );

      return {
        squad,
        ...riskTypes,
      };
    });

    const monthlyPerformance = Array.from(squads).map((squad) => {
      const squadData = filteredData.filter((entry) => entry.squad === squad);
      const monthly: {
        [key: string]: {
          risks: number;
          resolutions: number;
          cancellations: number;
        };
      } = {};

      squadData.forEach((entry) => {
        const month = new Date(entry.dataEntrada).toLocaleString('pt-BR', {
          month: 'long',
          year: 'numeric',
        });
        if (!monthly[month]) {
          monthly[month] = { risks: 0, resolutions: 0, cancellations: 0 };
        }
        monthly[month].risks++;

        if (entry.dataSaida) {
          const resolutionMonth = new Date(entry.dataSaida).toLocaleString(
            'pt-BR',
            { month: 'long', year: 'numeric' }
          );
          if (!monthly[resolutionMonth]) {
            monthly[resolutionMonth] = {
              risks: 0,
              resolutions: 0,
              cancellations: 0,
            };
          }
          monthly[resolutionMonth].resolutions++;
        }

        if (entry.dataCancelamento) {
          const cancellationMonth = new Date(
            entry.dataCancelamento
          ).toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
          if (!monthly[cancellationMonth]) {
            monthly[cancellationMonth] = {
              risks: 0,
              resolutions: 0,
              cancellations: 0,
            };
          }
          monthly[cancellationMonth].cancellations++;
        }
      });

      return {
        squad,
        performance: Object.entries(monthly)
          .map(([month, data]) => ({
            month,
            ...data,
          }))
          .sort((a, b) => sortByMonth({ name: a.month }, { name: b.month })),
      };
    });

    const correlationData = Array.from(squads).map((squad) => {
      const squadData = filteredData.filter((entry) => entry.squad === squad);
      return {
        squad,
        casesCount: squadData.length,
        avgResolutionTime: squadMetrics[squad].avgDaysToResolve,
        resolutionRate: squadMetrics[squad].resolutionRate,
      };
    });

    return {
      squadMetrics,
      riskTypesBySquad,
      monthlyPerformance,
      correlationData,
      riskReasons: riskReasonsPercentage,
      riskReasonsBySquad,
    };
  }, [filteredData]);

  const handleExport = () => {
    const exportData = {
      overview: {
        squadPerformance: Object.entries(metrics.squadMetrics).map(
          ([squad, data]) => ({
            Squad: squad,
            'Total de Casos': data.totalCases,
            'Casos Resolvidos': data.resolvedCases,
            'Casos Cancelados': data.canceledCases,
            'Casos Ativos': data.activeCases,
            'Taxa de Resolução (%)': data.resolutionRate.toFixed(1),
            'Taxa de Cancelamento (%)': data.cancellationRate.toFixed(1),
            'Média de Dias para Resolução': data.avgDaysToResolve.toFixed(1),
          })
        ),
        riskTypes: metrics.riskTypesBySquad,
        riskReasons: metrics.riskReasons.map((reason) => ({
          Motivo: reason.reason,
          Quantidade: reason.count,
          'Porcentagem (%)': reason.percentage.toFixed(1),
        })),
      },
      monthlyPerformance: metrics.monthlyPerformance.flatMap((squad) =>
        squad.performance.map((perf) => ({
          Squad: squad.squad,
          Mês: perf.month,
          'Novos Riscos': perf.risks,
          Resoluções: perf.resolutions,
          Cancelamentos: perf.cancellations,
        }))
      ),
    };

    const convertToCSV = (data: any[]) => {
      const headers = Object.keys(data[0]);
      const rows = data.map((row) =>
        headers.map((header) => JSON.stringify(row[header])).join(',')
      );
      return [headers.join(','), ...rows].join('\n');
    };

    const downloadCSV = (csv: string, filename: string) => {
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      if (navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, filename);
      } else {
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    };

    const timestamp = new Date().toISOString().split('T')[0];
    downloadCSV(
      convertToCSV(exportData.overview.squadPerformance),
      `performance-squads-${timestamp}.csv`
    );
    downloadCSV(
      convertToCSV(exportData.monthlyPerformance),
      `performance-mensal-${timestamp}.csv`
    );
    downloadCSV(
      convertToCSV(exportData.overview.riskReasons),
      `motivos-risco-${timestamp}.csv`
    );
  };

  const renderRiskReasonsSection = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Distribuição de Motivos de Risco */}
      <div className="card col-span-2">
        <div className="card-header">
          <h3 className="text-lg font-medium">
            Distribuição de Motivos de Risco
          </h3>
        </div>
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Motivo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantidade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Porcentagem
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {metrics.riskReasons.map((reason, index) => (
                  <tr
                    key={reason.reason}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reason.reason || 'Não especificado'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {reason.count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {reason.percentage.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Gráfico de Motivos de Risco */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium">
            Visualização de Motivos de Risco
          </h3>
        </div>
        <div className="card-body">
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.riskReasons}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="reason"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  interval={0}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Quantidade" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Motivos por Squad */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium">Motivos de Risco por Squad</h3>
        </div>
        <div className="card-body">
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={Object.entries(metrics.riskReasonsBySquad).map(
                  ([squad, reasons]) => ({
                    squad,
                    ...reasons,
                  })
                )}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="squad" />
                <YAxis />
                <Tooltip />
                <Legend />
                {Object.keys(
                  metrics.riskReasonsBySquad[
                    Object.keys(metrics.riskReasonsBySquad)[0]
                  ] || {}
                ).map((reason, index) => (
                  <Bar
                    key={reason}
                    dataKey={reason}
                    fill={COLORS[index % COLORS.length]}
                    stackId="1"
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOverviewSection = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Squad Performance Comparison */}
      <div className="card col-span-2">
        <div className="card-header">
          <h3 className="text-lg font-medium">
            Comparativo de Performance por Squad
          </h3>
        </div>
        <div className="card-body">
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={Object.entries(metrics.squadMetrics).map(
                  ([squad, data]) => ({
                    squad,
                    'Taxa de Resolução': data.resolutionRate.toFixed(1),
                    'Taxa de Cancelamento': data.cancellationRate.toFixed(1),
                    'Média de Dias para Resolução':
                      data.avgDaysToResolve.toFixed(1),
                  })
                )}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="squad" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Taxa de Resolução" fill="#0088FE" />
                <Bar dataKey="Taxa de Cancelamento" fill="#FF8042" />
                <Bar dataKey="Média de Dias para Resolução" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Risk Types Distribution by Squad */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium">
            Distribuição de Tipos de Risco por Squad
          </h3>
        </div>
        <div className="card-body">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.riskTypesBySquad} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="squad" type="category" />
                <Tooltip />
                <Legend />
                {Object.keys(metrics.riskTypesBySquad[0] || {})
                  .filter((key) => key !== 'squad')
                  .map((riskType, index) => (
                    <Bar
                      key={riskType}
                      dataKey={riskType}
                      fill={COLORS[index % COLORS.length]}
                      stackId="1"
                    />
                  ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Correlation Analysis */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium">Análise de Correlação</h3>
        </div>
        <div className="card-body">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={metrics.correlationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="avgResolutionTime"
                  name="Tempo Médio de Resolução"
                />
                <YAxis dataKey="resolutionRate" name="Taxa de Resolução (%)" />
                <Tooltip />
                <Legend />
                <Scatter
                  name="Squads"
                  data={metrics.correlationData}
                  fill="#8884d8"
                >
                  {metrics.correlationData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Scatter>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSquadSection = () => (
    <div className="space-y-6">
      {metrics.monthlyPerformance.map(({ squad, performance }) => (
        <div key={squad} className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium">
              Performance da Squad: {squad}
            </h3>
          </div>
          <div className="card-body">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="risks"
                    stroke="#8884d8"
                    name="Novos Riscos"
                  />
                  <Line
                    type="monotone"
                    dataKey="resolutions"
                    stroke="#82ca9d"
                    name="Resoluções"
                  />
                  <Line
                    type="monotone"
                    dataKey="cancellations"
                    stroke="#ff7300"
                    name="Cancelamentos"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 grid grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500">
                  Total de Casos
                </h4>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {metrics.squadMetrics[squad].totalCases}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500">
                  Taxa de Resolução
                </h4>
                <p className="mt-2 text-2xl font-semibold text-green-600">
                  {metrics.squadMetrics[squad].resolutionRate.toFixed(1)}%
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500">
                  Taxa de Cancelamento
                </h4>
                <p className="mt-2 text-2xl font-semibold text-red-600">
                  {metrics.squadMetrics[squad].cancellationRate.toFixed(1)}%
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500">
                  Tempo Médio de Resolução
                </h4>
                <p className="mt-2 text-2xl font-semibold text-blue-600">
                  {metrics.squadMetrics[squad].avgDaysToResolve.toFixed(1)} dias
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Análise de Dados
          </h2>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>
              Período:{' '}
              {timeRange === 'all' ? 'Todo período' : `Últimos ${timeRange}`}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
            className="input"
          >
            <option value="1m">Último mês</option>
            <option value="3m">Últimos 3 meses</option>
            <option value="6m">Últimos 6 meses</option>
            <option value="1y">Último ano</option>
            <option value="all">Todo período</option>
          </select>
          <button onClick={handleExport} className="btn btn-secondary">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </button>
        </div>
      </div>

      <div className="flex space-x-4 border-b border-gray-200">
        <button
          onClick={() => setSelectedView('overview')}
          className={`px-4 py-2 border-b-2 font-medium text-sm ${
            selectedView === 'overview'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center space-x-2">
            <BarChart2 className="w-4 h-4" />
            <span>Visão Geral</span>
          </div>
        </button>
        <button
          onClick={() => setSelectedView('squad')}
          className={`px-4 py-2 border-b-2 font-medium text-sm ${
            selectedView === 'squad'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span>Performance por Squad</span>
          </div>
        </button>
        <button
          onClick={() => setSelectedView('risks')}
          className={`px-4 py-2 border-b-2 font-medium text-sm ${
            selectedView === 'risks'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Motivos de Risco</span>
          </div>
        </button>
      </div>

      {selectedView === 'overview' && renderOverviewSection()}
      {selectedView === 'squad' && renderSquadSection()}
      {selectedView === 'risks' && renderRiskReasonsSection()}
    </div>
  );
};
