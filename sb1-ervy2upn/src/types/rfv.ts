export interface RFVCustomer {
  id: string;
  name: string;
  recency: number; // days since last purchase
  frequency: number; // number of purchases
  value: number; // average purchase value
  
  // Optional fields
  segment?: string;
  channel?: string;
  region?: string;
  totalValue?: number;
  lastPurchase?: string;
}

export interface RFVScore {
  r: number;
  f: number;
  v: number;
  segment: string;
}

export interface RFVMetrics {
  avgRecency: number;
  avgFrequency: number;
  avgValue: number;
  totalRevenue: number;
}