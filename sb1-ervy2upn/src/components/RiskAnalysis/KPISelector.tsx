import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { KPIConfig } from '../../utils/types';

interface KPISelectorProps {
  kpiConfig: KPIConfig[];
  onConfigChange: (config: KPIConfig[]) => void;
}

export const KPISelector: React.FC<KPISelectorProps> = ({
  kpiConfig,
  onConfigChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (id: string) => {
    const updatedConfig = kpiConfig.map((kpi) =>
      kpi.id === id ? { ...kpi, visible: !kpi.visible } : kpi
    );
    onConfigChange(updatedConfig);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 text-gray-700 border border-gray-200"
      >
        <Settings className="w-5 h-5 mr-2" />
        Configurar KPIs
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-lg p-4 z-50 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Indicadores Visíveis</h3>
          </div>
          <div className="space-y-3">
            {kpiConfig.map((kpi) => (
              <label
                key={kpi.id}
                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={kpi.visible}
                  onChange={() => handleToggle(kpi.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{kpi.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
