import { createLoanSchema } from '@/lib/validations/loan';
import { ClientStatus, type Client } from '@/types/client';
import { Loan, LoanStatus, LoanType } from '@/types/loan';
import { NextRequest, NextResponse } from 'next/server';

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

function validateBusinessRules(
  clientId: string,
  amount: number,
): { valid: boolean; error?: string } {
  const client = mockClients.find((c) => c.id === clientId);

  if (!client) {
    return { valid: false, error: 'Cliente no encontrado' };
  }

  // Business rule: Minimum credit score of 600
  if (client.creditScore < 600) {
    return {
      valid: false,
      error: `Score de crédito insuficiente (${client.creditScore}). Mínimo requerido: 600`,
    };
  }

  // Business rule: Maximum loan amount based on credit score
  const maxAmount =
    client.creditScore >= 750
      ? 500000
      : client.creditScore >= 700
        ? 300000
        : 100000;
  if (amount > maxAmount) {
    return {
      valid: false,
      error: `Monto excede el límite permitido para este score (${client.creditScore}). Máximo: $${maxAmount.toLocaleString()}`,
    };
  }

  return { valid: true };
}

export async function GET() {
  try {
    // Add client data to loans
    const loansWithClients = mockLoans.map((loan) => ({
      ...loan,
      client: mockClients.find((client) => client.id === loan.clientId),
    }));

    return NextResponse.json(loansWithClients);
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: 'Error al obtener préstamos',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = createLoanSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validationResult.error },
        { status: 400 },
      );
    }

    const { clientId, amount, term, interestRate, loanType } =
      validationResult.data;

    // Validate business rules
    const businessValidation = validateBusinessRules(clientId, amount);
    if (!businessValidation.valid) {
      return NextResponse.json(
        { error: businessValidation.error },
        { status: 400 },
      );
    }

    // Create new loan
    const newLoan: Loan = {
      id: (mockLoans.length + 1).toString(),
      clientId,
      amount,
      term,
      interestRate,
      loanType,
      status: LoanStatus.APPROVED,
      approvedAt: new Date(),
      dueDate: new Date(Date.now() + term * 30 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
      client: mockClients.find((client) => client.id === clientId)!,
      payments: [],
    };

    mockLoans.push(newLoan);

    // Return loan with client data
    const loanWithClient = {
      ...newLoan,
      client: mockClients.find((client) => client.id === clientId),
    };

    return NextResponse.json(loanWithClient, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Error al crear préstamo',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 },
    );
  }
}
