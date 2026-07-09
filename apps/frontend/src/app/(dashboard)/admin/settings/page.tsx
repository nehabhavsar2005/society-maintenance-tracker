'use client';

import * as React from 'react';
import { ProtectedRoute } from '@/components/shared/protected-route';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PriorityBadge } from '@/components/shared/status-badge';
import { usePrioritySettings, useUpdatePrioritySettings } from '@/hooks/use-settings';
import { ComplaintPriority } from '@/lib/types';
import { AlertTriangle } from 'lucide-react';

export default function SettingsPage() {
  const { data, isLoading } = usePrioritySettings();
  const updateSettings = useUpdatePrioritySettings();
  const [values, setValues] = React.useState<Record<ComplaintPriority, number>>({ HIGH: 3, MEDIUM: 7, LOW: 15 });

  React.useEffect(() => {
    if (data) {
      const next = { ...values };
      data.forEach((s) => (next[s.priority] = s.overdueThresholdDays));
      setValues(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const priorities: ComplaintPriority[] = ['HIGH', 'MEDIUM', 'LOW'];

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <div className="mx-auto max-w-2xl space-y-6">
        <PageHeader title="System Settings" description="Configure overdue detection thresholds by complaint priority." />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Overdue Detection Thresholds
            </CardTitle>
            <CardDescription>
              Complaints are automatically marked overdue and highlighted in red once they exceed the configured number of days without
              resolution.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-14 rounded-lg" />
                <Skeleton className="h-14 rounded-lg" />
                <Skeleton className="h-14 rounded-lg" />
              </div>
            ) : (
              priorities.map((priority) => (
                <div key={priority} className="flex items-center justify-between gap-4 rounded-lg border border-border p-4">
                  <div className="flex items-center gap-3">
                    <PriorityBadge priority={priority} />
                    <Label htmlFor={`threshold-${priority}`} className="text-sm text-muted-foreground">
                      Mark overdue after
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      id={`threshold-${priority}`}
                      type="number"
                      min={1}
                      max={90}
                      className="w-20"
                      value={values[priority]}
                      onChange={(e) => setValues((v) => ({ ...v, [priority]: Number(e.target.value) }))}
                    />
                    <span className="text-sm text-muted-foreground">days</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateSettings.mutate({ priority, days: values[priority] })}
                      loading={updateSettings.isPending}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
