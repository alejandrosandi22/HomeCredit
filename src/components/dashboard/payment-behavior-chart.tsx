import { PaymentBehaviorItem } from '@/types/dashboard.types';
import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface PaymentBehaviorChartProps {
  data: PaymentBehaviorItem[];
}

const COLORS = {
  'On Time': '#22C55E',
  '1-30 Days Late': '#FDE047',
  '31-90 Days Late': '#FB923C',
  '91-180 Days Late': '#F87171',
  'Over 180 Days Late': '#DC2626',
};

const CustomTooltip: React.FC<{
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: PaymentBehaviorItem;
  }>;
  label?: string;
}> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className='rounded-lg border bg-white p-3 shadow-lg'>
        <p className='font-semibold'>{label}</p>
        <p className='text-blue-600'>Count: {data.count.toLocaleString()}</p>
        <p className='text-orange-600'>
          Avg Days Overdue: {data.avgDaysOverdue.toFixed(0)}
        </p>
        <p className='text-red-600'>
          Total Debt: ${data.totalDebtAmount.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const getRiskLevel = (status: string): string => {
  switch (status) {
    case 'On Time':
      return 'Low';
    case '1-30 Days Late':
      return 'Medium';
    case '31-90 Days Late':
      return 'High';
    default:
      return 'Critical';
  }
};

const getRiskColor = (status: string): string => {
  switch (status) {
    case 'On Time':
      return 'text-green-600 bg-green-50';
    case '1-30 Days Late':
      return 'text-yellow-600 bg-yellow-50';
    case '31-90 Days Late':
      return 'text-orange-600 bg-orange-50';
    default:
      return 'text-red-600 bg-red-50';
  }
};

export function PaymentBehaviorChart({ data }: PaymentBehaviorChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className='flex h-64 items-center justify-center text-gray-500'>
        No payment behavior data available
      </div>
    );
  }

  const totalCount = data.reduce((sum, item) => sum + item.count, 0);
  const totalDebt = data.reduce((sum, item) => sum + item.totalDebtAmount, 0);
  const onTimePayments =
    data.find((item) => item.paymentStatus === 'On Time')?.count || 0;
  const onTimePercentage =
    totalCount > 0 ? (onTimePayments / totalCount) * 100 : 0;

  const chartData = data.map((item) => ({
    ...item,
    percentage: totalCount > 0 ? (item.count / totalCount) * 100 : 0,
    riskLevel: getRiskLevel(item.paymentStatus),
  }));

  return (
    <div className='w-full space-y-6'>
      {/* Key Metrics */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
        <div className='rounded-lg bg-green-50 p-3'>
          <div className='text-sm font-medium text-green-600'>On-Time Rate</div>
          <div className='text-2xl font-bold text-green-800'>
            {onTimePercentage.toFixed(1)}%
          </div>
          <div className='text-xs text-green-600'>
            {onTimePayments.toLocaleString()} accounts
          </div>
        </div>

        <div className='rounded-lg bg-blue-50 p-3'>
          <div className='text-sm font-medium text-blue-600'>
            Total Accounts
          </div>
          <div className='text-2xl font-bold text-blue-800'>
            {totalCount.toLocaleString()}
          </div>
          <div className='text-xs text-blue-600'>All payment statuses</div>
        </div>

        <div className='rounded-lg bg-red-50 p-3'>
          <div className='text-sm font-medium text-red-600'>Total Debt</div>
          <div className='text-2xl font-bold text-red-800'>
            ${(totalDebt / 1000000).toFixed(1)}M
          </div>
          <div className='text-xs text-red-600'>Outstanding amount</div>
        </div>

        <div className='rounded-lg bg-yellow-50 p-3'>
          <div className='text-sm font-medium text-yellow-600'>
            Late Payments
          </div>
          <div className='text-2xl font-bold text-yellow-800'>
            {(100 - onTimePercentage).toFixed(1)}%
          </div>
          <div className='text-xs text-yellow-600'>Need attention</div>
        </div>
      </div>

      {/* Payment Status Distribution */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        {/* Pie Chart */}
        <div className='h-80'>
          <h4 className='mb-3 text-sm font-medium text-gray-700'>
            Payment Status Distribution
          </h4>
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              <Pie
                data={chartData}
                cx='50%'
                cy='50%'
                labelLine={false}
                label={({ paymentStatus, percentage }) =>
                  `${paymentStatus}: ${percentage.toFixed(1)}%`
                }
                outerRadius={80}
                fill='#8884d8'
                dataKey='count'
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      COLORS[entry.paymentStatus as keyof typeof COLORS] ||
                      '#8884d8'
                    }
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart - Count vs Avg Days Overdue */}
        <div className='h-80'>
          <h4 className='mb-3 text-sm font-medium text-gray-700'>
            Volume vs Average Days Overdue
          </h4>
          <ResponsiveContainer width='100%' height='100%'>
            <ComposedChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis
                dataKey='paymentStatus'
                angle={-45}
                textAnchor='end'
                height={80}
                fontSize={10}
              />
              <YAxis yAxisId='left' orientation='left' />
              <YAxis yAxisId='right' orientation='right' />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar yAxisId='left' dataKey='count' fill='#0088FE' name='Count' />
              <Line
                yAxisId='right'
                type='monotone'
                dataKey='avgDaysOverdue'
                stroke='#FF8042'
                strokeWidth={3}
                name='Avg Days Overdue'
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Status Cards */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {chartData.map((item, index) => (
          <div
            key={index}
            className={`rounded-lg border-l-4 p-4 shadow-sm ${
              item.paymentStatus === 'On Time'
                ? 'border-green-500 bg-green-50'
                : item.paymentStatus === '1-30 Days Late'
                  ? 'border-yellow-500 bg-yellow-50'
                  : item.paymentStatus === '31-90 Days Late'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-red-500 bg-red-50'
            }`}
          >
            <div className='mb-3 flex items-center justify-between'>
              <h5 className='text-sm font-semibold text-gray-800'>
                {item.paymentStatus}
              </h5>
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${getRiskColor(item.paymentStatus)}`}
              >
                {getRiskLevel(item.paymentStatus)} Risk
              </span>
            </div>

            <div className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Accounts:</span>
                <span className='font-medium'>
                  {item.count.toLocaleString()}
                </span>
              </div>

              <div className='flex justify-between'>
                <span className='text-gray-600'>Percentage:</span>
                <span className='font-medium'>
                  {item.percentage.toFixed(1)}%
                </span>
              </div>

              <div className='flex justify-between'>
                <span className='text-gray-600'>Avg Days Overdue:</span>
                <span className='font-medium text-orange-600'>
                  {item.avgDaysOverdue.toFixed(0)} days
                </span>
              </div>

              <div className='flex justify-between'>
                <span className='text-gray-600'>Total Debt:</span>
                <span className='font-medium text-red-600'>
                  ${(item.totalDebtAmount / 1000000).toFixed(2)}M
                </span>
              </div>
            </div>

            {/* Progress Bar for Percentage */}
            <div className='mt-3'>
              <div className='mb-1 flex justify-between text-xs text-gray-500'>
                <span>Portfolio Share</span>
                <span>{item.percentage.toFixed(1)}%</span>
              </div>
              <div className='h-2 w-full rounded-full bg-gray-200'>
                <div
                  className={`h-2 rounded-full ${
                    item.paymentStatus === 'On Time'
                      ? 'bg-green-500'
                      : item.paymentStatus === '1-30 Days Late'
                        ? 'bg-yellow-500'
                        : item.paymentStatus === '31-90 Days Late'
                          ? 'bg-orange-500'
                          : 'bg-red-500'
                  }`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>

            {/* Action Indicator */}
            <div className='mt-3 text-xs'>
              {item.paymentStatus === 'On Time' ? (
                <div className='flex items-center text-green-600'>
                  <div className='mr-2 h-2 w-2 rounded-full bg-green-500'></div>
                  Healthy accounts
                </div>
              ) : item.paymentStatus === '1-30 Days Late' ? (
                <div className='flex items-center text-yellow-600'>
                  <div className='mr-2 h-2 w-2 rounded-full bg-yellow-500'></div>
                  Early intervention needed
                </div>
              ) : item.paymentStatus === '31-90 Days Late' ? (
                <div className='flex items-center text-orange-600'>
                  <div className='mr-2 h-2 w-2 rounded-full bg-orange-500'></div>
                  Collection follow-up
                </div>
              ) : (
                <div className='flex items-center text-red-600'>
                  <div className='mr-2 h-2 w-2 rounded-full bg-red-500'></div>
                  Urgent action required
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Debt Analysis Chart */}
      <div className='h-64'>
        <h4 className='mb-3 text-sm font-medium text-gray-700'>
          Debt Distribution by Payment Status
        </h4>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis
              dataKey='paymentStatus'
              angle={-45}
              textAnchor='end'
              height={80}
              fontSize={11}
            />
            <YAxis
              tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
            />
            <Tooltip
              formatter={(value: number) => [
                `${value.toLocaleString()}`,
                'Total Debt',
              ]}
              labelFormatter={(label) => `Status: ${label}`}
            />
            <Bar
              dataKey='totalDebtAmount'
              fill='#8884d8'
              name='Total Debt Amount'
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    COLORS[entry.paymentStatus as keyof typeof COLORS] ||
                    '#8884d8'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Payment Performance Summary */}
      <div className='rounded-lg bg-gray-50 p-4'>
        <h4 className='mb-3 text-sm font-medium text-gray-700'>
          Payment Performance Summary
        </h4>
        <div className='grid grid-cols-1 gap-4 text-sm md:grid-cols-2'>
          <div>
            <h5 className='mb-2 font-medium'>Portfolio Health Indicators</h5>
            <ul className='space-y-1'>
              <li className='flex justify-between'>
                <span>Healthy Accounts (On Time):</span>
                <span className='font-medium text-green-600'>
                  {onTimePercentage.toFixed(1)}%
                </span>
              </li>
              <li className='flex justify-between'>
                <span>At-Risk Accounts (30+ days):</span>
                <span className='font-medium text-orange-600'>
                  {chartData
                    .filter(
                      (item) =>
                        !['On Time', '1-30 Days Late'].includes(
                          item.paymentStatus,
                        ),
                    )
                    .reduce((sum, item) => sum + item.percentage, 0)
                    .toFixed(1)}
                  %
                </span>
              </li>
              <li className='flex justify-between'>
                <span>Critical Accounts (90+ days):</span>
                <span className='font-medium text-red-600'>
                  {chartData
                    .filter((item) =>
                      ['91-180 Days Late', 'Over 180 Days Late'].includes(
                        item.paymentStatus,
                      ),
                    )
                    .reduce((sum, item) => sum + item.percentage, 0)
                    .toFixed(1)}
                  %
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h5 className='mb-2 font-medium'>Debt Concentration</h5>
            <ul className='space-y-1'>
              <li className='flex justify-between'>
                <span>Total Outstanding Debt:</span>
                <span className='font-medium'>
                  ${(totalDebt / 1000000).toFixed(1)}M
                </span>
              </li>
              <li className='flex justify-between'>
                <span>Average Debt per Account:</span>
                <span className='font-medium'>
                  ${(totalDebt / totalCount).toLocaleString()}
                </span>
              </li>
              <li className='flex justify-between'>
                <span>Highest Risk Category:</span>
                <span className='font-medium text-red-600'>
                  {
                    chartData.reduce((max, item) =>
                      item.totalDebtAmount > max.totalDebtAmount ? item : max,
                    ).paymentStatus
                  }
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Risk Assessment */}
        <div className='mt-4 rounded border bg-white p-3'>
          <h5 className='mb-2 flex items-center font-medium'>
            <div
              className={`mr-2 h-3 w-3 rounded-full ${
                onTimePercentage >= 80
                  ? 'bg-green-500'
                  : onTimePercentage >= 60
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
              }`}
            ></div>
            Overall Portfolio Risk Assessment
          </h5>
          <p className='text-sm text-gray-600'>
            {onTimePercentage >= 80
              ? 'Portfolio shows healthy payment behavior with strong on-time payment rates.'
              : onTimePercentage >= 60
                ? 'Portfolio shows moderate risk with room for improvement in payment collection.'
                : 'Portfolio requires immediate attention with high delinquency rates.'}
          </p>
        </div>
      </div>
    </div>
  );
}
