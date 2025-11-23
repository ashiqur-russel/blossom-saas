import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface IWithdrawal {
  id: string;
  amount: number;
  date: Date;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateWithdrawal {
  amount: number;
  date: Date;
  description?: string;
}

export interface IWithdrawalSummary {
  totalWithdrawals: number;
  totalSavings: number;
  availableSavings: number;
  totalWithdrawalCount: number;
}

@Injectable({
  providedIn: 'root',
})
export class WithdrawalService {
  private apiUrl = `${environment.apiUrl}/withdrawals`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<IWithdrawal[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(withdrawals => withdrawals.map(w => this.normalizeWithdrawal(w)))
    );
  }

  getById(id: string): Observable<IWithdrawal> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(w => this.normalizeWithdrawal(w))
    );
  }

  create(withdrawal: ICreateWithdrawal): Observable<IWithdrawal> {
    const payload = {
      ...withdrawal,
      date: withdrawal.date instanceof Date ? withdrawal.date.toISOString() : withdrawal.date,
    };
    return this.http.post<any>(this.apiUrl, payload).pipe(
      map(w => this.normalizeWithdrawal(w))
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getSummary(): Observable<IWithdrawalSummary> {
    return this.http.get<IWithdrawalSummary>(`${this.apiUrl}/summary`);
  }

  private normalizeWithdrawal(withdrawal: any): IWithdrawal {
    return {
      id: withdrawal.id || withdrawal._id?.toString() || '',
      amount: Number(withdrawal.amount) || 0,
      date: new Date(withdrawal.date),
      description: withdrawal.description,
      createdAt: withdrawal.createdAt ? new Date(withdrawal.createdAt) : new Date(),
      updatedAt: withdrawal.updatedAt ? new Date(withdrawal.updatedAt) : new Date(),
    };
  }
}

