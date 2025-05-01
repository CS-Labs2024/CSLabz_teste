import React, { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';

export default function HelpButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 transition-colors"
        aria-label="Ajuda"
      >
        <HelpCircle className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Instruções de Uso</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 text-gray-900">
              <section>
                <h3 className="font-medium text-lg mb-2 text-gray-900">Adicionando Clientes</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-900">
                  <li>Preencha o formulário com nome do cliente, data de entrada e segmento</li>
                  <li>A data de saída é opcional e deve ser preenchida apenas se o cliente já saiu</li>
                  <li>Clique em "Add Customer" para adicionar o cliente</li>
                </ul>
              </section>

              <section>
                <h3 className="font-medium text-lg mb-2 text-gray-900">Upload em Massa</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-900">
                  <li>Clique no botão "Bulk Upload" para importar vários clientes de uma vez</li>
                  <li>O arquivo CSV deve conter as colunas: name, entry, exit (opcional), segment (opcional)</li>
                  <li>As datas devem estar no formato YYYY-MM-DD</li>
                </ul>
              </section>

              <section>
                <h3 className="font-medium text-lg mb-2 text-gray-900">Análise de Dados</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-900">
                  <li>Early Churn: mostra clientes que saíram nos primeiros 3 meses</li>
                  <li>Churn por Segmento: análise de saída de clientes por categoria</li>
                  <li>Matriz de Coorte: visualização da retenção de clientes ao longo do tempo</li>
                  <li>Use os filtros para analisar períodos específicos ou segmentos</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
}