import { Badge } from '@/components/ui/badge';
import { ComplaintPriority, ComplaintStatus, PRIORITY_LABELS, STATUS_LABELS } from '@/lib/types';
import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle2, CircleDot, Clock, XCircle } from 'lucide-react';

const STATUS_CONFIG: Record<ComplaintStatus, { variant: 'info' | 'warning' | 'success' | 'secondary' | 'destructive'; icon: typeof Clock }> = {
  OPEN: { variant: 'info', icon: CircleDot },
  IN_PROGRESS: { variant: 'warning', icon: Clock },
  RESOLVED: { variant: 'success', icon: CheckCircle2 },
  CLOSED: { variant: 'secondary', icon: XCircle },
  OVERDUE: { variant: 'destructive', icon: AlertTriangle },
};

export function StatusBadge({ status, className }: { status: ComplaintStatus; className?: string }) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  return (
    <Badge variant={config.variant} className={cn(status === 'OVERDUE' && 'animate-pulse', className)}>
      <Icon className="h-3 w-3" />
      {STATUS_LABELS[status]}
    </Badge>
  );
}

const PRIORITY_CONFIG: Record<ComplaintPriority, { variant: 'destructive' | 'warning' | 'secondary'; dot: string }> = {
  HIGH: { variant: 'destructive', dot: 'bg-red-500' },
  MEDIUM: { variant: 'warning', dot: 'bg-amber-500' },
  LOW: { variant: 'secondary', dot: 'bg-slate-400' },
};

export function PriorityBadge({ priority, className }: { priority: ComplaintPriority; className?: string }) {
  const config = PRIORITY_CONFIG[priority];
  return (
    <Badge variant={config.variant} className={className}>
      <span className={cn('h-1.5 w-1.5 rounded-full', config.dot)} />
      {PRIORITY_LABELS[priority]}
    </Badge>
  );
}
