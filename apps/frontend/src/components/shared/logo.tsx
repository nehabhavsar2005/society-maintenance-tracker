import { Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className, iconOnly = false }: { className?: string; iconOnly?: boolean }) {
  return (
    <div className={cn('flex items-center gap-2 font-bold', className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 shadow-md shadow-indigo-500/30">
        <Building2 className="h-5 w-5 text-white" />
      </span>
      {!iconOnly && <span className="text-lg tracking-tight">Society<span className="text-primary">Tracker</span></span>}
    </div>
  );
}
