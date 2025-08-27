// src/app/api/users/[id]/route.ts
import { requireAdmin } from '@/lib/auth';
import { updateUserSchema } from '@/lib/validations/user';
import type { User, UserResponse } from '@/types/user';
import { NextRequest, NextResponse } from 'next/server';

// Mock data para desarrollo (en producción vendría de una base de datos)
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    email: 'user@example.com',
    name: 'Regular User',
    role: 'user',
    status: 'active',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    email: 'inactive@example.com',
    name: 'Inactive User',
    role: 'user',
    status: 'inactive',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
  },
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await requireAdmin();

    const user = mockUsers.find((u) => u.id === params.id);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Usuario no encontrado' },
        { status: 404 },
      );
    }

    const response: UserResponse = {
      success: true,
      data: user,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('GET /api/users/[id] error:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener usuario' },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await requireAdmin();

    const body = await request.json();
    const validatedData = updateUserSchema.parse({ ...body, id: params.id });

    const userIndex = mockUsers.findIndex((u) => u.id === params.id);

    if (userIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Usuario no encontrado' },
        { status: 404 },
      );
    }

    // Simular delay de actualización
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const updatedUser: User = {
      ...mockUsers[userIndex],
      ...validatedData,
      updatedAt: new Date().toISOString(),
    };

    mockUsers[userIndex] = updatedUser;

    const response: UserResponse = {
      success: true,
      data: updatedUser,
      message: 'Usuario actualizado exitosamente',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('PUT /api/users/[id] error:', error);
    return NextResponse.json(
      { success: false, message: 'Error al actualizar usuario' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await requireAdmin();

    const userIndex = mockUsers.findIndex((u) => u.id === params.id);

    if (userIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Usuario no encontrado' },
        { status: 404 },
      );
    }

    // Simular delay de eliminación
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const deletedUser = mockUsers.splice(userIndex, 1)[0];

    const response: UserResponse = {
      success: true,
      data: deletedUser,
      message: 'Usuario eliminado exitosamente',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('DELETE /api/users/[id] error:', error);
    return NextResponse.json(
      { success: false, message: 'Error al eliminar usuario' },
      { status: 500 },
    );
  }
}
