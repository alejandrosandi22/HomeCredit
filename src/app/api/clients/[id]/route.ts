import { updateClientSchema } from '@/lib/validations/client';
import { ClientStatus, type Client } from '@/types/client';
import { NextRequest, NextResponse } from 'next/server';

const mockClients: Client[] = [
  {
    id: '1',
    firstName: 'Juan',
    lastName: 'Pérez',
    identification: '12345678901',
    email: 'juan.perez@email.com',
    phone: '+506 8888-8888',
    address: 'San Jos�, Costa Rica',
    dateOfBirth: new Date('1985-03-15'),
    creditScore: 750,
    status: ClientStatus.ACTIVE as const,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15'),
    loans: [],
    payments: [],
  },
  {
    id: '2',
    firstName: 'María',
    lastName: 'Gonz�lez',
    identification: '98765432109',
    email: 'maria.gonzalez@email.com',
    phone: '+506 7777-7777',
    address: 'Cartago, Costa Rica',
    dateOfBirth: new Date('1990-07-22'),
    creditScore: 680,
    status: ClientStatus.ACTIVE as const,
    createdAt: new Date('2023-02-10'),
    updatedAt: new Date('2023-02-10'),
    loans: [],
    payments: [],
  },
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const clientId = params.id;

    if (!clientId) {
      return NextResponse.json(
        { error: 'ID del cliente es requerido' },
        { status: 400 },
      );
    }

    const client = mockClients.find((c) => c.id === clientId);

    if (!client) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 },
      );
    }

    return NextResponse.json(client);
  } catch (error) {
    console.error('Error fetching client:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const clientId = params.id;

    if (!clientId) {
      return NextResponse.json(
        { error: 'ID del cliente es requerido' },
        { status: 400 },
      );
    }

    const clientIndex = mockClients.findIndex((c) => c.id === clientId);

    if (clientIndex === -1) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 },
      );
    }

    const body = await request.json();
    const validatedData = updateClientSchema.parse(body);

    const updatedClient: Client = {
      ...mockClients[clientIndex],
      ...validatedData,
      status: validatedData.status as ClientStatus,
      updatedAt: new Date(),
    };

    mockClients[clientIndex] = updatedClient;

    return NextResponse.json(updatedClient);
  } catch (error) {
    console.error('Error updating client:', error);
    if (error instanceof Error && 'issues' in error) {
      return NextResponse.json(
        { error: 'Datos de entrada inv�lidos', details: error },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const clientId = params.id;

    if (!clientId) {
      return NextResponse.json(
        { error: 'ID del cliente es requerido' },
        { status: 400 },
      );
    }

    const clientIndex = mockClients.findIndex((c) => c.id === clientId);

    if (clientIndex === -1) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 },
      );
    }

    // Check if client has active loans before deletion
    const client = mockClients[clientIndex];
    const hasActiveLoans = client.loans && client.loans.length > 0;

    if (hasActiveLoans) {
      return NextResponse.json(
        { error: 'No se puede eliminar un cliente con pr�stamos activos' },
        { status: 409 },
      );
    }

    // Remove client from mock database
    mockClients.splice(clientIndex, 1);

    return NextResponse.json(
      { message: 'Cliente eliminado exitosamente' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    );
  }
}
