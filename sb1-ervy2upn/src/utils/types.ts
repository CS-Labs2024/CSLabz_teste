import { LucideIcon } from 'lucide-react';

export interface RiskEntry {
  mesEntrada: string;
  nomeCliente: string;
  squad: string;
  tier: string;
  classificacaoRisco: string;
  dataEntrada: string;
  dataSaida: string;
  dataCancelamento: string;
  motivoRisco: string;
  statusAtual: string;
  diasEmRisco: number;
  comentarios: string;
  notas: Note[];
  ultimoTouchpoint?: string;
}

export interface Note {
  id: string;
  texto: string;
  autor: string;
  data: string;
  categoria: NoteCategory;
}

export type NoteCategory =
  | 'Contato'
  | 'Negociação'
  | 'Alerta'
  | 'Atualização'
  | 'Resolução'
  | 'Outro';

export interface KPIData {
  reversalRate: number;
  averageDaysInRisk: number;
  totalClients: number;
  activeRisks: number;
  resolvedRisks: number;
  canceledContracts: number;
  cancellationRate: number;
  risksBySquad: { [key: string]: number };
  risksByTier: { [key: string]: number };
  statusDistribution: { [key: string]: number };
  risksByMonth: { [key: string]: number };
  averageTimeToResolution: number;
  clientsWithoutTouchpoint: number;
  averageTouchpointInterval: number;
}

export interface KPIConfig {
  id: string;
  label: string;
  visible: boolean;
  category: 'performance' | 'risk' | 'engagement';
  format?: 'percentage' | 'number' | 'days';
  color?: string;
}
