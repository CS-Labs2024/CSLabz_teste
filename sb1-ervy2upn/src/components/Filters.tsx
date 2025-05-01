import React from 'react';
import { FilterState } from '../types';
import { Calendar, Users, Tag } from 'lucide-react';

interface FiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  segments: string[];
  tiers: string[];
}

export default function Filters({ filters, onFilterChange, segments, tiers }: FiltersProps) {
  const handleDateChange = (field: 'start' | 'end', value: string) => {
    onFilterChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [field]: value,
      },
    });
  };

  const handleSegmentChange = (value: string) => {
    onFilterChange({
      ...filters,
      segment: value,
    });
  };

  const handleTierChange = (value: string) => {
    onFilterChange({
      ...filters,
      tier: value,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="space-y-2">
        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
          <Calendar className="w-4 h-4 mr-2 text-gray-500" />
          Data Inicial
        </label>
        <input
          type="date"
          value={filters.dateRange.start}
          onChange={(e) => handleDateChange('start', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FFC6] focus:border-transparent bg-white text-gray-900"
        />
      </div>
      
      <div className="space-y-2">
        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
          <Calendar className="w-4 h-4 mr-2 text-gray-500" />
          Data Final
        </label>
        <input
          type="date"
          value={filters.dateRange.end}
          onChange={(e) => handleDateChange('end', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FFC6] focus:border-transparent bg-white text-gray-900"
        />
      </div>
      
      <div className="space-y-2">
        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
          <Users className="w-4 h-4 mr-2 text-gray-500" />
          Segmento
        </label>
        <select
          value={filters.segment}
          onChange={(e) => handleSegmentChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FFC6] focus:border-transparent bg-white text-gray-900"
        >
          <option value="">Todos os Segmentos</option>
          {segments.map((segment) => (
            <option key={segment} value={segment}>
              {segment}
            </option>
          ))}
        </select>
      </div>
      
      <div className="space-y-2">
        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
          <Tag className="w-4 h-4 mr-2 text-gray-500" />
          Tier
        </label>
        <select
          value={filters.tier}
          onChange={(e) => handleTierChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FFC6] focus:border-transparent bg-white text-gray-900"
        >
          <option value="">Todos os Tiers</option>
          {tiers.map((tier) => (
            <option key={tier} value={tier}>
              {tier}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}