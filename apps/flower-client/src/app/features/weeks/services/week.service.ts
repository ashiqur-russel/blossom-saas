import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { BaseCrudService } from '../../../shared/services/base-crud.service';
import { IWeek, ICreateWeek, IUpdateWeek } from '../../../shared/models/week.model';

@Injectable({
  providedIn: 'root',
})
export class WeekService extends BaseCrudService<IWeek, ICreateWeek, IUpdateWeek> {
  protected apiUrl = `${environment.apiUrl}/flower-weeks`;

  constructor(http: HttpClient) {
    super(http);
  }

  /**
   * Normalize week entity from API response
   * Handles both new and legacy data formats
   */
  protected normalizeEntity(week: any): IWeek {
    // Handle legacy format (quantity/price) vs new format (totalFlower/totalBuyingPrice)
    const totalFlower = this.normalizeNumber(week.totalFlower || week.quantity);
    const totalBuyingPrice = this.normalizeNumber(
      week.totalBuyingPrice || (week.quantity && week.price ? week.quantity * week.price : 0)
    );
    
    const sale = week.sale || { thursday: 0, friday: 0, saturday: 0 };
    const totalSale = this.normalizeNumber(
      week.totalSale || (week.quantity && week.price ? week.quantity * week.price : 0)
    );
    const profit = this.normalizeNumber(week.profit);
    const revenue = this.normalizeNumber(week.revenue || totalSale);
    const savings = this.normalizeNumber(week.savings);

    return {
      id: this.normalizeId(week),
      weekNumber: this.normalizeNumber(week.weekNumber),
      year: this.normalizeNumber(week.year),
      startDate: this.normalizeDate(week.startDate),
      endDate: this.normalizeDate(week.endDate),
      totalFlower,
      totalBuyingPrice,
      sale,
      totalSale,
      profit,
      revenue,
      savings,
      createdAt: this.normalizeDate(week.createdAt),
      updatedAt: this.normalizeDate(week.updatedAt),
    };
  }
}
