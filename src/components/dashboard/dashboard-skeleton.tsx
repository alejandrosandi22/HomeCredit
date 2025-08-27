// src/components/dashboard/DashboardSkeleton.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardSkeleton() {
  return (
    <div className='space-y-6'>
      {/* Skeleton para los filtros */}
      <Card>
        <CardContent className='pt-6'>
          <div className='flex flex-col space-y-4'>
            <Skeleton className='h-10 w-full' />
            <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
              <Skeleton className='h-10 w-full' />
              <Skeleton className='h-10 w-full' />
              <Skeleton className='h-10 w-full' />
              <Skeleton className='h-10 w-full' />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skeleton para las tarjetas KPI */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-5'>
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardContent className='p-6'>
              <Skeleton className='mb-2 h-4 w-24' />
              <Skeleton className='h-8 w-32' />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Skeleton para los gráficos */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardContent className='flex h-80 items-center justify-center p-6'>
              <Skeleton className='h-full w-full' />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
