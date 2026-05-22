/**
 * Formats a number or numeric string into Indonesian Rupiah (IDR) currency format.
 * 
 * @param {number|string} amount - The amount to format
 * @param {boolean} includeSymbol - Whether to include the "Rp" symbol prefix
 * @returns {string} Formatted currency string (e.g. "Rp 5.000.000")
 */
export const formatCurrency = (amount, includeSymbol = true) => {
  if (amount === null || amount === undefined) return includeSymbol ? 'Rp 0' : '0';
  
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return includeSymbol ? 'Rp 0' : '0';
  
  try {
    const formatted = new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
    
    return includeSymbol ? `Rp ${formatted}` : formatted;
  } catch (error) {
    console.error('Error formatting currency:', error);
    return includeSymbol ? `Rp ${amount}` : String(amount);
  }
};
