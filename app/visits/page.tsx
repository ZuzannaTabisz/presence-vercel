'use client';

import { useState } from 'react';
import { useData } from '@/lib/data-context';
import { VisitCard } from '@/components/visit-card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import type { VisitStatus } from '@/lib/types';

type FilterStatus = 'all' | VisitStatus;

export default function VisitsPage() {
  const { visits, getSenior, getVolunteer, updateVisitStatus, isLoading } =
    useData();
  const [filter, setFilter] = useState<FilterStatus>('all');

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  // Sort visits: today first, then future dates, then past dates
  const sortedVisits = [...visits].sort((a, b) => {
    const today = new Date().toISOString().split('T')[0];
    const dateA = a.date;
    const dateB = b.date;

    // Today's visits first
    if (dateA === today && dateB !== today) return -1;
    if (dateB === today && dateA !== today) return 1;

    // Then scheduled visits by date
    if (a.status === 'scheduled' && b.status !== 'scheduled') return -1;
    if (b.status === 'scheduled' && a.status !== 'scheduled') return 1;

    // Then by date (most recent first)
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  const filteredVisits =
    filter === 'all'
      ? sortedVisits
      : sortedVisits.filter((v) => v.status === filter);

  const filterOptions: { value: FilterStatus; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'completed', label: 'Completed' },
    { value: 'no-contact', label: 'No Contact' },
  ];

  const handleNoContact = (visitId: string) => {
    updateVisitStatus(visitId, 'no-contact');
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Visits</h1>
        <p className="mt-1 text-muted-foreground">
          Manage and track all volunteer visits
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {filterOptions.map((option) => (
          <Button
            key={option.value}
            variant={filter === option.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(option.value)}
          >
            {option.label}
            {option.value !== 'all' && (
              <span className="ml-1.5 opacity-70">
                ({visits.filter((v) => v.status === option.value).length})
              </span>
            )}
          </Button>
        ))}
      </div>

      {/* Visits List */}
      {filteredVisits.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-muted/30 py-12 text-center">
          <p className="text-muted-foreground">No visits found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredVisits.map((visit) => (
            <VisitCard
              key={visit.id}
              visit={visit}
              senior={getSenior(visit.seniorId)}
              volunteer={getVolunteer(visit.volunteerId)}
              onMarkCompleted={() => handleNoContact(visit.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
