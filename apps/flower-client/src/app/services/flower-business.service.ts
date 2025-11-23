import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
    return this.http.get<FlowerWeekDTO[]>(this.apiUrl);
  }

  getWeekById(id: string): Observable<FlowerWeekDTO> {
    return this.http.get<FlowerWeekDTO>(`${this.apiUrl}/${id}`);
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
    return this.http.get<FlowerWeekSummaryDTO>(`${this.apiUrl}/summary`);
  }
}
