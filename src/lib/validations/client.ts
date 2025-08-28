import { z } from 'zod';

export const clientSchema = z
  .object({
    skIdCurr: z.number().min(1, 'Client ID must be greater than 0'),
    target: z.number().min(0).max(1).nullable().optional(),
    nameContractType: z
      .string()
      .min(1, 'Contract type is required')
      .nullable()
      .optional(),
    codeGender: z.enum(['M', 'F', 'XNA']).nullable().optional(),
    flagOwnCar: z.number().min(0).max(1).nullable().optional(),
    flagOwnRealty: z.number().min(0).max(1).nullable().optional(),
    cntChildren: z.number().min(0).max(20).nullable().optional(),
    amtIncomeTotal: z
      .number()
      .min(0, 'Income must be positive')
      .nullable()
      .optional(),
    amtCredit: z
      .number()
      .min(0, 'Credit amount must be positive')
      .nullable()
      .optional(),
    amtAnnuity: z
      .number()
      .min(0, 'Annuity must be positive')
      .nullable()
      .optional(),
    amtGoodsPrice: z
      .number()
      .min(0, 'Goods price must be positive')
      .nullable()
      .optional(),
    daysBirth: z
      .number()
      .max(0, 'Days birth should be negative')
      .nullable()
      .optional(),
    daysEmployed: z.number().nullable().optional(),
    occupationType: z.string().max(100).nullable().optional(),
    organizationType: z.string().max(100).nullable().optional(),
    extSource1: z.number().min(0).max(1).nullable().optional(),
    extSource2: z.number().min(0).max(1).nullable().optional(),
    extSource3: z.number().min(0).max(1).nullable().optional(),
    weekdayApprProcessStart: z.string().nullable().optional(),
    hourApprProcessStart: z.number().min(0).max(23).nullable().optional(),
  })
  .refine(
    (data) => {
      if (data.daysBirth && Math.abs(data.daysBirth) / 365 < 18) {
        return false;
      }
      if (
        data.amtAnnuity &&
        data.amtCredit &&
        data.amtAnnuity > data.amtCredit
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        'Client must be at least 18 years old and annuity cannot exceed credit amount',
    },
  );

export const createClientSchema = clientSchema;
export const updateClientSchema = clientSchema.partial().extend({
  skIdCurr: z.number().min(1, 'Client ID must be greater than 0'),
});

export type CreateClientData = z.infer<typeof createClientSchema>;
export type UpdateClientData = z.infer<typeof updateClientSchema>;
