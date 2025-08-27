import { Loan, LoanStatus, LoanType } from './loan';

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  identification: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: Date;
  creditScore: number;
  status: ClientStatus;
  createdAt: Date;
  updatedAt: Date;
  loans: Loan[];
  payments: Payment[];
}

export interface Payment {
  id: string;
  loanId: string;
  clientId: string;
  amount: number;
  paymentDate: Date;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
  loan: Loan;
  client: Client;
}

export enum ClientStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING = 'PENDING',
}

export enum PaymentMethod {
  CASH = 'CASH',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  CHECK = 'CHECK',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export interface ClientFilters {
  search?: string;
  creditScore?: {
    min?: number;
    max?: number;
  };
  loanType?: LoanType;
  status?: ClientStatus;
  loanStatus?: LoanStatus;
}

export interface ClientListResponse {
  clients: Client[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateClientRequest {
  firstName: string;
  lastName: string;
  identification: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: Date;
}

export interface UpdateClientRequest extends Partial<CreateClientRequest> {
  status?: ClientStatus;
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
