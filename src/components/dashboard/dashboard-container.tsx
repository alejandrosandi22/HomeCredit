'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertTriangle,
  BarChart3,
  CreditCard,
  RefreshCw,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import CreditTrendsChart from './credit-trends-chart';
import DefaultRiskChart from './default-risk-chart';
import DemographicsChart from './demographics-chart';
import LoadingSpinner from './loading-spinner';
import LoanDistributionChart from './loan-distribution-chart';
import { PaymentBehaviorChart } from './payment-behavior-chart';

interface DashboardData {
  loanDistribution: Array<{
    contractType: string;
    count: number;
    percentage: number;
    avgAmount: number;
  }>;
  defaultRiskAnalysis: Array<{
    riskCategory: string;
    totalApplications: number;
    defaulted: number;
    defaultRate: number;
    avgCreditAmount: number;
  }>;
  creditAmountTrends: Array<{
    month: string;
    totalApplications: number;
    avgCreditAmount: number;
    totalCreditAmount: number;
  }>;
  applicantDemographics: Array<{
    category: string;
    subcategory: string;
    count: number;
    avgIncome: number;
    defaultRate: number;
  }>;
  paymentBehavior: Array<{
    paymentStatus: string;
    count: number;
    avgDaysOverdue: number;
    totalDebtAmount: number;
  }>;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/dashboard');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch dashboard data');
      }

      setData(result.data || null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <LoadingSpinner size='large' text='Loading dashboard...' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='p-6'>
        <Alert variant='destructive'>
          <AlertTriangle className='h-4 w-4' />
          <AlertDescription>Error loading dashboard: {error}</AlertDescription>
        </Alert>
        <Button onClick={fetchData} className='mt-4' variant='outline'>
          <RefreshCw className='mr-2 h-4 w-4' />
          Retry
        </Button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className='p-6'>
        <Alert>
          <AlertDescription>No dashboard data available.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className='min-h-screen space-y-6 bg-gray-50 p-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight text-gray-900'>
            Home Credit Dashboard
          </h1>
          <p className='mt-1 text-gray-600'>
            Credit risk analysis and loan performance metrics
          </p>
        </div>
        <Button onClick={fetchData} variant='outline' size='sm'>
          <RefreshCw className='mr-2 h-4 w-4' />
          Refresh
        </Button>
      </div>

      {/* Key Metrics Summary */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Applications
            </CardTitle>
            <Users className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {data.loanDistribution
                .reduce((acc, item) => acc + item.count, 0)
                .toLocaleString()}
            </div>
            <p className='text-muted-foreground text-xs'>
              Across all loan types
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Avg Credit Amount
            </CardTitle>
            <CreditCard className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              $
              {(
                data.loanDistribution.reduce(
                  (acc, item) => acc + item.avgAmount * item.count,
                  0,
                ) /
                data.loanDistribution.reduce((acc, item) => acc + item.count, 0)
              ).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <p className='text-muted-foreground text-xs'>Weighted average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Default Rate</CardTitle>
            <AlertTriangle className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-red-600'>
              {(
                (data.defaultRiskAnalysis.reduce(
                  (acc, item) => acc + item.defaulted,
                  0,
                ) /
                  data.defaultRiskAnalysis.reduce(
                    (acc, item) => acc + item.totalApplications,
                    0,
                  )) *
                100
              ).toFixed(1)}
              %
            </div>
            <p className='text-muted-foreground text-xs'>
              Overall default rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Payment Issues
            </CardTitle>
            <BarChart3 className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-orange-600'>
              {data.paymentBehavior
                .filter((item) => item.paymentStatus !== 'On Time')
                .reduce((acc, item) => acc + item.count, 0)
                .toLocaleString()}
            </div>
            <p className='text-muted-foreground text-xs'>Late payments</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Charts */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <TrendingUp className='h-5 w-5' />
              Loan Distribution by Type
            </CardTitle>
            <CardDescription>
              Distribution and average amounts across different loan types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoanDistributionChart data={data.loanDistribution} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <AlertTriangle className='h-5 w-5' />
              Default Risk by Income Category
            </CardTitle>
            <CardDescription>
              Default rates and application volumes by income segments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DefaultRiskChart data={data.defaultRiskAnalysis} />
          </CardContent>
        </Card>
      </div>

      {/* Credit Trends - Full Width */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <BarChart3 className='h-5 w-5' />
            Credit Amount Trends
          </CardTitle>
          <CardDescription>
            Monthly trends in credit applications and average amounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreditTrendsChart data={data.creditAmountTrends} />
        </CardContent>
      </Card>

      {/* Demographics and Payment Behavior */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Users className='h-5 w-5' />
              Applicant Demographics
            </CardTitle>
            <CardDescription>
              Demographics breakdown with default rates and average income
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DemographicsChart data={data.applicantDemographics} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <CreditCard className='h-5 w-5' />
              Payment Behavior Analysis
            </CardTitle>
            <CardDescription>
              Payment status distribution and overdue analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PaymentBehaviorChart data={data.paymentBehavior} />
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className='py-4 text-center text-sm text-gray-500'>
        Dashboard updated: {new Date().toLocaleString()}
      </div>
    </div>
  );
}
