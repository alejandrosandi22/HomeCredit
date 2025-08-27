import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function UserTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <Skeleton className='h-6 w-32' />
          <Skeleton className='h-9 w-28' />
        </div>
        <div className='flex items-center space-x-2'>
          <Skeleton className='h-9 w-64' />
          <Skeleton className='h-9 w-32' />
          <Skeleton className='h-9 w-32' />
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className='flex items-center space-x-4 p-2'>
              <Skeleton className='h-10 w-10 rounded-full' />
              <div className='flex-1 space-y-2'>
                <Skeleton className='h-4 w-48' />
                <Skeleton className='h-3 w-32' />
              </div>
              <Skeleton className='h-6 w-16' />
              <Skeleton className='h-6 w-20' />
              <div className='flex space-x-2'>
                <Skeleton className='h-8 w-8' />
                <Skeleton className='h-8 w-8' />
                <Skeleton className='h-8 w-8' />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
