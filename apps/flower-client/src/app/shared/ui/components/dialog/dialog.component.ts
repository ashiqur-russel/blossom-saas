import { Component, Input, Output, EventEmitter, TemplateRef, ContentChild, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent {
  @Input() open: boolean = false;
  @Input() title: string = '';
  @Input() description: string = '';
  @Output() openChange = new EventEmitter<boolean>();

  @ViewChild('dialogOverlay', { static: false }) overlayRef?: ElementRef<HTMLElement>;
  @ViewChild('dialogContent', { static: false }) contentRef?: ElementRef<HTMLElement>;

  close(): void {
    this.open = false;
    this.openChange.emit(false);
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === this.overlayRef?.nativeElement) {
      this.close();
    }
  }

  onContentClick(event: MouseEvent): void {
    event.stopPropagation();
  }
}

