import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IFaq } from '../../models/landing.models';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss',
})
export class FaqComponent {
  @Input() faqs: IFaq[] = [];
  openFaqIndex: number | null = null;

  toggleFaq(index: number): void {
    this.openFaqIndex = this.openFaqIndex === index ? null : index;
  }
}

