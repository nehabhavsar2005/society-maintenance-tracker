'use client';

import { motion } from 'framer-motion';
import { type LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color: 'indigo' | 'emerald' | 'amber' | 'red' | 'blue' | 'purple';
  trend?: { value: number; label: string };
  index?: number;
}

const COLOR_MAP: Record<StatCardProps['color'], { gradient: string; iconColor: string; badgeBg: string }> = {
  indigo: { gradient: 'from-indigo-500 to-indigo-600', iconColor: 'text-indigo-600', badgeBg: 'bg-indigo-500/10' },
  emerald: { gradient: 'from-emerald-500 to-emerald-600', iconColor: 'text-emerald-600', badgeBg: 'bg-emerald-500/10' },
  amber: { gradient: 'from-amber-500 to-amber-600', iconColor: 'text-amber-600', badgeBg: 'bg-amber-500/10' },
  red: { gradient: 'from-red-500 to-red-600', iconColor: 'text-red-600', badgeBg: 'bg-red-500/10' },
  blue: { gradient: 'from-blue-500 to-blue-600', iconColor: 'text-blue-600', badgeBg: 'bg-blue-500/10' },
  purple: { gradient: 'from-purple-500 to-purple-600', iconColor: 'text-purple-600', badgeBg: 'bg-purple-500/10' },
};

export function StatCard({ label, value, icon: Icon, color, trend, index = 0 }: StatCardProps) {
  const { gradient, iconColor, badgeBg } = COLOR_MAP[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="group relative overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg">
        <div className={cn('absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br opacity-10 blur-2xl transition-opacity group-hover:opacity-20', gradient)} />
        <CardContent className="relative flex items-start justify-between p-5">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">{value}</p>
            {trend && (
              <div className={cn('mt-2 inline-flex items-center gap-1 text-xs font-medium', trend.value >= 0 ? 'text-success' : 'text-destructive')}>
                {trend.value >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {Math.abs(trend.value)}% {trend.label}
              </div>
            )}
          </div>
          <span className={cn('flex h-11 w-11 items-center justify-center rounded-xl', badgeBg, iconColor)}>
            <Icon className="h-5 w-5" />
          </span>
        </CardContent>
      </Card>
    </motion.div>
  );
}
