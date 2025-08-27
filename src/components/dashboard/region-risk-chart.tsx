import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { RegionRisk } from '@/types/dashboard';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from 'recharts';

interface RegionRiskChartProps {
  data: RegionRisk[] | null;
  isLoading: boolean;
}

export default function RegionRiskChart({
  data,
  isLoading,
}: RegionRiskChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Riesgo de Impago por Región</CardTitle>
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
          <CardTitle>Riesgo de Impago por Región</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex h-80 items-center justify-center text-gray-500'>
            No hay datos disponibles
          </div>
        </CardContent>
      </Card>
    );
  }

  // Ordenar por riesgo descendente
  const sortedData = [...data].sort((a, b) => b.riskIndex - a.riskIndex);

  const getBarColor = (riskIndex: number) => {
    if (riskIndex <= 4) return '#10b981'; // Verde para riesgo bajo
    if (riskIndex <= 7) return '#f59e0b'; // Amarillo para riesgo medio
    return '#ef4444'; // Rojo para riesgo alto
  };

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className='rounded-lg border border-gray-200 bg-white p-3 shadow-lg'>
          <p className='font-semibold text-gray-800'>{`Región: ${label}`}</p>
          <p className='text-sm text-gray-600'>
            {`Índice de riesgo: ${data.riskIndex}%`}
          </p>
          <p className='text-sm text-gray-600'>
            {`Préstamos: ${data.loanCount.toLocaleString()}`}
          </p>
          <div className='mt-2 text-xs'>
            <span
              className={`mr-1 inline-block h-2 w-2 rounded-full ${
                data.riskIndex <= 4
                  ? 'bg-green-500'
                  : data.riskIndex <= 7
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
              }`}
            ></span>
            {data.riskIndex <= 4
              ? 'Riesgo Bajo'
              : data.riskIndex <= 7
                ? 'Riesgo Medio'
                : 'Riesgo Alto'}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Riesgo de Impago por Región</CardTitle>
        <p className='text-sm text-gray-600'>
          Comparación del riesgo de impago entre diferentes regiones
        </p>
      </CardHeader>
      <CardContent>
        <div className='h-80'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart
              data={sortedData}
              layout='horizontal'
              margin={{
                top: 20,
                right: 30,
                left: 60,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
              <XAxis
                type='number'
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#e0e0e0' }}
                label={{
                  value: 'Índice de Riesgo (%)',
                  position: 'insideBottom',
                  offset: -5,
                }}
              />
              <YAxis
                type='category'
                dataKey='region'
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#e0e0e0' }}
                width={60}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey='riskIndex' radius={[0, 4, 4, 0]}>
                {sortedData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getBarColor(entry.riskIndex)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk legend */}
        <div className='mt-4 flex justify-center gap-6 text-sm'>
          <div className='flex items-center gap-2'>
            <div className='h-3 w-3 rounded-full bg-green-500'></div>
            <span>Riesgo Bajo (≤4%)</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='h-3 w-3 rounded-full bg-yellow-500'></div>
            <span>Riesgo Medio (4-7%)</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='h-3 w-3 rounded-full bg-red-500'></div>
            <span>Riesgo Alto (&gt;7%)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
