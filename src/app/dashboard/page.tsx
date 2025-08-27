import DashboardContainer from '@/components/dashboard/dashboard-container';
import { requireAuth } from '@/lib/auth';

export default async function DashboardPage() {
  await requireAuth();

  return <DashboardContainer />;
}
