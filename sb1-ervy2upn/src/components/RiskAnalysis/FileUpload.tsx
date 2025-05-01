import React, { useState, useEffect } from 'react';
import {
  Upload,
  Plus,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { RiskEntry, Note } from '../../utils/types';

interface FileUploadProps {
  onDataLoaded: (data: RiskEntry[]) => void;
}

interface FieldMapping {
  systemField: keyof RiskEntry;
  fileField: string;
  label: string;
  description: string;
  required: boolean;
  recommended?: boolean;
}

const FIELD_MAPPINGS = {
  nomeCliente: [
    'nome',
    'cliente',
    'customer',
    'name',
    'razao',
    'razão',
    'empresa',
  ],
  squad: ['squad', 'equipe', 'team', 'grupo', 'area', 'área'],
  tier: ['tier', 'nível', 'nivel', 'segmento', 'segment'],
  classificacaoRisco: [
    'classificacao',
    'classificação',
    'tipo',
    'type',
    'risco',
    'risk',
  ],
  dataEntrada: [
    'entrada',
    'data entrada',
    'data_entrada',
    'start',
    'início',
    'inicio',
    'dt_entrada',
    'data_inicio',
  ],
  dataSaida: [
    'saida',
    'saída',
    'data saida',
    'data_saida',
    'end',
    'fim',
    'dt_saida',
    'data_fim',
  ],
  dataCancelamento: [
    'cancelamento',
    'data cancelamento',
    'data_cancelamento',
    'canceled',
    'cancelled',
    'dt_cancelamento',
  ],
  motivoRisco: [
    'motivo',
    'reason',
    'causa',
    'cause',
    'justificativa',
    'motivo_risco',
    'motivo do risco',
  ],
  statusAtual: [
    'status',
    'situacao',
    'situação',
    'state',
    'current status',
    'status_atual',
  ],
  comentarios: [
    'comentario',
    'comentário',
    'observacao',
    'observação',
    'notes',
    'comment',
    'comments',
    'obs',
  ],
  mesEntrada: ['mes', 'mês', 'month', 'periodo', 'período'],
};

const SYSTEM_FIELDS: FieldMapping[] = [
  {
    systemField: 'nomeCliente',
    fileField: '',
    label: 'Nome do Cliente',
    description: 'Nome ou identificação do cliente',
    required: true,
  },
  {
    systemField: 'dataEntrada',
    fileField: '',
    label: 'Data de Entrada',
    description: 'Data em que o cliente entrou em risco',
    required: true,
  },
  {
    systemField: 'statusAtual',
    fileField: '',
    label: 'Status Atual',
    description: 'Situação atual do cliente',
    required: true,
  },
  {
    systemField: 'squad',
    fileField: '',
    label: 'Squad',
    description: 'Equipe responsável pelo cliente',
    required: false,
    recommended: true,
  },
  {
    systemField: 'tier',
    fileField: '',
    label: 'Tier',
    description: 'Nível de classificação do cliente',
    required: false,
    recommended: true,
  },
  {
    systemField: 'classificacaoRisco',
    fileField: '',
    label: 'Tipo de Risco',
    description: 'Classificação do tipo de risco',
    required: false,
    recommended: true,
  },
  {
    systemField: 'motivoRisco',
    fileField: '',
    label: 'Motivo do Risco',
    description: 'Razão pela qual o cliente entrou em risco',
    required: false,
    recommended: true,
  },
  {
    systemField: 'mesEntrada',
    fileField: '',
    label: 'Mês de Entrada',
    description:
      'Mês em que o cliente entrou em risco (calculado automaticamente)',
    required: false,
  },
  {
    systemField: 'dataSaida',
    fileField: '',
    label: 'Data de Saída',
    description: 'Data em que o cliente saiu do risco',
    required: false,
  },
  {
    systemField: 'dataCancelamento',
    fileField: '',
    label: 'Data de Cancelamento',
    description: 'Data em que o contrato foi cancelado',
    required: false,
  },
  {
    systemField: 'comentarios',
    fileField: '',
    label: 'Comentários',
    description: 'Observações adicionais sobre o cliente',
    required: false,
  },
];

const DATE_FORMATS = [
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (31/12/2023)' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (12/31/2023)' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (2023-12-31)' },
  { value: 'DD-MM-YYYY', label: 'DD-MM-YYYY (31-12-2023)' },
  { value: 'YYYY/MM/DD', label: 'YYYY/MM/DD (2023/12/31)' },
];

export const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded }) => {
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [fileHeaders, setFileHeaders] = useState<string[]>([]);
  const [mappings, setMappings] = useState<FieldMapping[]>(SYSTEM_FIELDS);
  const [showMappings, setShowMappings] = useState(false);
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if (fileHeaders.length > 0) {
      const newMappings = mappings.map((mapping) => {
        const possibleMatches =
          FIELD_MAPPINGS[mapping.systemField as keyof typeof FIELD_MAPPINGS] ||
          [];
        const matchedHeader = fileHeaders.find((header) =>
          possibleMatches.some((match) =>
            header.toLowerCase().includes(match.toLowerCase())
          )
        );
        return {
          ...mapping,
          fileField: matchedHeader || '',
        };
      });
      setMappings(newMappings);
    }
  }, [fileHeaders]);

  const parseDate = (dateStr: any): string => {
    if (!dateStr) return '';

    const cleanDate = dateStr?.toString().trim();
    if (!cleanDate) return '';

    // Handle Excel date numbers
    if (!isNaN(Number(cleanDate))) {
      const excelDate = new Date(
        Math.round((Number(cleanDate) - 25569) * 86400 * 1000)
      );
      const year = excelDate.getFullYear();
      const month = String(excelDate.getMonth() + 1).padStart(2, '0');
      const day = String(excelDate.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    try {
      let day: string | number, month: string | number, year: string | number;
      const separator = cleanDate.includes('/') ? '/' : '-';
      const parts = cleanDate.split(separator);

      if (parts.length !== 3) return '';

      switch (dateFormat) {
        case 'DD/MM/YYYY':
          [day, month, year] = parts;
          break;
        case 'MM/DD/YYYY':
          [month, day, year] = parts;
          break;
        case 'YYYY-MM-DD':
          [year, month, day] = parts;
          break;
        case 'DD-MM-YYYY':
          [day, month, year] = parts;
          break;
        case 'YYYY/MM/DD':
          [year, month, day] = parts;
          break;
        default:
          return '';
      }

      day = parseInt(day.toString());
      month = parseInt(month.toString());
      year = parseInt(year.toString());

      if (isNaN(day) || isNaN(month) || isNaN(year)) return '';
      if (day < 1 || day > 31) return '';
      if (month < 1 || month > 12) return '';
      if (year < 1900 || year > 2100) return '';

      return `${year}-${month.toString().padStart(2, '0')}-${day
        .toString()
        .padStart(2, '0')}`;
    } catch (error) {
      console.error('Erro ao processar data:', error);
      return '';
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar extensão do arquivo
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (!['csv', 'xlsx', 'xls'].includes(fileExt || '')) {
      setError('Formato de arquivo inválido. Use CSV ou Excel (xlsx/xls).');
      return;
    }

    // Validar tamanho do arquivo (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Arquivo muito grande. O tamanho máximo é 10MB.');
      return;
    }

    setSelectedFile(file);
    setShowMappings(true);
    setError(null);

    if (fileExt === 'csv') {
      Papa.parse(file, {
        header: true,
        preview: 1,
        complete: (results) => {
          if (results.data && results.data.length > 0) {
            setFileHeaders(Object.keys(results.data[0]));
          }
        },
      });
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          if (jsonData && jsonData.length > 0) {
            const headers = jsonData[0] as string[];
            setFileHeaders(headers);
          }
        } catch (error) {
          console.error('Erro ao ler arquivo Excel:', error);
          setError(
            'Erro ao ler o arquivo. Verifique se o formato está correto.'
          );
        }
      };
      reader.readAsBinaryString(file);
    }
  };

  const handleFieldMapping = (
    systemField: keyof RiskEntry,
    fileField: string
  ) => {
    setMappings((prev) =>
      prev.map((mapping) =>
        mapping.systemField === systemField
          ? { ...mapping, fileField }
          : mapping
      )
    );
  };

  const processData = (results: any[]) => {
    try {
      if (!results || results.length === 0) {
        setError('Nenhum dado encontrado no arquivo.');
        return;
      }

      const processedData: RiskEntry[] = results
        .filter((row) => row && Object.keys(row).length > 0)
        .map((row) => {
          const entry: any = {
            mesEntrada: '',
            nomeCliente: '',
            squad: '',
            tier: '',
            classificacaoRisco: '',
            dataEntrada: '',
            dataSaida: '',
            dataCancelamento: '',
            motivoRisco: '',
            statusAtual: '',
            diasEmRisco: 0,
            comentarios: '',
            notas: [],
          };

          mappings.forEach((mapping) => {
            const value = row[mapping.fileField];

            if (mapping.systemField.includes('data')) {
              entry[mapping.systemField] = parseDate(value);
            } else if (mapping.systemField === 'diasEmRisco') {
              entry[mapping.systemField] = parseInt(value) || 0;
            } else if (mapping.systemField === 'mesEntrada') {
              if (value) {
                entry[mapping.systemField] = value;
              } else {
                const dataEntrada =
                  entry.dataEntrada ||
                  parseDate(
                    row[
                      mappings.find((m) => m.systemField === 'dataEntrada')
                        ?.fileField || ''
                    ]
                  );
                if (dataEntrada) {
                  const date = new Date(dataEntrada);
                  entry[mapping.systemField] = date.toLocaleString('pt-BR', {
                    month: 'long',
                  });
                }
              }
            } else {
              entry[mapping.systemField] = value || '';
            }
          });

          return entry as RiskEntry;
        })
        .filter((entry) => entry.nomeCliente && entry.dataEntrada);

      if (processedData.length === 0) {
        setError('Nenhum dado válido encontrado após o processamento.');
        return;
      }

      onDataLoaded(processedData);
      setError(null);
    } catch (error) {
      console.error('Erro ao processar dados:', error);
      setError('Erro ao processar os dados do arquivo.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      setError('Nenhum arquivo selecionado.');
      return;
    }

    const requiredMappings = mappings.filter((m) => m.required);
    const missingMappings = requiredMappings.filter((m) => !m.fileField);

    if (missingMappings.length > 0) {
      setError(
        `Campos obrigatórios não mapeados: ${missingMappings
          .map((m) => m.label)
          .join(', ')}`
      );
      return;
    }

    setIsProcessing(true);
    const fileExt = selectedFile.name.split('.').pop()?.toLowerCase();

    if (fileExt === 'csv') {
      Papa.parse(selectedFile, {
        header: true,
        complete: (results) => {
          if (results.errors && results.errors.length > 0) {
            setError('Erro ao ler o arquivo CSV.');
            setIsProcessing(false);
            return;
          }
          processData(results.data);
        },
      });
    } else if (fileExt === 'xlsx' || fileExt === 'xls') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          processData(jsonData);
        } catch (error) {
          console.error('Erro ao ler arquivo Excel:', error);
          setError('Erro ao ler o arquivo Excel.');
          setIsProcessing(false);
        }
      };
      reader.readAsBinaryString(selectedFile);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="ml-3 text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Importar Dados
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Selecione um arquivo CSV ou Excel para importar os dados dos
              clientes
            </p>
          </div>
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="text-gray-400 hover:text-gray-600"
          >
            <HelpCircle className="w-6 h-6" />
          </button>
        </div>

        {showHelp && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">
              Como preparar seu arquivo:
            </h3>
            <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
              <li>Use arquivos CSV ou Excel (xlsx/xls)</li>
              <li>A primeira linha deve conter os nomes das colunas</li>
              <li>
                Campos obrigatórios: Nome do Cliente, Data de Entrada, Status
                Atual
              </li>
              <li>Datas devem estar em um formato consistente</li>
              <li>Tamanho máximo do arquivo: 10MB</li>
            </ul>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Formato das Datas no Arquivo
          </label>
          <select
            value={dateFormat}
            onChange={(e) => setDateFormat(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {DATE_FORMATS.map((format) => (
              <option key={format.value} value={format.value}>
                {format.label}
              </option>
            ))}
          </select>
        </div>

        <label className="flex flex-col items-center px-4 py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors">
          <Upload className="w-12 h-12 text-blue-500 mb-2" />
          <span className="text-lg font-medium text-gray-700">
            {selectedFile ? selectedFile.name : 'Selecione um arquivo'}
          </span>
          <span className="text-sm text-gray-500 mt-1">
            {selectedFile
              ? `${(selectedFile.size / 1024 / 1024).toFixed(2)}MB`
              : 'CSV ou Excel até 10MB'}
          </span>
          <input
            type="file"
            className="hidden"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileSelect}
          />
        </label>

        {showMappings && fileHeaders.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Mapeamento de Campos</h3>

            <div className="space-y-6">
              {/* Required Fields */}
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-2">
                  Campos Obrigatórios
                </h4>
                <div className="bg-white rounded-lg border border-gray-200">
                  {mappings
                    .filter((m) => m.required)
                    .map((mapping) => (
                      <div
                        key={mapping.systemField}
                        className="p-4 border-b last:border-b-0"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-gray-900">
                              {mapping.label}
                            </p>
                            <p className="text-sm text-gray-500">
                              {mapping.description}
                            </p>
                          </div>
                          <select
                            value={mapping.fileField}
                            onChange={(e) =>
                              handleFieldMapping(
                                mapping.systemField,
                                e.target.value
                              )
                            }
                            className="ml-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          >
                            <option value="">Selecione um campo</option>
                            {fileHeaders.map((header) => (
                              <option key={header} value={header}>
                                {header}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Recommended Fields */}
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-2">
                  Campos Recomendados
                </h4>
                <div className="bg-white rounded-lg border border-gray-200">
                  {mappings
                    .filter((m) => !m.required && m.recommended)
                    .map((mapping) => (
                      <div
                        key={mapping.systemField}
                        className="p-4 border-b last:border-b-0"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-gray-900">
                              {mapping.label}
                            </p>
                            <p className="text-sm text-gray-500">
                              {mapping.description}
                            </p>
                          </div>
                          <select
                            value={mapping.fileField}
                            onChange={(e) =>
                              handleFieldMapping(
                                mapping.systemField,
                                e.target.value
                              )
                            }
                            className="ml-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          >
                            <option value="">Selecione um campo</option>
                            {fileHeaders.map((header) => (
                              <option key={header} value={header}>
                                {header}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Optional Fields */}
              <div>
                <button
                  onClick={() => setShowOptionalFields(!showOptionalFields)}
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  {showOptionalFields ? (
                    <ChevronUp className="w-4 h-4 mr-1" />
                  ) : (
                    <ChevronDown className="w-4 h-4 mr-1" />
                  )}
                  <span className="text-md font-medium">
                    {showOptionalFields
                      ? 'Ocultar Campos Opcionais'
                      : 'Mostrar Campos Opcionais'}
                  </span>
                </button>

                {showOptionalFields && (
                  <div className="mt-2 bg-white rounded-lg border border-gray-200">
                    {mappings
                      .filter((m) => !m.required && !m.recommended)
                      .map((mapping) => (
                        <div
                          key={mapping.systemField}
                          className="p-4 border-b last:border-b-0"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-gray-900">
                                {mapping.label}
                              </p>
                              <p className="text-sm text-gray-500">
                                {mapping.description}
                              </p>
                            </div>
                            <select
                              value={mapping.fileField}
                              onChange={(e) =>
                                handleFieldMapping(
                                  mapping.systemField,
                                  e.target.value
                                )
                              }
                              className="ml-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                              <option value="">Selecione um campo</option>
                              {fileHeaders.map((header) => (
                                <option key={header} value={header}>
                                  {header}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleUpload}
                disabled={isProcessing}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isProcessing ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processando...
                  </>
                ) : (
                  'Processar Arquivo'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};