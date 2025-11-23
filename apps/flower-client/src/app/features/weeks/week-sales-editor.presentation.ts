import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CardComponent } from '../../shared/ui/components/card/card.component';
import { ButtonComponent } from '../../shared/ui/components/button/button.component';
import { InputComponent } from '../../shared/ui/components/input/input.component';

@Component({
  selector: 'app-week-sales-editor-presentation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardComponent, ButtonComponent, InputComponent],
  templateUrl: './week-sales-editor.presentation.html',
  styleUrl: './week-sales-editor.presentation.scss',
})
export class WeekSalesEditorPresentationComponent {
  @Input() form!: FormGroup;
  @Input() isEditMode: boolean = false;
  @Input() loading: boolean = false;
  @Input() error: string | null = null;
  @Output() submit = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onSubmit(): void {
    this.submit.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}

