import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { IWeek, ICreateWeek, IUpdateWeek } from '../../../shared/models/week.model';

@Injectable({
  providedIn: 'root',
})
export class WeekService {
  private apiUrl = `${environment.apiUrl}/flower-weeks`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<IWeek[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(weeks => weeks.map(week => this.normalizeWeek(week)))
    );
  }

  getById(id: string): Observable<IWeek> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(week => this.normalizeWeek(week))
    );
  }

  create(week: ICreateWeek): Observable<IWeek> {
    const payload = {
      ...week,
      startDate: week.startDate instanceof Date ? week.startDate.toISOString() : week.startDate,
      endDate: week.endDate instanceof Date ? week.endDate.toISOString() : week.endDate,
    };
    return this.http.post<any>(this.apiUrl, payload).pipe(
      map(week => this.normalizeWeek(week))
    );
  }

  update(id: string, week: IUpdateWeek): Observable<IWeek> {
    const payload: any = { ...week };
    if (week.startDate) {
      payload.startDate = week.startDate instanceof Date ? week.startDate.toISOString() : week.startDate;
    }
    if (week.endDate) {
      payload.endDate = week.endDate instanceof Date ? week.endDate.toISOString() : week.endDate;
    }
    return this.http.patch<any>(`${this.apiUrl}/${id}`, payload).pipe(
      map(week => this.normalizeWeek(week))
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private normalizeWeek(week: any): IWeek {
    const totalFlower = week.totalFlower || week.quantity || 0;
    const totalBuyingPrice = week.totalBuyingPrice || (week.quantity && week.price ? week.quantity * week.price : 0) || 0;
    const sale = week.sale || { thursday: 0, friday: 0, saturday: 0 };
    const totalSale = week.totalSale || (week.quantity && week.price ? week.quantity * week.price : 0) || 0;
    const profit = week.profit || 0;
    const revenue = week.revenue || totalSale;
    const savings = week.savings || 0;
    
    let weekId = '';
    if (week.id) {
      weekId = typeof week.id === 'string' ? week.id : week.id.toString();
    } else if (week._id) {
      weekId = typeof week._id === 'string' ? week._id : (week._id.$oid || week._id.toString());
    }

    return {
      id: weekId,
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
}
