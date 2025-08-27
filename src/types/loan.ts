import { Client, Payment } from './client';

export interface Loan {
  id: string;
  clientId: string;
  amount: number;
  interestRate: number;
  term: number;
  loanType: LoanType;
  status: LoanStatus;
  approvedAt: Date;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  client: Client;
  payments: Payment[];
}

export enum LoanType {
  PERSONAL = 'PERSONAL',
  MORTGAGE = 'MORTGAGE',
  BUSINESS = 'BUSINESS',
  AUTO = 'AUTO',
  EDUCATION = 'EDUCATION',
}

export enum LoanStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  DEFAULTED = 'DEFAULTED',
  REJECTED = 'REJECTED',
}

export interface LoanDetails extends Loan {
  totalPaid: number;
  remainingBalance: number;
  nextPaymentDue: Date | null;
  paymentStatus: 'current' | 'late' | 'defaulted';
  monthlyPayment: number;
  totalAmount: number;
}

export interface LoanDetails extends Loan {
  totalPaid: number;
  remainingBalance: number;
  nextPaymentDue: Date | null;
  paymentStatus: 'current' | 'late' | 'defaulted';
  monthlyPayment: number;
  totalAmount: number;
}

export type CreateLoanData = {
  clientId: string;
  amount: number;
  term: number;
  interestRate: number;
  loanType: LoanType;
};

export type UpdateLoanData = Partial<CreateLoanData> & {
  status?: LoanStatus;
};
