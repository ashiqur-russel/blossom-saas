import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IFeature } from '../../models/landing.models';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './features.component.html',
  styleUrl: './features.component.scss',
})
export class FeaturesComponent {
  @Input() features: IFeature[] = [];
}

