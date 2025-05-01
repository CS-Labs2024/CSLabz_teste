import React from 'react';
import { Settings } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';

export default function EarlyChurnConfig() {
  const { earlyChurnMonths, setEarlyChurnMonths } = useConfig();

  return (
    <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-gray-100">
      <Settings className="w-4 h-4 text-gray-500" />
      <label className="text-sm text-gray-600">
        Período Early Churn:
      </label>
      <input
        type="number"
        min="1"
        max="12"
        value={earlyChurnMonths}
        onChange={(e) => setEarlyChurnMonths(Math.max(1, parseInt(e.target.value) || 1))}
        className="w-12 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00FFC6] text-center"
      />
      <span className="text-sm text-gray-600">meses</span>
    </div>
  );
}