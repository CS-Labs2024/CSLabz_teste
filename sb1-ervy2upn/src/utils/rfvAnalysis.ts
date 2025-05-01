import { RFVCustomer, RFVScore, RFVMetrics } from '../types/rfv';

export const calculateRFVScore = (customer: RFVCustomer): RFVScore => {
  // R score (1-5, 5 being most recent)
  const rScore = 5 - Math.min(5, Math.floor(customer.recency / 73));

  // F score (1-5, 5 being highest frequency)
  const fScore = Math.min(5, Math.ceil(customer.frequency / 10));

  // V score (1-5, 5 being highest value)
  const vScore = Math.min(5, Math.ceil(customer.value / 200));

  // Determine segment based on scores
  let segment = 'At Risk';
  const total = rScore + fScore + vScore;

  if (total >= 12) segment = 'Champions';
  else if (total >= 9) segment = 'Loyal';
  else if (total >= 6) segment = 'Potential';
  else segment = 'At Risk';

  return { r: rScore, f: fScore, v: vScore, segment };
};

export const calculateRFVMetrics = (customers: RFVCustomer[]): RFVMetrics => {
  if (customers.length === 0) {
    return {
      avgRecency: 0,
      avgFrequency: 0,
      avgValue: 0,
      totalRevenue: 0,
    };
  }

  const avgRecency =
    customers.reduce((sum, c) => sum + c.recency, 0) / customers.length;
  const avgFrequency =
    customers.reduce((sum, c) => sum + c.frequency, 0) / customers.length;
  const avgValue =
    customers.reduce((sum, c) => sum + c.value, 0) / customers.length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalValue, 0);

  return {
    avgRecency: Math.round(avgRecency),
    avgFrequency: Math.round(avgFrequency * 10) / 10,
    avgValue: Math.round(avgValue),
    totalRevenue,
  };
};

export const generateRFVMatrix = (customers: RFVCustomer[]): number[][] => {
  // Create a 5x5 matrix initialized with zeros
  const matrix = Array(5).fill(0).map(() => Array(5).fill(0));
  
  customers.forEach(customer => {
    const score = calculateRFVScore(customer);
    // Adjust indices to 0-based (scores are 1-5)
    const rIndex = 5 - score.r; // Invert so 5 (most recent) is at the top
    const fIndex = score.f - 1;
    
    // Increment the count in the appropriate cell
    if (rIndex >= 0 && rIndex < 5 && fIndex >= 0 && fIndex < 5) {
      matrix[rIndex][fIndex]++;
    }
  });
  
  return matrix;
};

export const getSegmentDistribution = (customers: RFVCustomer[]): Record<string, number> => {
  const distribution: Record<string, number> = {
    'Champions': 0,
    'Loyal': 0,
    'Potential': 0,
    'At Risk': 0
  };
  
  customers.forEach(customer => {
    const score = calculateRFVScore(customer);
    distribution[score.segment]++;
  });
  
  return distribution;
};