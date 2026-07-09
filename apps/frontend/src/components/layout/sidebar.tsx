'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  MessageSquareWarning,
  Megaphone,
  Users,
  Settings,
  ScrollText,
  X,
  type LucideIcon,
} from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { Logo } from '@/components/shared/logo';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const RESIDENT_NAV: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'My Complaints', href: '/complaints', icon: MessageSquareWarning },
  { label: 'Notice Board', href: '/notices', icon: Megaphone },
];

const ADMIN_NAV: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Complaints', href: '/complaints', icon: MessageSquareWarning },
  { label: 'Notice Board', href: '/notices', icon: Megaphone },
  { label: 'Residents', href: '/admin/residents', icon: Users },
  { label: 'Audit Logs', href: '/admin/audit-logs', icon: ScrollText },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export function Sidebar({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const items = user?.role === 'ADMIN' ? ADMIN_NAV : RESIDENT_NAV;

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-border px-5">
        <Link href={user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'}>
          <Logo />
        </Link>
        <Button variant="ghost" size="icon-sm" className="lg:hidden" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-thin px-3 py-4">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active ? 'text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-lg bg-primary/10"
                  transition={{ type: 'spring', duration: 0.4, bounce: 0.2 }}
                />
              )}
              <item.icon className="relative z-10 h-4.5 w-4.5" />
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <div className="rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-4">
          <p className="text-xs font-semibold text-foreground">Need help?</p>
          <p className="mt-1 text-xs text-muted-foreground">Reach out to your society office for assistance.</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden w-64 flex-shrink-0 border-r border-border bg-card lg:block">{content}</aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }}
            className="absolute left-0 top-0 h-full w-72 bg-card shadow-2xl"
          >
            {content}
          </motion.aside>
        </div>
      )}
    </>
  );
}
