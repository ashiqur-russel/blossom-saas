import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IWeek } from '../../../../shared/models/week.model';
import { CardComponent } from '../../../../shared/ui/components/card/card.component';
import { ButtonComponent } from '../../../../shared/ui/components/button/button.component';

@Component({
  selector: 'app-week-card',
  standalone: true,
  imports: [CommonModule, RouterModule, CardComponent, ButtonComponent],
  templateUrl: './week-card.component.html',
  styleUrl: './week-card.component.scss',
})
export class WeekCardComponent {
  @Input() week!: IWeek;
  @Input() getProfitColor!: (profit: number) => string;
  @Input() getProfitBgColor!: (profit: number) => string;
  @Output() delete = new EventEmitter<string>();

  onDelete(): void {
    this.delete.emit(this.week.id);
  }
}

