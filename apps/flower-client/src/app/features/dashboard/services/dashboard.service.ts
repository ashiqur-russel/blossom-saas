import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { WeekService } from '../../weeks/services/week.service';
import { SummaryService } from '../../weeks/services/summary.service';
import { IWeek, IWeekSummary } from '../../../shared/models/week.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(
    private weekService: WeekService,
    private summaryService: SummaryService,
  ) {}

  loadDashboardData(): Observable<{ weeks: IWeek[]; summary: IWeekSummary }> {
    return forkJoin({
      weeks: this.weekService.getAll(),
      summary: this.summaryService.getSummary(),
    });
  }
}

