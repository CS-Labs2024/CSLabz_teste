import React, { useState } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';

interface RFVCustomer {
  id: string;
  name: string;
  recency: number;
  frequency: number;
  value: number;
  totalValue: number;
  segment?: string;
  channel?: string;
  region?: string;
  lastPurchase: string;
  // Campos adicionais para compatibilidade com o sistema
  DataUltimaCompra?: string;
  QuantidadeCompras?: number;
  ValorTotalCompras?: number;
}

interface RFVFileUploadProps {
  onDataLoaded: (data: RFVCustomer[]) => void;
}

export default function RFVFileUpload({ onDataLoaded }: RFVFileUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const processFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Por favor, envie um arquivo CSV');
      return;
    }

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        try {
          const customers: RFVCustomer[] = results.data
            .filter((row: any) => row.name || row.Nome)
            .map((row: any, index) => {
              // Mapear campos do CSV para o formato esperado
              const name = row.name || row.Nome || '';
              
              // Obter data da última compra
              let lastPurchase = row.lastPurchase || row.DataUltimaCompra || '';
              if (!lastPurchase && row.UltimoContato) {
                lastPurchase = row.UltimoContato;
              }
              
              // Calcular recência se não fornecida diretamente
              let recency = parseInt(row.recency) || 0;
              if (!recency && lastPurchase) {
                const lastPurchaseDate = new Date(lastPurchase);
                const today = new Date();
                const diffTime = Math.abs(today.getTime() - lastPurchaseDate.getTime());
                recency = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              }
              
              // Obter frequência (número de compras)
              const frequency = parseInt(row.frequency) || parseInt(row.QuantidadeCompras) || 0;
              
              // Obter valor médio por compra
              let value = parseFloat(row.value) || 0;
              if (!value && row.MRR) {
                value = parseFloat(row.MRR);
              }
              
              // Obter valor total gasto
              let totalValue = parseFloat(row.totalValue) || parseFloat(row.ValorTotalCompras) || 0;
              if (!totalValue && value && frequency) {
                totalValue = value * frequency;
              }
              
              return {
                id: `C${index + 1}`,
                name,
                segment: row.segment || row.Tier || 'Não categorizado',
                channel: row.channel || row.CategoriaContato || 'Direto',
                region: row.region || 'Não especificada',
                recency,
                frequency,
                value,
                totalValue,
                lastPurchase: lastPurchase || new Date().toISOString(),
                // Campos adicionais para compatibilidade
                DataUltimaCompra: lastPurchase,
                QuantidadeCompras: frequency,
                ValorTotalCompras: totalValue
              };
            });

          if (customers.length === 0) {
            setError('Nenhum dado válido encontrado no arquivo');
            return;
          }

          onDataLoaded(customers);
          setError(null);
        } catch (err) {
          setError('Erro ao processar o arquivo. Verifique o formato dos dados.');
        }
      },
      error: (error) => {
        setError(`Erro ao ler o arquivo: ${error.message}`);
      },
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFFEE] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <BarChart2 className="w-12 h-12 text-[#00FFC6] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#002b28] mb-2">
            Análise RFV
          </h1>
          <p className="text-gray-600">
            Faça upload do seu arquivo CSV para começar a análise
          </p>
        </div>

        <div className="space-y-6">
          <div 
            className={`bg-gray-50 border-2 border-dashed ${dragActive ? 'border-[#00FFC6] bg-[#00FFC6]/5' : 'border-gray-300'} rounded-lg p-8`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              <Upload className="w-12 h-12 text-gray-400 mb-4" />
              <span className="text-sm font-medium text-gray-700">
                Clique para fazer upload
              </span>
              <span className="text-sm text-gray-500 mt-1">
                ou arraste e solte seu arquivo CSV aqui
              </span>
            </label>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              <p className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                {error}
              </p>
            </div>
          )}

          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">
              Formato esperado do CSV:
            </h3>
            <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
              <li>Nome (Nome do cliente)</li>
              <li>DataUltimaCompra (Data da última compra)</li>
              <li>QuantidadeCompras (Número total de compras)</li>
              <li>ValorTotalCompras (Valor total gasto pelo cliente)</li>
              <li>Tier (Classificação do cliente)</li>
              <li>MRR (Receita mensal recorrente)</li>
              <li>Produto (Produto contratado)</li>
              <li>UltimoContato (Data do último contato)</li>
              <li>Dias sem Touch (Dias desde o último contato)</li>
              <li>CategoriaContato (Tipo do último contato)</li>
              <li>Atualizações (Notas sobre o cliente)</li>
              <li>ProximoContato (Data do próximo contato agendado)</li>
              <li>Mês de Entrada no Risco (Mês em que entrou em risco)</li>
              <li>Squad (Equipe responsável)</li>
              <li>Classificação de Risco (Alto, Médio, Baixo)</li>
              <li>Data de Entrada no Risco</li>
              <li>Data de Saída do Risco</li>
              <li>Data do Cancelamento</li>
              <li>Motivo do Risco</li>
              <li>Status Atual</li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">
              Exemplo de arquivo CSV:
            </h3>
            <pre className="text-xs text-gray-600 overflow-x-auto">
              Nome,DataUltimaCompra,QuantidadeCompras,ValorTotalCompras,Tier,MRR,Produto,UltimoContato,Dias sem Touch,CategoriaContato,Atualizações,ProximoContato,Mês de Entrada no Risco,Squad,Classificação de Risco,Data de Entrada no Risco,Data de Saída do Risco,Data do Cancelamento,Motivo do Risco,Status Atual<br/>
              Empresa ABC,2023-12-15,24,20400,Enterprise,850,Software,2023-12-15,30,Reunião,Reunião Realizada,2024-01-15,Janeiro,Ferrari,Alto,2023-12-15,,,Redução de Investimentos,Em Risco<br/>
              Startup XYZ,2023-11-01,5,1600,Startup,320,Serviço,2023-11-01,60,Email,Contato por Email,2024-02-01,Novembro,McLaren,Médio,2023-11-01,2023-12-01,,Performance,Risco Revertido
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}