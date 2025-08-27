// src/app/dashboard/users/page.tsx
import UsersContainer from '@/components/users/users-container';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function UsersPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <div className='container mx-auto p-6'>
      <UsersContainer />
    </div>
  );
}
