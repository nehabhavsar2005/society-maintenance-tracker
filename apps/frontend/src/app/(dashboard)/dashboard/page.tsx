'use client';

import Link from 'next/link';
import { FileText, CircleDot, Clock, CheckCircle2, AlertTriangle, Users, Plus } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { ErrorState } from '@/components/shared/error-state';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/dashboard/stat-card';
import { CategoryChart } from '@/components/dashboard/category-chart';
import { PriorityChart } from '@/components/dashboard/priority-chart';
import { TrendChart } from '@/components/dashboard/trend-chart';
import { RecentComplaintsList } from '@/components/dashboard/recent-complaints-list';
import { RecentNoticesList } from '@/components/dashboard/recent-notices-list';
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeleton';
import { useDashboardStats } from '@/hooks/use-dashboard';
import { useAuth } from '@/providers/auth-provider';
import { AdminDashboardStats, ResidentDashboardStats } from '@/lib/services/dashboard.service';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading, isError, refetch } = useDashboardStats();

  if (isLoading || !data) return <DashboardSkeleton />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.name.split(' ')[0]} 👋`}
        description={isAdmin ? "Here's what's happening across your society today." : 'Track your complaints and stay updated with society notices.'}
        actions={
          <Link href="/complaints/new">
            <Button variant="gradient">
              <Plus className="h-4 w-4" />
              New Complaint
            </Button>
          </Link>
        }
      />

      {isAdmin ? <AdminOverview data={data as AdminDashboardStats} /> : <ResidentOverview data={data as ResidentDashboardStats} />}
    </div>
  );
}

function AdminOverview({ data }: { data: AdminDashboardStats }) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Complaints" value={data.totals.total} icon={FileText} color="indigo" index={0} />
        <StatCard label="Open" value={data.totals.open} icon={CircleDot} color="blue" index={1} />
        <StatCard label="In Progress" value={data.totals.inProgress} icon={Clock} color="amber" index={2} />
        <StatCard label="Resolved" value={data.totals.resolved} icon={CheckCircle2} color="emerald" index={3} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Overdue" value={data.totals.overdue} icon={AlertTriangle} color="red" index={4} />
        <StatCard label="Closed" value={data.totals.closed} icon={CheckCircle2} color="purple" index={5} />
        <StatCard label="Total Residents" value={data.totals.totalResidents} icon={Users} color="blue" index={6} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <CategoryChart data={data.byCategory} />
        <PriorityChart data={data.byPriority} />
      </div>

      <div className="mt-4">
        <TrendChart data={data.monthlyTrend} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RecentComplaintsList complaints={data.recentComplaints} />
        <RecentNoticesList notices={data.recentNotices} />
      </div>
    </>
  );
}

function ResidentOverview({ data }: { data: ResidentDashboardStats }) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Complaints" value={data.totals.total} icon={FileText} color="indigo" index={0} />
        <StatCard label="Open" value={data.totals.open} icon={CircleDot} color="blue" index={1} />
        <StatCard label="In Progress" value={data.totals.inProgress} icon={Clock} color="amber" index={2} />
        <StatCard label="Resolved" value={data.totals.resolved} icon={CheckCircle2} color="emerald" index={3} />
      </div>
      {data.totals.overdue > 0 && (
        <div className="mt-4">
          <StatCard label="Overdue" value={data.totals.overdue} icon={AlertTriangle} color="red" index={4} />
        </div>
      )}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RecentComplaintsList complaints={data.recentComplaints} />
        <RecentNoticesList notices={data.recentNotices} />
      </div>
    </>
  );
}
