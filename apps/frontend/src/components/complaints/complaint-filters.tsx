'use client';

import * as React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CATEGORY_LABELS, PRIORITY_LABELS, STATUS_LABELS } from '@/lib/types';
import { ComplaintFilters } from '@/lib/services/complaint.service';

interface Props {
  filters: ComplaintFilters;
  onChange: (filters: ComplaintFilters) => void;
}

const ALL = '__all__';

export function ComplaintFiltersBar({ filters, onChange }: Props) {
  const [search, setSearch] = React.useState(filters.search ?? '');

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (search !== (filters.search ?? '')) onChange({ ...filters, search: search || undefined, page: 1 });
    }, 400);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const activeFilterCount = [filters.category, filters.priority, filters.status].filter(Boolean).length;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by title, ticket number, or description..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select value={filters.category ?? ALL} onValueChange={(v) => onChange({ ...filters, category: v === ALL ? undefined : (v as never), page: 1 })}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All Categories</SelectItem>
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.priority ?? ALL} onValueChange={(v) => onChange({ ...filters, priority: v === ALL ? undefined : (v as never), page: 1 })}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All Priorities</SelectItem>
            {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.status ?? ALL} onValueChange={(v) => onChange({ ...filters, status: v === ALL ? undefined : (v as never), page: 1 })}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All Statuses</SelectItem>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.sortBy ?? 'newest'} onValueChange={(v) => onChange({ ...filters, sortBy: v as never, page: 1 })}>
          <SelectTrigger className="w-[130px]">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="status">Status</SelectItem>
          </SelectContent>
        </Select>

        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearch('');
              onChange({ page: 1, limit: filters.limit, sortBy: filters.sortBy });
            }}
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
