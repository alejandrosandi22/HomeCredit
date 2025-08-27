import type { DashboardData } from '@/types/dashboard';

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value);
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const calculateTotalApplications = (data: DashboardData): number => {
  return data.creditRejectionRate.reduce(
    (sum, item) => sum + item.totalApplications,
    0,
  );
};

export const calculateAverageRejectionRate = (data: DashboardData): number => {
  if (data.creditRejectionRate.length === 0) return 0;

  const totalApplications = calculateTotalApplications(data);
  const totalRejected = data.creditRejectionRate.reduce(
    (sum, item) => sum + item.rejectedApplications,
    0,
  );

  return totalApplications > 0 ? (totalRejected / totalApplications) * 100 : 0;
};

export const getMostCommonEmploymentType = (data: DashboardData): string => {
  if (data.employmentTypes.length === 0) return 'N/A';

  return data.employmentTypes.reduce((prev, current) =>
    prev.count > current.count ? prev : current,
  ).type;
};

export const getEmploymentTypeDistribution = (data: DashboardData) => {
  const total = data.employmentTypes.reduce((sum, item) => sum + item.count, 0);

  return data.employmentTypes.map((item) => ({
    ...item,
    percentage: total > 0 ? (item.count / total) * 100 : 0,
  }));
};

export const getChartColors = () => [
  'hsl(var(--primary))',
  'hsl(var(--secondary))',
  'hsl(var(--accent))',
  'hsl(var(--muted))',
  'hsl(var(--destructive))',
  'hsl(var(--warning))',
  'hsl(var(--success))',
];

export const generateDateRange = (months: number = 12) => {
  const end = new Date();
  const start = new Date();
  start.setMonth(start.getMonth() - months);

  return { from: start, to: end };
};
