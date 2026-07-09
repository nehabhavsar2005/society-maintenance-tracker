'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Compass, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/shared/logo';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-grid-pattern bg-background px-6 text-center">
      <div className="mb-8">
        <Logo />
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10"
      >
        <Compass className="h-12 w-12 text-primary" />
      </motion.div>
      <h1 className="mt-8 text-6xl font-bold tracking-tight text-foreground">404</h1>
      <p className="mt-3 text-lg font-semibold text-foreground">Page not found</p>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <Link href="/">
        <Button variant="gradient" className="mt-8">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Button>
      </Link>
    </div>
  );
}
