export type DateFormat = 
  | 'DD/MM/YYYY' 
  | 'MM/DD/YYYY' 
  | 'YYYY/MM/DD' 
  | 'YYYY/DD/MM' 
  | 'YYYY-MM-DD' 
  | 'DD-MM-YYYY'
  | 'MM-DD-YYYY';

export const DATE_FORMATS: { [key in DateFormat]: string } = {
  'DD/MM/YYYY': 'DD/MM/YYYY (31/12/2024)',
  'MM/DD/YYYY': 'MM/DD/YYYY (12/31/2024)',
  'YYYY/MM/DD': 'YYYY/MM/DD (2024/12/31)',
  'YYYY/DD/MM': 'YYYY/DD/MM (2024/31/12)',
  'YYYY-MM-DD': 'YYYY-MM-DD (2024-12-31)',
  'DD-MM-YYYY': 'DD-MM-YYYY (31-12-2024)',
  'MM-DD-YYYY': 'MM-DD-YYYY (12-31-2024)'
};

export const parseDateString = (dateStr: string, format: DateFormat): Date => {
  // Normalize separators to handle both / and -
  const normalizedStr = dateStr.replace(/-/g, '/');
  const parts = normalizedStr.split('/');
  
  if (parts.length !== 3) {
    throw new Error(`Invalid date format: ${dateStr}`);
  }

  let day: number, month: number, year: number;

  switch (format) {
    case 'DD/MM/YYYY':
    case 'DD-MM-YYYY':
      [day, month, year] = parts.map(Number);
      break;
    case 'MM/DD/YYYY':
    case 'MM-DD-YYYY':
      [month, day, year] = parts.map(Number);
      break;
    case 'YYYY/MM/DD':
    case 'YYYY-MM-DD':
      [year, month, day] = parts.map(Number);
      break;
    case 'YYYY/DD/MM':
      [year, day, month] = parts.map(Number);
      break;
    default:
      throw new Error(`Unsupported date format: ${format}`);
  }

  validateDateParts(day, month, year);
  return createValidDate(year, month, day);
};

const validateDateParts = (day: number, month: number, year: number): void => {
  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    throw new Error('Invalid date components');
  }
  if (day < 1 || day > 31) {
    throw new Error(`Invalid day: ${day}`);
  }
  if (month < 1 || month > 12) {
    throw new Error(`Invalid month: ${month}`);
  }
  if (year < 1900 || year > 2100) {
    throw new Error(`Invalid year: ${year}`);
  }
};

const createValidDate = (year: number, month: number, day: number): Date => {
  // JavaScript months are 0-based
  const date = new Date(year, month - 1, day);

  // Verify the date is valid (handles edge cases like 31/04/2024)
  if (date.getDate() !== day) {
    throw new Error(`Invalid date for month: ${month}/${day}`);
  }

  return date;
};