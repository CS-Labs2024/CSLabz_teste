export const calculateDaysBetween = (start: Date | string, end: Date | string): number => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const calculateMonthsBetween = (start: Date | string, end: Date | string): number => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
         (endDate.getMonth() - startDate.getMonth());
};

export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString();
};

export const formatDateForInput = (date: Date | string): string => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

// Safari-safe date parsing
export const parseDate = (dateString: string): Date => {
  // Replace any hyphens with forward slashes for Safari
  const safeDateString = dateString.replace(/-/g, '/');
  return new Date(safeDateString);
};