import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { ClientDemographics } from '@/types/dashboard';
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

interface ClientDemographicsChartProps {
  data: ClientDemographics[] | null;
  isLoading: boolean;
}

export default function ClientDemographicsChart({
  data,
  isLoading,
}: ClientDemographicsChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Distribución de Clientes por Edad y Género</CardTitle>
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
          <CardTitle>Distribución de Clientes por Edad y Género</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex h-80 items-center justify-center text-gray-500'>
            No hay datos disponibles
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.reduce(
    (acc, item) => {
      const existing = acc.find((d) => d.ageRange === item.ageRange);
      if (existing) {
        existing[item.gender] = item.count;
      } else {
        acc.push({
          ageRange: item.ageRange,
          [item.gender]: item.count,
        });
      }
      return acc;
    },
    [] as Record<string, number | string>[],
  );

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
      return (
        <div className='rounded-lg border border-gray-200 bg-white p-3 shadow-lg'>
          <p className='font-semibold text-gray-800'>{`Rango de edad: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className='text-sm' style={{ color: entry.color }}>
              {`${entry.dataKey === 'male' ? 'Masculino' : 'Femenino'}: ${entry.value} clientes`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución de Clientes por Edad y Género</CardTitle>
        <p className='text-sm text-gray-600'>
          Análisis demográfico de los clientes que solicitan préstamos
        </p>
      </CardHeader>
      <CardContent>
        <div className='h-80'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
              <XAxis
                dataKey='ageRange'
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#e0e0e0' }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#e0e0e0' }}
                label={{
                  value: 'Número de Clientes',
                  angle: -90,
                  position: 'insideLeft',
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) =>
                  value === 'male' ? 'Masculino' : 'Femenino'
                }
                wrapperStyle={{ paddingTop: '20px' }}
              />
              <Bar
                dataKey='male'
                fill='#3b82f6'
                name='Masculino'
                radius={[2, 2, 0, 0]}
              />
              <Bar
                dataKey='female'
                fill='#ec4899'
                name='Femenino'
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
