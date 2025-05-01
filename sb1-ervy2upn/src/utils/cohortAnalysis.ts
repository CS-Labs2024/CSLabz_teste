import { Customer, CohortData } from '../types';
import { calculateMonthsBetween } from './dateUtils';

export const calculateCohortMatrix = (customers: Customer[]): CohortData[] => {
  // Group customers by entry month
  const cohortGroups = customers.reduce((groups: { [key: string]: Customer[] }, customer) => {
    const date = new Date(customer.entryDate);
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }
    groups[monthYear].push(customer);
    return groups;
  }, {});

  // Sort cohorts chronologically
  const sortedPeriods = Object.keys(cohortGroups).sort();
  
  // Calculate retention for each cohort
  return sortedPeriods.map(period => {
    const cohortCustomers = cohortGroups[period];
    const retention = Array(12).fill(0).map((_, monthIndex) => {
      const activeInMonth = cohortCustomers.filter(customer => {
        const entryDate = new Date(customer.entryDate);
        const monthEnd = new Date(entryDate);
        monthEnd.setMonth(entryDate.getMonth() + monthIndex + 1);
        monthEnd.setDate(0); // Last day of the target month

        // Customer is active if they haven't churned or churned after this month
        if (!customer.exitDate) {
          return true; // Still active
        }

        const exitDate = new Date(customer.exitDate);
        return exitDate > monthEnd;
      });

      return Math.round((activeInMonth.length / cohortCustomers.length) * 100);
    });

    return {
      period,
      customerCount: cohortCustomers.length,
      retention
    };
  });
};