import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IHowItWorksStep } from '../../models/landing.models';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './how-it-works.component.html',
  styleUrl: './how-it-works.component.scss',
})
export class HowItWorksComponent {
  @Input() steps: IHowItWorksStep[] = [];
}

