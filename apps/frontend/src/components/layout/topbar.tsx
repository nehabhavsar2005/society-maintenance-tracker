'use client';

import { Menu, LogOut, Settings, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { NotificationDropdown } from './notification-dropdown';
import { useAuth } from '@/providers/auth-provider';
import { initials } from '@/lib/utils';
import Link from 'next/link';

export function Topbar({ onMenuClick, breadcrumb }: { onMenuClick: () => void; breadcrumb?: string }) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-lg sm:px-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>
        {breadcrumb && <h2 className="hidden text-sm font-medium text-muted-foreground sm:block">{breadcrumb}</h2>}
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <NotificationDropdown />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="ml-1 flex items-center gap-2 rounded-full transition-opacity hover:opacity-80">
              <Avatar className="h-9 w-9 border border-border">
                <AvatarImage src={user?.avatarUrl ?? undefined} alt={user?.name} />
                <AvatarFallback>{user ? initials(user.name) : '?'}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <p className="text-sm font-semibold">{user?.name}</p>
              <p className="truncate text-xs font-normal text-muted-foreground">{user?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <UserIcon />
                Profile
              </Link>
            </DropdownMenuItem>
            {user?.role === 'ADMIN' && (
              <DropdownMenuItem asChild>
                <Link href="/admin/settings">
                  <Settings />
                  Settings
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => logout()}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
