import { Upload } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Customer } from '../types';
import * as XLSX from 'xlsx';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '/src/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Label } from '../components/ui/label';

interface FileUploadProps {
  onUpload: (data: Customer[]) => void;
}

const EXPECTED_COLUMNS = {
  Nome: ['Nome do Cliente', 'Nome', 'name', 'customer'],
  Tier: ['Tier', 'tier', 'nivel', 'segmento'],
  MRR: ['MRR', 'mrr', 'receita', 'revenue'],
  Produto: ['Produto', 'product', 'servico', 'service'],
  UltimoContato: ['Ultimo Contato', 'UltimoContato', 'Último Contato', 'lastcontact'],
  CategoriaContato: ['Categoria do Contato', 'CategoriaContato', 'tipo', 'category'],
  Atualizacoes: ['Atualizações', 'Atualizacoes', 'updates', 'notas'],
  ProximoContato: [
    'Proximo Contato Agendado',
    'ProximoContato',
    'Próximo Contato',
    'nextcontact',
  ],
  DiasSemTouch: ['Dias sem Touch', 'DiasSemTouch', 'dayswithoutcontact'],
  DataUltimaCompra: ['DataUltimaCompra', 'LastPurchase', 'UltimaCompra', 'lastpurchasedate'],
  QuantidadeCompras: ['QuantidadeCompras', 'Frequency', 'Frequencia', 'purchasecount'],
  ValorTotalCompras: ['ValorTotalCompras', 'TotalValue', 'ValorTotal', 'totalspent'],
  MesEntradaRisco: ['Mês de Entrada no Risco', 'MesEntradaRisco', 'riskentrymonth'],
  Squad: ['Squad', 'Equipe', 'Team', 'team'],
  ClassificacaoRisco: ['Classificação de Risco', 'ClassificacaoRisco', 'risklevel'],
  DataEntradaRisco: ['Data de Entrada no Risco', 'DataEntradaRisco', 'riskentrydate'],
  DataSaidaRisco: ['Data de Saída do Risco', 'DataSaidaRisco', 'riskexitdate'],
  DataCancelamento: ['Data do Cancelamento', 'DataCancelamento', 'cancellationdate'],
  MotivoRisco: ['Motivo do Risco', 'MotivoRisco', 'riskreason'],
  StatusAtual: ['Status Atual', 'StatusAtual', 'currentstatus'],
  DiasEmRisco: ['Dias em Risco', 'DiasEmRisco', 'daysatrisk'],
  Comentarios: ['Comentários', 'Comentarios', 'comments'],
  entryDate: ['Entry Date', 'EntryDate', 'dataentrada'],
  exitDate: ['Exit Date', 'ExitDate', 'datasaida'],
  segment: ['Segment', 'Segmento', 'segment'],
} as const;

type ColumnMapping = {
  [K in keyof typeof EXPECTED_COLUMNS]?: string;
};

export default function FileUpload({ onUpload }: FileUploadProps) {
  const [showMapping, setShowMapping] = useState(false);
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({});
  const [workbookData, setWorkbookData] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccess(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const rawData = XLSX.utils.sheet_to_json(worksheet, {
        raw: true,
      }) as any[];
      setWorkbookData(rawData);

      // Get available columns from the first row
      if (rawData.length > 0) {
        const columns = Object.keys(rawData[0]);
        setAvailableColumns(columns);

        // Try to automatically map columns
        const initialMapping: ColumnMapping = {};
        Object.entries(EXPECTED_COLUMNS).forEach(([key, possibleNames]) => {
          const matchedColumn = columns.find((col) =>
            possibleNames.some(
              (name) => col.toLowerCase() === name.toLowerCase()
            )
          );
          if (matchedColumn) {
            initialMapping[key as keyof typeof EXPECTED_COLUMNS] =
              matchedColumn;
          }
        });
        setColumnMapping(initialMapping);
      }

      setShowMapping(true);
    };
    reader.readAsBinaryString(file);
  };

  const handleFieldMapping = (
    systemField: keyof typeof EXPECTED_COLUMNS,
    fileField: string
  ) => {
    setColumnMapping((prev) =>
      prev[systemField] === fileField
        ? { ...prev, [systemField]: undefined }
        : { ...prev, [systemField]: fileField }
    );
  };

  const processData = () => {
    try {
      if (!workbookData || workbookData.length === 0) {
        setError('Nenhum dado encontrado no arquivo.');
        return;
      }

      const processedData: Customer[] = workbookData
        .filter((row) => row && Object.keys(row).length > 0)
        .map((row) => {
          const entry: any = {
            Nome: '',
            Tier: '',
            MRR: '',
            Produto: '',
            UltimoContato: '',
            CategoriaContato: '',
            Atualizacoes: '',
            ProximoContato: '',
            DiasSemTouch: undefined,
            atividades: [],
            // Campos adicionais para RFV
            DataUltimaCompra: '',
            QuantidadeCompras: '',
            ValorTotalCompras: '',
            // Campos adicionais para Gestão de Risco
            MesEntradaRisco: '',
            Squad: '',
            ClassificacaoRisco: '',
            DataEntradaRisco: '',
            DataSaidaRisco: '',
            DataCancelamento: '',
            MotivoRisco: '',
            StatusAtual: '',
            DiasEmRisco: undefined,
            Comentarios: '',
            // Campos adicionais para Cohort
            entryDate: '',
            exitDate: '',
            segment: '',
          };

          // Mapear campos do arquivo para os campos do sistema
          Object.entries(columnMapping).forEach(([systemField, fileField]) => {
            if (fileField && row[fileField] !== undefined) {
              const value = row[fileField];

              // Processar campos de data
              if (
                [
                  'UltimoContato',
                  'ProximoContato',
                  'DataUltimaCompra',
                  'DataEntradaRisco',
                  'DataSaidaRisco',
                  'DataCancelamento',
                  'entryDate',
                  'exitDate',
                ].includes(systemField)
              ) {
                entry[systemField] = formatDate(value);
              }
              // Processar campos numéricos
              else if (
                [
                  'DiasSemTouch',
                  'QuantidadeCompras',
                  'ValorTotalCompras',
                  'DiasEmRisco',
                ].includes(systemField)
              ) {
                entry[systemField] = parseNumericValue(value);
              }
              // Processar MRR (valor monetário)
              else if (systemField === 'MRR') {
                entry[systemField] = parseMonetaryValue(value);
              }
              // Outros campos como texto
              else {
                entry[systemField] = value?.toString() || '';
              }
            }
          });

          // Calcular DiasSemTouch se não estiver definido mas tiver UltimoContato
          if (entry.UltimoContato && entry.DiasSemTouch === undefined) {
            const lastContact = new Date(entry.UltimoContato);
            const today = new Date();
            const diffTime = Math.abs(today.getTime() - lastContact.getTime());
            entry.DiasSemTouch = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          }

          return entry as Customer;
        })
        .filter((entry) => entry.Nome); // Filtrar entradas sem nome

      if (processedData.length === 0) {
        setError('Nenhum dado válido encontrado após o processamento.');
        return;
      }

      onUpload(processedData);
      setSuccess(`${processedData.length} clientes importados com sucesso!`);
      setShowMapping(false);
      setWorkbookData(null);
      setColumnMapping({});
    } catch (error) {
      console.error('Erro ao processar dados:', error);
      setError('Erro ao processar os dados do arquivo.');
    }
  };

  // Funções auxiliares para formatação de dados
  const formatDate = (value: any): string => {
    if (!value) return '';

    // Lidar com datas do Excel (números)
    if (typeof value === 'number') {
      const date = XLSX.SSF.parse_date_code(value);
      return new Date(date.y, date.m - 1, date.d).toISOString();
    }

    try {
      const date = new Date(value);
      return date.toISOString();
    } catch {
      return value.toString();
    }
  };

  const parseNumericValue = (value: any): number | undefined => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const cleaned = value.replace(/[^\d.-]/g, '');
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? undefined : parsed;
    }
    return undefined;
  };

  const parseMonetaryValue = (value: any): string => {
    if (!value) return '0';
    
    if (typeof value === 'number') {
      return value.toString();
    }
    
    if (typeof value === 'string') {
      // Remover símbolos de moeda, pontos de milhar, etc.
      const cleaned = value.replace(/[^\d.-]/g, '');
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? '0' : parsed.toString();
    }
    
    return '0';
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg border-primary/20 hover:border-primary/40 transition-colors">
        <Upload className="h-12 w-12 text-primary mb-4" />
        <h2 className="text-xl font-semibold mb-2">
          Importar Dados dos Clientes
        </h2>
        <p className="text-sm text-muted-foreground mb-4 text-center">
          Arraste e solte seu arquivo XLS ou CSV aqui, ou clique para selecionar
        </p>
        <Button asChild>
          <label className="cursor-pointer">
            Escolher Arquivo
            <input
              type="file"
              className="hidden"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
            />
          </label>
        </Button>
      </div>

      <Dialog open={showMapping} onOpenChange={setShowMapping}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Mapear Colunas do Arquivo</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <h3 className="font-medium text-blue-900 mb-2">
                Formato esperado:
              </h3>
              <p className="text-sm text-blue-800 mb-2">
                Mapeie as colunas do seu arquivo para os campos do sistema. Os campos marcados com * são obrigatórios.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-2">
              <div className="font-medium text-gray-700">Campo do Sistema</div>
              <div className="font-medium text-gray-700">Coluna no Arquivo</div>
            </div>

            {/* Campos obrigatórios */}
            <div className="border rounded-lg p-4 mb-4">
              <h4 className="font-medium text-gray-700 mb-2">Campos Obrigatórios</h4>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 items-center">
                  <div className="text-gray-700">
                    Nome <span className="text-red-500">*</span>
                  </div>
                  <Select
                    value={columnMapping.Nome}
                    onValueChange={(value) => handleFieldMapping('Nome', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma coluna" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Nenhuma</SelectItem>
                      {availableColumns.map((column) => (
                        <SelectItem key={column} value={column}>
                          {column}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Campos para análise de clientes */}
            <div className="border rounded-lg p-4 mb-4">
              <h4 className="font-medium text-gray-700 mb-2">Dados do Cliente</h4>
              <div className="space-y-3">
                {['Tier', 'MRR', 'Produto', 'UltimoContato', 'CategoriaContato', 'Atualizacoes', 'ProximoContato', 'DiasSemTouch'].map((field) => (
                  <div key={field} className="grid grid-cols-2 gap-4 items-center">
                    <div className="text-gray-700">{field}</div>
                    <Select
                      value={columnMapping[field as keyof typeof EXPECTED_COLUMNS]}
                      onValueChange={(value) => handleFieldMapping(field as keyof typeof EXPECTED_COLUMNS, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma coluna" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Nenhuma</SelectItem>
                        {availableColumns.map((column) => (
                          <SelectItem key={column} value={column}>
                            {column}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>

            {/* Campos para análise RFV */}
            <div className="border rounded-lg p-4 mb-4">
              <h4 className="font-medium text-gray-700 mb-2">Dados para Análise RFV</h4>
              <div className="space-y-3">
                {['DataUltimaCompra', 'QuantidadeCompras', 'ValorTotalCompras'].map((field) => (
                  <div key={field} className="grid grid-cols-2 gap-4 items-center">
                    <div className="text-gray-700">{field}</div>
                    <Select
                      value={columnMapping[field as keyof typeof EXPECTED_COLUMNS]}
                      onValueChange={(value) => handleFieldMapping(field as keyof typeof EXPECTED_COLUMNS, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma coluna" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Nenhuma</SelectItem>
                        {availableColumns.map((column) => (
                          <SelectItem key={column} value={column}>
                            {column}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>

            {/* Campos para gestão de risco */}
            <div className="border rounded-lg p-4 mb-4">
              <h4 className="font-medium text-gray-700 mb-2">Dados para Gestão de Risco</h4>
              <div className="space-y-3">
                {['MesEntradaRisco', 'Squad', 'ClassificacaoRisco', 'DataEntradaRisco', 'DataSaidaRisco', 'DataCancelamento', 'MotivoRisco', 'StatusAtual', 'DiasEmRisco', 'Comentarios'].map((field) => (
                  <div key={field} className="grid grid-cols-2 gap-4 items-center">
                    <div className="text-gray-700">{field}</div>
                    <Select
                      value={columnMapping[field as keyof typeof EXPECTED_COLUMNS]}
                      onValueChange={(value) => handleFieldMapping(field as keyof typeof EXPECTED_COLUMNS, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma coluna" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Nenhuma</SelectItem>
                        {availableColumns.map((column) => (
                          <SelectItem key={column} value={column}>
                            {column}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>

            {/* Campos para análise de cohort */}
            <div className="border rounded-lg p-4 mb-4">
              <h4 className="font-medium text-gray-700 mb-2">Dados para Análise de Cohort</h4>
              <div className="space-y-3">
                {['entryDate', 'exitDate', 'segment'].map((field) => (
                  <div key={field} className="grid grid-cols-2 gap-4 items-center">
                    <div className="text-gray-700">{field}</div>
                    <Select
                      value={columnMapping[field as keyof typeof EXPECTED_COLUMNS]}
                      onValueChange={(value) => handleFieldMapping(field as keyof typeof EXPECTED_COLUMNS, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma coluna" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Nenhuma</SelectItem>
                        {availableColumns.map((column) => (
                          <SelectItem key={column} value={column}>
                            {column}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>

            {/* Preview dos dados */}
            {workbookData && workbookData.length > 0 && (
              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-700 mb-2">Preview dos Dados</h4>
                <div className="overflow-x-auto max-h-60">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {availableColumns.map((header) => (
                          <th
                            key={header}
                            className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {workbookData.slice(0, 5).map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {availableColumns.map((header) => (
                            <td
                              key={`${rowIndex}-${header}`}
                              className="px-3 py-2 whitespace-nowrap text-xs text-gray-500"
                            >
                              {row[header]?.toString() || ''}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={processData} className="bg-[#00FFC6] text-[#002b28] hover:bg-[#00FFC6]/90">
              Importar Dados
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}