export interface Customer {
  id: string;
  name: string;
  entryDate: Date;
  exitDate: Date | null;
  segment?: string;
  tier?: string;
}

export interface CohortData {
  period: string;
  customerCount: number;
  retention: number[];
}

export interface CustomerLifetimeStats {
  averageLifetimeDays: number;
  averageLifetimeMonths: number;
  totalCustomers: number;
}

export interface FilterState {
  dateRange: {
    start: string;
    end: string;
  };
  segment: string;
  tier: string;
}