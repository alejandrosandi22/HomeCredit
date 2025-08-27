// src/app/api/users/route.ts
import { requireAdmin } from '@/lib/auth';
import { userFiltersSchema, userSchema } from '@/lib/validations/user';
import type { User, UserResponse, UsersResponse } from '@/types/user';
import { NextRequest, NextResponse } from 'next/server';

// Mock data para desarrollo
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

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const filters = userFiltersSchema.parse({
      search: searchParams.get('search') || '',
      role: searchParams.get('role') || '',
      status: searchParams.get('status') || '',
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
    });

    // Simular delay de carga
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filteredUsers = [...mockUsers];

    // Aplicar filtros
    if (filters.search) {
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          user.email.toLowerCase().includes(filters.search.toLowerCase()),
      );
    }

    if (filters.role) {
      filteredUsers = filteredUsers.filter(
        (user) => user.role === filters.role,
      );
    }

    if (filters.status) {
      filteredUsers = filteredUsers.filter(
        (user) => user.status === filters.status,
      );
    }

    const response: UsersResponse = {
      success: true,
      data: filteredUsers,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / filters.limit),
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('GET /api/users error:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener usuarios' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const validatedData = userSchema.parse(body);

    // Simular delay de creación
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newUser: User = {
      id: Date.now().toString(),
      ...validatedData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockUsers.push(newUser);

    const response: UserResponse = {
      success: true,
      data: newUser,
      message: 'Usuario creado exitosamente',
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('POST /api/users error:', error);
    return NextResponse.json(
      { success: false, message: 'Error al crear usuario' },
      { status: 500 },
    );
  }
}
