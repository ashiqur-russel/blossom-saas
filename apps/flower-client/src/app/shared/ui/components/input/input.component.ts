import { Component, input, forwardRef, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent implements ControlValueAccessor {
  label = input<string>('');
  type = input<string>('text');
  placeholder = input<string>('');
  required = input<boolean>(false);
  min = input<number | null>(null);
  max = input<number | null>(null);
  step = input<number | null>(null);
  readonly = input<boolean>(false);
  error = input<string>('');

  private readonly rawValueSignal = signal<string>('');
  displayValue = this.rawValueSignal.asReadonly();

  private readonly isTypingDecimalSignal = signal<boolean>(false);
  isTypingDecimal = this.isTypingDecimalSignal.asReadonly();

  inputType = computed(() => {
    const t = this.type();
    return t === 'number' ? 'text' : t;
  });

  inputMode = computed(() => {
    const t = this.type();
    return t === 'number' ? 'decimal' : null;
  });

  private onChange = (value: any) => {};
  private onTouched = () => {};

  writeValue(value: any): void {
    if (this.isTypingDecimalSignal() && this.rawValueSignal().endsWith('.')) {
      return;
    }

    if (value === null || value === undefined || value === '') {
      if (!this.isTypingDecimalSignal()) {
        this.rawValueSignal.set('');
      }
    } else {
      if (!this.isTypingDecimalSignal()) {
        this.rawValueSignal.set(String(value));
      }
    }
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newValue = target.value;
    this.rawValueSignal.set(newValue);

    if (this.type() === 'number') {
      if (newValue === '' || newValue === '-') {
        this.isTypingDecimalSignal.set(false);
        this.onChange(null);
      } else if (newValue.includes('.')) {
        this.isTypingDecimalSignal.set(true);
        const numPart = newValue.split('.')[0];
        if (numPart !== '' && !isNaN(parseFloat(numPart))) {
          this.onChange(parseFloat(numPart));
        } else if (newValue.startsWith('.')) {
          this.onChange(0);
        }
      } else {
        this.isTypingDecimalSignal.set(false);
        const numValue = parseFloat(newValue);
        if (!isNaN(numValue)) {
          this.onChange(numValue);
        } else {
          this.onChange(newValue);
        }
      }
    } else {
      this.isTypingDecimalSignal.set(false);
      this.onChange(newValue);
    }
  }

  onBlur(): void {
    this.onTouched();
    this.isTypingDecimalSignal.set(false);

    if (this.type() === 'number') {
      const currentValue = this.rawValueSignal();
      
      if (currentValue === '' || currentValue === '-') {
        this.onChange(null);
        return;
      }

      if (currentValue.endsWith('.')) {
        const numPart = currentValue.slice(0, -1);
        const numValue = numPart ? parseFloat(numPart) : null;
        this.onChange(numValue);
        return;
      }

      const numValue = parseFloat(currentValue);
      if (!isNaN(numValue)) {
        this.rawValueSignal.set(String(numValue));
        this.onChange(numValue);
      }
    }
  }
}
