import { Customer } from '../types';

export const calculateCohortStats = (customers: Customer[]) => {
  const totalCustomers = customers.length;
  const churnedCustomers = customers.filter(customer => customer.exitDate !== null).length;
  const activeCustomers = totalCustomers - churnedCustomers;
  
  return {
    totalCustomers,
    churnedCustomers,
    activeCustomers,
    churnRate: totalCustomers > 0 ? Math.round((churnedCustomers / totalCustomers) * 100) : 0,
    averageLifetimeMonths: calculateAverageLifetime(customers)
  };
};

const calculateAverageLifetime = (customers: Customer[]) => {
  const now = new Date();
  
  const lifetimes = customers.map(customer => {
    const start = new Date(customer.entryDate);
    const end = customer.exitDate ? new Date(customer.exitDate) : now;
    const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                  (end.getMonth() - start.getMonth());
    return months;
  });

  const totalMonths = lifetimes.reduce((sum, months) => sum + months, 0);
  return customers.length > 0 ? Math.round(totalMonths / customers.length) : 0;
};