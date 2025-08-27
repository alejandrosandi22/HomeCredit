import { LoanStatus, LoanType } from '@/types/loan';
import { z } from 'zod';

export const createLoanSchema = z.object({
  clientId: z.string().min(1, 'Cliente es requerido'),
  amount: z
    .number()
    .min(1000, 'El monto mínimo es $1,000')
    .max(1000000, 'El monto máximo es $1,000,000'),
  term: z
    .number()
    .min(6, 'El plazo mínimo es 6 meses')
    .max(360, 'El plazo máximo es 360 meses'),
  interestRate: z
    .number()
    .min(0.1, 'La tasa mínima es 0.1%')
    .max(50, 'La tasa máxima es 50%'),
  loanType: z.enum(LoanType, {
    error: 'Tipo de préstamo inválido',
  }),
});

export const updateLoanSchema = createLoanSchema.partial().extend({
  status: z.enum(LoanStatus).optional(),
});

export type CreateLoanFormData = z.infer<typeof createLoanSchema>;
export type UpdateLoanFormData = z.infer<typeof updateLoanSchema>;
