import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// Define types locally
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
  startDate?: Date | string;
  endDate?: Date | string;
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

@Injectable({
  providedIn: 'root',
})
export class FlowerBusinessService {
  private apiUrl = `${environment.apiUrl}/flower-weeks`;

  constructor(private http: HttpClient) {}

  getAllWeeks(): Observable<FlowerWeekDTO[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(weeks => weeks.map(week => this.normalizeWeekData(week)))
    );
  }

  private normalizeWeekData(week: any): FlowerWeekDTO {
    // Handle both old and new data formats
    const totalFlower = week.totalFlower || week.quantity || 0;
    const totalBuyingPrice = week.totalBuyingPrice || (week.quantity && week.price ? week.quantity * week.price : 0) || 0;
    const sale = week.sale || { thursday: 0, friday: 0, saturday: 0 };
    const totalSale = week.totalSale || (week.quantity && week.price ? week.quantity * week.price : 0) || 0;
    const profit = week.profit || 0;
    const revenue = week.revenue || totalSale;
    const savings = week.savings || 0;

    return {
      id: week.id || week._id?.toString() || '',
      weekNumber: week.weekNumber,
      year: week.year,
      startDate: new Date(week.startDate),
      endDate: new Date(week.endDate),
      totalFlower,
      totalBuyingPrice,
      sale,
      totalSale,
      profit,
      revenue,
      savings,
      createdAt: week.createdAt ? new Date(week.createdAt) : new Date(),
      updatedAt: week.updatedAt ? new Date(week.updatedAt) : new Date(),
    };
  }

  getWeekById(id: string): Observable<FlowerWeekDTO> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(week => this.normalizeWeekData(week))
    );
  }

  createWeek(week: CreateFlowerWeekDTO): Observable<FlowerWeekDTO> {
    // Ensure dates are properly formatted
    const payload = {
      ...week,
      startDate: week.startDate instanceof Date ? week.startDate.toISOString() : week.startDate,
      endDate: week.endDate instanceof Date ? week.endDate.toISOString() : week.endDate,
    };
    return this.http.post<FlowerWeekDTO>(this.apiUrl, payload);
  }

  updateWeek(id: string, week: UpdateFlowerWeekDTO): Observable<FlowerWeekDTO> {
    // Ensure dates are properly formatted if present
    const payload: any = { ...week };
    if (week.startDate) {
      payload.startDate = week.startDate instanceof Date ? week.startDate.toISOString() : week.startDate;
    }
    if (week.endDate) {
      payload.endDate = week.endDate instanceof Date ? week.endDate.toISOString() : week.endDate;
    }
    return this.http.patch<FlowerWeekDTO>(`${this.apiUrl}/${id}`, payload);
  }

  deleteWeek(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getSummary(): Observable<FlowerWeekSummaryDTO> {
    return this.http.get<any>(`${this.apiUrl}/summary`).pipe(
      map(summary => ({
        totalWeeks: summary.totalWeeks || 0,
        totalFlowers: summary.totalFlowers || summary.totalQuantity || 0,
        totalBuyingPrice: summary.totalBuyingPrice || 0,
        totalSales: summary.totalSales || summary.totalRevenue || 0,
        totalProfit: summary.totalProfit || 0,
        totalRevenue: summary.totalRevenue || summary.totalSales || 0,
        totalSavings: summary.totalSavings || 0,
        averageProfit: summary.averageProfit || 0,
        averageFlowers: summary.averageFlowers || summary.averageQuantity || 0,
        bestWeek: summary.bestWeek || null,
      }))
    );
  }
}
