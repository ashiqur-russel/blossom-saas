import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IStatistic } from '../../models/landing.models';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss',
})
export class StatisticsComponent {
  @Input() statistics: IStatistic[] = [];
}

