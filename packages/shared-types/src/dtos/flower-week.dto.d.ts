export interface FlowerWeekDTO {
    id: string;
    weekNumber: number;
    year: number;
    startDate: Date;
    endDate: Date;
    quantity: number;
    price: number;
    profit: number;
    savings: number;
    nextWeekBudget: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateFlowerWeekDTO {
    weekNumber: number;
    year: number;
    startDate: Date;
    endDate: Date;
    quantity: number;
    price: number;
    profit: number;
    savings: number;
    nextWeekBudget: number;
}
export interface UpdateFlowerWeekDTO {
    quantity?: number;
    price?: number;
    profit?: number;
    savings?: number;
    nextWeekBudget?: number;
}
export interface FlowerWeekSummaryDTO {
    totalWeeks: number;
    totalQuantity: number;
    totalRevenue: number;
    totalProfit: number;
    totalSavings: number;
    averageProfit: number;
    averageQuantity: number;
}
