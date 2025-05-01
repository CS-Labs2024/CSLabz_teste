import { Card } from '../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Customer } from '../types';
import { useState, useMemo } from 'react';
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Calendar,
  BarChart3,
  Activity,
} from 'lucide-react';
import { Progress } from '../components/ui/progress';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

interface AnalyticsProps {
  customers: Customer[];
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

const formatPercent = (value: number) => `${value.toFixed(1)}%`;

const formatNumber = (value: number) =>
  new Intl.NumberFormat('pt-BR').format(value);

export default function Analytics({ customers }: AnalyticsProps) {
  const [timeFilter, setTimeFilter] = useState('30');

  // Verificar se temos dados de contato
  const hasContactData = customers.some(customer => 
    customer.UltimoContato || 
    customer.atividades?.length > 0
  );

  const data = useMemo(() => {
    if (!hasContactData) {
      return {
        totalContacts: 0,
        totalMRR: 0,
        activityTypes: {},
        tierAnalysis: {},
        weeklyDistribution: {},
        trends: { increasing: 0, decreasing: 0, stable: 0 },
        weeklyChartData: [],
        tierChartData: [],
        activityTypeData: [],
      };
    }
    
    const filterDate = new Date();
    filterDate.setDate(filterDate.getDate() - parseInt(timeFilter));
    const now = new Date();

    // Initialize contact distribution by week
    const weeklyDistribution: Record<string, number> = {};
    const startDate = new Date(filterDate);
    while (startDate <= now) {
      const weekKey = startDate.toISOString().split('T')[0];
      weeklyDistribution[weekKey] = 0;
      startDate.setDate(startDate.getDate() + 7);
    }

    // Calculate metrics
    const analysisData = customers.reduce(
      (acc, customer) => {
        // Get all contact points (activities + last touch point)
        const activities = [...(customer.atividades || [])];

        // Add last touch point if it exists and is not already included in activities
        if (customer.UltimoContato) {
          const lastTouch = {
            data: customer.UltimoContato,
            tipo: customer.CategoriaContato || 'Contato',
            descricao: 'Último contato registrado',
            responsavel: 'Sistema',
          };

          // Check if this touch point is not already in activities
          const touchExists = activities.some(
            (a) =>
              new Date(a.data).getTime() === new Date(lastTouch.data).getTime()
          );

          if (!touchExists) {
            activities.push(lastTouch);
          }
        }

        // Filter recent activities
        const recentActivities = activities.filter(
          (a) => new Date(a.data) >= filterDate
        );
        const mrr = parseFloat(customer.MRR) || 0;
        const tier = customer.Tier || 'Sem Tier';

        // Weekly distribution
        recentActivities.forEach((activity) => {
          const activityDate = new Date(activity.data);
          const weekKey = activityDate.toISOString().split('T')[0];
          weeklyDistribution[weekKey] = (weeklyDistribution[weekKey] || 0) + 1;
        });

        // Activity types distribution
        recentActivities.forEach((activity) => {
          acc.activityTypes[activity.tipo] =
            (acc.activityTypes[activity.tipo] || 0) + 1;
        });

        // Tier analysis
        if (!acc.tierAnalysis[tier]) {
          acc.tierAnalysis[tier] = {
            totalCustomers: 0,
            totalContacts: 0,
            totalMRR: 0,
            averageContactsPerCustomer: 0,
            contactDistribution: {
              '0': 0,
              '1-2': 0,
              '3-5': 0,
              '6+': 0,
            },
          };
        }

        acc.tierAnalysis[tier].totalCustomers++;
        acc.tierAnalysis[tier].totalContacts += recentActivities.length;
        acc.tierAnalysis[tier].totalMRR += mrr;

        // Contact frequency distribution
        const contactCount = recentActivities.length;
        const contactRange =
          contactCount === 0
            ? '0'
            : contactCount <= 2
            ? '1-2'
            : contactCount <= 5
            ? '3-5'
            : '6+';
        acc.tierAnalysis[tier].contactDistribution[contactRange]++;

        // Update overall metrics
        acc.totalContacts += recentActivities.length;
        acc.totalMRR += mrr;

        // Contact trends (including last touch point)
        const last30Days = activities.filter((a) => {
          const date = new Date(a.data);
          return date >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        }).length;

        const previous30Days = activities.filter((a) => {
          const date = new Date(a.data);
          const start = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
          const end = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return date >= start && date < end;
        }).length;

        if (last30Days > previous30Days) acc.trends.increasing++;
        else if (last30Days < previous30Days) acc.trends.decreasing++;
        else acc.trends.stable++;

        return acc;
      },
      {
        totalContacts: 0,
        totalMRR: 0,
        activityTypes: {} as Record<string, number>,
        tierAnalysis: {} as Record<
          string,
          {
            totalCustomers: number;
            totalContacts: number;
            totalMRR: number;
            averageContactsPerCustomer: number;
            contactDistribution: Record<string, number>;
          }
        >,
        weeklyDistribution,
        trends: { increasing: 0, decreasing: 0, stable: 0 },
      }
    );

    // Calculate averages and prepare chart data
    Object.keys(analysisData.tierAnalysis).forEach((tier) => {
      const tierData = analysisData.tierAnalysis[tier];
      tierData.averageContactsPerCustomer =
        tierData.totalContacts / Math.max(tierData.totalCustomers, 1);
    });

    // Prepare chart data
    const weeklyChartData = Object.entries(analysisData.weeklyDistribution)
      .map(([date, count]) => ({
        date: new Date(date).toLocaleDateString('pt-BR'),
        contatos: count,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const tierChartData = Object.entries(analysisData.tierAnalysis)
      .map(([tier, data]) => ({
        tier,
        contatos: data.totalContacts,
        media: parseFloat(data.averageContactsPerCustomer.toFixed(1)),
        mrr: data.totalMRR,
      }))
      .sort((a, b) => b.contatos - a.contatos);

    const activityTypeData = Object.entries(analysisData.activityTypes)
      .map(([type, count]) => ({
        type,
        value: count,
        percentage: (count / analysisData.totalContacts) * 100,
      }))
      .sort((a, b) => b.value - a.value);

    return {
      ...analysisData,
      weeklyChartData,
      tierChartData,
      activityTypeData,
    };
  }, [customers, timeFilter, hasContactData]);

  if (!hasContactData) {
    return (
      <div className="p-8 text-center">
        <div className="bg-[#00FFC6]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <Activity className="w-8 h-8 text-[#00FFC6]" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          Dados insuficientes para análise de contatos
        </h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Para visualizar análises de contatos, você precisa registrar atividades para seus clientes ou importar dados que incluam informações de último contato.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold">Período de Análise:</h3>
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Últimos 7 dias</SelectItem>
              <SelectItem value="30">Últimos 30 dias</SelectItem>
              <SelectItem value="90">Últimos 90 dias</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Contact Coverage KPIs */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="metric-card">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Total de Contatos</h3>
            </div>
            <p className="metric-value">{formatNumber(data.totalContacts)}</p>
            <p className="text-sm text-muted-foreground mt-2">
              no período selecionado
            </p>
          </Card>

          <Card className="metric-card">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Tendência de Contatos</h3>
            </div>
            <p className="metric-value">
              {formatNumber(data.trends.increasing)}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              clientes com aumento na frequência
            </p>
          </Card>

          <Card className="metric-card">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">MRR Impactado</h3>
            </div>
            <p className="metric-value">{formatCurrency(data.totalMRR)}</p>
            <p className="text-sm text-muted-foreground mt-2">
              em clientes contatados
            </p>
          </Card>
        </div>

        {/* Contact Distribution Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Weekly Distribution */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">
              Distribuição Semanal de Contatos
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.weeklyChartData}>
                  <defs>
                    <linearGradient
                      id="colorContatos"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--chart-1))"
                        stopOpacity={0.1}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--chart-1))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="date"
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--foreground))' }}
                  />
                  <YAxis
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--foreground))' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="contatos"
                    stroke="hsl(var(--chart-1))"
                    fillOpacity={1}
                    fill="url(#colorContatos)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Activity Types Distribution */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Tipos de Contato</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.activityTypeData}
                    dataKey="value"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ type, percentage }) =>
                      `${type} (${percentage.toFixed(1)}%)`
                    }
                  >
                    {data.activityTypeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          {/* Tier Analysis */}
          <Card className="p-6 bg-white">
            <h3 className="text-lg font-semibold mb-6">Análise por Tier</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.tierChartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="tier"
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--foreground))' }}
                  />
                  <YAxis
                    yAxisId="left"
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--foreground))' }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--foreground))' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="contatos"
                    name="Total de Contatos"
                    fill="hsl(var(--chart-1))"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="media"
                    name="Média por Cliente"
                    fill="hsl(var(--chart-2))"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
        {/* Contact Distribution by Tier */}
        <div className="grid gap-6">
          {Object.entries(data.tierAnalysis).map(([tier, analysis]) => (
            <Card key={tier} className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-lg font-semibold">{tier}</h4>
                  <p className="text-sm text-muted-foreground">
                    {formatNumber(analysis.totalCustomers)} clientes |{' '}
                    {formatCurrency(analysis.totalMRR)} MRR
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">
                    {formatNumber(analysis.totalContacts)} contatos
                  </p>
                  <p className="text-sm text-muted-foreground">
                    média de {analysis.averageContactsPerCustomer.toFixed(1)}{' '}
                    por cliente
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {Object.entries(analysis.contactDistribution).map(
                  ([range, count]) => (
                    <div key={range}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">
                          {range === '0'
                            ? 'Sem contatos'
                            : range === '1-2'
                            ? '1 a 2 contatos'
                            : range === '3-5'
                            ? '3 a 5 contatos'
                            : '6 ou mais contatos'}
                        </span>
                        <span className="text-sm font-medium">
                          {count} cliente{count !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <Progress
                        value={(count / analysis.totalCustomers) * 100}
                        className="h-2"
                      />
                    </div>
                  )
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}