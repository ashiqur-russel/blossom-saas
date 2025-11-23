import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BaseCrudService } from '../../shared/services/base-crud.service';
import { IWithdrawal, ICreateWithdrawal, IWithdrawalSummary } from '../../shared/models/withdrawal.model';

@Injectable({
  providedIn: 'root',
})
export class WithdrawalService extends BaseCrudService<IWithdrawal, ICreateWithdrawal, Partial<ICreateWithdrawal>> {
  protected apiUrl = `${environment.apiUrl}/withdrawals`;

  constructor(http: HttpClient) {
    super(http);
  }

  /**
   * Get withdrawal summary
   */
  getSummary(): Observable<IWithdrawalSummary> {
    return this.http.get<IWithdrawalSummary>(`${this.apiUrl}/summary`);
  }

  /**
   * Normalize withdrawal entity from API response
   */
  protected normalizeEntity(withdrawal: any): IWithdrawal {
    return {
      id: this.normalizeId(withdrawal),
      amount: this.normalizeNumber(withdrawal.amount),
      date: this.normalizeDate(withdrawal.date),
      description: withdrawal.description,
      createdAt: this.normalizeDate(withdrawal.createdAt),
      updatedAt: this.normalizeDate(withdrawal.updatedAt),
    };
  }
}

