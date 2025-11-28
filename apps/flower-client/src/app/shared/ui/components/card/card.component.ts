import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type CardVariant = 'default' | 'highlight' | 'interactive';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() variant: CardVariant = 'default';
  @Input() padding: CardPadding = 'md';
  @Input() interactive: boolean = false;

  get cardClasses(): string {
    const classes = ['card'];
    
    if (this.variant === 'highlight') {
      classes.push('card-highlight');
    }
    
    if (this.interactive) {
      classes.push('card-interactive');
    }
    
    if (this.padding !== 'none') {
      classes.push(`card-padding-${this.padding}`);
    }
    
    return classes.filter(Boolean).join(' ');
  }
}


