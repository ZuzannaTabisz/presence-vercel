import { cn } from '@/lib/utils';
import type { ContactStatus, VisitStatus } from '@/lib/types';

interface ContactStatusBadgeProps {
  status: ContactStatus;
  daysSinceContact: number;
}

export function ContactStatusBadge({
  status,
  daysSinceContact,
}: ContactStatusBadgeProps) {
  const labels: Record<ContactStatus, string> = {
    good: 'Recent contact',
    warning: 'Needs contact',
    urgent: 'Urgent',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        status === 'good' && 'bg-status-good/15 text-status-good',
        status === 'warning' && 'bg-status-warning/15 text-status-warning',
        status === 'urgent' && 'bg-status-urgent/15 text-status-urgent'
      )}
    >
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          status === 'good' && 'bg-status-good',
          status === 'warning' && 'bg-status-warning',
          status === 'urgent' && 'bg-status-urgent'
        )}
      />
      {labels[status]}
      {daysSinceContact < 999 && (
        <span className="opacity-75">({daysSinceContact}d)</span>
      )}
    </span>
  );
}

interface VisitStatusBadgeProps {
  status: VisitStatus;
}

export function VisitStatusBadge({ status }: VisitStatusBadgeProps) {
  const config: Record<VisitStatus, { label: string; className: string }> = {
    scheduled: {
      label: 'Scheduled',
      className: 'bg-primary/15 text-primary',
    },
    completed: {
      label: 'Completed',
      className: 'bg-status-good/15 text-status-good',
    },
    'no-contact': {
      label: 'No contact',
      className: 'bg-status-warning/15 text-status-warning',
    },
  };

  const { label, className } = config[status];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        className
      )}
    >
      {label}
    </span>
  );
}
