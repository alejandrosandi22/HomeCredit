import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { LoanStatus } from '@/types/dashboard';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    payload: LoanStatus;
  }>;
}

interface CustomLabelProps {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  percent?: number;
}

interface LoanStatusChartProps {
  data: LoanStatus[] | null;
  isLoading: boolean;
}

export default function LoanStatusChart({
  data,
  isLoading,
}: LoanStatusChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Estado de Préstamos</CardTitle>
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
          <CardTitle>Estado de Préstamos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex h-80 items-center justify-center text-gray-500'>
            No hay datos disponibles
          </div>
        </CardContent>
      </Card>
    );
  }

  const colors = {
    approved: '#10b981',
    rejected: '#ef4444',
    pending: '#f59e0b',
  };

  const statusLabels = {
    approved: 'Aprobados',
    rejected: 'Rechazados',
    pending: 'En Proceso',
  };

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className='rounded-lg border border-gray-200 bg-white p-3 shadow-lg'>
          <p className='font-semibold text-gray-800'>
            {statusLabels[data.status as keyof typeof statusLabels]}
          </p>
          <p className='text-sm text-gray-600'>
            {`Cantidad: ${data.count.toLocaleString()}`}
          </p>
          <p className='text-sm text-gray-600'>
            {`Porcentaje: ${data.percentage.toFixed(1)}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: CustomLabelProps) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius! + (outerRadius! - innerRadius!) * 0.5;
    const x = cx! + radius * Math.cos(-midAngle! * RADIAN);
    const y = cy! + radius * Math.sin(-midAngle! * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill='white'
        textAnchor={x > cx! ? 'start' : 'end'}
        dominantBaseline='central'
        className='text-sm font-semibold'
      >
        {`${(percent! * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estado de Préstamos</CardTitle>
        <p className='text-sm text-gray-600'>
          Distribución porcentual de préstamos por estado
        </p>
      </CardHeader>
      <CardContent>
        <div className='h-80'>
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              <Pie
                data={data}
                cx='50%'
                cy='50%'
                labelLine={false}
                label={CustomLabel}
                outerRadius={80}
                fill='#8884d8'
                dataKey='count'
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[entry.status as keyof typeof colors]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value, entry) => (
                  <span style={{ color: entry.color }}>
                    {statusLabels[value as keyof typeof statusLabels]}
                  </span>
                )}
                wrapperStyle={{ paddingTop: '20px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Summary stats */}
        <div className='mt-4 grid grid-cols-3 gap-4 text-center'>
          {data.map((item) => (
            <div key={item.status} className='rounded-lg bg-gray-50 p-2'>
              <div
                className='text-lg font-bold'
                style={{ color: colors[item.status as keyof typeof colors] }}
              >
                {item.count.toLocaleString()}
              </div>
              <div className='text-xs text-gray-600'>
                {statusLabels[item.status as keyof typeof statusLabels]}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
