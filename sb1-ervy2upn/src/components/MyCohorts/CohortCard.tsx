import React from 'react';
import { Calendar, Users, Clock, TrendingDown, Trash2, ArrowRight } from 'lucide-react';
import { SavedCohort } from '../../types/savedCohort';

interface CohortCardProps {
  cohort: SavedCohort;
  onDelete: (id: string) => void;
  onClick: (cohort: SavedCohort) => void;
}

export default function CohortCard({ cohort, onDelete, onClick }: CohortCardProps) {
  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer group"
      onClick={() => onClick(cohort)}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#00FFC6] transition-colors">
            {cohort.name}
          </h3>
          {cohort.description && (
            <p className="text-sm text-gray-500 mt-1">
              {cohort.description}
            </p>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(cohort.id);
          }}
          className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
          aria-label="Excluir análise"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
          {new Date(cohort.dateCreated).toLocaleDateString()}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Users className="w-4 h-4 mr-2 text-gray-400" />
          {cohort.stats.totalCustomers} clientes
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-blue-600" />
            <div>
              <p className="text-xs text-gray-600">Tempo Médio</p>
              <p className="text-sm font-semibold text-blue-600">
                {cohort.stats.averageLifetimeMonths} meses
              </p>
            </div>
          </div>
        </div>
        <div className="bg-red-50 rounded-lg p-3">
          <div className="flex items-center">
            <TrendingDown className="w-4 h-4 mr-2 text-red-600" />
            <div>
              <p className="text-xs text-gray-600">Taxa de Churn</p>
              <p className="text-sm font-semibold text-red-600">
                {cohort.stats.churnRate}%
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
        <button 
          className="text-xs text-[#00FFC6] font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onClick(cohort);
          }}
        >
          Ver detalhes
          <ArrowRight className="w-3 h-3 ml-1" />
        </button>
      </div>
    </div>
  );
}