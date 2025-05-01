import { useState } from 'react';
import { Trash2, ChevronDown, ChevronUp, Edit, Calendar, Tag, User } from 'lucide-react';
import { Customer } from '../types';
import EditCustomerModal from './EditCustomerModal';

interface CustomerTableProps {
  customers: Customer[];
  onDelete: (id: string) => void;
  onUpdate: (customer: Customer) => void;
  segments: string[];
  tiers: string[];
}

export default function CustomerTable({
  customers,
  onDelete,
  onUpdate,
  segments,
  tiers,
}: CustomerTableProps) {
  const [expanded, setExpanded] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const displayCustomers = expanded ? customers : customers.slice(0, 5);
  const hasMore = customers.length > 5;

  return (
    <>
      <div className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2 text-gray-400" />
                    Cliente
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    Data de Entrada
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    Data de Saída
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Tag className="w-4 h-4 mr-2 text-gray-400" />
                    Segmento
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Tag className="w-4 h-4 mr-2 text-gray-400" />
                    Tier
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {customer.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(customer.entryDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.exitDate
                      ? new Date(customer.exitDate).toLocaleDateString()
                      : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.segment ? (
                      <span className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
                        {customer.segment}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.tier ? (
                      <span className="px-2 py-1 text-xs font-medium bg-purple-50 text-purple-700 rounded-full">
                        {customer.tier}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setEditingCustomer(customer)}
                        className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded-full hover:bg-blue-50"
                        title="Editar cliente"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(customer.id)}
                        className="text-red-600 hover:text-red-900 transition-colors p-1 rounded-full hover:bg-red-50"
                        title="Excluir cliente"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {displayCustomers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    Nenhum cliente encontrado com os filtros atuais
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {hasMore && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center justify-center w-full text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              {expanded ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-2" />
                  Mostrar Menos
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-2" />
                  Mostrar Todos ({customers.length} clientes)
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {editingCustomer && (
        <EditCustomerModal
          isOpen={!!editingCustomer}
          onClose={() => setEditingCustomer(null)}
          customer={editingCustomer}
          onSave={onUpdate}
          segments={segments}
          tiers={tiers}
        />
      )}
    </>
  );
}