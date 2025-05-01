import React, { useState } from 'react';
import { RiskEntry, Note } from '../../utils/types';
import {
  Pencil,
  Save,
  X,
  Plus,
  ArrowUpDown,
  MessageSquarePlus,
  AlertCircle,
  Clock,
} from 'lucide-react';

interface DataTableProps {
  data: RiskEntry[];
  onUpdateData: (updatedData: RiskEntry[]) => void;
}

const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
};

export const DataTable: React.FC<DataTableProps> = ({ data, onUpdateData }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedData, setEditedData] = useState<RiskEntry | null>(null);
  const [sortField, setSortField] = useState<keyof RiskEntry>('nomeCliente');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<RiskEntry | null>(null);
  const [newNote, setNewNote] = useState({ texto: '', autor: '' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClient, setNewClient] = useState<RiskEntry>({
    mesEntrada: new Date().toLocaleString('pt-BR', { month: 'long' }),
    nomeCliente: '',
    squad: '',
    tier: '',
    classificacaoRisco: '',
    dataEntrada: new Date().toISOString().split('T')[0],
    dataSaida: '',
    dataCancelamento: '',
    motivoRisco: '',
    statusAtual: 'Em Risco',
    diasEmRisco: 0,
    comentarios: '',
    notas: [],
  });

  const calculateDaysInRisk = (entry: RiskEntry): number => {
    const startDate = new Date(entry.dataEntrada);
    const endDate = entry.dataSaida ? new Date(entry.dataSaida) : new Date();
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateDaysSinceLastUpdate = (notas: Note[] = []): number => {
    if (notas.length === 0) return 0;
    const lastUpdate = new Date(
      Math.max(...notas.map((n) => new Date(n.data).getTime()))
    );
    const diffTime = Math.abs(new Date().getTime() - lastUpdate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getRiskLevel = (days: number) => {
    if (days <= 30) return { color: 'bg-green-500', label: 'Baixo' };
    if (days <= 60) return { color: 'bg-yellow-500', label: 'Médio' };
    return { color: 'bg-red-500', label: 'Alto' };
  };

  const getUpdateStatusColor = (days: number): string => {
    if (days === 0) return 'text-gray-400';
    if (days <= 7) return 'text-green-600';
    if (days <= 15) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleSort = (field: keyof RiskEntry) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    return [...data].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle dates
      if (sortField.includes('data')) {
        aValue = aValue ? new Date(aValue).getTime() : 0;
        bValue = bValue ? new Date(bValue).getTime() : 0;
      }
      // Handle strings
      else if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortField, sortDirection]);

  const handleEdit = (entry: RiskEntry) => {
    setEditingId(entry.nomeCliente);
    setEditedData({ ...entry });
  };

  const handleSave = () => {
    if (editedData) {
      const newData = data.map((item) =>
        item.nomeCliente === editingId ? editedData : item
      );
      onUpdateData(newData);
      setEditingId(null);
      setEditedData(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedData(null);
  };

  const handleChange = (field: keyof RiskEntry, value: string | number) => {
    if (editedData) {
      setEditedData({ ...editedData, [field]: value });
    }
  };

  const handleAddNote = () => {
    if (selectedClient && newNote.texto && newNote.autor) {
      const note: Note = {
        id: Date.now().toString(),
        texto: newNote.texto,
        autor: newNote.autor,
        data: new Date().toISOString(),
        categoria: 'Atualização',
      };

      const updatedClient = {
        ...selectedClient,
        notas: [...(selectedClient.notas || []), note],
      };

      const updatedData = data.map((item) =>
        item.nomeCliente === selectedClient.nomeCliente ? updatedClient : item
      );

      onUpdateData(updatedData);
      setShowNoteModal(false);
      setNewNote({ texto: '', autor: '' });
      setSelectedClient(null);
    }
  };

  const handleAddClient = () => {
    if (newClient.nomeCliente && newClient.dataEntrada) {
      const updatedData = [
        ...data,
        { ...newClient, diasEmRisco: calculateDaysInRisk(newClient) },
      ];
      onUpdateData(updatedData);
      setShowAddModal(false);
      setNewClient({
        mesEntrada: new Date().toLocaleString('pt-BR', { month: 'long' }),
        nomeCliente: '',
        squad: '',
        tier: '',
        classificacaoRisco: '',
        dataEntrada: new Date().toISOString().split('T')[0],
        dataSaida: '',
        dataCancelamento: '',
        motivoRisco: '',
        statusAtual: 'Em Risco',
        diasEmRisco: 0,
        comentarios: '',
        notas: [],
      });
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">
          Lista de Clientes
        </h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-[#00FFC6] text-black font-medium rounded-md hover:bg-[#00FFC6]/90 transition-colors flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Cliente
        </button>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Risco
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('nomeCliente')}
            >
              <div className="flex items-center">
                Cliente
                <ArrowUpDown className="w-4 h-4 ml-1" />
              </div>
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('squad')}
            >
              <div className="flex items-center">
                Squad
                <ArrowUpDown className="w-4 h-4 ml-1" />
              </div>
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('tier')}
            >
              <div className="flex items-center">
                Tier
                <ArrowUpDown className="w-4 h-4 ml-1" />
              </div>
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('statusAtual')}
            >
              <div className="flex items-center">
                Status
                <ArrowUpDown className="w-4 h-4 ml-1" />
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Dias sem Atualizações
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('dataEntrada')}
            >
              <div className="flex items-center">
                Data Entrada
                <ArrowUpDown className="w-4 h-4 ml-1" />
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data Saída
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('dataCancelamento')}
            >
              <div className="flex items-center">
                Data Cancelamento
                <ArrowUpDown className="w-4 h-4 ml-1" />
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedData.map((entry) => {
            const daysInRisk = calculateDaysInRisk(entry);
            const riskLevel = getRiskLevel(daysInRisk);
            const daysSinceUpdate = calculateDaysSinceLastUpdate(entry.notas);
            const updateStatusColor = getUpdateStatusColor(daysSinceUpdate);

            return (
              <tr key={entry.nomeCliente}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-3 h-3 rounded-full ${riskLevel.color}`}
                      title={`${riskLevel.label} - ${daysInRisk} dias em risco`}
                    />
                    <span className="text-sm text-gray-500">{daysInRisk}d</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === entry.nomeCliente ? (
                    <input
                      type="text"
                      className="input"
                      value={editedData?.nomeCliente || ''}
                      onChange={(e) =>
                        handleChange('nomeCliente', e.target.value)
                      }
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>{entry.nomeCliente}</span>
                      {entry.notas?.length > 0 && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {entry.notas.length} notas
                        </span>
                      )}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === entry.nomeCliente ? (
                    <input
                      type="text"
                      className="input"
                      value={editedData?.squad || ''}
                      onChange={(e) => handleChange('squad', e.target.value)}
                    />
                  ) : (
                    entry.squad
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === entry.nomeCliente ? (
                    <input
                      type="text"
                      className="input"
                      value={editedData?.tier || ''}
                      onChange={(e) => handleChange('tier', e.target.value)}
                    />
                  ) : (
                    <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                      {entry.tier || '-'}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === entry.nomeCliente ? (
                    <input
                      type="text"
                      className="input"
                      value={editedData?.statusAtual || ''}
                      onChange={(e) =>
                        handleChange('statusAtual', e.target.value)
                      }
                    />
                  ) : (
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        entry.statusAtual.toLowerCase().includes('cancelado')
                          ? 'bg-red-100 text-red-800'
                          : entry.dataSaida
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {entry.statusAtual}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div
                    className={`flex items-center space-x-2 ${updateStatusColor}`}
                  >
                    <Clock className="w-4 h-4" />
                    <span>
                      {daysSinceUpdate === 0
                        ? 'Sem atualizações'
                        : `${daysSinceUpdate} dias`}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === entry.nomeCliente ? (
                    <input
                      type="date"
                      className="input"
                      value={editedData?.dataEntrada || ''}
                      onChange={(e) =>
                        handleChange('dataEntrada', e.target.value)
                      }
                    />
                  ) : (
                    new Date(entry.dataEntrada).toLocaleDateString(
                      'pt-BR',
                      DATE_FORMAT_OPTIONS
                    )
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === entry.nomeCliente ? (
                    <input
                      type="date"
                      className="input"
                      value={editedData?.dataSaida || ''}
                      onChange={(e) =>
                        handleChange('dataSaida', e.target.value)
                      }
                    />
                  ) : entry.dataSaida ? (
                    new Date(entry.dataSaida).toLocaleDateString(
                      'pt-BR',
                      DATE_FORMAT_OPTIONS
                    )
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === entry.nomeCliente ? (
                    <input
                      type="date"
                      className="input"
                      value={editedData?.dataCancelamento || ''}
                      onChange={(e) =>
                        handleChange('dataCancelamento', e.target.value)
                      }
                    />
                  ) : entry.dataCancelamento ? (
                    new Date(entry.dataCancelamento).toLocaleDateString(
                      'pt-BR',
                      DATE_FORMAT_OPTIONS
                    )
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    {editingId === entry.nomeCliente ? (
                      <>
                        <button
                          onClick={handleSave}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Save className="w-5 h-5" />
                        </button>
                        <button
                          onClick={handleCancel}
                          className="text-red-600 hover:text-red-900"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(entry)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedClient(entry);
                            setShowNoteModal(true);
                          }}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          <MessageSquarePlus className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">
              Adicionar Novo Cliente
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nome do Cliente
                </label>
                <input
                  type="text"
                  value={newClient.nomeCliente}
                  onChange={(e) =>
                    setNewClient((prev) => ({
                      ...prev,
                      nomeCliente: e.target.value,
                    }))
                  }
                  className="mt-1 input"
                  placeholder="Nome do cliente"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Squad
                </label>
                <input
                  type="text"
                  value={newClient.squad}
                  onChange={(e) =>
                    setNewClient((prev) => ({ ...prev, squad: e.target.value }))
                  }
                  className="mt-1 input"
                  placeholder="Squad responsável"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tier
                </label>
                <input
                  type="text"
                  value={newClient.tier}
                  onChange={(e) =>
                    setNewClient((prev) => ({ ...prev, tier: e.target.value }))
                  }
                  className="mt-1 input"
                  placeholder="Tier do cliente"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Data de Entrada
                </label>
                <input
                  type="date"
                  value={newClient.dataEntrada}
                  onChange={(e) =>
                    setNewClient((prev) => ({
                      ...prev,
                      dataEntrada: e.target.value,
                    }))
                  }
                  className="mt-1 input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Motivo do Risco
                </label>
                <textarea
                  value={newClient.motivoRisco}
                  onChange={(e) =>
                    setNewClient((prev) => ({
                      ...prev,
                      motivoRisco: e.target.value,
                    }))
                  }
                  className="mt-1 input"
                  rows={3}
                  placeholder="Descreva o motivo do risco"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddClient}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={!newClient.nomeCliente || !newClient.dataEntrada}
              >
                Adicionar Cliente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Note Modal */}
      {showNoteModal && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">
              Adicionar Nota - {selectedClient.nomeCliente}
            </h3>

            {selectedClient.notas?.length > 0 && (
              <div className="mb-4 max-h-40 overflow-y-auto">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Histórico de Notas
                </h4>
                {selectedClient.notas.map((nota) => (
                  <div key={nota.id} className="bg-gray-50 p-3 rounded-lg mb-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{nota.autor}</span>
                      <span>{new Date(nota.data).toLocaleString('pt-BR')}</span>
                    </div>
                    <p className="mt-1 text-gray-800">{nota.texto}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Responsável
                </label>
                <input
                  type="text"
                  value={newNote.autor}
                  onChange={(e) =>
                    setNewNote((prev) => ({ ...prev, autor: e.target.value }))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Nome do responsável"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nota
                </label>
                <textarea
                  value={newNote.texto}
                  onChange={(e) =>
                    setNewNote((prev) => ({ ...prev, texto: e.target.value }))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={4}
                  placeholder="Digite sua nota aqui..."
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowNoteModal(false);
                  setNewNote({ texto: '', autor: '' });
                  setSelectedClient(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddNote}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={!newNote.texto || !newNote.autor}
              >
                Adicionar Nota
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
