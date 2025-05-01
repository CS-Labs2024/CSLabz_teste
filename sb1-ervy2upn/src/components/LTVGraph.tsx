import React from 'react';
import { BarChart, Calendar, TrendingUp, Users } from 'lucide-react';
import { Customer } from '../types';
import { calculateMonthsBetween } from '../utils/dateUtils';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

interface LTVGraphProps {
  customers: Customer[];
}

export default function LTVGraph({ customers }: LTVGraphProps) {
  const calculateLTVData = () => {
    const monthlyData: { [key: string]: { count: number; months: number; active: number } } = {};
    const now = new Date();
    
    customers.forEach(customer => {
      const entryDate = new Date(customer.entryDate);
      const monthYear = `${entryDate.getFullYear()}-${String(entryDate.getMonth() + 1).padStart(2, '0')}`;
      
      const months = customer.exitDate 
        ? calculateMonthsBetween(entryDate, new Date(customer.exitDate))
        : calculateMonthsBetween(entryDate, now);

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { count: 0, months: 0, active: 0 };
      }
      
      monthlyData[monthYear].count++;
      monthlyData[monthYear].months += months;
      if (!customer.exitDate) {
        monthlyData[monthYear].active++;
      }
    });

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([period, data]) => ({
        period,
        avgMonths: Math.round(data.months / data.count),
        totalCustomers: data.count,
        activeCustomers: data.active,
        retentionRate: Math.round((data.active / data.count) * 100)
      }));
  };

  const data = calculateLTVData();

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAvgMonths" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
            <XAxis 
              dataKey="period" 
              className="text-xs"
              tick={{ fill: '#6B7280' }}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: '#6B7280' }}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
              labelStyle={{ fontWeight: 'bold', marginBottom: '5px' }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '10px' }}
              iconType="circle"
            />
            <Line
              type="monotone"
              dataKey="avgMonths"
              name="Média de Meses"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--chart-1))', r: 4 }}
              activeDot={{ r: 6, stroke: 'white', strokeWidth: 2 }}
              fillOpacity={1}
              fill="url(#colorAvgMonths)"
            />
            <Line
              type="monotone"
              dataKey="retentionRate"
              name="Taxa de Retenção (%)"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--chart-2))', r: 4 }}
              activeDot={{ r: 6, stroke: 'white', strokeWidth: 2 }}
              fillOpacity={1}
              fill="url(#colorRetention)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {data.length > 0 && (
          <>
            <div className="bg-blue-50 rounded-lg p-5 shadow-sm">
              <div className="flex items-center mb-2">
                <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                <h4 className="text-sm font-medium text-gray-700">Último Cohort</h4>
              </div>
              <p className="text-xl font-semibold text-blue-700 flex items-center">
                {data[data.length - 1].totalCustomers}
                <span className="text-sm font-normal text-blue-500 ml-2">clientes</span>
              </p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-5 shadow-sm">
              <div className="flex items-center mb-2">
                <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                <h4 className="text-sm font-medium text-gray-700">Taxa de Retenção</h4>
              </div>
              <p className="text-xl font-semibold text-green-700 flex items-center">
                {data[data.length - 1].retentionRate}%
                <span className="text-sm font-normal text-green-500 ml-2">atual</span>
              </p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-5 shadow-sm">
              <div className="flex items-center mb-2">
                <BarChart className="w-5 h-5 text-purple-600 mr-2" />
                <h4 className="text-sm font-medium text-gray-700">Média de Tempo</h4>
              </div>
              <p className="text-xl font-semibold text-purple-700 flex items-center">
                {Math.round(data.reduce((sum, d) => sum + d.avgMonths, 0) / data.length)}
                <span className="text-sm font-normal text-purple-500 ml-2">meses</span>
              </p>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-5 shadow-sm">
              <div className="flex items-center mb-2">
                <Users className="w-5 h-5 text-orange-600 mr-2" />
                <h4 className="text-sm font-medium text-gray-700">Total de Cohorts</h4>
              </div>
              <p className="text-xl font-semibold text-orange-700 flex items-center">
                {data.length}
                <span className="text-sm font-normal text-orange-500 ml-2">períodos</span>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}