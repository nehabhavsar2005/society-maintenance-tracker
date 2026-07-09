'use client';

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CATEGORY_LABELS, ComplaintCategory } from '@/lib/types';
import { EmptyState } from '@/components/shared/empty-state';
import { PieChart as PieChartIcon } from 'lucide-react';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6', '#f97316', '#64748b'];

export function CategoryChart({ data }: { data: { category: ComplaintCategory; count: number }[] }) {
  const chartData = data.filter((d) => d.count > 0).map((d) => ({ name: CATEGORY_LABELS[d.category], value: d.count }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Complaints by Category</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <EmptyState icon={PieChartIcon} title="No data yet" description="Category breakdown will appear once complaints are logged." className="py-10" />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                {chartData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))', background: 'hsl(var(--popover))', fontSize: 13 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
