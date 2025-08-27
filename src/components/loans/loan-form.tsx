'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  createLoanSchema,
  type CreateLoanFormData,
} from '@/lib/validations/loan';
import type { Client } from '@/types/client';
import { LoanType, type Loan } from '@/types/loan';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertCircle,
  AlertTriangle,
  Calculator,
  CheckCircle,
  User,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

interface LoanFormProps {
  onSuccess: (loan: Loan) => void;
  editLoan?: Loan;
  onCancel?: () => void;
}

const loanTypeLabels: Record<LoanType, string> = {
  [LoanType.PERSONAL]: 'Personal',
  [LoanType.MORTGAGE]: 'Hipotecario',
  [LoanType.BUSINESS]: 'Empresarial',
  [LoanType.AUTO]: 'Automotriz',
  [LoanType.EDUCATION]: 'Educativo',
};

export default function LoanForm({
  onSuccess,
  editLoan,
  onCancel,
}: LoanFormProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [loanCalculation, setLoanCalculation] = useState<{
    monthlyPayment: number;
    totalAmount: number;
    totalInterest: number;
  } | null>(null);

  const form = useForm<CreateLoanFormData>({
    resolver: zodResolver(createLoanSchema),
    defaultValues: editLoan
      ? {
          clientId: editLoan.clientId,
          amount: editLoan.amount,
          term: editLoan.term,
          interestRate: editLoan.interestRate,
          loanType: editLoan.loanType,
        }
      : {
          clientId: '',
          amount: 0,
          term: 12,
          interestRate: 12,
          loanType: LoanType.PERSONAL,
        },
  });

  const watchedValues = form.watch();

  // Load clients on component mount
  useEffect(() => {
    const loadClients = async () => {
      try {
        setIsLoadingClients(true);
        const response = await fetch('/api/clients');

        if (!response.ok) {
          throw new Error('Error al cargar clientes');
        }

        const clientsData = await response.json();
        setClients(clientsData);

        // If editing, set the selected client
        if (editLoan) {
          const client = clientsData.find(
            (c: Client) => c.id === editLoan.clientId,
          );
          setSelectedClient(client || null);
        }
      } catch (error) {
        console.error('Error loading clients:', error);
        setError('Error al cargar la lista de clientes');
      } finally {
        setIsLoadingClients(false);
      }
    };

    loadClients();
  }, [editLoan]);

  // Update selected client when clientId changes
  useEffect(() => {
    if (watchedValues.clientId && clients.length > 0) {
      const client = clients.find((c) => c.id === watchedValues.clientId);
      setSelectedClient(client || null);
    } else {
      setSelectedClient(null);
    }
  }, [watchedValues.clientId, clients]);

  // Calculate loan details when values change
  useEffect(() => {
    if (
      watchedValues.amount > 0 &&
      watchedValues.term > 0 &&
      watchedValues.interestRate > 0
    ) {
      const principal = watchedValues.amount;
      const monthlyRate = watchedValues.interestRate / 100 / 12;
      const numberOfPayments = watchedValues.term;

      // Calculate monthly payment using the standard loan formula
      const monthlyPayment =
        (principal *
          (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

      const totalAmount = monthlyPayment * numberOfPayments;
      const totalInterest = totalAmount - principal;

      setLoanCalculation({
        monthlyPayment: Math.round(monthlyPayment * 100) / 100,
        totalAmount: Math.round(totalAmount * 100) / 100,
        totalInterest: Math.round(totalInterest * 100) / 100,
      });
    } else {
      setLoanCalculation(null);
    }
  }, [watchedValues.amount, watchedValues.term, watchedValues.interestRate]);

  const onSubmit = async (data: CreateLoanFormData) => {
    if (!selectedClient) {
      setError('Por favor seleccione un cliente válido');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const url = editLoan ? `/api/loans/${editLoan.id}` : '/api/loans';
      const method = editLoan ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al procesar el préstamo');
      }

      // Call success callback
      onSuccess(result);
    } catch (error) {
      console.error('Error submitting loan:', error);
      setError(
        error instanceof Error
          ? error.message
          : 'Error desconocido al procesar el préstamo',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getClientFullName = (client: Client): string => {
    return `${client.firstName} ${client.lastName}`.trim();
  };

  const getCreditScoreColor = (creditScore: number): string => {
    if (creditScore >= 750) return 'text-green-600 dark:text-green-400';
    if (creditScore >= 700) return 'text-blue-600 dark:text-blue-400';
    if (creditScore >= 650) return 'text-yellow-600 dark:text-yellow-400';
    if (creditScore >= 600) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getCreditScoreLabel = (creditScore: number): string => {
    if (creditScore >= 750) return 'Excelente';
    if (creditScore >= 700) return 'Bueno';
    if (creditScore >= 650) return 'Regular';
    if (creditScore >= 600) return 'Aceptable';
    return 'Insuficiente';
  };

  const getMaxLoanAmount = (creditScore: number): number => {
    if (creditScore >= 750) return 500000;
    if (creditScore >= 700) return 300000;
    if (creditScore >= 600) return 100000;
    return 0;
  };

  return (
    <Card className='mx-auto w-full max-w-4xl'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Calculator className='h-5 w-5' />
          {editLoan ? 'Editar Préstamo' : 'Nuevo Préstamo'}
        </CardTitle>
        <CardDescription>
          {editLoan
            ? 'Modifica los datos del préstamo existente'
            : 'Complete la información para crear un nuevo préstamo'}
        </CardDescription>
      </CardHeader>

      <CardContent className='space-y-6'>
        {/* Error Alert */}
        {error && (
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {/* Client and Loan Type Selection */}
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='clientId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isLoadingClients || isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          {isLoadingClients ? (
                            <Skeleton className='h-4 w-full' />
                          ) : (
                            <SelectValue placeholder='Seleccione un cliente' />
                          )}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            <div className='flex flex-col'>
                              <span className='font-medium'>
                                {getClientFullName(client)}
                              </span>
                              <span className='text-muted-foreground text-sm'>
                                Score: {client.creditScore} •{' '}
                                {client.identification}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='loanType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Préstamo *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Seleccione el tipo de préstamo' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(loanTypeLabels).map(
                          ([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Loan Amount, Term, and Interest Rate */}
            <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
              <FormField
                control={form.control}
                name='amount'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monto del Préstamo ($) *</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='50,000'
                        min='1000'
                        max='1000000'
                        step='100'
                        disabled={isSubmitting}
                        {...field}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                    {selectedClient && watchedValues.amount > 0 && (
                      <p className='text-muted-foreground text-xs'>
                        Límite máximo: $
                        {getMaxLoanAmount(
                          selectedClient.creditScore,
                        ).toLocaleString()}
                      </p>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='term'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plazo (meses) *</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='24'
                        min='6'
                        max='360'
                        step='1'
                        disabled={isSubmitting}
                        {...field}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 0;
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className='text-muted-foreground text-xs'>
                      Entre 6 y 360 meses
                    </p>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='interestRate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tasa de Interés (% anual) *</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='12.5'
                        min='0.1'
                        max='50'
                        step='0.1'
                        disabled={isSubmitting}
                        {...field}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className='text-muted-foreground text-xs'>
                      Entre 0.1% y 50% anual
                    </p>
                  </FormItem>
                )}
              />
            </div>

            {/* Client Information Card */}
            {selectedClient && (
              <Card className='border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/50'>
                <CardHeader className='pb-3'>
                  <CardTitle className='flex items-center gap-2 text-blue-900 dark:text-blue-100'>
                    <User className='h-4 w-4' />
                    Información del Cliente
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-3'>
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <div>
                      <p className='text-sm font-medium text-blue-900 dark:text-blue-100'>
                        {getClientFullName(selectedClient)}
                      </p>
                      <p className='text-sm text-blue-700 dark:text-blue-300'>
                        {selectedClient.identification}
                      </p>
                    </div>
                    <div>
                      <p className='text-sm text-blue-700 dark:text-blue-300'>
                        {selectedClient.email}
                      </p>
                      <p className='text-sm text-blue-700 dark:text-blue-300'>
                        {selectedClient.phone}
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center justify-between border-t border-blue-200 pt-2 dark:border-blue-800'>
                    <div className='flex items-center gap-2'>
                      <span className='text-sm font-medium text-blue-900 dark:text-blue-100'>
                        Score de Crédito:
                      </span>
                      <span
                        className={`text-lg font-bold ${getCreditScoreColor(selectedClient.creditScore)}`}
                      >
                        {selectedClient.creditScore}
                      </span>
                      <span className='text-sm text-blue-600 dark:text-blue-400'>
                        ({getCreditScoreLabel(selectedClient.creditScore)})
                      </span>
                    </div>

                    {selectedClient.creditScore >= 600 ? (
                      <div className='flex items-center gap-1 text-green-600 dark:text-green-400'>
                        <CheckCircle className='h-4 w-4' />
                        <span className='text-sm font-medium'>Elegible</span>
                      </div>
                    ) : (
                      <div className='flex items-center gap-1 text-red-600 dark:text-red-400'>
                        <AlertTriangle className='h-4 w-4' />
                        <span className='text-sm font-medium'>
                          Score insuficiente
                        </span>
                      </div>
                    )}
                  </div>

                  {selectedClient.creditScore < 600 && (
                    <Alert variant='destructive' className='mt-3'>
                      <AlertCircle className='h-4 w-4' />
                      <AlertDescription>
                        El cliente no cumple con el score mínimo requerido (600
                        puntos) para obtener un préstamo.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Loan Calculation */}
            {loanCalculation && watchedValues.amount > 0 && (
              <Card className='border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/50'>
                <CardHeader className='pb-3'>
                  <CardTitle className='flex items-center gap-2 text-green-900 dark:text-green-100'>
                    <Calculator className='h-4 w-4' />
                    Calculadora del Préstamo
                  </CardTitle>
                  <CardDescription className='text-green-700 dark:text-green-300'>
                    Proyección de pagos basada en los datos ingresados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                    <div className='text-center'>
                      <p className='mb-1 text-sm font-medium text-green-700 dark:text-green-300'>
                        Pago Mensual
                      </p>
                      <p className='text-2xl font-bold text-green-900 dark:text-green-100'>
                        ${loanCalculation.monthlyPayment.toLocaleString()}
                      </p>
                    </div>

                    <div className='text-center'>
                      <p className='mb-1 text-sm font-medium text-green-700 dark:text-green-300'>
                        Total a Pagar
                      </p>
                      <p className='text-2xl font-bold text-green-900 dark:text-green-100'>
                        ${loanCalculation.totalAmount.toLocaleString()}
                      </p>
                    </div>

                    <div className='text-center'>
                      <p className='mb-1 text-sm font-medium text-green-700 dark:text-green-300'>
                        Total de Intereses
                      </p>
                      <p className='text-2xl font-bold text-green-900 dark:text-green-100'>
                        ${loanCalculation.totalInterest.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className='mt-4 border-t border-green-200 pt-4 dark:border-green-800'>
                    <div className='grid grid-cols-2 gap-4 text-sm'>
                      <div>
                        <span className='text-green-700 dark:text-green-300'>
                          Monto del préstamo:
                        </span>
                        <span className='ml-2 font-medium text-green-900 dark:text-green-100'>
                          ${watchedValues.amount.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className='text-green-700 dark:text-green-300'>
                          Tasa de interés:
                        </span>
                        <span className='ml-2 font-medium text-green-900 dark:text-green-100'>
                          {watchedValues.interestRate}% anual
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Form Actions */}
            <div className='flex flex-col gap-3 pt-6 sm:flex-row'>
              <Button
                type='submit'
                disabled={
                  isSubmitting ||
                  isLoadingClients ||
                  (selectedClient?.creditScore !== undefined &&
                    selectedClient.creditScore < 600)
                }
                className='flex-1 sm:flex-none sm:px-8'
              >
                {isSubmitting ? (
                  <>
                    <div className='mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white' />
                    Procesando...
                  </>
                ) : editLoan ? (
                  'Actualizar Préstamo'
                ) : (
                  'Crear Préstamo'
                )}
              </Button>

              {onCancel && (
                <Button
                  type='button'
                  variant='outline'
                  onClick={onCancel}
                  disabled={isSubmitting}
                  className='flex-1 sm:flex-none sm:px-8'
                >
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
