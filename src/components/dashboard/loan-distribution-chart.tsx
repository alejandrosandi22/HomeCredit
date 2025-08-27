import { LoanDistributionItem } from '@/types/dashboard.types';
import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface LoanDistributionChartProps {
  data: LoanDistributionItem[];
}

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884D8',
  '#82CA9D',
  '#FFC658',
  '#FF7C7C',
];

const CustomTooltip: React.FC<{
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: LoanDistributionItem;
  }>;
}> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className='rounded-lg border bg-white p-3 shadow-lg'>
        <p className='font-semibold'>{data.contractType}</p>
        <p className='text-blue-600'>
          Applications: {data.count.toLocaleString()}
        </p>
        <p className='text-green-600'>Percentage: {data.percentage}%</p>
        <p className='text-purple-600'>
          Avg Amount: ${data.avgAmount.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export default function LoanDistributionChart({
  data,
}: LoanDistributionChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className='flex h-64 items-center justify-center text-gray-500'>
        No loan distribution data available
      </div>
    );
  }

  return (
    <div className='w-full space-y-6'>
      {/* Pie Chart for Distribution */}
      <div className='h-80'>
        <h4 className='mb-3 text-sm font-medium text-gray-700'>
          Distribution by Type
        </h4>
        <ResponsiveContainer width='100%' height='100%'>
          <PieChart>
            <Pie
              data={data}
              cx='50%'
              cy='50%'
              labelLine={false}
              label={({ contractType, percentage }) =>
                `${contractType}: ${percentage}%`
              }
              outerRadius={80}
              fill='#8884d8'
              dataKey='count'
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart for Average Amounts */}
      <div className='h-64'>
        <h4 className='mb-3 text-sm font-medium text-gray-700'>
          Average Credit Amounts
        </h4>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis
              dataKey='contractType'
              angle={-45}
              textAnchor='end'
              height={60}
              interval={0}
              fontSize={12}
            />
            <YAxis
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
              fontSize={12}
            />
            <Tooltip
              formatter={(value: number) => [
                `$${value.toLocaleString()}`,
                'Avg Amount',
              ]}
              labelFormatter={(label) => `Contract Type: ${label}`}
            />
            <Bar dataKey='avgAmount' fill='#0088FE' />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Table */}
      <div className='mt-4'>
        <h4 className='mb-2 text-sm font-medium text-gray-700'>Summary</h4>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='border-b'>
                <th className='p-2 text-left'>Contract Type</th>
                <th className='p-2 text-right'>Applications</th>
                <th className='p-2 text-right'>Percentage</th>
                <th className='p-2 text-right'>Avg Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className='border-b last:border-b-0'>
                  <td className='p-2'>
                    <div className='flex items-center'>
                      <div
                        className='mr-2 h-3 w-3 rounded'
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                      {item.contractType}
                    </div>
                  </td>
                  <td className='p-2 text-right'>
                    {item.count.toLocaleString()}
                  </td>
                  <td className='p-2 text-right'>{item.percentage}%</td>
                  <td className='p-2 text-right'>
                    ${item.avgAmount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
