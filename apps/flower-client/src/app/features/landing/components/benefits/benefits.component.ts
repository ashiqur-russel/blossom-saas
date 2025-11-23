import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IBenefit } from '../../models/landing.models';

@Component({
  selector: 'app-benefits',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './benefits.component.html',
  styleUrl: './benefits.component.scss',
})
export class BenefitsComponent {
  @Input() benefits: IBenefit[] = [];
}

