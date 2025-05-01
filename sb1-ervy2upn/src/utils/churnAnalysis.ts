import { Customer } from '../types';
import { calculateMonthsBetween } from './dateUtils';

export const calculateChurnStats = (customers: Customer[], earlyChurnMonths: number) => {
  const totalCustomers = customers.length;
  const churnedCustomers = customers.filter(c => c.exitDate !== null);
  
  // Early Churn Analysis
  const earlyChurnCustomers = churnedCustomers.filter(customer => {
    const monthsDiff = calculateMonthsBetween(
      new Date(customer.entryDate),
      new Date(customer.exitDate!)
    );
    return monthsDiff < earlyChurnMonths;
  });

  // Segment Churn Analysis
  const segmentStats = customers.reduce((acc: { [key: string]: { total: number; churned: number } }, customer) => {
    const segment = customer.segment || 'Não especificado';
    
    if (!acc[segment]) {
      acc[segment] = { total: 0, churned: 0 };
    }
    
    acc[segment].total++;
    if (customer.exitDate) {
      acc[segment].churned++;
    }
    
    return acc;
  }, {});

  // Calculate percentages
  const segmentChurn = Object.entries(segmentStats).reduce((acc, [segment, stats]) => {
    acc[segment] = {
      ...stats,
      percentage: stats.total > 0 ? Math.round((stats.churned / stats.total) * 100) : 0
    };
    return acc;
  }, {} as { [key: string]: { total: number; churned: number; percentage: number } });

  return {
    earlyChurn: {
      count: earlyChurnCustomers.length,
      percentage: totalCustomers > 0 ? Math.round((earlyChurnCustomers.length / totalCustomers) * 100) : 0
    },
    segmentChurn
  };
};