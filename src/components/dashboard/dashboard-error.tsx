'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface DashboardErrorProps {
  error: string;
  onRetry: () => void;
}

export default function DashboardError({
  error,
  onRetry,
}: DashboardErrorProps) {
  return (
    <div className='container mx-auto p-6'>
      <Card>
        <CardContent className='p-6'>
          <Alert variant='destructive' className='mb-4'>
            <AlertTriangle className='h-4 w-4' />
            <AlertDescription>
              Failed to load dashboard data: {error}
            </AlertDescription>
          </Alert>

          <div className='text-center'>
            <p className='text-muted-foreground mb-4'>
              There was an error loading the dashboard. Please try again.
            </p>
            <Button onClick={onRetry} variant='outline'>
              <RefreshCw className='mr-2 h-4 w-4' />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
