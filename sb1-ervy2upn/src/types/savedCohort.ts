import { FilterState } from './index';

export interface SavedCohort {
  id: string;
  name: string;
  description?: string;
  dateCreated: Date;
  filters: FilterState;
  stats: {
    totalCustomers: number;
    averageLifetimeMonths: number;
    churnRate: number;
    activeCustomers: number;
    churnedCustomers: number;
  };
}