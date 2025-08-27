import { DemographicsItem } from '@/types/dashboard.types';
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

interface DemographicsChartProps {
  data: DemographicsItem[];
}

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884D8',
  '#82CA9D',
];

const CustomTooltip: React.FC<{
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: DemographicsItem;
  }>;
  label?: string;
}> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className='rounded-lg border bg-white p-3 shadow-lg'>
        <p className='font-semibold'>
          {data.category}: {label}
        </p>
        <p className='text-blue-600'>Count: {data.count.toLocaleString()}</p>
        <p className='text-green-600'>
          Avg Income: ${data.avgIncome.toLocaleString()}
        </p>
        <p className='text-red-600'>
          Default Rate: {data.defaultRate.toFixed(1)}%
        </p>
      </div>
    );
  }
  return null;
};

export default function DemographicsChart({ data }: DemographicsChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className='flex h-64 items-center justify-center text-gray-500'>
        No demographics data available
      </div>
    );
  }

  const groupedData = data.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, DemographicsItem[]>,
  );

  const categories = Object.keys(groupedData);

  return (
    <div className='w-full space-y-8'>
      {/* Overview Charts by Category */}
      {categories.map((category, categoryIndex) => {
        const categoryData = groupedData[category];

        return (
          <div key={category} className='space-y-4'>
            <h4 className='border-b pb-2 text-lg font-semibold text-gray-800'>
              {category} Analysis
            </h4>

            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
              {/* Distribution Pie Chart */}
              <div className='h-64'>
                <h5 className='mb-3 text-sm font-medium text-gray-700'>
                  Distribution
                </h5>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx='50%'
                      cy='50%'
                      labelLine={false}
                      label={({ subcategory, count }) =>
                        `${subcategory}: ${count.toLocaleString()}`
                      }
                      outerRadius={60}
                      fill='#8884d8'
                      dataKey='count'
                    >
                      {categoryData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Average Income Bar Chart */}
              <div className='h-64'>
                <h5 className='mb-3 text-sm font-medium text-gray-700'>
                  Average Income
                </h5>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart
                    data={categoryData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis
                      dataKey='subcategory'
                      angle={-45}
                      textAnchor='end'
                      height={60}
                      fontSize={12}
                    />
                    <YAxis
                      tickFormatter={(value) =>
                        `$${(value / 1000).toFixed(0)}K`
                      }
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey='avgIncome'
                      fill={COLORS[categoryIndex % COLORS.length]}
                      opacity={0.8}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Summary Cards */}
            <div className='grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3'>
              {categoryData.map((item, index) => (
                <div
                  key={`${category}-${index}`}
                  className='rounded-lg border bg-white p-4 transition-shadow hover:shadow-md'
                >
                  <div className='mb-3 flex items-center justify-between'>
                    <h6 className='font-semibold text-gray-800'>
                      {item.subcategory}
                    </h6>
                    <div
                      className='h-4 w-4 rounded'
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                  </div>

                  <div className='space-y-2 text-sm'>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Count:</span>
                      <span className='font-medium'>
                        {item.count.toLocaleString()}
                      </span>
                    </div>

                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Avg Income:</span>
                      <span className='font-medium text-green-600'>
                        ${item.avgIncome.toLocaleString()}
                      </span>
                    </div>

                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Default Rate:</span>
                      <span
                        className={`font-medium ${
                          item.defaultRate > 15
                            ? 'text-red-600'
                            : item.defaultRate > 10
                              ? 'text-yellow-600'
                              : 'text-green-600'
                        }`}
                      >
                        {item.defaultRate.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Risk Indicator */}
                  <div className='mt-3'>
                    <div className='mb-1 flex justify-between text-xs text-gray-500'>
                      <span>Risk Level</span>
                      <span>{item.defaultRate.toFixed(1)}%</span>
                    </div>
                    <div className='h-2 w-full rounded-full bg-gray-200'>
                      <div
                        className={`h-2 rounded-full ${
                          item.defaultRate > 15
                            ? 'bg-red-500'
                            : item.defaultRate > 10
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                        }`}
                        style={{
                          width: `${Math.min(item.defaultRate * 5, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Combined Analysis */}
      <div className='space-y-4'>
        <h4 className='border-b pb-2 text-lg font-semibold text-gray-800'>
          Combined Demographics Analysis
        </h4>

        {/* Default Rate Comparison */}
        <div className='h-80'>
          <h5 className='mb-3 text-sm font-medium text-gray-700'>
            Default Rate by Demographics
          </h5>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis
                dataKey='subcategory'
                angle={-45}
                textAnchor='end'
                height={80}
                fontSize={11}
              />
              <YAxis
                domain={[0, 'dataMax + 5']}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey='defaultRate'
                fill='#FF6B6B'
                name='Default Rate (%)'
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Statistics */}
        <div className='rounded-lg bg-gray-50 p-4'>
          <h5 className='mb-3 text-sm font-medium text-gray-700'>
            Key Insights
          </h5>
          <div className='grid grid-cols-1 gap-4 text-sm md:grid-cols-2 lg:grid-cols-4'>
            <div className='rounded bg-white p-3'>
              <div className='text-gray-600'>Total Applicants</div>
              <div className='text-xl font-bold text-blue-600'>
                {data
                  .reduce((sum, item) => sum + item.count, 0)
                  .toLocaleString()}
              </div>
            </div>

            <div className='rounded bg-white p-3'>
              <div className='text-gray-600'>Avg Income (All)</div>
              <div className='text-xl font-bold text-green-600'>
                $
                {Math.round(
                  data.reduce(
                    (sum, item) => sum + item.avgIncome * item.count,
                    0,
                  ) / data.reduce((sum, item) => sum + item.count, 0),
                ).toLocaleString()}
              </div>
            </div>

            <div className='rounded bg-white p-3'>
              <div className='text-gray-600'>Overall Default Rate</div>
              <div className='text-xl font-bold text-red-600'>
                {(
                  data.reduce(
                    (sum, item) => sum + item.defaultRate * item.count,
                    0,
                  ) / data.reduce((sum, item) => sum + item.count, 0)
                ).toFixed(1)}
                %
              </div>
            </div>

            <div className='rounded bg-white p-3'>
              <div className='text-gray-600'>Categories</div>
              <div className='text-xl font-bold text-purple-600'>
                {Object.keys(groupedData).length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
