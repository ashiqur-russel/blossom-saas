import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FlowerBusinessService, FlowerWeekDTO, SaleByDay } from '../../services/flower-business.service';

@Component({
  selector: 'app-flower-week-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './flower-week-form.component.html',
  styleUrl: './flower-week-form.component.scss',
})
export class FlowerWeekFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  weekId: string | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private flowerService: FlowerBusinessService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.form = this.fb.group({
      weekNumber: [null, [Validators.required, Validators.min(1), Validators.max(53)]],
      year: [new Date().getFullYear(), [Validators.required, Validators.min(2000)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      totalFlower: [0, [Validators.required, Validators.min(0)]],
      totalBuyingPrice: [0, [Validators.required, Validators.min(0)]],
      saleThursday: [0, [Validators.required, Validators.min(0)]],
      saleFriday: [0, [Validators.required, Validators.min(0)]],
      saleSaturday: [0, [Validators.required, Validators.min(0)]],
      totalSale: [0, [Validators.required, Validators.min(0)]],
      profit: [0, Validators.required],
      revenue: [0, [Validators.required, Validators.min(0)]],
      savings: [0, [Validators.required, Validators.min(0)]],
    });

    // Auto-calculate totalSale and profit
    this.form.get('saleThursday')?.valueChanges.subscribe(() => this.calculateTotals());
    this.form.get('saleFriday')?.valueChanges.subscribe(() => this.calculateTotals());
    this.form.get('saleSaturday')?.valueChanges.subscribe(() => this.calculateTotals());
    this.form.get('totalBuyingPrice')?.valueChanges.subscribe(() => this.calculateProfit());
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.weekId = params['id'];
        this.loadWeek(params['id']);
      } else {
        const today = new Date();
        const currentWeek = this.getWeekNumber(today);
        this.form.patchValue({
          weekNumber: currentWeek,
          year: today.getFullYear(),
        });
      }
    });
  }

  loadWeek(id: string): void {
    this.loading = true;
    this.flowerService.getWeekById(id).subscribe({
      next: (week) => {
        const sale = week.sale || { thursday: 0, friday: 0, saturday: 0 };
        this.form.patchValue({
          weekNumber: week.weekNumber,
          year: week.year,
          startDate: new Date(week.startDate).toISOString().split('T')[0],
          endDate: new Date(week.endDate).toISOString().split('T')[0],
          totalFlower: week.totalFlower || 0,
          totalBuyingPrice: week.totalBuyingPrice || 0,
          saleThursday: sale.thursday || 0,
          saleFriday: sale.friday || 0,
          saleSaturday: sale.saturday || 0,
          totalSale: week.totalSale || 0,
          profit: week.profit || 0,
          revenue: week.revenue || week.totalSale || 0,
          savings: week.savings || 0,
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load week: ' + (err.error?.message || err.message || 'Unknown error');
        this.loading = false;
        console.error('Load week error:', err);
      },
    });
  }

  calculateTotals(): void {
    const thursday = this.form.get('saleThursday')?.value || 0;
    const friday = this.form.get('saleFriday')?.value || 0;
    const saturday = this.form.get('saleSaturday')?.value || 0;
    const totalSale = thursday + friday + saturday;
    
    this.form.patchValue({ totalSale }, { emitEvent: false });
    this.calculateProfit();
  }

  calculateProfit(): void {
    const totalSale = this.form.get('totalSale')?.value || 0;
    const totalBuyingPrice = this.form.get('totalBuyingPrice')?.value || 0;
    const profit = totalSale - totalBuyingPrice;
    
    this.form.patchValue({ profit, revenue: totalSale }, { emitEvent: false });
  }

  getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.loading = true;
      this.error = null;

      const formValue = this.form.value;
      
      // Calculate totals if not already set
      const saleThursday = Number(formValue.saleThursday || 0);
      const saleFriday = Number(formValue.saleFriday || 0);
      const saleSaturday = Number(formValue.saleSaturday || 0);
      const calculatedTotalSale = saleThursday + saleFriday + saleSaturday;
      const totalBuyingPrice = Number(formValue.totalBuyingPrice || 0);
      const calculatedProfit = calculatedTotalSale - totalBuyingPrice;
      
      const weekData: any = {
        weekNumber: Number(formValue.weekNumber),
        year: Number(formValue.year),
        startDate: new Date(formValue.startDate).toISOString(),
        endDate: new Date(formValue.endDate).toISOString(),
        totalFlower: Number(formValue.totalFlower || 0),
        totalBuyingPrice: totalBuyingPrice,
        sale: {
          thursday: saleThursday,
          friday: saleFriday,
          saturday: saleSaturday,
        },
        totalSale: Number(formValue.totalSale || calculatedTotalSale),
        profit: Number(formValue.profit || calculatedProfit),
        revenue: Number(formValue.revenue || calculatedTotalSale),
        savings: Number(formValue.savings || 0),
      };

      const operation = this.isEditMode
        ? this.flowerService.updateWeek(this.weekId!, weekData)
        : this.flowerService.createWeek(weekData);

      operation.subscribe({
        next: () => {
          this.router.navigate(['/']);
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
          this.error = this.isEditMode
            ? `Failed to update week: ${errorMsg}`
            : `Failed to create week: ${errorMsg}`;
          this.loading = false;
          console.error('Form submission error:', err);
          if (err.error) {
            console.error('Error details:', JSON.stringify(err.error, null, 2));
          }
        },
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/']);
  }
}
