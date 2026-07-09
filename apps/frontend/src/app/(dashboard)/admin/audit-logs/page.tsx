'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ProtectedRoute } from '@/components/shared/protected-route';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { PaginationControls } from '@/components/shared/pagination-controls';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { auditApi } from '@/lib/services/audit.service';
import { formatDate } from '@/lib/utils';
import { ScrollText } from 'lucide-react';

const ACTION_COLORS: Record<string, 'default' | 'destructive' | 'warning' | 'success' | 'info' | 'secondary'> = {
  DELETE: 'destructive',
  BULK_ACTION: 'warning',
  ADMIN_UPDATE: 'info',
};

export default function AuditLogsPage() {
  const [page, setPage] = React.useState(1);
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['audit-logs', page],
    queryFn: () => auditApi.list({ page, limit: 15 }),
  });

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <div className="space-y-6">
        <PageHeader title="Audit Logs" description="A complete history of administrative actions taken across the platform." />

        {isLoading && (
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
        )}

        {isError && <ErrorState onRetry={() => refetch()} />}

        {!isLoading && !isError && data && (
          <>
            {data.items.length === 0 ? (
              <EmptyState icon={ScrollText} title="No audit logs yet" description="Administrative actions will be recorded here." />
            ) : (
              <Card>
                <CardContent className="divide-y divide-border p-0">
                  {data.items.map((log) => (
                    <div key={log.id} className="flex items-center justify-between gap-4 p-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={ACTION_COLORS[log.action] ?? 'secondary'}>{log.action.replace('_', ' ')}</Badge>
                          <span className="text-sm font-medium text-foreground">{log.entityType}</span>
                          {log.entityId && <span className="truncate font-mono text-xs text-muted-foreground">#{log.entityId.slice(0, 8)}</span>}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {log.user ? `${log.user.name} (${log.user.role})` : 'System'} · {formatDate(log.createdAt, true)}
                          {log.ipAddress ? ` · ${log.ipAddress}` : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
            <PaginationControls meta={data.meta} onPageChange={setPage} />
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
