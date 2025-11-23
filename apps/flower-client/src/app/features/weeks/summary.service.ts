import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { IWeekSummary } from '../../shared/models/week.model';

@Injectable({
  providedIn: 'root',
})
export class SummaryService {
  private apiUrl = `${environment.apiUrl}/flower-weeks`;

  constructor(private http: HttpClient) {}

  getSummary(): Observable<IWeekSummary> {
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
        averageRevenue: summary.averageRevenue || 0,
        averageFlowers: summary.averageFlowers || summary.averageQuantity || 0,
        bestWeek: summary.bestWeek || null,
      }))
    );
  }
}

