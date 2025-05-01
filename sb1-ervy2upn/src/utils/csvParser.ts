import { Customer } from '../types';
import { DateFormat, parseDateString } from './dateFormats';

export interface CSVParseResult {
  success: boolean;
  data?: Omit<Customer, 'id'>[];
  error?: string;
  invalidRows?: Array<{
    line: number;
    content: string;
    reason: string;
  }>;
}

export const parseCSVData = (
  csvText: string, 
  dateFormat: DateFormat
): CSVParseResult => {
  try {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      return {
        success: false,
        error: 'O arquivo CSV deve conter um cabeçalho e pelo menos uma linha de dados'
      };
    }

    const header = lines[0].split(',').map(col => col.trim().toLowerCase());
    
    // Mapear índices das colunas
    const columnIndices: Record<string, number> = {
      nome: header.findIndex(col => col.includes('nome') || col.includes('name')),
      tier: header.findIndex(col => col.includes('tier') || col.includes('nivel')),
      mrr: header.findIndex(col => col.includes('mrr') || col.includes('receita')),
      produto: header.findIndex(col => col.includes('produto') || col.includes('product')),
      ultimoContato: header.findIndex(col => col.includes('ultimocontato') || col.includes('lastcontact')),
      categoriaContato: header.findIndex(col => col.includes('categoriacontato') || col.includes('tipo')),
      atualizacoes: header.findIndex(col => col.includes('atualizacoes') || col.includes('updates')),
      proximoContato: header.findIndex(col => col.includes('proximocontato') || col.includes('nextcontact')),
      diasSemTouch: header.findIndex(col => col.includes('diassemtouch') || col.includes('dayswithout')),
      
      // Campos RFV
      dataUltimaCompra: header.findIndex(col => col.includes('dataultimacompra') || col.includes('lastpurchase')),
      quantidadeCompras: header.findIndex(col => col.includes('quantidadecompras') || col.includes('frequency')),
      valorTotalCompras: header.findIndex(col => col.includes('valortotalcompras') || col.includes('totalvalue')),
      
      // Campos Gestão de Risco
      mesEntradaRisco: header.findIndex(col => col.includes('mesentrada') || col.includes('riskmonth')),
      squad: header.findIndex(col => col.includes('squad') || col.includes('equipe')),
      classificacaoRisco: header.findIndex(col => col.includes('classificacao') || col.includes('risklevel')),
      dataEntradaRisco: header.findIndex(col => col.includes('dataentrada') || col.includes('riskentry')),
      dataSaidaRisco: header.findIndex(col => col.includes('datasaida') || col.includes('riskexit')),
      dataCancelamento: header.findIndex(col => col.includes('datacancelamento') || col.includes('cancellation')),
      motivoRisco: header.findIndex(col => col.includes('motivo') || col.includes('reason')),
      statusAtual: header.findIndex(col => col.includes('status') || col.includes('currentstatus')),
      diasEmRisco: header.findIndex(col => col.includes('diasemrisco') || col.includes('daysatrisk')),
      comentarios: header.findIndex(col => col.includes('comentarios') || col.includes('comments')),
      
      // Campos para análise de cohort
      entryDate: header.findIndex(col => col.includes('entry') || col.includes('entrada')),
      exitDate: header.findIndex(col => col.includes('exit') || col.includes('saida')),
      segment: header.findIndex(col => col.includes('segment') || col.includes('segmento')),
    };

    // Verificar se pelo menos o nome está presente
    if (columnIndices.nome === -1) {
      return {
        success: false,
        error: 'O CSV deve conter uma coluna para nome do cliente'
      };
    }

    const invalidRows: Array<{line: number; content: string; reason: string}> = [];
    const validData: Omit<Customer, 'id'>[] = [];

    lines.slice(1).forEach((line, index) => {
      if (!line.trim()) return;

      try {
        const columns = line.split(',').map(col => col.trim());
        
        // Criar objeto cliente
        const customer: Partial<Customer> = {
          Nome: columnIndices.nome >= 0 ? columns[columnIndices.nome] : '',
          Tier: columnIndices.tier >= 0 ? columns[columnIndices.tier] : '',
          MRR: columnIndices.mrr >= 0 ? columns[columnIndices.mrr] : '',
          Produto: columnIndices.produto >= 0 ? columns[columnIndices.produto] : '',
          UltimoContato: columnIndices.ultimoContato >= 0 ? formatDateValue(columns[columnIndices.ultimoContato], dateFormat) : '',
          CategoriaContato: columnIndices.categoriaContato >= 0 ? columns[columnIndices.categoriaContato] : '',
          Atualizacoes: columnIndices.atualizacoes >= 0 ? columns[columnIndices.atualizacoes] : '',
          ProximoContato: columnIndices.proximoContato >= 0 ? formatDateValue(columns[columnIndices.proximoContato], dateFormat) : '',
          DiasSemTouch: columnIndices.diasSemTouch >= 0 ? parseFloat(columns[columnIndices.diasSemTouch]) : undefined,
          
          // Campos RFV
          DataUltimaCompra: columnIndices.dataUltimaCompra >= 0 ? formatDateValue(columns[columnIndices.dataUltimaCompra], dateFormat) : '',
          QuantidadeCompras: columnIndices.quantidadeCompras >= 0 ? columns[columnIndices.quantidadeCompras] : '',
          ValorTotalCompras: columnIndices.valorTotalCompras >= 0 ? columns[columnIndices.valorTotalCompras] : '',
          
          // Campos Gestão de Risco
          MesEntradaRisco: columnIndices.mesEntradaRisco >= 0 ? columns[columnIndices.mesEntradaRisco] : '',
          Squad: columnIndices.squad >= 0 ? columns[columnIndices.squad] : '',
          ClassificacaoRisco: columnIndices.classificacaoRisco >= 0 ? columns[columnIndices.classificacaoRisco] : '',
          DataEntradaRisco: columnIndices.dataEntradaRisco >= 0 ? formatDateValue(columns[columnIndices.dataEntradaRisco], dateFormat) : '',
          DataSaidaRisco: columnIndices.dataSaidaRisco >= 0 ? formatDateValue(columns[columnIndices.dataSaidaRisco], dateFormat) : '',
          DataCancelamento: columnIndices.dataCancelamento >= 0 ? formatDateValue(columns[columnIndices.dataCancelamento], dateFormat) : '',
          MotivoRisco: columnIndices.motivoRisco >= 0 ? columns[columnIndices.motivoRisco] : '',
          StatusAtual: columnIndices.statusAtual >= 0 ? columns[columnIndices.statusAtual] : '',
          
          // Campos para análise de cohort
          entryDate: columnIndices.entryDate >= 0 ? formatDateValue(columns[columnIndices.entryDate], dateFormat) : '',
          exitDate: columnIndices.exitDate >= 0 ? formatDateValue(columns[columnIndices.exitDate], dateFormat) : '',
          segment: columnIndices.segment >= 0 ? columns[columnIndices.segment] : '',
          
          // Inicializar array de atividades vazio
          atividades: [],
        };

        // Validar nome (obrigatório)
        if (!customer.Nome) {
          invalidRows.push({
            line: index + 2,
            content: line,
            reason: 'Nome do cliente é obrigatório'
          });
          return;
        }

        // Calcular DiasSemTouch se não estiver definido mas tiver UltimoContato
        if (customer.UltimoContato && customer.DiasSemTouch === undefined) {
          try {
            const lastContact = new Date(customer.UltimoContato);
            const today = new Date();
            const diffTime = Math.abs(today.getTime() - lastContact.getTime());
            customer.DiasSemTouch = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          } catch (error) {
            // Se não conseguir calcular, deixa undefined
          }
        }

        validData.push(customer as Customer);
      } catch (error) {
        invalidRows.push({
          line: index + 2,
          content: line,
          reason: error instanceof Error ? error.message : 'Formato de dados inválido'
        });
      }
    });

    if (invalidRows.length > 0 && validData.length === 0) {
      return {
        success: false,
        error: `Encontradas ${invalidRows.length} linhas inválidas e nenhuma linha válida`,
        invalidRows,
      };
    }

    return {
      success: true,
      data: validData,
      invalidRows: invalidRows.length > 0 ? invalidRows : undefined
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Falha ao processar dados do CSV'
    };
  }
};

// Função auxiliar para formatar datas
function formatDateValue(value: string, format: DateFormat): string {
  if (!value) return '';
  
  try {
    // Tentar converter datas do Excel (números) para formato ISO
    if (!isNaN(Number(value))) {
      const excelDate = new Date(Math.round((Number(value) - 25569) * 86400 * 1000));
      return excelDate.toISOString();
    }
    
    // Tentar converter usando o formato especificado
    const date = parseDateString(value, format);
    return date.toISOString();
  } catch (e) {
    // Se falhar, retornar o valor original
    return value;
  }
}