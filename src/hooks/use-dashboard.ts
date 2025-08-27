// src/hooks/useDashboard.ts
import {
  ComponentDataRequest,
  DashboardData,
  DashboardFilters,
  DashboardResponse,
} from '@/types/dashboard.types';
import { useCallback, useEffect, useState } from 'react';

interface UseDashboardReturn {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  executionTime: string | null;
  refreshData: () => Promise<void>;
  fetchComponentData: (request: ComponentDataRequest) => Promise<unknown>;
}

export function useDashboard(): UseDashboardReturn {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [executionTime, setExecutionTime] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const startTime = performance.now();

      const response = await fetch('/api/dashboard', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'force-cache',
        next: { revalidate: 300 },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: DashboardResponse = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch dashboard data');
      }

      const endTime = performance.now();
      const clientExecutionTime = `${Math.round(endTime - startTime)}ms`;

      setData(result.data || null);
      setExecutionTime(result.executionTime || clientExecutionTime);

      console.log(
        `Dashboard data loaded in ${result.executionTime || clientExecutionTime}`,
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchComponentData = useCallback(
    async (request: ComponentDataRequest): Promise<unknown> => {
      try {
        const response = await fetch('/api/dashboard', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch component data');
        }

        return result.data;
      } catch (err) {
        console.error('Component data fetch error:', err);
        throw err;
      }
    },
    [],
  );

  const refreshData = useCallback(async () => {
    await fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    data,
    loading,
    error,
    executionTime,
    refreshData,
    fetchComponentData,
  };
}

export function useDashboardComponent(
  component: ComponentDataRequest['component'],
  filters?: DashboardFilters,
) {
  const [componentData, setComponentData] = useState<unknown>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/dashboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ component, filters }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch component data');
      }

      setComponentData(result.data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error(`${component} fetch error:`, err);
    } finally {
      setLoading(false);
    }
  }, [component, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data: componentData,
    loading,
    error,
    refetch: fetchData,
  };
}
