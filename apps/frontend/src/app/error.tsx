'use client';

import * as React from 'react';
import { AlertTriangle, RotateCw, Home } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/shared/logo';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  React.useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <div className="mb-8">
        <Logo />
      </div>
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-destructive/10">
        <AlertTriangle className="h-10 w-10 text-destructive" />
      </div>
      <h1 className="mt-8 text-2xl font-bold text-foreground">Something went wrong</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        An unexpected error occurred. Try refreshing the page, or head back to the dashboard.
      </p>
      <div className="mt-8 flex gap-3">
        <Button variant="outline" onClick={reset}>
          <RotateCw className="h-4 w-4" />
          Try again
        </Button>
        <Link href="/">
          <Button variant="gradient">
            <Home className="h-4 w-4" />
            Go home
          </Button>
        </Link>
      </div>
    </div>
  );
}
