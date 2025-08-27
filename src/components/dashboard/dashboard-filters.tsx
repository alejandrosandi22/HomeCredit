'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  dashboardFiltersSchema,
  type DashboardFiltersFormData,
} from '@/lib/validations/dashboard';
import type { DashboardFilters } from '@/types/dashboard';
import { zodResolver } from '@hookform/resolvers/zod';
import { Filter, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { Resolver, useForm } from 'react-hook-form';

interface DashboardFiltersProps {
  onFiltersChange: (filters: DashboardFilters) => void;
  isLoading: boolean;
}

export default function DashboardFilters({
  onFiltersChange,
  isLoading,
}: DashboardFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DashboardFiltersFormData>({
    resolver: zodResolver(dashboardFiltersSchema) as Resolver<
      DashboardFiltersFormData,
      DashboardFiltersFormData
    >,
    defaultValues: {
      dateRange: {
        from: new Date(new Date().getFullYear(), 0, 1)
          .toISOString()
          .split('T')[0],
        to: new Date().toISOString().split('T')[0],
      },
      region: 'all',
      loanAmount: {
        min: 0,
        max: 500000,
      },
    },
  });

  const regionValue = watch('region');

  const onSubmit = (data: DashboardFiltersFormData) => {
    onFiltersChange(data);
  };

  const handleReset = () => {
    reset();
    onFiltersChange({
      dateRange: {
        from: new Date(new Date().getFullYear(), 0, 1)
          .toISOString()
          .split('T')[0],
        to: new Date().toISOString().split('T')[0],
      },
      region: 'all',
      loanAmount: {
        min: 0,
        max: 500000,
      },
    });
  };

  const regions = [
    { value: 'all', label: 'Todas las regiones' },
    { value: 'san-jose', label: 'San José' },
    { value: 'alajuela', label: 'Alajuela' },
    { value: 'cartago', label: 'Cartago' },
    { value: 'heredia', label: 'Heredia' },
    { value: 'guanacaste', label: 'Guanacaste' },
    { value: 'puntarenas', label: 'Puntarenas' },
    { value: 'limon', label: 'Limón' },
  ];

  return (
    <Card className='mb-6'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Filter className='h-5 w-5' />
          Filtros de Dashboard
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setIsExpanded(!isExpanded)}
            className='ml-auto'
          >
            {isExpanded ? 'Ocultar' : 'Mostrar'}
          </Button>
        </CardTitle>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
              {/* Date Range */}
              <div className='space-y-2'>
                <Label htmlFor='dateFrom'>Fecha Inicio</Label>
                <Input
                  id='dateFrom'
                  type='date'
                  {...register('dateRange.from')}
                  className={errors.dateRange?.from ? 'border-red-500' : ''}
                />
                {errors.dateRange?.from && (
                  <p className='text-sm text-red-600'>
                    {errors.dateRange.from.message}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='dateTo'>Fecha Fin</Label>
                <Input
                  id='dateTo'
                  type='date'
                  {...register('dateRange.to')}
                  className={errors.dateRange?.to ? 'border-red-500' : ''}
                />
                {errors.dateRange?.to && (
                  <p className='text-sm text-red-600'>
                    {errors.dateRange.to.message}
                  </p>
                )}
              </div>

              {/* Region */}
              <div className='space-y-2'>
                <Label htmlFor='region'>Región</Label>
                <Select
                  value={regionValue}
                  onValueChange={(value) => setValue('region', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Seleccionar región' />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region.value} value={region.value}>
                        {region.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Loan Amount Min */}
              <div className='space-y-2'>
                <Label htmlFor='loanAmountMin'>Monto Mínimo</Label>
                <Input
                  id='loanAmountMin'
                  type='number'
                  min='0'
                  step='1000'
                  {...register('loanAmount.min', { valueAsNumber: true })}
                  className={errors.loanAmount?.min ? 'border-red-500' : ''}
                />
                {errors.loanAmount?.min && (
                  <p className='text-sm text-red-600'>
                    {errors.loanAmount.min.message}
                  </p>
                )}
              </div>

              {/* Loan Amount Max */}
              <div className='space-y-2'>
                <Label htmlFor='loanAmountMax'>Monto Máximo</Label>
                <Input
                  id='loanAmountMax'
                  type='number'
                  min='0'
                  step='1000'
                  {...register('loanAmount.max', { valueAsNumber: true })}
                  className={errors.loanAmount?.max ? 'border-red-500' : ''}
                />
                {errors.loanAmount?.max && (
                  <p className='text-sm text-red-600'>
                    {errors.loanAmount.max.message}
                  </p>
                )}
              </div>
            </div>

            <div className='flex gap-2 pt-4'>
              <Button type='submit' disabled={isLoading}>
                {isLoading ? 'Aplicando...' : 'Aplicar Filtros'}
              </Button>
              <Button type='button' variant='outline' onClick={handleReset}>
                <RotateCcw className='mr-2 h-4 w-4' />
                Restablecer
              </Button>
            </div>
          </form>
        </CardContent>
      )}
    </Card>
  );
}
