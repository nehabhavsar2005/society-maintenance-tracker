'use client';

import { motion } from 'framer-motion';
import { Pin, PinOff, Pencil, Trash2, Megaphone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Notice } from '@/lib/types';
import { formatDate, initials, timeAgo } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface NoticeCardProps {
  notice: Notice;
  isAdmin?: boolean;
  index?: number;
  onEdit?: (notice: Notice) => void;
  onDelete?: (notice: Notice) => void;
  onTogglePin?: (notice: Notice) => void;
}

export function NoticeCard({ notice, isAdmin, index = 0, onEdit, onDelete, onTogglePin }: NoticeCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.3) }}>
      <Card
        className={cn(
          'relative overflow-hidden transition-all hover:shadow-md',
          notice.isPinned && 'border-primary/40 bg-gradient-to-br from-primary/[0.04] to-transparent'
        )}
      >
        {notice.isPinned && (
          <div className="absolute right-3 top-3 text-primary">
            <Pin className="h-4 w-4 fill-primary" />
          </div>
        )}
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Megaphone className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-foreground">{notice.title}</h3>
                {notice.isImportant && <Badge variant="destructive">Important</Badge>}
              </div>
              <p className="mt-1.5 whitespace-pre-wrap text-sm text-muted-foreground">{notice.content}</p>
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <Avatar className="h-5 w-5">
                  <AvatarFallback className="text-[9px]">{notice.author ? initials(notice.author.name) : 'A'}</AvatarFallback>
                </Avatar>
                <span>{notice.author?.name ?? 'Admin'}</span>
                <span>·</span>
                <span title={formatDate(notice.createdAt, true)}>{timeAgo(notice.createdAt)}</span>
              </div>
            </div>
          </div>

          {isAdmin && (
            <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
              <Button variant="ghost" size="sm" onClick={() => onTogglePin?.(notice)}>
                {notice.isPinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
                {notice.isPinned ? 'Unpin' : 'Pin'}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onEdit?.(notice)}>
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Button>
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => onDelete?.(notice)}>
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
