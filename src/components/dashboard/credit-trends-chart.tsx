import { CreditTrendItem } from '@/types/dashboard.types';
import React from 'react';
import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface CreditTrendsChartProps {
  data: CreditTrendItem[];
}

const CustomTooltip: React.FC<{
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: CreditTrendItem;
    color: string;
  }>;
  label?: string;
}> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className='rounded-lg border bg-white p-3 shadow-lg'>
        <p className='font-semibold'>Month: {label}</p>
        <p className='text-blue-600'>
          Applications: {data.totalApplications.toLocaleString()}
        </p>
        <p className='text-green-600'>
          Avg Amount: ${data.avgCreditAmount.toLocaleString()}
        </p>
        <p className='text-purple-600'>
          Total Credit: ${data.totalCreditAmount.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export default function CreditTrendsChart({ data }: CreditTrendsChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className='flex h-64 items-center justify-center text-gray-500'>
        No credit trends data available
      </div>
    );
  }

  // Ordenar datos por mes (más reciente primero se invierte para mostrar cronológicamente)
  const sortedData = [...data].reverse();

  // Calcular estadísticas
  const totalApplications = sortedData.reduce(
    (sum, item) => sum + item.totalApplications,
    0,
  );
  const avgApplicationsPerMonth = totalApplications / sortedData.length;
  const totalCreditVolume = sortedData.reduce(
    (sum, item) => sum + item.totalCreditAmount,
    0,
  );

  return (
    <div className='w-full space-y-6'>
      {/* Key Metrics Row */}
      <div className='mb-4 grid grid-cols-1 gap-4 md:grid-cols-3'>
        <div className='rounded-lg bg-blue-50 p-3'>
          <div className='text-sm font-medium text-blue-600'>
            Total Applications
          </div>
          <div className='text-2xl font-bold text-blue-800'>
            {totalApplications.toLocaleString()}
          </div>
          <div className='text-xs text-blue-600'>Last 12 months</div>
        </div>
        <div className='rounded-lg bg-green-50 p-3'>
          <div className='text-sm font-medium text-green-600'>
            Avg per Month
          </div>
          <div className='text-2xl font-bold text-green-800'>
            {Math.round(avgApplicationsPerMonth).toLocaleString()}
          </div>
          <div className='text-xs text-green-600'>Applications</div>
        </div>
        <div className='rounded-lg bg-purple-50 p-3'>
          <div className='text-sm font-medium text-purple-600'>
            Total Credit Volume
          </div>
          <div className='text-2xl font-bold text-purple-800'>
            ${(totalCreditVolume / 1000000).toFixed(1)}M
          </div>
          <div className='text-xs text-purple-600'>Million USD</div>
        </div>
      </div>

      {/* Combined Chart - Applications and Average Amount */}
      <div className='h-80'>
        <h4 className='mb-3 text-sm font-medium text-gray-700'>
          Applications vs Average Credit Amount Over Time
        </h4>
        <ResponsiveContainer width='100%' height='100%'>
          <ComposedChart
            data={sortedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis
              dataKey='month'
              angle={-45}
              textAnchor='end'
              height={60}
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
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              yAxisId='left'
              dataKey='totalApplications'
              fill='#0088FE'
              name='Applications'
              opacity={0.8}
            />
            <Line
              yAxisId='right'
              type='monotone'
              dataKey='avgCreditAmount'
              stroke='#FF8042'
              strokeWidth={3}
              name='Avg Credit Amount'
              dot={{ fill: '#FF8042', strokeWidth: 2, r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Total Credit Volume Area Chart */}
      <div className='h-64'>
        <h4 className='mb-3 text-sm font-medium text-gray-700'>
          Total Credit Volume Trend
        </h4>
        <ResponsiveContainer width='100%' height='100%'>
          <AreaChart
            data={sortedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis
              dataKey='month'
              angle={-45}
              textAnchor='end'
              height={60}
              fontSize={12}
            />
            <YAxis
              tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
            />
            <Tooltip
              formatter={(value: number) => [
                `${value.toLocaleString()}`,
                'Total Credit',
              ]}
              labelFormatter={(label) => `Month: ${label}`}
            />
            <Area
              type='monotone'
              dataKey='totalCreditAmount'
              stroke='#8884d8'
              fill='#8884d8'
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Applications Trend Line Chart */}
      <div className='h-64'>
        <h4 className='mb-3 text-sm font-medium text-gray-700'>
          Application Volume Trend
        </h4>
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart
            data={sortedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis
              dataKey='month'
              angle={-45}
              textAnchor='end'
              height={60}
              fontSize={12}
            />
            <YAxis tickFormatter={(value) => value.toLocaleString()} />
            <Tooltip
              formatter={(value: number) => [
                value.toLocaleString(),
                'Applications',
              ]}
              labelFormatter={(label) => `Month: ${label}`}
            />
            <Line
              type='monotone'
              dataKey='totalApplications'
              stroke='#00C49F'
              strokeWidth={3}
              dot={{ fill: '#00C49F', strokeWidth: 2, r: 5 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Summary Table */}
      <div className='mt-6'>
        <h4 className='mb-3 text-sm font-medium text-gray-700'>
          Monthly Summary
        </h4>
        <div className='overflow-x-auto'>
          <table className='w-full border-collapse text-sm'>
            <thead>
              <tr className='border-b-2 border-gray-200'>
                <th className='bg-gray-50 p-3 text-left'>Month</th>
                <th className='bg-gray-50 p-3 text-right'>Applications</th>
                <th className='bg-gray-50 p-3 text-right'>Avg Credit Amount</th>
                <th className='bg-gray-50 p-3 text-right'>
                  Total Credit Volume
                </th>
                <th className='bg-gray-50 p-3 text-right'>Growth Rate</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((item, index) => {
                const prevItem = index > 0 ? sortedData[index - 1] : null;
                const growthRate = prevItem
                  ? ((item.totalApplications - prevItem.totalApplications) /
                      prevItem.totalApplications) *
                    100
                  : 0;

                return (
                  <tr
                    key={index}
                    className='border-b border-gray-100 hover:bg-gray-50'
                  >
                    <td className='p-3 font-medium'>{item.month}</td>
                    <td className='p-3 text-right'>
                      {item.totalApplications.toLocaleString()}
                    </td>
                    <td className='p-3 text-right'>
                      ${item.avgCreditAmount.toLocaleString()}
                    </td>
                    <td className='p-3 text-right'>
                      ${item.totalCreditAmount.toLocaleString()}
                    </td>
                    <td className='p-3 text-right'>
                      <span
                        className={`${
                          growthRate > 0
                            ? 'text-green-600'
                            : growthRate < 0
                              ? 'text-red-600'
                              : 'text-gray-600'
                        }`}
                      >
                        {index > 0
                          ? `${growthRate > 0 ? '+' : ''}${growthRate.toFixed(1)}%`
                          : '-'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trend Analysis */}
      <div className='rounded-lg bg-gray-50 p-4'>
        <h4 className='mb-2 text-sm font-medium text-gray-700'>
          Trend Analysis
        </h4>
        <div className='grid grid-cols-1 gap-4 text-sm md:grid-cols-2'>
          <div>
            <span className='font-medium'>Peak Month:</span>
            <span className='ml-2'>
              {
                sortedData.reduce((max, item) =>
                  item.totalApplications > max.totalApplications ? item : max,
                ).month
              }{' '}
              (
              {sortedData
                .reduce((max, item) =>
                  item.totalApplications > max.totalApplications ? item : max,
                )
                .totalApplications.toLocaleString()}{' '}
              applications)
            </span>
          </div>
          <div>
            <span className='font-medium'>Highest Avg Amount:</span>
            <span className='ml-2'>
              {
                sortedData.reduce((max, item) =>
                  item.avgCreditAmount > max.avgCreditAmount ? item : max,
                ).month
              }{' '}
              ($
              {sortedData
                .reduce((max, item) =>
                  item.avgCreditAmount > max.avgCreditAmount ? item : max,
                )
                .avgCreditAmount.toLocaleString()}
              )
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
