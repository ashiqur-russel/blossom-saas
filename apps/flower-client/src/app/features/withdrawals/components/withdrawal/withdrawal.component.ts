import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WithdrawalService, ICreateWithdrawal, IWithdrawal, IWithdrawalSummary } from '../../services/withdrawal.service';
import { CardComponent } from '../../../../shared/ui/components/card/card.component';
import { ButtonComponent } from '../../../../shared/ui/components/button/button.component';
import { InputComponent } from '../../../../shared/ui/components/input/input.component';

@Component({
  selector: 'app-withdrawal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardComponent, ButtonComponent, InputComponent],
  templateUrl: './withdrawal.component.html',
  styleUrl: './withdrawal.component.scss',
})
export class WithdrawalComponent implements OnInit {
  form: FormGroup;
  loading = false;
  error: string | null = null;
  success: string | null = null;
  withdrawals: IWithdrawal[] = [];
  summary: IWithdrawalSummary | null = null;

  constructor(
    private fb: FormBuilder,
    private withdrawalService: WithdrawalService,
  ) {
    this.form = this.fb.group({
      amount: [0, [Validators.required, Validators.min(0.01)]],
      date: [new Date().toISOString().split('T')[0], Validators.required],
      description: [''],
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = null;
    this.success = null;

    let summaryLoaded = false;
    let withdrawalsLoaded = false;

    const checkComplete = () => {
      if (summaryLoaded && withdrawalsLoaded) {
        this.loading = false;
      }
    };

    // Load summary and withdrawals in parallel
    this.withdrawalService.getSummary().subscribe({
      next: (summary) => {
        this.summary = summary;
        summaryLoaded = true;
        checkComplete();
      },
      error: (err) => {
        this.error = `Failed to load withdrawal summary: ${err.error?.message || err.message || 'Unknown error'}`;
        summaryLoaded = true;
        checkComplete();
        console.error('Withdrawal summary error:', err);
      },
    });

    this.withdrawalService.getAll().subscribe({
      next: (withdrawals) => {
        this.withdrawals = withdrawals;
        withdrawalsLoaded = true;
        checkComplete();
      },
      error: (err) => {
        console.error('Failed to load withdrawals:', err);
        withdrawalsLoaded = true;
        checkComplete();
      },
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      const amount = Number(formValue.amount);

      if (this.summary && amount > this.summary.availableSavings) {
        this.error = `Insufficient savings. Available: €${this.summary.availableSavings.toFixed(2)}`;
        return;
      }

      this.loading = true;
      this.error = null;
      this.success = null;

      const withdrawal: ICreateWithdrawal = {
        amount,
        date: new Date(formValue.date),
        description: formValue.description || undefined,
      };

      this.withdrawalService.create(withdrawal).subscribe({
        next: () => {
          this.loading = false;
          this.success = 'Withdrawal created successfully';
          this.form.reset({
            amount: 0,
            date: new Date().toISOString().split('T')[0],
            description: '',
          });
          this.loadData();
        },
        error: (err) => {
          this.loading = false;
          let errorMsg = 'Failed to create withdrawal';
          if (err.error?.message) {
            errorMsg = err.error.message;
          } else if (err.message) {
            errorMsg = err.message;
          }
          this.error = errorMsg;
          console.error('Withdrawal creation error:', err);
        },
      });
    }
  }

  onDelete(id: string): void {
    if (confirm('Are you sure you want to delete this withdrawal?')) {
      this.withdrawalService.delete(id).subscribe({
        next: () => {
          this.loadData();
        },
        error: (err) => {
          this.error = 'Failed to delete withdrawal';
          console.error(err);
        },
      });
    }
  }
}

