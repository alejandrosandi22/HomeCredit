'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
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
import {
  clientFiltersSchema,
  type ClientFiltersFormData,
} from '@/lib/validations/client';
import { ClientStatus } from '@/types/client';
import { LoanStatus, LoanType } from '@/types/loan';
import { zodResolver } from '@hookform/resolvers/zod';
import { Filter, X } from 'lucide-react';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';

interface ClientFiltersProps {
  onFiltersChange: (filters: ClientFiltersFormData) => void;
  initialFilters?: Partial<ClientFiltersFormData>;
}

export default function ClientFilters({
  onFiltersChange,
  initialFilters = {},
}: ClientFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const form = useForm<ClientFiltersFormData>({
    resolver: zodResolver(clientFiltersSchema),
    defaultValues: {
      search: initialFilters.search ?? '',
      creditScore: initialFilters.creditScore,
      loanType: initialFilters.loanType,
      status: initialFilters.status,
      loanStatus: initialFilters.loanStatus,
      page: initialFilters.page ?? 1,
      limit: initialFilters.limit ?? 10,
    },
  });

  const onSubmit: SubmitHandler<ClientFiltersFormData> = (data) => {
    // Asegurar que page y limit siempre tengan valores
    const filtersWithDefaults = {
      ...data,
      page: data.page ?? 1,
      limit: data.limit ?? 10,
    };
    onFiltersChange(filtersWithDefaults);
    updateActiveFilters(filtersWithDefaults);
  };

  const updateActiveFilters = (data: ClientFiltersFormData) => {
    const filters: string[] = [];

    if (data.search) filters.push(`Búsqueda: ${data.search}`);
    if (data.status)
      filters.push(`Estado: ${getStatusLabel(data.status as ClientStatus)}`);
    if (data.loanType)
      filters.push(
        `Tipo de crédito: ${getLoanTypeLabel(data.loanType as LoanType)}`,
      );
    if (data.loanStatus)
      filters.push(
        `Estado del préstamo: ${getLoanStatusLabel(data.loanStatus as LoanStatus)}`,
      );
    if (data.creditScore?.min)
      filters.push(`Score mín: ${data.creditScore.min}`);
    if (data.creditScore?.max)
      filters.push(`Score máx: ${data.creditScore.max}`);

    setActiveFilters(filters);
  };

  const clearAllFilters = () => {
    form.reset({
      search: '',
      creditScore: { min: undefined, max: undefined },
      loanType: undefined,
      status: undefined,
      loanStatus: undefined,
      page: 1,
      limit: 10,
    });
    setActiveFilters([]);
    onFiltersChange({
      search: '',
      page: 1,
      limit: 10,
    });
  };

  const getStatusLabel = (status: ClientStatus): string => {
    const labels = {
      ACTIVE: 'Activo',
      INACTIVE: 'Inactivo',
      SUSPENDED: 'Suspendido',
      PENDING: 'Pendiente',
      COMPLETED: 'Completado',
    };
    return labels[status];
  };

  const getLoanTypeLabel = (type: LoanType): string => {
    const labels = {
      PERSONAL: 'Personal',
      MORTGAGE: 'Hipotecario',
      BUSINESS: 'Empresarial',
      AUTO: 'Vehículo',
      EDUCATION: 'Educación',
    };
    return labels[type];
  };

  const getLoanStatusLabel = (status: LoanStatus): string => {
    const labels = {
      PENDING: 'Pendiente',
      APPROVED: 'Aprobado',
      ACTIVE: 'Activo',
      COMPLETED: 'Completado',
      DEFAULTED: 'En mora',
      REJECTED: 'Rechazado',
    };
    return labels[status];
  };

  return (
    <div className='space-y-4'>
      {/* Filter Toggle and Active Filters */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant='outline' size='sm'>
                <Filter className='mr-2 h-4 w-4' />
                Filtros
                {activeFilters.length > 0 && (
                  <Badge variant='secondary' className='ml-2'>
                    {activeFilters.length}
                  </Badge>
                )}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>

          {activeFilters.length > 0 && (
            <Button
              variant='ghost'
              size='sm'
              onClick={clearAllFilters}
              className='text-muted-foreground hover:text-foreground'
            >
              <X className='mr-1 h-3 w-3' />
              Limpiar filtros
            </Button>
          )}
        </div>

        {/* Active Filters Display */}
        {activeFilters.length > 0 && (
          <div className='flex flex-wrap gap-2'>
            {activeFilters.map((filter, index) => (
              <Badge key={index} variant='secondary' className='text-xs'>
                {filter}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Filter Form */}
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleContent className='space-y-4'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <div className='bg-muted/30 grid grid-cols-1 gap-4 rounded-lg border p-4 md:grid-cols-2 lg:grid-cols-4'>
                {/* Status Filter */}
                <FormField
                  control={form.control}
                  name='status'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado del Cliente</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Seleccionar estado' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value=''>Todos</SelectItem>
                          <SelectItem value={ClientStatus.ACTIVE}>
                            Activo
                          </SelectItem>
                          <SelectItem value={ClientStatus.INACTIVE}>
                            Inactivo
                          </SelectItem>
                          <SelectItem value={ClientStatus.SUSPENDED}>
                            Suspendido
                          </SelectItem>
                          <SelectItem value={ClientStatus.PENDING}>
                            Pendiente
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Loan Type Filter */}
                <FormField
                  control={form.control}
                  name='loanType'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Crédito</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Tipo de crédito' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value=''>Todos</SelectItem>
                          <SelectItem value={LoanType.PERSONAL}>
                            Personal
                          </SelectItem>
                          <SelectItem value={LoanType.MORTGAGE}>
                            Hipotecario
                          </SelectItem>
                          <SelectItem value={LoanType.BUSINESS}>
                            Empresarial
                          </SelectItem>
                          <SelectItem value={LoanType.AUTO}>
                            Vehículo
                          </SelectItem>
                          <SelectItem value={LoanType.EDUCATION}>
                            Educación
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Loan Status Filter */}
                <FormField
                  control={form.control}
                  name='loanStatus'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado del Préstamo</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Estado préstamo' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value=''>Todos</SelectItem>
                          <SelectItem value={LoanStatus.PENDING}>
                            Pendiente
                          </SelectItem>
                          <SelectItem value={LoanStatus.APPROVED}>
                            Aprobado
                          </SelectItem>
                          <SelectItem value={LoanStatus.ACTIVE}>
                            Activo
                          </SelectItem>
                          <SelectItem value={LoanStatus.COMPLETED}>
                            Completado
                          </SelectItem>
                          <SelectItem value={LoanStatus.DEFAULTED}>
                            En mora
                          </SelectItem>
                          <SelectItem value={LoanStatus.REJECTED}>
                            Rechazado
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Credit Score Range */}
                <div className='space-y-2'>
                  <FormLabel>Rango de Score Crediticio</FormLabel>
                  <div className='flex space-x-2'>
                    <FormField
                      control={form.control}
                      name='creditScore.min'
                      render={({ field }) => (
                        <FormItem className='flex-1'>
                          <FormControl>
                            <Input
                              type='number'
                              placeholder='Mín'
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? Number(e.target.value)
                                    : undefined,
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
                      name='creditScore.max'
                      render={({ field }) => (
                        <FormItem className='flex-1'>
                          <FormControl>
                            <Input
                              type='number'
                              placeholder='Máx'
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? Number(e.target.value)
                                    : undefined,
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className='flex justify-end space-x-2'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={clearAllFilters}
                >
                  Limpiar
                </Button>
                <Button type='submit'>Aplicar Filtros</Button>
              </div>
            </form>
          </Form>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
