'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { CategoryIcon } from '@/components/shared/category-icon';
import { StatusBadge, PriorityBadge } from '@/components/shared/status-badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Complaint } from '@/lib/types';
import { formatDate, initials, timeAgo } from '@/lib/utils';
import { ImageIcon, MessageSquareText } from 'lucide-react';

interface ComplaintCardProps {
  complaint: Complaint;
  showResident?: boolean;
  index?: number;
  selectable?: boolean;
  selected?: boolean;
  onSelectChange?: (checked: boolean) => void;
}

export function ComplaintCard({ complaint, showResident = false, index = 0, selectable = false, selected = false, onSelectChange }: ComplaintCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.3) }}>
      <Card
        className={`group relative transition-all hover:-translate-y-0.5 hover:shadow-lg ${
          complaint.isOverdue ? 'border-destructive/40 bg-destructive/[0.03]' : ''
        }`}
      >
        {selectable && (
          <div className="absolute left-4 top-4 z-10" onClick={(e) => e.stopPropagation()}>
            <Checkbox checked={selected} onCheckedChange={(checked) => onSelectChange?.(Boolean(checked))} />
          </div>
        )}
        <Link href={`/complaints/${complaint.id}`}>
          <CardContent className={`flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4 ${selectable ? 'pl-11' : ''}`}>
            <CategoryIcon category={complaint.category} className="h-11 w-11 flex-shrink-0" />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate font-semibold text-foreground group-hover:text-primary">{complaint.title}</p>
                <span className="font-mono text-[11px] text-muted-foreground">#{complaint.ticketNumber}</span>
              </div>
              <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{complaint.description}</p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span>{formatDate(complaint.createdAt)}</span>
                <span>·</span>
                <span>{timeAgo(complaint.createdAt)}</span>
                {complaint.images.length > 0 && (
                  <span className="flex items-center gap-1">
                    <ImageIcon className="h-3 w-3" /> {complaint.images.length}
                  </span>
                )}
                {complaint._count && (complaint._count.history ?? 0) > 0 && (
                  <span className="flex items-center gap-1">
                    <MessageSquareText className="h-3 w-3" /> {complaint._count.history}
                  </span>
                )}
                {showResident && complaint.resident && (
                  <span className="flex items-center gap-1.5">
                    <Avatar className="h-4.5 w-4.5">
                      <AvatarFallback className="text-[9px]">{initials(complaint.resident.name)}</AvatarFallback>
                    </Avatar>
                    {complaint.resident.name}
                    {complaint.resident.flatNumber && ` · ${complaint.resident.flatNumber}`}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-shrink-0 items-center gap-2 sm:flex-col sm:items-end">
              <StatusBadge status={complaint.status} />
              <PriorityBadge priority={complaint.priority} />
            </div>
          </CardContent>
        </Link>
      </Card>
    </motion.div>
  );
}
