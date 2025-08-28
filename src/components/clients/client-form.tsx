'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CreateClientData,
  UpdateClientData,
  createClientSchema,
  updateClientSchema,
} from '@/lib/validations/client';
import { ApplicationsFinal } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Input } from '../ui/input';

interface ClientFormProps {
  client?: ApplicationsFinal;
  onSubmit: (data: CreateClientData | UpdateClientData) => Promise<void>;
  isLoading?: boolean;
  mode: 'create' | 'edit';
}

export default function ClientForm({
  client,
  onSubmit,
  isLoading = false,
  mode,
}: ClientFormProps) {
  const form = useForm<CreateClientData | UpdateClientData>({
    resolver: zodResolver(
      mode === 'create' ? createClientSchema : updateClientSchema,
    ),
    defaultValues: client
      ? {
          skIdCurr: client.skIdCurr,
          target: client.target,
          nameContractType: client.nameContractType,
          codeGender: client.codeGender as 'M' | 'F' | 'XNA' | null,
          flagOwnCar: client.flagOwnCar,
          flagOwnRealty: client.flagOwnRealty,
          cntChildren: client.cntChildren,
          amtIncomeTotal: client.amtIncomeTotal,
          amtCredit: client.amtCredit,
          amtAnnuity: client.amtAnnuity,
          amtGoodsPrice: client.amtGoodsPrice,
          daysBirth: client.daysBirth,
          daysEmployed: client.daysEmployed,
          occupationType: client.occupationType,
          organizationType: client.organizationType,
          extSource1: client.extSource1,
          extSource2: client.extSource2,
          extSource3: client.extSource3,
          weekdayApprProcessStart: client.weekdayApprProcessStart,
          hourApprProcessStart: client.hourApprProcessStart,
        }
      : {
          skIdCurr: undefined,
          target: 0,
          nameContractType: '',
          codeGender: 'M',
          flagOwnCar: 0,
          flagOwnRealty: 0,
          cntChildren: 0,
          amtIncomeTotal: 0,
          amtCredit: 0,
          amtAnnuity: 0,
          amtGoodsPrice: 0,
          daysBirth: -9000,
          daysEmployed: -1000,
          occupationType: '',
          organizationType: '',
          extSource1: null,
          extSource2: null,
          extSource3: null,
          weekdayApprProcessStart: 'MONDAY',
          hourApprProcessStart: 10,
        },
  });

  const handleSubmit = async (data: CreateClientData | UpdateClientData) => {
    await onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-8'>
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
          {/* Basic Information */}
          <Card className='rounded-2xl border shadow-sm'>
            <CardHeader className='pb-4'>
              <CardTitle className='text-lg font-semibold'>
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className='grid gap-6'>
              <FormField
                control={form.control}
                name='skIdCurr'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client ID</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='Enter client ID'
                        disabled={mode === 'edit'}
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || undefined)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='codeGender'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select gender' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='M'>Male</SelectItem>
                        <SelectItem value='F'>Female</SelectItem>
                        <SelectItem value='XNA'>Not Available</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='nameContractType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contract Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select contract type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='Cash loans'>Cash loans</SelectItem>
                        <SelectItem value='Revolving loans'>
                          Revolving loans
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='target'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target (Default Risk)</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select target' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='0'>No Default (0)</SelectItem>
                        <SelectItem value='1'>Default (1)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Financial Information */}
          <Card className='rounded-2xl border shadow-sm'>
            <CardHeader className='pb-4'>
              <CardTitle className='text-lg font-semibold'>
                Financial Information
              </CardTitle>
            </CardHeader>
            <CardContent className='grid gap-6'>
              <FormField
                control={form.control}
                name='amtIncomeTotal'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Income</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='Enter total income'
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(
                            parseFloat(e.target.value) || undefined,
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='amtCredit'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Credit Amount</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='Enter credit amount'
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(
                            parseFloat(e.target.value) || undefined,
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='amtAnnuity'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loan Annuity</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='Enter loan annuity'
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(
                            parseFloat(e.target.value) || undefined,
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='amtGoodsPrice'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goods Price</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='Enter goods price'
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(
                            parseFloat(e.target.value) || undefined,
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Personal Details */}
          <Card className='rounded-2xl border shadow-sm'>
            <CardHeader className='pb-4'>
              <CardTitle className='text-lg font-semibold'>
                Personal Details
              </CardTitle>
            </CardHeader>
            <CardContent className='grid gap-6'>
              <FormField
                control={form.control}
                name='cntChildren'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Children</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        min='0'
                        max='20'
                        placeholder='Enter number of children'
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || undefined)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='flagOwnCar'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Owns Car</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select car ownership' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='0'>No</SelectItem>
                        <SelectItem value='1'>Yes</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='flagOwnRealty'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Owns Realty</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select realty ownership' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='0'>No</SelectItem>
                        <SelectItem value='1'>Yes</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='daysBirth'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Days Birth (Negative Value)</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='e.g., -9000 for ~25 years old'
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || undefined)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Employment Information */}
          <Card className='rounded-2xl border shadow-sm'>
            <CardHeader className='pb-4'>
              <CardTitle className='text-lg font-semibold'>
                Employment Information
              </CardTitle>
            </CardHeader>
            <CardContent className='grid gap-6'>
              <FormField
                control={form.control}
                name='occupationType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Occupation Type</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='e.g., Laborers, Core staff, etc.'
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.value || null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='organizationType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Type</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='e.g., Business Entity Type 3, etc.'
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(e.target.value || undefined)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='daysEmployed'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Days Employed (Negative Value)</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='e.g., -1000 for ~3 years employed'
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || undefined)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* External Sources */}
          <Card className='rounded-2xl border shadow-sm'>
            <CardHeader className='pb-4'>
              <CardTitle className='text-lg font-semibold'>
                External Credit Sources
              </CardTitle>
            </CardHeader>
            <CardContent className='grid gap-6'>
              <FormField
                control={form.control}
                name='extSource1'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>External Source 1 (0-1)</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        step='0.01'
                        min='0'
                        max='1'
                        placeholder='0.0 - 1.0'
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(
                            parseFloat(e.target.value) || undefined,
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='extSource2'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>External Source 2 (0-1)</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        step='0.01'
                        min='0'
                        max='1'
                        placeholder='0.0 - 1.0'
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(
                            parseFloat(e.target.value) || undefined,
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='extSource3'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>External Source 3 (0-1)</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        step='0.01'
                        min='0'
                        max='1'
                        placeholder='0.0 - 1.0'
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(
                            parseFloat(e.target.value) || undefined,
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Application Process */}
          <Card className='rounded-2xl border shadow-sm'>
            <CardHeader className='pb-4'>
              <CardTitle className='text-lg font-semibold'>
                Application Process
              </CardTitle>
            </CardHeader>
            <CardContent className='grid gap-6'>
              <FormField
                control={form.control}
                name='weekdayApprProcessStart'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Application Weekday</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select weekday' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='MONDAY'>Monday</SelectItem>
                        <SelectItem value='TUESDAY'>Tuesday</SelectItem>
                        <SelectItem value='WEDNESDAY'>Wednesday</SelectItem>
                        <SelectItem value='THURSDAY'>Thursday</SelectItem>
                        <SelectItem value='FRIDAY'>Friday</SelectItem>
                        <SelectItem value='SATURDAY'>Saturday</SelectItem>
                        <SelectItem value='SUNDAY'>Sunday</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='hourApprProcessStart'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Application Hour (0-23)</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        min='0'
                        max='23'
                        placeholder='e.g., 10 for 10 AM'
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || undefined)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        <div className='flex justify-end'>
          <Button
            type='submit'
            disabled={isLoading}
            className='min-w-[160px] rounded-xl shadow-md'
          >
            {isLoading
              ? 'Saving...'
              : mode === 'create'
                ? 'Create Client'
                : 'Update Client'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
