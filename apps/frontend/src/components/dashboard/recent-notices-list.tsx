'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/empty-state';
import { Badge } from '@/components/ui/badge';
import { Notice } from '@/lib/types';
import { timeAgo } from '@/lib/utils';
import { Megaphone, Pin, ArrowRight } from 'lucide-react';

export function RecentNoticesList({ notices }: { notices: Notice[] }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">Latest Notices</CardTitle>
        <Link href="/notices" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
          View all
          <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent>
        {notices.length === 0 ? (
          <EmptyState icon={Megaphone} title="No notices yet" description="Society announcements will appear here." className="py-8" />
        ) : (
          <div className="space-y-1">
            {notices.map((notice) => (
              <Link key={notice.id} href="/notices" className="flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-accent">
                <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {notice.isPinned ? <Pin className="h-3.5 w-3.5" /> : <Megaphone className="h-3.5 w-3.5" />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-foreground">{notice.title}</p>
                    {notice.isImportant && (
                      <Badge variant="destructive" className="flex-shrink-0">
                        Important
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{timeAgo(notice.createdAt)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
