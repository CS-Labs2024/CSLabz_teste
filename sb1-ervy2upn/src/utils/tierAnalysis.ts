import { Customer } from '../types';
import { TierAnalysis, TierKPIs } from '../types/tier';
import { calculateMonthsBetween } from './dateUtils';

export function analyzeTierMetrics(customers: Customer[]): TierAnalysis {
  const tierMap = new Map<string, Customer[]>();
  
  // Group customers by tier
  customers.forEach(customer => {
    const tier = customer.tier || 'Unassigned';
    if (!tierMap.has(tier)) {
      tierMap.set(tier, []);
    }
    tierMap.get(tier)!.push(customer);
  });

  const tiers: TierKPIs[] = Array.from(tierMap.entries()).map(([name, customers]) => {
    const active = customers.filter(c => !c.exitDate);
    const churned = customers.filter(c => c.exitDate);
    const earlyChurned = churned.filter(customer => {
      const months = calculateMonthsBetween(
        new Date(customer.entryDate),
        new Date(customer.exitDate!)
      );
      return months <= 3;
    });

    const lifetimeMonths = customers
      .filter(c => c.exitDate)
      .map(c => calculateMonthsBetween(
        new Date(c.entryDate),
        new Date(c.exitDate!)
      ));

    const averageLifetime = lifetimeMonths.length > 0
      ? Math.round(lifetimeMonths.reduce((a, b) => a + b, 0) / lifetimeMonths.length)
      : 0;

    return {
      name,
      totalCustomers: customers.length,
      activeCustomers: active.length,
      churnedCustomers: churned.length,
      retentionRate: customers.length > 0 ? Math.round((active.length / customers.length) * 100) : 0,
      averageLifetimeMonths: averageLifetime,
      earlyChurnRate: customers.length > 0 ? Math.round((earlyChurned.length / customers.length) * 100) : 0
    };
  });

  return {
    tiers: tiers.sort((a, b) => b.totalCustomers - a.totalCustomers),
    totalCustomers: customers.length
  };
}