import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { CreditScoreByOccupation } from '@/types/dashboard';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface CreditScoreChartProps {
  data: CreditScoreByOccupation[] | null;
  isLoading: boolean;
}

export default function CreditScoreChart({
  data,
  isLoading,
}: CreditScoreChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Score Crediticio Promedio por Ocupación</CardTitle>
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
          <CardTitle>Score Crediticio Promedio por Ocupación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex h-80 items-center justify-center text-gray-500'>
            No hay datos disponibles
          </div>
        </CardContent>
      </Card>
    );
  }

  // Ordenar por score promedio descendente
  const sortedData = [...data].sort((a, b) => b.averageScore - a.averageScore);

  const getBarColor = (score: number) => {
    if (score >= 700) return '#10b981'; // Verde para score alto
    if (score >= 600) return '#f59e0b'; // Amarillo para score medio
    return '#ef4444'; // Rojo para score bajo
  };
  interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
      name: string;
      value: number;
      dataKey: string;
      color: string;
      payload: CreditScoreByOccupation;
    }>;
    label?: string;
  }

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className='rounded-lg border border-gray-200 bg-white p-3 shadow-lg'>
          <p className='font-semibold text-gray-800'>{`Ocupación: ${label}`}</p>
          <div className='space-y-1 text-sm'>
            <p className='text-gray-600'>
              {`Score promedio: ${data.averageScore}`}
            </p>
            <p className='text-gray-600'>{`Mediana: ${data.median}`}</p>
            <p className='text-gray-600'>
              {`Rango: ${data.min} - ${data.max}`}
            </p>
            <p className='text-gray-600'>{`Q1: ${data.q1} | Q3: ${data.q3}`}</p>
          </div>
          <div className='mt-2 text-xs'>
            <span
              className={`mr-1 inline-block h-2 w-2 rounded-full ${
                data.averageScore >= 700
                  ? 'bg-green-500'
                  : data.averageScore >= 600
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
              }`}
            ></span>
            {data.averageScore >= 700
              ? 'Score Alto'
              : data.averageScore >= 600
                ? 'Score Medio'
                : 'Score Bajo'}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Score Crediticio Promedio por Ocupación</CardTitle>
        <p className='text-sm text-gray-600'>
          Análisis de variación del score crediticio según la ocupación del
          cliente
        </p>
      </CardHeader>
      <CardContent>
        <div className='h-80'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart
              data={sortedData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='occupation' />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey='averageScore' fill='#8884d8' radius={[4, 4, 0, 0]}>
                {sortedData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getBarColor(entry.averageScore)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Score legend */}
        <div className='mt-4 flex justify-center gap-6 text-sm'>
          <div className='flex items-center gap-2'>
            <div className='h-3 w-3 rounded-full bg-green-500'></div>
            <span>Score Alto (≥700)</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='h-3 w-3 rounded-full bg-yellow-500'></div>
            <span>Score Medio (600-699)</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='h-3 w-3 rounded-full bg-red-500'></div>
            <span>Score Bajo (&lt;600)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
