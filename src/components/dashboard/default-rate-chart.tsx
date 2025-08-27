import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { DefaultRateData } from '@/types/dashboard';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from 'recharts';

interface DefaultRateChartProps {
  data: DefaultRateData[] | null;
  isLoading: boolean;
}

export default function DefaultRateChart({
  data,
  isLoading,
}: DefaultRateChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tasa de Impago por Monto de Préstamo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='h-80'>
            <Skeleton className='h-full w-full' />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tasa de Impago por Monto de Préstamo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex h-80 items-center justify-center text-gray-500'>
            No hay datos disponibles
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className='rounded-lg border border-gray-200 bg-white p-3 shadow-lg'>
          <p className='font-semibold text-gray-800'>{`Monto: ${formatCurrency(label)}`}</p>
          <p className='text-sm text-red-600'>
            {`Tasa de impago: ${payload[0].value}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasa de Impago por Monto de Préstamo</CardTitle>
        <p className='text-sm text-gray-600'>
          Relación entre el monto del préstamo y la probabilidad de impago
        </p>
      </CardHeader>
      <CardContent>
        <div className='h-80'>
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
              <XAxis
                dataKey='loanAmount'
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#e0e0e0' }}
                tickFormatter={(value) => `₡${(value / 1000).toFixed(0)}K`}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#e0e0e0' }}
                label={{
                  value: 'Tasa de Impago (%)',
                  angle: -90,
                  position: 'insideLeft',
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type='monotone'
                dataKey='defaultRate'
                stroke='#ef4444'
                strokeWidth={3}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
