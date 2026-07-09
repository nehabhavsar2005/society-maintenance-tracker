'use client';

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ComplaintPriority, PRIORITY_LABELS } from '@/lib/types';

const PRIORITY_COLORS: Record<ComplaintPriority, string> = { HIGH: '#ef4444', MEDIUM: '#f59e0b', LOW: '#94a3b8' };

export function PriorityChart({ data }: { data: { priority: ComplaintPriority; count: number }[] }) {
  const order: ComplaintPriority[] = ['HIGH', 'MEDIUM', 'LOW'];
  const chartData = order.map((priority) => ({
    name: PRIORITY_LABELS[priority],
    value: data.find((d) => d.priority === priority)?.count ?? 0,
    priority,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Complaints by Priority</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} barSize={48}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
            <YAxis tickLine={false} axisLine={false} fontSize={12} allowDecimals={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))', background: 'hsl(var(--popover))', fontSize: 13 }} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {chartData.map((entry) => (
                <Cell key={entry.priority} fill={PRIORITY_COLORS[entry.priority]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
