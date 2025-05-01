import { CohortData } from '../types';

export const exportCohortMatrixToCSV = (data: CohortData[]): void => {
  // Create CSV header
  const headers = ['Period', 'Customer Count', ...Array(12).fill(0).map((_, i) => `Month ${i + 1} Retention`)];
  
  // Transform data to CSV rows
  const rows = data.map(cohort => [
    cohort.period,
    cohort.customerCount,
    ...cohort.retention.map(value => `${value}%`)
  ]);
  
  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `cohort-matrix-${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};