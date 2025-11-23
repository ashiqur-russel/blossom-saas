/**
 * Landing page data models
 * Centralized interfaces for landing page sections
 */

export interface IHeroStat {
  value: string;
  label: string;
}

export interface IFeature {
  icon: string;
  title: string;
  description: string;
}

export interface IHowItWorksStep {
  title: string;
  description: string;
}

export interface IBenefit {
  title: string;
  description: string;
}

export interface ITestimonial {
  text: string;
  name: string;
  role: string;
  avatar: string;
}

export interface IStatistic {
  icon: string;
  value: string;
  label: string;
  description: string;
}

export interface IFaq {
  question: string;
  answer: string;
}


