import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() label: string = '';
  @Input() variant: 'primary' | 'secondary' | 'danger' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' | 'full' = 'md';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() icon: string = '';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() customClass: string = '';
  @Input() customStyle: { [key: string]: string } = {};
  @Output() clicked = new EventEmitter<void>();

  get buttonClasses(): string {
    const classes = [`btn`, `btn-${this.variant}`, `btn-${this.size}`];
    if (this.customClass) {
      classes.push(this.customClass);
    }
    return classes.filter(Boolean).join(' ');
  }

  get buttonStyles(): { [key: string]: string } {
    return this.customStyle;
  }

  onClick(): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit();
    }
  }
}

