'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Complaint, ComplaintPriority, ComplaintStatus, PRIORITY_LABELS, STATUS_LABELS } from '@/lib/types';
import { useAdminUpdateComplaint } from '@/hooks/use-complaints';
import { useAdmins } from '@/hooks/use-users';
import { Settings2 } from 'lucide-react';

const UNASSIGNED = '__unassigned__';

export function AdminActionsPanel({ complaint }: { complaint: Complaint }) {
  const [status, setStatus] = React.useState<ComplaintStatus>(complaint.status);
  const [priority, setPriority] = React.useState<ComplaintPriority>(complaint.priority);
  const [assignedToId, setAssignedToId] = React.useState<string>(complaint.assignedToId ?? UNASSIGNED);
  const [internalNotes, setInternalNotes] = React.useState(complaint.internalNotes ?? '');
  const [notes, setNotes] = React.useState('');

  const { data: admins } = useAdmins();
  const updateComplaint = useAdminUpdateComplaint(complaint.id);

  const isDirty =
    status !== complaint.status ||
    priority !== complaint.priority ||
    (assignedToId === UNASSIGNED ? null : assignedToId) !== (complaint.assignedToId ?? null) ||
    internalNotes !== (complaint.internalNotes ?? '');

  const handleSave = () => {
    updateComplaint.mutate({
      status,
      priority,
      assignedToId: assignedToId === UNASSIGNED ? null : assignedToId,
      internalNotes,
      notes: notes || undefined,
    });
    setNotes('');
  };

  return (
    <Card className="border-primary/20 bg-primary/[0.02]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Settings2 className="h-4 w-4" />
          Admin Actions
        </CardTitle>
        <CardDescription>Update status, priority, assignment, and internal notes.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as ComplaintStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Priority</Label>
            <Select value={priority} onValueChange={(v) => setPriority(v as ComplaintPriority)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Assign To</Label>
          <Select value={assignedToId} onValueChange={setAssignedToId}>
            <SelectTrigger>
              <SelectValue placeholder="Unassigned" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={UNASSIGNED}>Unassigned</SelectItem>
              {admins?.map((admin) => (
                <SelectItem key={admin.id} value={admin.id}>
                  {admin.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Internal Notes</Label>
          <Textarea
            value={internalNotes}
            onChange={(e) => setInternalNotes(e.target.value)}
            rows={3}
            placeholder="Notes visible to admins only..."
          />
        </div>

        <div className="space-y-1.5">
          <Label>Change Note (optional, added to timeline)</Label>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="e.g. Plumber scheduled for tomorrow 10 AM" />
        </div>

        <Button onClick={handleSave} variant="gradient" className="w-full" disabled={!isDirty} loading={updateComplaint.isPending}>
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
}
