'use client';

import * as React from 'react';
import { ProtectedRoute } from '@/components/shared/protected-route';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { PaginationControls } from '@/components/shared/pagination-controls';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { useAllUsers, useToggleUserActive } from '@/hooks/use-users';
import { formatDate, initials } from '@/lib/utils';
import { Users } from 'lucide-react';

export default function ResidentsPage() {
  const [page, setPage] = React.useState(1);
  const { data, isLoading, isError, refetch } = useAllUsers({ page, limit: 12 });
  const toggleActive = useToggleUserActive();

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <div className="space-y-6">
        <PageHeader title="Residents & Users" description="Manage resident and admin accounts across your society." />

        {isLoading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        )}

        {isError && <ErrorState onRetry={() => refetch()} />}

        {!isLoading && !isError && data && (
          <>
            {data.items.length === 0 ? (
              <EmptyState icon={Users} title="No users found" />
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data.items.map((u) => (
                  <Card key={u.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{initials(u.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-semibold">{u.name}</p>
                            <p className="text-xs text-muted-foreground">{u.email}</p>
                          </div>
                        </div>
                        <Badge variant={u.role === 'ADMIN' ? 'info' : 'secondary'}>{u.role}</Badge>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {u.flatNumber ? `Flat ${u.flatNumber}` : '—'} · Joined {formatDate(u.createdAt)}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                        <span className="text-xs text-muted-foreground">{u._count.complaints} complaint(s)</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{u.isActive ? 'Active' : 'Suspended'}</span>
                          <Switch checked={u.isActive} onCheckedChange={() => toggleActive.mutate(u.id)} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            <PaginationControls meta={data.meta} onPageChange={setPage} />
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
