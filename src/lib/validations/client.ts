import { ClientStatus } from '@/types/client';
import { LoanStatus, LoanType } from '@/types/loan';
import { z } from 'zod';

export const createClientSchema = z.object({
  firstName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede tener más de 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras'),

  lastName: z
    .string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede tener más de 50 caracteres')
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      'El apellido solo puede contener letras',
    ),

  identification: z
    .string()
    .min(8, 'La identificación debe tener al menos 8 caracteres')
    .max(20, 'La identificación no puede tener más de 20 caracteres')
    .regex(/^[0-9A-Za-z-]+$/, 'Formato de identificación inválido'),

  email: z
    .string()
    .email({ message: 'Email inválido' })
    .max(100, 'El email no puede tener más de 100 caracteres'),

  phone: z
    .string()
    .min(8, 'El teléfono debe tener al menos 8 dígitos')
    .max(15, 'El teléfono no puede tener más de 15 dígitos')
    .regex(/^[+]?[0-9\s\-()]+$/, 'Formato de teléfono inválido'),

  address: z
    .string()
    .min(10, 'La dirección debe tener al menos 10 caracteres')
    .max(200, 'La dirección no puede tener más de 200 caracteres'),

  dateOfBirth: z.date().refine((date) => {
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    return age >= 18 && age <= 100;
  }, 'El cliente debe ser mayor de 18 años y menor de 100 años'),
});

export const updateClientSchema = createClientSchema.partial().extend({
  status: z
    .enum(Object.values(ClientStatus) as [string, ...string[]])
    .optional(),
});

export const clientFiltersSchema = z.object({
  search: z.string().optional(),
  creditScore: z
    .object({
      min: z.number().min(300).max(850).optional(),
      max: z.number().min(300).max(850).optional(),
    })
    .optional(),
  loanType: z.enum(Object.values(LoanType) as [string, ...string[]]).optional(),
  status: z
    .enum(Object.values(ClientStatus) as [string, ...string[]])
    .optional(),
  loanStatus: z
    .enum(Object.values(LoanStatus) as [string, ...string[]])
    .optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
});

export type CreateClientFormData = z.infer<typeof createClientSchema>;
export type UpdateClientFormData = z.infer<typeof updateClientSchema>;
export type ClientFiltersFormData = z.infer<typeof clientFiltersSchema>;
