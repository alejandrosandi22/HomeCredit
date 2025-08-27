'use client';

import type {
  DashboardData,
  DashboardFilters as DashboardFiltersType,
} from '@/types/dashboard';
import { useEffect, useState } from 'react';
import ClientDemographicsChart from './client-demographics-chart';
import CreditScoreChart from './credit-score-chart';
import DashboardFilters from './dashboard-filters';
import DefaultRateChart from './default-rate-chart';
import KPICards from './kpi-cards';
import LoanStatusChart from './loan-status-chart';
import PaymentHistoryChart from './payment-history-chart';
import RegionRiskChart from './region-risk-chart';

export default function DashboardContainer() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<DashboardFiltersType>({
    dateRange: {
      from: new Date(new Date().getFullYear(), 0, 1)
        .toISOString()
        .split('T')[0],
      to: new Date().toISOString().split('T')[0],
    },
    region: 'all',
    loanAmount: {
      min: 0,
      max: 500000,
    },
  });

  const fetchDashboardData = async (currentFilters: DashboardFiltersType) => {
    try {
      setIsLoading(true);
      const searchParams = new URLSearchParams({
        dateFrom: currentFilters.dateRange.from,
        dateTo: currentFilters.dateRange.to,
        region: currentFilters.region,
        minAmount: currentFilters.loanAmount.min.toString(),
        maxAmount: currentFilters.loanAmount.max.toString(),
      });
      const response = await fetch(`/api/dashboard?${searchParams}`);
      const result = await response.json();
      if (result.success && result.data) {
        setDashboardData(result.data);
      } else {
        console.error('Error fetching dashboard data:', result.message);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(filters);
  }, []);

  const handleFiltersChange = (newFilters: DashboardFiltersType) => {
    setFilters(newFilters);
    fetchDashboardData(newFilters);
  };

  return (
    <div className='space-y-6'>
      {/* Filtros */}
      <DashboardFilters
        onFiltersChange={handleFiltersChange}
        isLoading={isLoading}
      />

      {/* KPI Cards */}
      <KPICards
        metrics={dashboardData?.kpiMetrics ?? null}
        isLoading={isLoading}
      />

      {/* Gráficos */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        <ClientDemographicsChart
          data={dashboardData?.clientDemographics ?? null}
          isLoading={isLoading}
        />
        <DefaultRateChart
          data={dashboardData?.defaultRateData ?? null}
          isLoading={isLoading}
        />
        <LoanStatusChart
          data={dashboardData?.loanStatus ?? null}
          isLoading={isLoading}
        />
        <PaymentHistoryChart
          data={dashboardData?.paymentHistory ?? null}
          isLoading={isLoading}
        />
        <RegionRiskChart
          data={dashboardData?.regionRisk ?? null}
          isLoading={isLoading}
        />
        <CreditScoreChart
          data={dashboardData?.creditScoreByOccupation ?? null}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
