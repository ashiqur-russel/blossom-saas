import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent {
  mobileMenuOpen = false;

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  features = [
    {
      icon: '📊',
      title: 'Track Weekly Sales',
      description: 'Monitor your flower business performance with detailed weekly analytics and insights.',
    },
    {
      icon: '💰',
      title: 'Profit Analysis',
      description: 'Understand your profit trends and optimize your business strategy for better returns.',
    },
    {
      icon: '📈',
      title: 'Visual Reports',
      description: 'Beautiful charts and graphs to visualize your sales data and business growth.',
    },
    {
      icon: '💾',
      title: 'Save & Plan',
      description: 'Track your savings and plan for future investments in your flower business.',
    },
  ];

  stats = [
    { value: '100%', label: 'Data Accuracy' },
    { value: '24/7', label: 'Access' },
    { value: 'Easy', label: 'To Use' },
    { value: 'Free', label: 'Forever' },
  ];
}

