import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChartConfiguration } from 'chart.js';
import { IWeek, IWeekSummary } from '../../../../shared/models/week.model';
import { CardComponent } from '../../../../shared/ui/components/card/card.component';
import { ButtonComponent } from '../../../../shared/ui/components/button/button.component';
import { ChartComponent } from '../../../../shared/ui/components/chart/chart.component';
import { ChartService } from '../../../../shared/ui/services/chart.service';
import { WeekCardComponent } from '../../../weeks/components/week-card/week-card.component';

@Component({
  selector: 'app-dashboard-presentation',
  standalone: true,
  imports: [CommonModule, RouterModule, CardComponent, ButtonComponent, ChartComponent, WeekCardComponent],
  templateUrl: './dashboard-presentation.component.html',
  styleUrl: './dashboard-presentation.component.scss',
})
export class DashboardPresentationComponent {
  @Input() weeks: IWeek[] = [];
  @Input() summary: IWeekSummary | null = null;
  @Input() loading: boolean = false;
  @Input() error: string | null = null;
  @Input() profitChartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  @Input() salesChartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  @Input() getProfitColor!: (profit: number) => string;
  @Input() getProfitBgColor!: (profit: number) => string;
  @Output() deleteWeek = new EventEmitter<string>();

  chartService = new ChartService();

  onDeleteWeek(id: string): void {
    this.deleteWeek.emit(id);
  }
}

