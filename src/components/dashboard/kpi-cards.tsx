import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { KPIMetrics } from '@/types/dashboard';
import {
  CreditCard,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react';

interface KPICardsProps {
  metrics: KPIMetrics | null;
  isLoading: boolean;
}

export default function KPICards({ metrics, isLoading }: KPICardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const kpiItems = [
    {
      title: 'Total de Préstamos',
      value: metrics?.totalLoans || 0,
      icon: CreditCard,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      formatter: (value: number) => value.toLocaleString(),
    },
    {
      title: 'Préstamos Aprobados',
      value: metrics?.approvedLoans || 0,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      formatter: (value: number) => value.toLocaleString(),
    },
    {
      title: 'Tasa de Impago Global',
      value: metrics?.globalDefaultRate || 0,
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      formatter: formatPercentage,
    },
    {
      title: 'Monto Promedio',
      value: metrics?.averageLoanAmount || 0,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      formatter: formatCurrency,
    },
    {
      title: 'Ingresos Totales',
      value: metrics?.totalRevenue || 0,
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      formatter: formatCurrency,
    },
  ];

  if (isLoading) {
    return (
      <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5'>
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-4 w-4' />
            </CardHeader>
            <CardContent>
              <Skeleton className='mb-2 h-8 w-16' />
              <Skeleton className='h-3 w-20' />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5'>
      {kpiItems.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.title} className='transition-shadow hover:shadow-lg'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-gray-600'>
                {item.title}
              </CardTitle>
              <div className={`rounded-full p-2 ${item.bgColor}`}>
                <Icon className={`h-4 w-4 ${item.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-gray-900'>
                {item.formatter(item.value)}
              </div>
              <p className='mt-1 text-xs text-gray-500'>
                Actualizado hace 5 min
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
