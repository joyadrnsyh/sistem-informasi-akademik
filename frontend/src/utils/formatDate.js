/**
 * Formats a date string, timestamp, or Date object into a localized Indonesian date.
 * 
 * @param {string|number|Date} date - The date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted Indonesian date
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '-';
  
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '-';
    
    const defaultOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      ...options
    };
    
    return new Intl.DateTimeFormat('id-ID', defaultOptions).format(d);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '-';
  }
};

/**
 * Formats a date string to show only time (e.g. "13:45")
 * 
 * @param {string|number|Date} date - The date to format
 * @returns {string} Formatted time
 */
export const formatTime = (date) => {
  return formatDate(date, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    day: undefined,
    month: undefined,
    year: undefined
  });
};

/**
 * Formats a date with day name (e.g. "Senin, 22 Mei 2026")
 * 
 * @param {string|number|Date} date - The date to format
 * @returns {string} Formatted date with day
 */
export const formatDateWithDay = (date) => {
  return formatDate(date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};
