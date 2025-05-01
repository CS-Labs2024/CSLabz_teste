import React, { useState } from 'react';
import { Save, Loader, AlertCircle } from 'lucide-react';
import { FilterState, Customer } from '../../types';
import { calculateCohortStats } from '../../utils/cohortStats';
import { useSavedCohorts } from '../../hooks/useSavedCohorts';
import CohortCard from './CohortCard';
import SaveCohortModal from './SaveCohortModal';
import CohortAnalysisModal from './CohortAnalysisModal';

interface MyCohortsProps {
  currentFilters: FilterState;
  customers: Customer[];
}

export default function MyCohorts({ currentFilters, customers }: MyCohortsProps) {
  const { cohorts, loading, error, saveCohort, deleteCohort } = useSavedCohorts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCohort, setSelectedCohort] = useState(null);

  const handleSave = async (name: string, description?: string) => {
    try {
      const stats = calculateCohortStats(customers);
      
      await saveCohort({
        name,
        description,
        dateCreated: new Date(),
        filters: currentFilters,
        stats: {
          totalCustomers: stats.totalCustomers,
          averageLifetimeMonths: stats.averageLifetimeMonths,
          churnRate: stats.churnRate,
          activeCustomers: stats.activeCustomers,
          churnedCustomers: stats.churnedCustomers
        }
      });
      
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to save cohort:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <Save className="w-5 h-5 mr-2 text-[#00FFC6]" />
          Análises Salvas
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-[#00FFC6] text-[#002b28] rounded-lg hover:bg-[#00FFC6]/90 transition-colors text-sm font-medium"
        >
          <Save className="w-4 h-4 mr-2" />
          Salvar Análise Atual
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 flex items-start">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <Loader className="w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">
            Carregando análises salvas...
          </p>
        </div>
      ) : cohorts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Save className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 max-w-md mx-auto">
            Você ainda não tem análises salvas.
            <br />
            Salve sua primeira análise para acompanhar mudanças ao longo do tempo.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cohorts.map((cohort) => (
            <CohortCard
              key={cohort.id}
              cohort={cohort}
              onDelete={deleteCohort}
              onClick={setSelectedCohort}
            />
          ))}
        </div>
      )}

      <SaveCohortModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        currentFilters={currentFilters}
      />

      {selectedCohort && (
        <CohortAnalysisModal
          cohort={selectedCohort}
          isOpen={!!selectedCohort}
          onClose={() => setSelectedCohort(null)}
        />
      )}
    </div>
  );
}