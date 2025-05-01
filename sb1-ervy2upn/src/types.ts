import { Activity } from './types/activity';

export interface Customer {
  id?: string;
  Nome: string;
  Tier: string;
  MRR: string;
  Produto: string;
  UltimoContato: string;
  CategoriaContato: string;
  Atualizacoes: string;
  ProximoContato: string;
  DiasSemTouch?: number;
  emRisco?: boolean;
  atividades?: Activity[];
  
  // Campos adicionais para RFV
  DataUltimaCompra?: string;
  QuantidadeCompras?: string;
  ValorTotalCompras?: string;
  
  // Campos adicionais para Gestão de Risco
  MesEntradaRisco?: string;
  Squad?: string;
  ClassificacaoRisco?: string;
  DataEntradaRisco?: string;
  DataSaidaRisco?: string;
  DataCancelamento?: string;
  MotivoRisco?: string;
  StatusAtual?: string;
  DiasEmRisco?: number;
  Comentarios?: string;
  
  // Campos adicionais para análise de cohort
  name?: string;
  entryDate?: Date | string;
  exitDate?: Date | string | null;
  segment?: string;
  tier?: string;
}

export interface RiskConfig {
  diasSemContato: number;
  tierRisks: Record<string, number>;
}

export interface FilterState {
  dateRange: {
    start: string;
    end: string;
  };
  segment: string;
  tier: string;
}