import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from '../hero/hero.component';
import { FeaturesComponent } from '../features/features.component';
import { HowItWorksComponent } from '../how-it-works/how-it-works.component';
import { BenefitsComponent } from '../benefits/benefits.component';
import { TestimonialsComponent } from '../testimonials/testimonials.component';
import { StatisticsComponent } from '../statistics/statistics.component';
import { FaqComponent } from '../faq/faq.component';
import { CtaComponent } from '../cta/cta.component';
import { FooterComponent } from '../footer/footer.component';
import {
  IHeroStat,
  IFeature,
  IHowItWorksStep,
  IBenefit,
  ITestimonial,
  IStatistic,
  IFaq,
} from '../../models/landing.models';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,
    FeaturesComponent,
    HowItWorksComponent,
    BenefitsComponent,
    TestimonialsComponent,
    StatisticsComponent,
    FaqComponent,
    CtaComponent,
    FooterComponent,
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent {

  features: IFeature[] = [
    {
      icon: '📊',
      title: 'Track Weekly Sales',
      description: 'Monitor our business performance with detailed weekly analytics and insights.',
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
      description: 'Track your savings and plan for future investments in our business.',
    },
  ];

  stats: IHeroStat[] = [
    { value: '100%', label: 'Data Accuracy' },
    { value: '24/7', label: 'Access' },
    { value: 'Easy', label: 'To Use' },
    { value: 'Free', label: 'Forever' },
  ];

  howItWorksSteps: IHowItWorksStep[] = [
    {
      title: 'Sign Up Free',
      description: 'Create your account in seconds. No credit card required, completely free forever.',
    },
    {
      title: 'Add Your Data',
      description: 'Start tracking by entering your weekly sales, purchases, and savings data.',
    },
    {
      title: 'Analyze & Grow',
      description: 'View beautiful charts and insights to understand your business trends and make better decisions.',
    },
    {
      title: 'Plan Ahead',
      description: 'Use savings tracking and withdrawal features to plan for future investments.',
    },
  ];

  benefits: IBenefit[] = [
    {
      title: 'Save Time',
      description: 'Automate your weekly tracking and spend less time on manual calculations.',
    },
    {
      title: 'Make Better Decisions',
      description: 'Get clear insights into your profit trends and identify growth opportunities.',
    },
    {
      title: 'Track Everything',
      description: 'Monitor sales, profits, savings, and withdrawals all in one place.',
    },
    {
      title: 'Stay Organized',
      description: 'Keep all your business data organized with easy-to-use weekly records.',
    },
    {
      title: 'Visual Analytics',
      description: 'Understand your data at a glance with beautiful charts and graphs.',
    },
    {
      title: 'Free Forever',
      description: 'No hidden fees, no subscriptions. Use Blossom completely free for as long as you need.',
    },
  ];

  testimonials: ITestimonial[] = [
    {
      text: 'Blossom has completely transformed how I track my business. The analytics are incredible and help me make better decisions every week.',
      name: 'Sarah Johnson',
      role: 'Business Owner',
      avatar: 'SJ',
    },
    {
      text: 'I love how easy it is to use. I can track all my weekly data in minutes and see exactly where my business is heading.',
      name: 'Michael Chen',
      role: 'Entrepreneur',
      avatar: 'MC',
    },
    {
      text: 'The savings tracking feature is a game-changer. I can now plan my investments much better thanks to Blossom.',
      name: 'Emma Williams',
      role: 'Small Business Owner',
      avatar: 'EW',
    },
  ];

  statistics: IStatistic[] = [
    {
      icon: '📈',
      value: '35%',
      label: 'Average Profit Increase',
      description: 'Users see significant profit improvements after using Blossom',
    },
    {
      icon: '⏱️',
      value: '5 min',
      label: 'Setup Time',
      description: 'Get started and tracking in just 5 minutes',
    },
    {
      icon: '💰',
      value: '€2M+',
      label: 'Total Tracked',
      description: 'Combined revenue tracked by our users',
    },
    {
      icon: '🎯',
      value: '95%',
      label: 'User Satisfaction',
      description: 'Of users recommend Blossom to others',
    },
  ];

  faqs: IFaq[] = [
    {
      question: 'Is Blossom really free?',
      answer: 'Yes! Blossom is completely free forever. No credit card required, no hidden fees, no subscriptions. We believe in providing powerful business tools to everyone.',
    },
    {
      question: 'How do I get started?',
      answer: 'Simply click "Get Started" and create your account. Then start adding your weekly sales data. It takes less than 5 minutes to set up.',
    },
    {
      question: 'Can I track multiple businesses?',
      answer: 'Currently, Blossom is designed to track one business per account. You can create separate accounts for different businesses if needed.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. Your data is stored securely and privately. We use industry-standard encryption to protect your information.',
    },
    {
      question: 'Can I export my data?',
      answer: 'Yes, you can view and download all your data at any time. Your data belongs to you, and you have full control over it.',
    },
    {
      question: 'Do I need any technical knowledge?',
      answer: 'Not at all! Blossom is designed to be simple and intuitive. If you can use a smartphone, you can use Blossom.',
    },
  ];

}

