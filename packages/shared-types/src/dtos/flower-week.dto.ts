/**
 * Shared DTOs for Flower Business Weekly Tracking
 * These DTOs are shared between the API and Client
 */

export interface SaleByDay {
  thursday: number;
  friday: number;
  saturday: number;
}

export interface FlowerWeekDTO {
  id: string;
  weekNumber: number;
  year: number;
  startDate: Date;
  endDate: Date;
  totalFlower: number;
  totalBuyingPrice: number;
  sale: SaleByDay;
  totalSale: number;
  profit: number;
  revenue: number;
  savings: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFlowerWeekDTO {
  weekNumber: number;
  year: number;
  startDate: Date;
  endDate: Date;
  totalFlower: number;
  totalBuyingPrice: number;
  sale: SaleByDay;
  totalSale: number;
  profit: number;
  revenue: number;
  savings: number;
}

export interface UpdateFlowerWeekDTO {
  weekNumber?: number;
  year?: number;
  startDate?: Date;
  endDate?: Date;
  totalFlower?: number;
  totalBuyingPrice?: number;
  sale?: Partial<SaleByDay>;
  totalSale?: number;
  profit?: number;
  revenue?: number;
  savings?: number;
}

export interface FlowerWeekSummaryDTO {
  totalWeeks: number;
  totalFlowers: number;
  totalBuyingPrice: number;
  totalSales: number;
  totalProfit: number;
  totalRevenue: number;
  totalSavings: number;
  averageProfit: number;
  averageFlowers: number;
  bestWeek: {
    weekNumber: number;
    year: number;
    profit: number;
  } | null;
}
