import {
  Zap,
  Droplets,
  Wrench,
  ShieldCheck,
  CarFront,
  ArrowUpDown,
  Sparkles,
  Trees,
  Volume2,
  HelpCircle,
  type LucideIcon,
} from 'lucide-react';
import { ComplaintCategory } from '@/lib/types';
import { cn } from '@/lib/utils';

const CATEGORY_ICON: Record<ComplaintCategory, LucideIcon> = {
  ELECTRICAL: Zap,
  WATER: Droplets,
  PLUMBING: Wrench,
  SECURITY: ShieldCheck,
  PARKING: CarFront,
  LIFT: ArrowUpDown,
  CLEANING: Sparkles,
  GARDEN: Trees,
  NOISE: Volume2,
  OTHER: HelpCircle,
};

const CATEGORY_COLOR: Record<ComplaintCategory, string> = {
  ELECTRICAL: 'text-amber-500 bg-amber-500/10',
  WATER: 'text-blue-500 bg-blue-500/10',
  PLUMBING: 'text-cyan-500 bg-cyan-500/10',
  SECURITY: 'text-red-500 bg-red-500/10',
  PARKING: 'text-slate-500 bg-slate-500/10',
  LIFT: 'text-purple-500 bg-purple-500/10',
  CLEANING: 'text-emerald-500 bg-emerald-500/10',
  GARDEN: 'text-green-500 bg-green-500/10',
  NOISE: 'text-orange-500 bg-orange-500/10',
  OTHER: 'text-gray-500 bg-gray-500/10',
};

export function CategoryIcon({ category, className }: { category: ComplaintCategory; className?: string }) {
  const Icon = CATEGORY_ICON[category];
  return (
    <span className={cn('inline-flex items-center justify-center rounded-lg p-2', CATEGORY_COLOR[category], className)}>
      <Icon className="h-4 w-4" />
    </span>
  );
}
