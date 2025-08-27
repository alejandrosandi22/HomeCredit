import { z } from 'zod';

export const dashboardFiltersSchema = z.object({
  dateRange: z.object({
    from: z.string().min(1, 'Fecha de inicio es requerida'),
    to: z.string().min(1, 'Fecha de fin es requerida'),
  }),
  region: z.string().default('all'),
  loanAmount: z.object({
    min: z.number().min(0, 'Monto mínimo debe ser mayor a 0'),
    max: z.number().min(0, 'Monto máximo debe ser mayor a 0'),
  }),
});

export type DashboardFiltersFormData = z.infer<typeof dashboardFiltersSchema>;
