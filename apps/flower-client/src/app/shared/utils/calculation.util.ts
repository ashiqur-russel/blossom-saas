/**
 * Business calculation utilities
 * Centralizes business logic calculations
 */

/**
 * Calculates total sale from daily sales
 * @param thursday - Thursday sales amount
 * @param friday - Friday sales amount
 * @param saturday - Saturday sales amount
 * @returns Total sales amount
 */
export function calculateTotalSale(thursday: number, friday: number, saturday: number): number {
  return (thursday || 0) + (friday || 0) + (saturday || 0);
}

/**
 * Calculates profit from total sale and buying price
 * @param totalSale - Total sales amount
 * @param buyingPrice - Total buying price
 * @returns Profit amount
 */
export function calculateProfit(totalSale: number, buyingPrice: number): number {
  return (totalSale || 0) - (buyingPrice || 0);
}

/**
 * Calculates profit from daily sales and buying price
 * @param thursday - Thursday sales amount
 * @param friday - Friday sales amount
 * @param saturday - Saturday sales amount
 * @param buyingPrice - Total buying price
 * @returns Profit amount
 */
export function calculateProfitFromSales(
  thursday: number,
  friday: number,
  saturday: number,
  buyingPrice: number,
): number {
  const totalSale = calculateTotalSale(thursday, friday, saturday);
  return calculateProfit(totalSale, buyingPrice);
}



