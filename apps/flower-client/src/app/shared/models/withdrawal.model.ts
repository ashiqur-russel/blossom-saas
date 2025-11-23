/**
 * Withdrawal model interfaces
 * Centralized type definitions for withdrawal entities
 */

export interface IWithdrawal {
  id: string;
  amount: number;
  date: Date;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateWithdrawal {
  amount: number;
  date: Date;
  description?: string;
}

export interface IWithdrawalSummary {
  totalWithdrawals: number;
  totalSavings: number;
  availableSavings: number;
  totalWithdrawalCount: number;
}

