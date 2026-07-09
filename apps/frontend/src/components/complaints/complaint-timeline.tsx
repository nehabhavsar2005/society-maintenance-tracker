'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge, PriorityBadge } from '@/components/shared/status-badge';
import { ComplaintHistoryEntry } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { History, User as UserIcon, Bot } from 'lucide-react';

export function ComplaintTimeline({ history }: { history: ComplaintHistoryEntry[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <History className="h-4 w-4" />
          Status History & Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">No history recorded yet.</p>
        ) : (
          <div className="relative space-y-6 pl-6 before:absolute before:left-[7px] before:top-2 before:h-[calc(100%-16px)] before:w-px before:bg-border">
            {history.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: index * 0.05 }}
                className="relative"
              >
                <span className="absolute -left-6 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-background bg-primary" />
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                    {entry.actor ? <UserIcon className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                    {entry.actor?.name ?? 'System'}
                  </span>
                  <span className="text-xs text-muted-foreground">{formatDate(entry.createdAt, true)}</span>
                </div>

                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm">
                  {entry.newStatus && entry.oldStatus && entry.newStatus !== entry.oldStatus && (
                    <span className="flex items-center gap-1.5">
                      <StatusBadge status={entry.oldStatus} />
                      <span className="text-muted-foreground">→</span>
                      <StatusBadge status={entry.newStatus} />
                    </span>
                  )}
                  {entry.newStatus && !entry.oldStatus && <StatusBadge status={entry.newStatus} />}
                  {entry.newPriority && entry.oldPriority && entry.newPriority !== entry.oldPriority && (
                    <span className="flex items-center gap-1.5">
                      <PriorityBadge priority={entry.oldPriority} />
                      <span className="text-muted-foreground">→</span>
                      <PriorityBadge priority={entry.newPriority} />
                    </span>
                  )}
                </div>

                {entry.notes && <p className="mt-1.5 rounded-lg bg-muted/60 px-3 py-2 text-sm text-muted-foreground">{entry.notes}</p>}
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
