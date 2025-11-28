import { Component, Input, Output, EventEmitter, forwardRef, OnChanges, SimpleChanges, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true,
    },
  ],
})
export class DropdownComponent implements ControlValueAccessor, OnChanges {
  @Input() options: { value: any; label: string }[] = [];
  @Input() placeholder: string = 'Select an option';
  @Input() disabled: boolean = false;
  @Input() label: string = '';
  @Input() required: boolean = false;
  @Input() error: string = '';
  @Input() value: any = null;

  @Output() valueChange = new EventEmitter<any>();

  isOpen = false;

  private onChange = (value: any) => {};
  private onTouched = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onSelect(value: any): void {
    if (this.disabled) return;

    this.value = value;
    this.onChange(value);
    this.onTouched();
    this.valueChange.emit(value);
    this.closeDropdown();
  }

  ngOnChanges(): void {
    // Value is now an @Input, so it will be updated automatically
    // This method can be used for additional logic if needed
  }

  toggleDropdown(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    if (!this.disabled) {
      this.isOpen = !this.isOpen;
      // Add/remove class to parent user-card when dropdown opens/closes
      if (this.isOpen) {
        const userCard = (event?.target as HTMLElement)?.closest('.user-card');
        if (userCard) {
          userCard.classList.add('dropdown-open');
        }
      } else {
        const userCard = document.querySelector('.user-card.dropdown-open');
        if (userCard) {
          userCard.classList.remove('dropdown-open');
        }
      }
    }
  }

  closeDropdown(): void {
    this.isOpen = false;
    // Remove dropdown-open class from parent user-card
    const userCard = document.querySelector('.user-card.dropdown-open');
    if (userCard) {
      userCard.classList.remove('dropdown-open');
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-container')) {
      this.closeDropdown();
    }
  }

  getSelectedLabel(): string {
    const selected = this.options.find(opt => opt.value === this.value);
    return selected ? selected.label : this.placeholder;
  }
}

