import React, { useState } from 'react';
import { Upload, AlertCircle, FileText, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Customer } from '../types';
import { parseCSVData } from '../utils/csvParser';
import { DateFormat, DATE_FORMATS } from '../utils/dateFormats';

export default function ImportBase() {
  const [dateFormat, setDateFormat] = useState<DateFormat>('DD/MM/YYYY');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState<string[][]>([]);
  const [invalidRows, setInvalidRows] = useState<Array<{
    line: number;
    content: string;
    reason: string;
  }> | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);
    setInvalidRows(null);
    setSuccess(false);
    
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Por favor, envie um arquivo CSV');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').map(line => line.split(',').map(cell => cell.trim()));
      setPreview(lines);
    };
    reader.onerror = () => {
      setError('Falha ao ler o arquivo');
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (preview.length === 0) {
      setError('Por favor, selecione um arquivo CSV primeiro');
      return;
    }

    const csvText = preview.map(row => row.join(',')).join('\n');
    const result = parseCSVData(csvText, dateFormat);

    if (!result.success) {
      setError(result.error || 'Falha ao processar dados do CSV');
      setInvalidRows(result.invalidRows || null);
      return;
    }

    if (result.data) {
      // Store the imported data in localStorage
      localStorage.setItem('importedCustomers', JSON.stringify(result.data));
      setSuccess(true);
      
      // Navigate to Cohort Analysis after a brief delay
      setTimeout(() => {
        navigate('/dashboard/cohort');
      }, 1500);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Importar Base</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Formato do Arquivo</h2>
          <p className="text-gray-600">
            O arquivo CSV deve conter as seguintes colunas:
          </p>
          <ul className="list-disc list-inside mt-2 text-gray-600">
            <li>name (obrigatório) - Nome do cliente</li>
            <li>entry (obrigatório) - Data de entrada</li>
            <li>exit (opcional) - Data de saída</li>
            <li>segment (opcional) - Segmento do cliente</li>
            <li>tier (opcional) - Tier do cliente</li>
          </ul>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Formato de Data no CSV
          </label>
          <select
            value={dateFormat}
            onChange={(e) => setDateFormat(e.target.value as DateFormat)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(DATE_FORMATS).map(([format, label]) => (
              <option key={format} value={format}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            id="csv-upload"
          />
          <label
            htmlFor="csv-upload"
            className="flex flex-col items-center justify-center cursor-pointer"
          >
            <Upload className="w-12 h-12 text-gray-400 mb-4" />
            <span className="text-gray-600">
              Clique para fazer upload do arquivo CSV
            </span>
          </label>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-700 font-medium">{error}</p>
                {invalidRows && invalidRows.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-red-600 font-medium">
                      Linhas inválidas:
                    </p>
                    <div className="mt-1 max-h-40 overflow-y-auto">
                      {invalidRows.map((row, index) => (
                        <div key={index} className="text-sm text-red-600 mt-1">
                          <span className="font-medium">Linha {row.line}:</span>{' '}
                          {row.reason}
                          <div className="text-xs text-red-500 mt-0.5">
                            Conteúdo: {row.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <p className="text-green-700">
                Base importada com sucesso! Redirecionando para análise...
              </p>
            </div>
          </div>
        )}

        {preview.length > 0 && (
          <>
            <div className="mt-6">
              <div className="flex items-center mb-4">
                <FileText className="w-5 h-5 text-gray-500 mr-2" />
                <h3 className="text-lg font-medium">Preview dos Dados</h3>
              </div>
              <div className="max-h-64 overflow-auto border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {preview[0].map((header, i) => (
                        <th
                          key={i}
                          className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {preview.slice(1).map((row, i) => (
                      <tr key={i}>
                        {row.map((cell, j) => (
                          <td key={j} className="px-4 py-2 text-sm text-gray-900">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleImport}
                className="w-full flex justify-center items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Importar e Aplicar na Análise
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}