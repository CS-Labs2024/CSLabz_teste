import React from 'react';
import { Download, Info } from 'lucide-react';
import { CohortData } from '../types';
import { exportCohortMatrixToCSV } from '../utils/exportUtils';

interface CohortMatrixProps {
  data: CohortData[];
}

export default function CohortMatrix({ data }: CohortMatrixProps) {
  const months = Array.from({ length: 12 }, (_, i) => `Mês ${i + 1}`);

  const handleExport = () => {
    exportCohortMatrixToCSV(data);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="bg-blue-50 p-1.5 rounded-md mr-2">
            <Info className="h-4 w-4 text-blue-600" />
          </div>
          <p className="text-sm text-gray-600">
            A matriz mostra a porcentagem de clientes que permaneceram ativos em cada mês após a entrada
          </p>
        </div>
        <button
          onClick={handleExport}
          className="inline-flex items-center px-4 py-2 bg-[#00FFC6] text-[#002b28] rounded-lg hover:bg-[#00FFC6]/90 transition-colors text-sm font-medium"
        >
          <Download className="h-4 w-4 mr-2" />
          Exportar CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 rounded-tl-lg border-b border-gray-200">
                Cohort
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-200">
                Clientes
              </th>
              {months.map((month) => (
                <th
                  key={month}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-200 last:rounded-tr-lg"
                >
                  {month}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {data.map((row) => (
              <tr key={row.period} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {row.period}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                  {row.customerCount}
                </td>
                {row.retention.map((value, index) => (
                  <td
                    key={index}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    <div className="flex items-center space-x-2">
                      <div 
                        className="h-2.5 rounded-full" 
                        style={{
                          width: `${value}%`,
                          backgroundColor: `hsl(${
                            value >= 75 ? '142, 76%, 36%' : // Green
                            value >= 50 ? '45, 93%, 47%' : // Yellow
                            value >= 25 ? '26, 91%, 42%' : // Orange
                            '0, 84%, 60%' // Red
                          })`
                        }}
                      />
                      <span className="font-medium">{value}%</span>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}