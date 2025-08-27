import ClientsPageContent from '@/components/clients/clients-page-content';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Gestión de Clientes',
  description:
    'Administra y consulta la información de los clientes del sistema financiero.',
};

function ClientsPageSkeleton() {
  return (
    <div className='space-y-6'>
      {/* Header Skeleton */}
      <div className='space-y-2'>
        <Skeleton className='h-8 w-48' />
        <Skeleton className='h-4 w-96' />
      </div>

      {/* Actions Skeleton */}
      <div className='flex items-center justify-between'>
        <Skeleton className='h-10 w-32' />
        <Skeleton className='h-10 w-40' />
      </div>

      {/* Filters Skeleton */}
      <Card>
        <CardContent className='p-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
          </div>
        </CardContent>
      </Card>

      {/* Table Skeleton */}
      <Card>
        <CardContent className='p-0'>
          <div className='space-y-4 p-4'>
            {/* Table Header */}
            <div className='grid grid-cols-8 gap-4'>
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className='h-4 w-full' />
              ))}
            </div>

            {/* Table Rows */}
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <div key={rowIndex} className='grid grid-cols-8 gap-4'>
                {Array.from({ length: 8 }).map((_, colIndex) => (
                  <Skeleton key={colIndex} className='h-6 w-full' />
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pagination Skeleton */}
      <div className='flex items-center justify-between'>
        <Skeleton className='h-4 w-48' />
        <div className='flex space-x-2'>
          <Skeleton className='h-8 w-20' />
          <Skeleton className='h-8 w-8' />
          <Skeleton className='h-8 w-8' />
          <Skeleton className='h-8 w-8' />
          <Skeleton className='h-8 w-8' />
        </div>
      </div>
    </div>
  );
}

export default function ClientsPage() {
  return (
    <div className='container mx-auto py-6'>
      <Suspense fallback={<ClientsPageSkeleton />}>
        <ClientsPageContent />
      </Suspense>
    </div>
  );
}
