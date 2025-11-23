import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WeekService } from '../../../weeks/services/week.service';
import { ICreateWeek, IUpdateWeek, IWeek } from '../../../../shared/models/week.model';
import { CardComponent } from '../../../../shared/ui/components/card/card.component';
import { ButtonComponent } from '../../../../shared/ui/components/button/button.component';
import { InputComponent } from '../../../../shared/ui/components/input/input.component';

@Component({
  selector: 'app-sales-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardComponent, ButtonComponent, InputComponent],
  templateUrl: './sales-form.component.html',
  styleUrl: './sales-form.component.scss',
})
export class SalesFormComponent implements OnInit, OnChanges {
  @Input() weekToEdit: IWeek | null = null;
  @Output() weekAdded = new EventEmitter<void>();
  @Output() weekUpdated = new EventEmitter<void>();
  @Output() editCancelled = new EventEmitter<void>();

  form!: FormGroup;
  loading = false;
  error: string | null = null;
  weekday = '';
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private weekService: WeekService,
  ) {}

  initializeForm(): void {
    const today = new Date();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    this.weekday = dayNames[today.getDay()];

    this.form = this.fb.group({
      date: [today.toISOString().split('T')[0], [Validators.required]],
      weekday: [this.weekday],
      flowerAmount: [null, [Validators.required, Validators.min(1)]],
      buyingAmount: [null, [Validators.required, Validators.min(0.01)]],
      salesThursday: [null, [Validators.required, Validators.min(0.01)]],
      salesFriday: [null, [Validators.required, Validators.min(0.01)]],
      salesSaturday: [null, [Validators.required, Validators.min(0.01)]],
      savings: [null, [Validators.required, Validators.min(0)]],
    });

    this.form.get('date')?.valueChanges.subscribe((date) => {
      if (date) {
        const selectedDate = new Date(date);
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        this.weekday = dayNames[selectedDate.getDay()];
        this.form.patchValue({ weekday: this.weekday }, { emitEvent: false });
      }
    });

    this.form.get('salesThursday')?.valueChanges.subscribe(() => this.calculateProfit());
    this.form.get('salesFriday')?.valueChanges.subscribe(() => this.calculateProfit());
    this.form.get('salesSaturday')?.valueChanges.subscribe(() => this.calculateProfit());
    this.form.get('buyingAmount')?.valueChanges.subscribe(() => this.calculateProfit());
  }

  get calculatedProfit(): number {
    const thursday = this.form.get('salesThursday')?.value || 0;
    const friday = this.form.get('salesFriday')?.value || 0;
    const saturday = this.form.get('salesSaturday')?.value || 0;
    const buyingAmount = this.form.get('buyingAmount')?.value || 0;
    return (thursday + friday + saturday) - buyingAmount;
  }

  calculateProfit(): void {
    this.form.markAsTouched();
  }

  getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['weekToEdit'] && this.weekToEdit) {
      this.loadWeekData(this.weekToEdit);
    } else if (changes['weekToEdit'] && !this.weekToEdit && this.isEditMode) {
      this.resetForm();
    }
  }

  loadWeekData(week: IWeek): void {
    this.isEditMode = true;
    const sale = week.sale || { thursday: 0, friday: 0, saturday: 0 };
    const date = new Date(week.startDate);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    this.weekday = dayNames[date.getDay()];

    this.form.patchValue({
      date: date.toISOString().split('T')[0],
      weekday: this.weekday,
      flowerAmount: week.totalFlower || 0,
      buyingAmount: week.totalBuyingPrice || 0,
      salesThursday: sale.thursday || 0,
      salesFriday: sale.friday || 0,
      salesSaturday: sale.saturday || 0,
      savings: week.savings || 0,
    });
  }

  resetForm(): void {
    this.isEditMode = false;
    const today = new Date();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    this.weekday = dayNames[today.getDay()];

    this.form.reset({
      date: today.toISOString().split('T')[0],
      weekday: this.weekday,
      flowerAmount: null,
      buyingAmount: null,
      salesThursday: null,
      salesFriday: null,
      salesSaturday: null,
      savings: null,
    });
    this.form.markAsUntouched();
    this.error = null;
  }

  cancelEdit(): void {
    this.resetForm();
    this.editCancelled.emit();
  }

  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (!field) {
      return '';
    }

    // Show errors if field is touched, dirty, or form was submitted
    const shouldShowError = field.touched || field.dirty || this.form.touched;

    if (!shouldShowError || !field.errors) {
      return '';
    }

    if (field.errors['required']) {
      return 'This field is required';
    } else if (field.errors['min']) {
      const min = field.errors['min'].min;
      if (min === 1) {
        return 'Must be at least 1';
      } else if (min === 0.01) {
        return 'Must be greater than 0';
      }
      return `Value must be at least ${min}`;
    } else if (field.errors['max']) {
      const max = field.errors['max'].max;
      return `Value must be at most ${max}`;
    }

    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    if (!field) {
      return false;
    }
    const shouldShowError = field.touched || field.dirty || this.form.touched;
    return shouldShowError && field.invalid;
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    
    if (!this.form.valid) {
      this.error = 'Please fill in all required fields with valid values.';
      return;
    }

    const formValue = this.form.value;
    
    // Additional validation to ensure no zero or empty values for required fields
    if (!formValue.flowerAmount || formValue.flowerAmount <= 0) {
      this.error = 'Flower Amount must be greater than 0.';
      this.form.get('flowerAmount')?.setErrors({ min: true });
      return;
    }
    
    if (!formValue.buyingAmount || formValue.buyingAmount <= 0) {
      this.error = 'Total Buying Amount must be greater than 0.';
      this.form.get('buyingAmount')?.setErrors({ min: true });
      return;
    }
    
    if (!formValue.salesThursday || formValue.salesThursday <= 0) {
      this.error = 'Thursday Sales must be greater than 0.';
      this.form.get('salesThursday')?.setErrors({ min: true });
      return;
    }
    
    if (!formValue.salesFriday || formValue.salesFriday <= 0) {
      this.error = 'Friday Sales must be greater than 0.';
      this.form.get('salesFriday')?.setErrors({ min: true });
      return;
    }
    
    if (!formValue.salesSaturday || formValue.salesSaturday <= 0) {
      this.error = 'Saturday Sales must be greater than 0.';
      this.form.get('salesSaturday')?.setErrors({ min: true });
      return;
    }
    
    if (formValue.savings === null || formValue.savings < 0) {
      this.error = 'Savings must be 0 or greater.';
      this.form.get('savings')?.setErrors({ min: true });
      return;
    }

    this.loading = true;
    this.error = null;
      const date = new Date(formValue.date);
      const weekNumber = this.getWeekNumber(date);
      const year = date.getFullYear();

      const startDate = new Date(date);
      startDate.setDate(date.getDate() - date.getDay());
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);

      const thursday = Number(formValue.salesThursday || 0);
      const friday = Number(formValue.salesFriday || 0);
      const saturday = Number(formValue.salesSaturday || 0);
      const totalSale = thursday + friday + saturday;
      const buyingAmount = Number(formValue.buyingAmount || 0);
      const profit = totalSale - buyingAmount;

      if (this.isEditMode && this.weekToEdit) {
        const updateData: IUpdateWeek = {
          weekNumber,
          year,
          startDate: startDate,
          endDate: endDate,
          totalFlower: Number(formValue.flowerAmount || 0),
          totalBuyingPrice: buyingAmount,
          sale: {
            thursday,
            friday,
            saturday,
          },
          totalSale,
          profit,
          revenue: totalSale,
          savings: Number(formValue.savings || 0),
        };

        this.weekService.update(this.weekToEdit.id, updateData).subscribe({
          next: () => {
            this.resetForm();
            this.loading = false;
            this.weekUpdated.emit();
          },
          error: (err) => {
            let errorMsg = 'Unknown error';
            if (err.error) {
              if (Array.isArray(err.error.message)) {
                errorMsg = err.error.message.join(', ');
              } else if (typeof err.error.message === 'string') {
                errorMsg = err.error.message;
              } else if (err.error.error) {
                errorMsg = err.error.error;
              }
            } else if (err.message) {
              errorMsg = err.message;
            }
            this.error = `Failed to update sales entry: ${errorMsg}`;
            this.loading = false;
            console.error('Form submission error:', err);
          },
        });
      } else {
        const weekData: ICreateWeek = {
          weekNumber,
          year,
          startDate: startDate,
          endDate: endDate,
          totalFlower: Number(formValue.flowerAmount || 0),
          totalBuyingPrice: buyingAmount,
          sale: {
            thursday,
            friday,
            saturday,
          },
          totalSale,
          profit,
          revenue: totalSale,
          savings: Number(formValue.savings || 0),
        };

        this.weekService.create(weekData).subscribe({
          next: () => {
            this.resetForm();
            this.loading = false;
            this.weekAdded.emit();
          },
          error: (err) => {
            let errorMsg = 'Unknown error';
            if (err.error) {
              if (Array.isArray(err.error.message)) {
                errorMsg = err.error.message.join(', ');
              } else if (typeof err.error.message === 'string') {
                errorMsg = err.error.message;
              } else if (err.error.error) {
                errorMsg = err.error.error;
              }
            } else if (err.message) {
              errorMsg = err.message;
            }
            this.error = `Failed to add sales entry: ${errorMsg}`;
            this.loading = false;
            console.error('Form submission error:', err);
          },
        });
      }
  }
}

