import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',
})
export class LoadingComponent {
  @Input() message: string = 'Loading...';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() overlay: boolean | string = false;
  @Input() inline: boolean = false;
}

