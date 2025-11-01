/**
 * Format number as VND currency
 * @param amount - The amount to format
 * @returns Formatted string with VND symbol
 */
export function formatVND(amount: number | string): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) {
    return '0₫';
  }
  
  // Format with thousands separators and no decimals for VND
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numAmount);
}
