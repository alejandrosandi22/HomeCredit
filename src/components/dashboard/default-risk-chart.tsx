import { DefaultRiskItem } from '@/types/dashboard.types';
import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface DefaultRiskChartProps {
  data: DefaultRiskItem[];
}

const CustomTooltip: React.FC<{
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: DefaultRiskItem;
    color: string;
  }>;
  label?: string;
}> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className='rounded-lg border bg-white p-3 shadow-lg'>
        <p className='font-semibold'>{label}</p>
        <p className='text-blue-600'>
          Total Applications: {data.totalApplications.toLocaleString()}
        </p>
        <p className='text-red-600'>
          Defaulted: {data.defaulted.toLocaleString()}
        </p>
        <p className='text-orange-600'>Default Rate: {data.defaultRate}%</p>
        <p className='text-green-600'>
          Avg Credit: ${data.avgCreditAmount.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export default function DefaultRiskChart({ data }: DefaultRiskChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className='flex h-64 items-center justify-center text-gray-500'>
        No default risk data available
      </div>
    );
  }

  // Preparar datos para el gráfico combinado
  const chartData = data.map((item) => ({
    ...item,
    successRate: 100 - item.defaultRate,
  }));

  return (
    <div className='w-full space-y-6'>
      {/* Combined Chart - Applications vs Default Rate */}
      <div className='h-80'>
        <h4 className='mb-3 text-sm font-medium text-gray-700'>
          Applications vs Default Rate by Income Category
        </h4>
        <ResponsiveContainer width='100%' height='100%'>
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis
              dataKey='riskCategory'
              angle={-45}
              textAnchor='end'
              height={80}
              fontSize={12}
            />
            <YAxis
              yAxisId='left'
              orientation='left'
              tickFormatter={(value) => value.toLocaleString()}
            />
            <YAxis
              yAxisId='right'
              orientation='right'
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              yAxisId='left'
              dataKey='totalApplications'
              fill='#0088FE'
              name='Total Applications'
            />
            <Bar
              yAxisId='left'
              dataKey='defaulted'
              fill='#FF8042'
              name='Defaulted'
            />
            <Line
              yAxisId='right'
              type='monotone'
              dataKey='defaultRate'
              stroke='#FF0000'
              strokeWidth={3}
              name='Default Rate (%)'
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Default Rate Comparison */}
      <div className='h-64'>
        <h4 className='mb-3 text-sm font-medium text-gray-700'>
          Default Rate Comparison
        </h4>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis
              dataKey='riskCategory'
              angle={-45}
              textAnchor='end'
              height={60}
              fontSize={12}
            />
            <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
            <Tooltip
              formatter={(value: number, name: string) => [
                `${value.toFixed(1)}%`,
                name === 'defaultRate' ? 'Default Rate' : 'Success Rate',
              ]}
            />
            <Legend />
            <Bar dataKey='defaultRate' fill='#FF4444' name='Default Rate' />
            <Bar dataKey='successRate' fill='#44AA44' name='Success Rate' />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Risk Categories Grid */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        {data.map((item, index) => (
          <div
            key={index}
            className={`rounded-lg border-2 p-4 ${
              item.defaultRate > 15
                ? 'border-red-200 bg-red-50'
                : item.defaultRate > 10
                  ? 'border-yellow-200 bg-yellow-50'
                  : 'border-green-200 bg-green-50'
            }`}
          >
            <div className='mb-2 flex items-center justify-between'>
              <h5 className='font-semibold text-gray-800'>
                {item.riskCategory}
              </h5>
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  item.defaultRate > 15
                    ? 'bg-red-100 text-red-800'
                    : item.defaultRate > 10
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                }`}
              >
                {item.defaultRate > 15
                  ? 'High Risk'
                  : item.defaultRate > 10
                    ? 'Medium Risk'
                    : 'Low Risk'}
              </span>
            </div>

            <div className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Applications:</span>
                <span className='font-medium'>
                  {item.totalApplications.toLocaleString()}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Default Rate:</span>
                <span className='font-medium text-red-600'>
                  {item.defaultRate}%
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Avg Credit:</span>
                <span className='font-medium'>
                  ${item.avgCreditAmount.toLocaleString()}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Defaulted:</span>
                <span className='font-medium'>
                  {item.defaulted.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Risk Level Indicator */}
            <div className='mt-3'>
              <div className='h-2 w-full rounded-full bg-gray-200'>
                <div
                  className={`h-2 rounded-full ${
                    item.defaultRate > 15
                      ? 'bg-red-500'
                      : item.defaultRate > 10
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(item.defaultRate, 100)}%` }}
                />
              </div>
              <div className='mt-1 text-xs text-gray-500'>
                Risk Level: {item.defaultRate.toFixed(1)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
