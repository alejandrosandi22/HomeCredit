import { z } from 'zod';

export const userSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Por favor ingresa un email válido')
    .toLowerCase()
    .trim(),
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .trim(),
  role: z.enum(['admin', 'user'], {
    message: 'El rol debe ser admin o user',
  }),
  status: z.enum(['active', 'inactive'], {
    message: 'El estado debe ser activo o inactivo',
  }),
});

export const updateUserSchema = userSchema.partial().extend({
  id: z.string().min(1, 'El ID es requerido'),
});

export const userFiltersSchema = z.object({
  search: z.string().optional().default(''),
  role: z.string().optional().default(''),
  status: z.string().optional().default(''),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(10),
});

export type UserFormSchema = z.infer<typeof userSchema>;
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
export type UserFiltersSchema = z.infer<typeof userFiltersSchema>;
