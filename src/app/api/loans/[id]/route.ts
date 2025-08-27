import { updateLoanSchema } from '@/lib/validations/loan';
import {
  Client,
  ClientStatus,
  Payment,
  PaymentMethod,
  PaymentStatus,
} from '@/types/client';
import { Loan, LoanDetails, LoanStatus, LoanType } from '@/types/loan';
import { NextRequest, NextResponse } from 'next/server';

// Mock data - Same as in main route (in real app, this would come from database)
const mockClients: Client[] = [
  {
    id: '1',
    firstName: 'Juan',
    lastName: 'Pérez',
    identification: '12345678901',
    email: 'juan@email.com',
    phone: '555-0001',
    address: 'Calle 123, Ciudad',
    dateOfBirth: new Date('1985-03-15'),
    creditScore: 750,
    status: ClientStatus.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
    loans: [],
    payments: [],
  },
  {
    id: '2',
    firstName: 'María',
    lastName: 'González',
    identification: '23456789012',
    email: 'maria@email.com',
    phone: '555-0002',
    address: 'Avenida 456, Ciudad',
    dateOfBirth: new Date('1990-07-22'),
    creditScore: 680,
    status: ClientStatus.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
    loans: [],
    payments: [],
  },
  {
    id: '3',
    firstName: 'Carlos',
    lastName: 'Rodriguez',
    identification: '34567890123',
    email: 'carlos@email.com',
    phone: '555-0003',
    address: 'Plaza 789, Ciudad',
    dateOfBirth: new Date('1982-11-08'),
    creditScore: 620,
    status: ClientStatus.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
    loans: [],
    payments: [],
  },
];

const mockLoans: Loan[] = [
  {
    id: '1',
    clientId: '1',
    amount: 50000,
    term: 24,
    interestRate: 12.5,
    loanType: LoanType.PERSONAL,
    status: LoanStatus.ACTIVE,
    approvedAt: new Date('2024-01-15'),
    dueDate: new Date('2026-01-15'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    client: mockClients[0],
    payments: [],
  },
  {
    id: '2',
    clientId: '2',
    amount: 25000,
    term: 12,
    interestRate: 15.0,
    loanType: LoanType.AUTO,
    status: LoanStatus.ACTIVE,
    approvedAt: new Date('2024-02-01'),
    dueDate: new Date('2025-02-01'),
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    client: mockClients[1],
    payments: [],
  },
];

const mockPayments: Payment[] = [
  {
    id: '1',
    loanId: '1',
    clientId: '1',
    amount: 2387.5,
    paymentDate: new Date('2024-02-15'),
    paymentMethod: 'BANK_TRANSFER' as PaymentMethod,
    status: PaymentStatus.COMPLETED,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
    loan: mockLoans[0],
    client: mockClients[0],
  },
  {
    id: '2',
    loanId: '1',
    clientId: '1',
    amount: 2387.5,
    paymentDate: new Date('2024-03-15'),
    paymentMethod: 'BANK_TRANSFER' as PaymentMethod,
    status: PaymentStatus.COMPLETED,
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-15'),
    loan: mockLoans[0],
    client: mockClients[0],
  },
  {
    id: '3',
    loanId: '1',
    clientId: '1',
    amount: 0,
    paymentDate: new Date('2024-04-15'),
    paymentMethod: 'BANK_TRANSFER' as PaymentMethod,
    status: PaymentStatus.PENDING,
    createdAt: new Date('2024-04-15'),
    updatedAt: new Date('2024-04-15'),
    loan: mockLoans[0],
    client: mockClients[0],
  },
];

function calculateLoanDetails(
  amount: number,
  term: number,
  interestRate: number,
) {
  const monthlyRate = interestRate / 100 / 12;
  const monthlyPayment =
    (amount * (monthlyRate * Math.pow(1 + monthlyRate, term))) /
    (Math.pow(1 + monthlyRate, term) - 1);
  const totalAmount = monthlyPayment * term;

  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
  };
}

function getLoanDetails(loanId: string): LoanDetails | null {
  const loan = mockLoans.find((l) => l.id === loanId);
  if (!loan) return null;

  const client = mockClients.find((c) => c.id === loan.clientId);
  if (!client) {
    throw new Error(`Client not found for loan ${loanId}`);
  }

  const payments = mockPayments.filter((p) => p.loanId === loanId);

  const totalPaid = payments
    .filter((p) => p.status === PaymentStatus.COMPLETED)
    .reduce((sum, p) => sum + p.amount, 0);
  const { monthlyPayment, totalAmount } = calculateLoanDetails(
    loan.amount,
    loan.term,
    loan.interestRate,
  );
  const remainingBalance = loan.amount - totalPaid;

  const nextPayment = payments.find((p) => p.status === PaymentStatus.PENDING);
  const nextPaymentDue = nextPayment ? nextPayment.paymentDate : null;

  // Determine payment status
  let paymentStatus: 'current' | 'late' | 'defaulted' = 'current';
  if (nextPayment && new Date() > nextPayment.paymentDate) {
    const daysLate = Math.floor(
      (Date.now() - nextPayment.paymentDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    paymentStatus = daysLate > 90 ? 'defaulted' : 'late';
  }

  return {
    ...loan,
    client,
    payments,
    totalPaid,
    remainingBalance,
    nextPaymentDue,
    paymentStatus,
    monthlyPayment,
    totalAmount,
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const loanDetails = getLoanDetails(params.id);

    if (!loanDetails) {
      return NextResponse.json(
        { error: 'Préstamo no encontrado' },
        { status: 404 },
      );
    }

    return NextResponse.json(loanDetails);
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Error al obtener detalles del préstamo',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const loanIndex = mockLoans.findIndex((l) => l.id === params.id);
    if (loanIndex === -1) {
      return NextResponse.json(
        { error: 'Préstamo no encontrado' },
        { status: 404 },
      );
    }

    const body = await request.json();
    const validationResult = updateLoanSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validationResult.error },
        { status: 400 },
      );
    }

    // Update loan
    mockLoans[loanIndex] = {
      ...mockLoans[loanIndex],
      ...validationResult.data,
      updatedAt: new Date(),
    };

    const updatedLoanDetails = getLoanDetails(params.id);
    return NextResponse.json(updatedLoanDetails);
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Error al actualizar préstamo',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const loanIndex = mockLoans.findIndex((l) => l.id === params.id);
    if (loanIndex === -1) {
      return NextResponse.json(
        { error: 'Préstamo no encontrado' },
        { status: 404 },
      );
    }

    mockLoans.splice(loanIndex, 1);

    return NextResponse.json({ message: 'Préstamo eliminado correctamente' });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Error al eliminar préstamo',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 },
    );
  }
}
