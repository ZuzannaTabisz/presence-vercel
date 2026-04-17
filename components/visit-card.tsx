'use client';

import Link from 'next/link';
import type { Visit, Senior, Volunteer, Mood } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VisitStatusBadge } from './status-badge';
import { Calendar, User, UserCheck, CheckCircle2 } from 'lucide-react';

interface VisitCardProps {
  visit: Visit;
  senior: Senior | undefined;
  volunteer: Volunteer | undefined;
  onMarkCompleted?: () => void;
}

const moodLabels: Record<Mood, { emoji: string; label: string }> = {
  good: { emoji: '🙂', label: 'Good' },
  average: { emoji: '😐', label: 'Average' },
  poor: { emoji: '🙁', label: 'Poor' },
};

export function VisitCard({
  visit,
  senior,
  volunteer,
  onMarkCompleted,
}: VisitCardProps) {
  const visitDate = new Date(visit.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isToday = visitDate.toDateString() === today.toDateString();
  const isPast = visitDate < today;

  return (
    <Card
      className={
        isToday && visit.status === 'scheduled'
          ? 'border-primary/50 bg-primary/5'
          : ''
      }
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-semibold text-foreground">
                {senior?.name ?? 'Unknown Senior'}
              </h3>
              <VisitStatusBadge status={visit.status} />
            </div>

            <div className="mt-2 space-y-1">
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar className="h-3.5 w-3.5 shrink-0" />
                <span>
                  {visitDate.toLocaleDateString('pl-PL', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                  {isToday && (
                    <span className="ml-1 font-medium text-primary">
                      (Today)
                    </span>
                  )}
                </span>
              </p>
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <User className="h-3.5 w-3.5 shrink-0" />
                <span>{senior?.address}</span>
              </p>
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <UserCheck className="h-3.5 w-3.5 shrink-0" />
                <span>Volunteer: {volunteer?.name ?? 'Unassigned'}</span>
              </p>
            </div>

            {/* Check-in details if completed */}
            {visit.checkin && (
              <div className="mt-3 rounded-lg bg-muted/50 p-3">
                <p className="text-sm font-medium text-foreground">
                  Check-in completed
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  {visit.checkin.visitOccurred ? (
                    <>
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-status-good" />
                        Visit occurred
                      </span>
                      {visit.checkin.mood && (
                        <span>
                          Mood: {moodLabels[visit.checkin.mood].emoji}{' '}
                          {moodLabels[visit.checkin.mood].label}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-status-warning">
                      Visit did not occur
                    </span>
                  )}
                  {visit.checkin.needsHelp && (
                    <span className="text-status-warning">Needs help</span>
                  )}
                </div>
                {visit.checkin.helpDescription && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {visit.checkin.helpDescription}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Action buttons */}
          {visit.status === 'scheduled' && (
            <div className="flex flex-col gap-2">
              <Link href={`/checkin/${visit.id}`}>
                <Button size="sm" className="whitespace-nowrap">
                  Complete Visit
                </Button>
              </Link>
              <Button
                size="sm"
                variant="outline"
                onClick={onMarkCompleted}
                className="whitespace-nowrap"
              >
                No Contact
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
