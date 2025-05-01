import React from 'react';
import { FileText, AlertCircle, Clock, Users, BarChart2 } from 'lucide-react';

export const SystemGuide = () => {
  return (
    <div className="space-y-6 text-gray-900">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium text-lg mb-3 flex items-center text-gray-900">
            <FileText className="w-5 h-5 mr-2 text-blue-600" />
            Campos Principais
          </h3>
          <ul className="space-y-2 text-gray-900">
            <li>
              • <strong>Nome do Cliente:</strong> Identificação do cliente
            </li>
            <li>
              • <strong>Squad:</strong> Equipe responsável pelo cliente
            </li>
            <li>
              • <strong>Tier:</strong> Nível de classificação do cliente
            </li>
            <li>
              • <strong>Data de Entrada:</strong> Quando o cliente entrou em
              risco
            </li>
            <li>
              • <strong>Data de Saída:</strong> Quando o cliente saiu do risco
            </li>
            <li>
              • <strong>Status Atual:</strong> Situação atual do cliente
            </li>
            <li>
              • <strong>Motivo do Risco:</strong> Razão da entrada em risco
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-medium text-lg mb-3 flex items-center text-gray-900">
            <AlertCircle className="w-5 h-5 mr-2 text-blue-600" />
            Funcionalidades
          </h3>
          <ul className="space-y-2 text-gray-900">
            <li className="flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 text-blue-600 mt-0.5 flex-shrink-0" />
              <span>Acompanhamento de status e evolução dos riscos</span>
            </li>
            <li className="flex items-start">
              <Clock className="w-5 h-5 mr-2 text-blue-600 mt-0.5 flex-shrink-0" />
              <span>Cálculo automático de dias em risco</span>
            </li>
            <li className="flex items-start">
              <Users className="w-5 h-5 mr-2 text-blue-600 mt-0.5 flex-shrink-0" />
              <span>Gestão de notas e atividades por cliente</span>
            </li>
            <li className="flex items-start">
              <BarChart2 className="w-5 h-5 mr-2 text-blue-600 mt-0.5 flex-shrink-0" />
              <span>Análise de KPIs e métricas personalizáveis</span>
            </li>
          </ul>
        </div>
      </div>

      <div>
        <h3 className="font-medium text-lg mb-3 text-gray-900">Como Usar</h3>
        <ol className="space-y-2 text-gray-900 list-decimal list-inside">
          <li>Importe seus dados através do botão "Importar Dados"</li>
          <li>Configure os KPIs que deseja visualizar no painel</li>
          <li>Gerencie os clientes na tabela de dados</li>
          <li>Adicione notas e acompanhe o progresso de cada cliente</li>
          <li>Monitore os indicadores e tome decisões baseadas nos dados</li>
        </ol>
      </div>
    </div>
  );
};