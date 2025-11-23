export interface ISaleByDay {
  thursday: number;
  friday: number;
  saturday: number;
}

export interface IWeek {
  id: string;
  weekNumber: number;
  year: number;
  startDate: Date;
  endDate: Date;
  totalFlower: number;
  totalBuyingPrice: number;
  sale: ISaleByDay;
  totalSale: number;
  profit: number;
  revenue: number;
  savings: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateWeek {
  weekNumber: number;
  year: number;
  startDate: Date;
  endDate: Date;
  totalFlower: number;
  totalBuyingPrice: number;
  sale: ISaleByDay;
  totalSale: number;
  profit: number;
  revenue: number;
  savings: number;
}

export interface IUpdateWeek {
  weekNumber?: number;
  year?: number;
  startDate?: Date;
  endDate?: Date;
  totalFlower?: number;
  totalBuyingPrice?: number;
  sale?: Partial<ISaleByDay>;
  totalSale?: number;
  profit?: number;
  revenue?: number;
  savings?: number;
}

export interface IWeekSummary {
  totalWeeks: number;
  totalFlowers: number;
  totalBuyingPrice: number;
  totalSales: number;
  totalProfit: number;
  totalRevenue: number;
  totalSavings: number;
  averageProfit: number;
  averageRevenue: number;
  averageFlowers: number;
  bestWeek: {
    weekNumber: number;
    year: number;
    profit: number;
  } | null;
}
