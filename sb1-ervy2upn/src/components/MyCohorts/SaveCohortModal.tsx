import React, { useState } from 'react';
import { X } from 'lucide-react';
import { FilterState } from '../../types';

interface SaveCohortModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, description?: string) => void;
  currentFilters: FilterState;
}

export default function SaveCohortModal({ 
  isOpen, 
  onClose, 
  onSave,
  currentFilters 
}: SaveCohortModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(name, description);
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full shadow-lg">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Salvar Análise
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome da Análise
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00FFC6] focus:border-transparent bg-white"
                placeholder="Ex: Análise Q1 2024"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição (opcional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00FFC6] focus:border-transparent bg-white"
                rows={3}
                placeholder="Adicione uma descrição para esta análise"
              />
            </div>

            <div className="bg-gray-50 rounded-lg p-4 text-sm">
              <h3 className="font-medium text-gray-700 mb-2">
                Filtros aplicados:
              </h3>
              <ul className="space-y-1 text-gray-600">
                <li>Período: {currentFilters.dateRange.start || 'Início'} até {currentFilters.dateRange.end || 'Hoje'}</li>
                <li>Segmento: {currentFilters.segment || 'Todos'}</li>
                <li>Tier: {currentFilters.tier || 'Todos'}</li>
              </ul>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#00FFC6] text-[#002b28] rounded-lg hover:bg-[#00FFC6]/90 transition-colors"
              >
                Salvar Análise
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}