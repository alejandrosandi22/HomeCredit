import { Client, ClientStatus } from '@/types/client';
import { NextResponse } from 'next/server';

// Mock clients data
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
  {
    id: '4',
    firstName: 'Ana',
    lastName: 'Martínez',
    identification: '45678901234',
    email: 'ana@email.com',
    phone: '555-0004',
    address: 'Boulevard 101, Ciudad',
    dateOfBirth: new Date('1988-12-03'),
    creditScore: 720,
    status: ClientStatus.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
    loans: [],
    payments: [],
  },
  {
    id: '5',
    firstName: 'Roberto',
    lastName: 'Silva',
    identification: '56789012345',
    email: 'roberto@email.com',
    phone: '555-0005',
    address: 'Carrera 202, Ciudad',
    dateOfBirth: new Date('1975-09-18'),
    creditScore: 550,
    status: ClientStatus.SUSPENDED,
    createdAt: new Date(),
    updatedAt: new Date(),
    loans: [],
    payments: [],
  },
];

export async function GET() {
  try {
    return NextResponse.json(mockClients);
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Error al obtener clientes',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 },
    );
  }
}
