'use client';

import { useData } from '@/lib/data-context';
import { SeniorCard } from '@/components/senior-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Users, AlertTriangle, Clock, CheckCircle } from 'lucide-react';

export default function DashboardPage() {
  const { seniorsWithStatus, visits, isLoading } = useData();

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  // Sort seniors by urgency (urgent first, then warning, then good)
  const sortedSeniors = [...seniorsWithStatus].sort((a, b) => {
    const order = { urgent: 0, warning: 1, good: 2 };
    return order[a.contactStatus] - order[b.contactStatus];
  });

  const urgentCount = seniorsWithStatus.filter(
    (s) => s.contactStatus === 'urgent'
  ).length;
  const warningCount = seniorsWithStatus.filter(
    (s) => s.contactStatus === 'warning'
  ).length;
  const goodCount = seniorsWithStatus.filter(
    (s) => s.contactStatus === 'good'
  ).length;

  const todayVisits = visits.filter((v) => {
    const today = new Date().toISOString().split('T')[0];
    return v.date === today && v.status === 'scheduled';
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          Coordinator Dashboard
        </h1>
        <p className="mt-1 text-muted-foreground">
          Overview of all seniors and their contact status
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Seniors</p>
              <p className="text-2xl font-bold">{seniorsWithStatus.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-status-urgent/10">
              <AlertTriangle className="h-6 w-6 text-status-urgent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Urgent</p>
              <p className="text-2xl font-bold">{urgentCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-status-warning/10">
              <Clock className="h-6 w-6 text-status-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Needs Contact</p>
              <p className="text-2xl font-bold">{warningCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-status-good/10">
              <CheckCircle className="h-6 w-6 text-status-good" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Recent Contact</p>
              <p className="text-2xl font-bold">{goodCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Visits Alert */}
      {todayVisits.length > 0 && (
        <Card className="mb-6 border-primary/30 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-primary">
              Today&apos;s Scheduled Visits ({todayVisits.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <p className="text-sm text-muted-foreground">
              You have {todayVisits.length} visit
              {todayVisits.length > 1 ? 's' : ''} scheduled for today. Go to the{' '}
              <a href="/visits" className="font-medium text-primary underline">
                Visits page
              </a>{' '}
              to manage them.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Priority List */}
      {(urgentCount > 0 || warningCount > 0) && (
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Priority: Requires Attention
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {sortedSeniors
              .filter((s) => s.contactStatus !== 'good')
              .map((senior) => (
                <SeniorCard key={senior.id} senior={senior} />
              ))}
          </div>
        </section>
      )}

      {/* All Seniors */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          All Seniors
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {sortedSeniors.map((senior) => (
            <SeniorCard key={senior.id} senior={senior} />
          ))}
        </div>
      </section>
    </div>
  );
}
