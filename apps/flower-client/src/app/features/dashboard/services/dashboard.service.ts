import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WeekService } from '../../weeks/services/week.service';
import { SummaryService } from '../../weeks/services/summary.service';
import { WithdrawalService } from '../../withdrawals/services/withdrawal.service';
import { IWeek, IWeekSummary } from '../../../shared/models/week.model';
import { IWithdrawalSummary } from '../../../shared/models/withdrawal.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(
    private weekService: WeekService,
    private summaryService: SummaryService,
    private withdrawalService: WithdrawalService,
  ) {}

  loadDashboardData(): Observable<{ weeks: IWeek[]; summary: IWeekSummary; withdrawalSummary: IWithdrawalSummary | null }> {
    return forkJoin({
      weeks: this.weekService.getAll(),
      summary: this.summaryService.getSummary(),
      withdrawalSummary: this.withdrawalService.getSummary().pipe(
        catchError(() => of(null)) // Return null if withdrawals service fails
      ),
    });
  }
}

