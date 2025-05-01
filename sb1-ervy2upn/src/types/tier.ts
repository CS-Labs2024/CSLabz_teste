export interface TierKPIs {
  name: string;
  totalCustomers: number;
  activeCustomers: number;
  churnedCustomers: number;
  retentionRate: number;
  averageLifetimeMonths: number;
  earlyChurnRate: number;
}

export interface TierAnalysis {
  tiers: TierKPIs[];
  totalCustomers: number;
}