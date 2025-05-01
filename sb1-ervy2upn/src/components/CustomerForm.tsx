import React, { useState } from 'react';
import { PlusCircle, User, Calendar, Tag, Briefcase } from 'lucide-react';
import { Customer } from '../types';
import { parseDate } from '../utils/dateUtils';

interface CustomerFormProps {
  onSubmit: (customer: Omit<Customer, 'id'>) => void;
  segments: string[];
  tiers: string[];
}

export default function CustomerForm({
  onSubmit,
  segments,
  tiers,
}: CustomerFormProps) {
  const [name, setName] = useState('');
  const [entryDate, setEntryDate] = useState('');
  const [exitDate, setExitDate] = useState('');
  const [segment, setSegment] = useState('');
  const [tier, setTier] = useState('');
  const [newSegment, setNewSegment] = useState('');
  const [newTier, setNewTier] = useState('');
  const [isAddingNewSegment, setIsAddingNewSegment] = useState(false);
  const [isAddingNewTier, setIsAddingNewTier] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      entryDate: parseDate(entryDate),
      exitDate: exitDate ? parseDate(exitDate) : null,
      segment: isAddingNewSegment ? newSegment : segment,
      tier: isAddingNewTier ? newTier : tier,
    });
    setName('');
    setEntryDate('');
    setExitDate('');
    setSegment('');
    setTier('');
    setNewSegment('');
    setNewTier('');
    setIsAddingNewSegment(false);
    setIsAddingNewTier(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <User className="w-4 h-4 mr-2 text-gray-500" />
            Nome do Cliente
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FFC6] focus:border-transparent bg-white"
            placeholder="Digite o nome do cliente"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Calendar className="w-4 h-4 mr-2 text-gray-500" />
            Data de Entrada
          </label>
          <input
            type="date"
            required
            value={entryDate}
            onChange={(e) => setEntryDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FFC6] focus:border-transparent bg-white"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Calendar className="w-4 h-4 mr-2 text-gray-500" />
            Data de Saída
          </label>
          <input
            type="date"
            value={exitDate}
            min={entryDate}
            onChange={(e) => setExitDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FFC6] focus:border-transparent bg-white"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Briefcase className="w-4 h-4 mr-2 text-gray-500" />
            Segmento
          </label>
          {isAddingNewSegment ? (
            <div className="flex space-x-2">
              <input
                type="text"
                value={newSegment}
                onChange={(e) => setNewSegment(e.target.value)}
                placeholder="Nome do novo segmento"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FFC6] focus:border-transparent bg-white"
              />
              <button
                type="button"
                onClick={() => setIsAddingNewSegment(false)}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <div className="flex space-x-2">
              <select
                value={segment}
                onChange={(e) => setSegment(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FFC6] focus:border-transparent bg-white"
              >
                <option value="">Selecione o segmento</option>
                {segments.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setIsAddingNewSegment(true)}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Novo
              </button>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Tag className="w-4 h-4 mr-2 text-gray-500" />
            Tier
          </label>
          {isAddingNewTier ? (
            <div className="flex space-x-2">
              <input
                type="text"
                value={newTier}
                onChange={(e) => setNewTier(e.target.value)}
                placeholder="Nome do novo tier"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FFC6] focus:border-transparent bg-white"
              />
              <button
                type="button"
                onClick={() => setIsAddingNewTier(false)}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <div className="flex space-x-2">
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FFC6] focus:border-transparent bg-white"
              >
                <option value="">Selecione o tier</option>
                {tiers.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setIsAddingNewTier(true)}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Novo
              </button>
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 inline-flex items-center px-5 py-2.5 bg-[#00FFC6] text-[#002b28] rounded-lg hover:bg-[#00FFC6]/90 transition-colors font-medium"
      >
        <PlusCircle className="w-5 h-5 mr-2" />
        Adicionar Cliente
      </button>
    </form>
  );
}
