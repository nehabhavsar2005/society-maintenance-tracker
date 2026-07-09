'use client';

import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/providers/auth-provider';
import { initials, formatDate } from '@/lib/utils';
import { Mail, Phone, MapPin, Calendar, LogOut, ShieldCheck } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="My Profile" description="View your account information." />

      <Card>
        <CardHeader className="flex-row items-center gap-4 space-y-0">
          <Avatar className="h-16 w-16 text-lg">
            <AvatarFallback className="text-xl">{initials(user.name)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl">{user.name}</CardTitle>
            <Badge variant={user.role === 'ADMIN' ? 'info' : 'secondary'} className="mt-1">
              <ShieldCheck className="h-3 w-3" />
              {user.role}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Separator className="mb-4" />
          <dl className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Email</span>
              <span className="ml-auto font-medium">{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Phone</span>
                <span className="ml-auto font-medium">{user.phone}</span>
              </div>
            )}
            {user.flatNumber && (
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Flat</span>
                <span className="ml-auto font-medium">
                  {user.flatNumber} {user.block && `(Block ${user.block})`}
                </span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Member since</span>
              <span className="ml-auto font-medium">{formatDate(user.createdAt)}</span>
            </div>
          </dl>

          <Separator className="my-4" />

          <Button variant="destructive" onClick={() => logout()}>
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
