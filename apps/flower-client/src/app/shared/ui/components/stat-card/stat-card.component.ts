import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type StatCardVariant = 'primary' | 'success' | 'info' | 'warning' | 'highlight' | 'secondary';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.scss',
})
export class StatCardComponent {
  @Input() label: string = '';
  @Input() value: string | number = '';
  @Input() change?: string;
  @Input() variant: StatCardVariant = 'primary';
  @Input() icon?: 'revenue' | 'profit' | 'chart' | 'bar' | 'box'; // Icon type

  getBorderColor(): string {
    return 'var(--border)';
  }

  getBorderLeftColor(): string {
    const colorMap: Record<StatCardVariant, string> = {
      primary: 'var(--kpi-blue)',
      success: 'var(--success)',
      info: 'var(--kpi-indigo)',
      warning: 'var(--kpi-orange)',
      highlight: 'var(--kpi-purple)',
      secondary: 'var(--muted-foreground)',
    };
    return colorMap[this.variant] || colorMap.primary;
  }
}

