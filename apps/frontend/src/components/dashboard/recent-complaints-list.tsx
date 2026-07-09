'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoryIcon } from '@/components/shared/category-icon';
import { StatusBadge } from '@/components/shared/status-badge';
import { EmptyState } from '@/components/shared/empty-state';
import { Complaint } from '@/lib/types';
import { timeAgo } from '@/lib/utils';
import { Inbox, ArrowRight } from 'lucide-react';

export function RecentComplaintsList({ complaints }: { complaints: Complaint[] }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">Latest Complaints</CardTitle>
        <Link href="/complaints" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
          View all
          <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent>
        {complaints.length === 0 ? (
          <EmptyState icon={Inbox} title="No complaints yet" description="New complaints will show up here." className="py-8" />
        ) : (
          <div className="space-y-1">
            {complaints.map((complaint) => (
              <Link
                key={complaint.id}
                href={`/complaints/${complaint.id}`}
                className="flex items-center gap-3 rounded-lg p-2.5 transition-colors hover:bg-accent"
              >
                <CategoryIcon category={complaint.category} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{complaint.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {complaint.ticketNumber} · {complaint.resident?.name ?? 'You'} · {timeAgo(complaint.createdAt)}
                  </p>
                </div>
                <StatusBadge status={complaint.status} />
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
