import { Customer, CustomerLifetimeStats } from '../types';
import { calculateDaysBetween, calculateMonthsBetween } from './dateUtils';

export const calculateCustomerLifetimeStats = (customers: Customer[]): CustomerLifetimeStats => {
  const customersWithLifetime = customers.filter(c => c.exitDate !== null);
  
  if (customersWithLifetime.length === 0) {
    return {
      averageLifetimeDays: 0,
      averageLifetimeMonths: 0,
      totalCustomers: 0
    };
  }

  const lifetimes = customersWithLifetime.map(customer => ({
    days: calculateDaysBetween(customer.entryDate, customer.exitDate!),
    months: calculateMonthsBetween(customer.entryDate, customer.exitDate!)
  }));

  const totalDays = lifetimes.reduce((sum, lt) => sum + lt.days, 0);
  const totalMonths = lifetimes.reduce((sum, lt) => sum + lt.months, 0);

  return {
    averageLifetimeDays: Math.round(totalDays / customersWithLifetime.length),
    averageLifetimeMonths: Math.round(totalMonths / customersWithLifetime.length),
    totalCustomers: customersWithLifetime.length
  };
};