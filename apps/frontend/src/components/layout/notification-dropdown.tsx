'use client';

import Link from 'next/link';
import { Bell, CheckCheck, MessageSquareWarning, Megaphone, KeyRound, Sparkles } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useMarkAllNotificationsRead, useMarkNotificationRead, useNotifications, useUnreadCount } from '@/hooks/use-notifications';
import { timeAgo, cn } from '@/lib/utils';
import { Notification, NotificationType } from '@/lib/types';

const ICON_MAP: Record<NotificationType, typeof Bell> = {
  COMPLAINT_CREATED: MessageSquareWarning,
  COMPLAINT_STATUS_CHANGED: MessageSquareWarning,
  COMPLAINT_RESOLVED: CheckCheck,
  COMPLAINT_OVERDUE: MessageSquareWarning,
  NOTICE_POSTED: Megaphone,
  PASSWORD_RESET: KeyRound,
  SYSTEM: Sparkles,
};

function NotificationItem({ notification, onRead }: { notification: Notification; onRead: (id: string) => void }) {
  const Icon = ICON_MAP[notification.type] ?? Bell;
  const inner = (
    <div
      className={cn(
        'flex gap-3 rounded-lg p-3 text-left transition-colors hover:bg-accent',
        !notification.isRead && 'bg-primary/5'
      )}
    >
      <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium leading-snug text-foreground">{notification.title}</p>
        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{notification.message}</p>
        <p className="mt-1 text-[11px] text-muted-foreground">{timeAgo(notification.createdAt)}</p>
      </div>
      {!notification.isRead && <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />}
    </div>
  );

  if (notification.complaintId) {
    return (
      <button className="w-full" onClick={() => onRead(notification.id)}>
        <Link href={`/complaints/${notification.complaintId}`}>{inner}</Link>
      </button>
    );
  }

  return (
    <button className="w-full" onClick={() => onRead(notification.id)}>
      {inner}
    </button>
  );
}

export function NotificationDropdown() {
  const { data: unreadCount } = useUnreadCount();
  const { data, isLoading } = useNotifications({ limit: 8 });
  const markAsRead = useMarkNotificationRead();
  const markAllAsRead = useMarkAllNotificationsRead();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-[18px] w-[18px]" />
          {Boolean(unreadCount) && (
            <Badge variant="destructive" className="absolute -right-1 -top-1 h-5 min-w-5 justify-center rounded-full p-0 text-[10px]">
              {unreadCount! > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-3 py-2.5">
          <p className="text-sm font-semibold">Notifications</p>
          {Boolean(unreadCount) && (
            <button
              onClick={() => markAllAsRead.mutate()}
              className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              <CheckCheck className="h-3 w-3" />
              Mark all read
            </button>
          )}
        </div>
        <Separator />
        <div className="max-h-96 overflow-y-auto scrollbar-thin p-1.5">
          {isLoading && <div className="py-8 text-center text-sm text-muted-foreground">Loading…</div>}
          {!isLoading && data?.items.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <Bell className="h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">You&apos;re all caught up!</p>
            </div>
          )}
          {data?.items.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} onRead={(id) => markAsRead.mutate(id)} />
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
