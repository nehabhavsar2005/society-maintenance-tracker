'use client';

import { motion } from 'framer-motion';
import { AlertOctagon, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ErrorState({ message = 'Something went wrong while loading data.', onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center gap-4 rounded-xl border border-destructive/20 bg-destructive/5 px-6 py-16 text-center"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
        <AlertOctagon className="h-8 w-8 text-destructive" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-foreground">We hit a snag</h3>
        <p className="max-w-sm text-sm text-muted-foreground">{message}</p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          <RotateCw className="h-4 w-4" />
          Try again
        </Button>
      )}
    </motion.div>
  );
}
