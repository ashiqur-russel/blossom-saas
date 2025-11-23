import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ChartConfiguration } from 'chart.js';
import { IWeek, IWeekSummary } from '../../../../shared/models/week.model';
import { CardComponent } from '../../../../shared/ui/components/card/card.component';
import { ButtonComponent } from '../../../../shared/ui/components/button/button.component';
import { ChartComponent } from '../../../../shared/ui/components/chart/chart.component';
import { ChartService } from '../../../../shared/ui/services/chart.service';
import { WeekCardComponent } from '../../../weeks/components/week-card/week-card.component';
import { SalesFormComponent } from '../sales-form/sales-form.component';

@Component({
  selector: 'app-dashboard-presentation',
  standalone: true,
  imports: [CommonModule, RouterModule, CardComponent, ChartComponent, DatePipe, SalesFormComponent],
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
  @Input() revenueProfitTrendsData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  @Input() profitSavingsBarData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  @Input() salesByDayPieData: ChartConfiguration<'pie'>['data'] = { labels: [], datasets: [] };
  @Input() dailySalesTrendsData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  @Input() currentWeek: IWeek | null = null;
  @Input() activeTab: 'weekly' | 'trends' = 'weekly';
  @Input() getProfitColor!: (profit: number) => string;
  @Input() getProfitBgColor!: (profit: number) => string;
  @Output() deleteWeek = new EventEmitter<string>();
  @Output() setActiveTab = new EventEmitter<'weekly' | 'trends'>();
  @Output() weekAdded = new EventEmitter<void>();
  @Output() weekUpdated = new EventEmitter<void>();
  @Output() editCancelled = new EventEmitter<void>();

  selectedWeekForEdit: IWeek | null = null;

  chartService = new ChartService();

  currentDate = new Date();

  getFormattedDate(): string {
    return this.currentDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  getAverageSalesByDay(): { thursday: number; friday: number; saturday: number } {
    if (!this.weeks || this.weeks.length === 0) {
      return { thursday: 0, friday: 0, saturday: 0 };
    }

    const totals = this.weeks.reduce((acc, week) => {
      const sale = week.sale || { thursday: 0, friday: 0, saturday: 0 };
      acc.thursday += sale.thursday || 0;
      acc.friday += sale.friday || 0;
      acc.saturday += sale.saturday || 0;
      return acc;
    }, { thursday: 0, friday: 0, saturday: 0 });

    const count = this.weeks.length;
    return {
      thursday: Math.round(totals.thursday / count),
      friday: Math.round(totals.friday / count),
      saturday: Math.round(totals.saturday / count),
    };
  }

  onDeleteWeek(id: string): void {
    this.deleteWeek.emit(id);
  }

  onTabClick(tab: 'weekly' | 'trends'): void {
    this.setActiveTab.emit(tab);
  }

  onEditWeek(week: IWeek): void {
    this.selectedWeekForEdit = week;
  }

  onWeekAdded(): void {
    this.selectedWeekForEdit = null;
    this.weekAdded.emit();
  }

  onWeekUpdated(): void {
    this.selectedWeekForEdit = null;
    this.weekUpdated.emit();
  }

  onEditCancelled(): void {
    this.selectedWeekForEdit = null;
    this.editCancelled.emit();
  }
}
