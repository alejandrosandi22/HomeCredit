import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { PaymentHistory } from '@/types/dashboard';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface PaymentHistoryChartProps {
  data: PaymentHistory[] | null;
  isLoading: boolean;
}

export default function PaymentHistoryChart({
  data,
  isLoading,
}: PaymentHistoryChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historial de Pagos (Puntualidad)</CardTitle>
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
          <CardTitle>Historial de Pagos (Puntualidad)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex h-80 items-center justify-center text-gray-500'>
            No hay datos disponibles
          </div>
        </CardContent>
      </Card>
    );
  }

  interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
      name: string;
      value: number;
      dataKey: string;
      color: string;
    }>;
    label?: string;
  }

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const total = payload.reduce(
        (sum: number, entry) => sum + entry.value,
        0,
      );
      return (
        <div className='rounded-lg border border-gray-200 bg-white p-3 shadow-lg'>
          <p className='font-semibold text-gray-800'>{`Mes: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className='text-sm' style={{ color: entry.color }}>
              {`${entry.dataKey === 'onTime' ? 'Pagos puntuales' : 'Pagos atrasados'}: ${entry.value.toLocaleString()}`}
            </p>
          ))}
          <p className='mt-1 border-t pt-1 text-sm text-gray-600'>
            {`Total: ${total.toLocaleString()}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Pagos (Puntualidad)</CardTitle>
        <p className='text-sm text-gray-600'>
          Análisis de patrones de puntualidad y morosidad en los pagos
        </p>
      </CardHeader>
      <CardContent>
        <div className='h-80'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart
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
                dataKey='month'
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#e0e0e0' }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#e0e0e0' }}
                label={{
                  value: 'Número de Pagos',
                  angle: -90,
                  position: 'insideLeft',
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) =>
                  value === 'onTime' ? 'Pagos Puntuales' : 'Pagos Atrasados'
                }
                wrapperStyle={{ paddingTop: '20px' }}
              />
              <Bar
                dataKey='onTime'
                stackId='a'
                fill='#10b981'
                name='Pagos Puntuales'
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey='late'
                stackId='a'
                fill='#ef4444'
                name='Pagos Atrasados'
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary stats */}
        <div className='mt-4 grid grid-cols-2 gap-4 text-center'>
          <div className='rounded-lg bg-green-50 p-3'>
            <div className='text-lg font-bold text-green-600'>
              {data
                .reduce((sum, item) => sum + item.onTime, 0)
                .toLocaleString()}
            </div>
            <div className='text-xs text-gray-600'>Total Pagos Puntuales</div>
          </div>
          <div className='rounded-lg bg-red-50 p-3'>
            <div className='text-lg font-bold text-red-600'>
              {data.reduce((sum, item) => sum + item.late, 0).toLocaleString()}
            </div>
            <div className='text-xs text-gray-600'>Total Pagos Atrasados</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
