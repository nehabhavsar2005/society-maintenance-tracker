import { Building2, ShieldCheck, BellRing, BarChart3 } from 'lucide-react';
import { Logo } from '@/components/shared/logo';

const FEATURES = [
  { icon: ShieldCheck, title: 'Secure by design', desc: 'JWT auth, hashed passwords, role-based access control.' },
  { icon: BellRing, title: 'Real-time updates', desc: 'Instant notifications for every complaint status change.' },
  { icon: BarChart3, title: 'Powerful insights', desc: 'Beautiful analytics dashboard with live charts.' },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          {children}
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-gradient-to-br from-indigo-700 via-violet-700 to-purple-800 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-purple-400/20 blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
              <Building2 className="h-5 w-5" />
            </span>
            <span className="text-lg font-bold">Society<span className="text-indigo-200">Tracker</span></span>
          </div>

          <h1 className="mt-16 text-4xl font-bold leading-tight text-white">
            Maintenance management,{' '}
            <span className="bg-gradient-to-r from-indigo-200 to-white bg-clip-text text-transparent">reimagined.</span>
          </h1>
          <p className="mt-4 max-w-md text-indigo-100/90">
            Track complaints, manage notices, and keep your entire society community informed — all from one beautiful dashboard.
          </p>
        </div>

        <div className="relative z-10 space-y-4">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="flex items-start gap-3 rounded-xl bg-white/10 p-4 backdrop-blur-sm">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/15">
                <feature.icon className="h-4.5 w-4.5 text-white" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{feature.title}</p>
                <p className="text-xs text-indigo-100/80">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
