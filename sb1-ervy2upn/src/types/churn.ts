export interface ChurnStats {
  earlyChurn: {
    count: number;
    percentage: number;
  };
  segmentChurn: {
    [segment: string]: {
      total: number;
      churned: number;
      percentage: number;
    };
  };
}