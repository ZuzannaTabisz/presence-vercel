'use client';

import { useParams } from 'next/navigation';
import { useData } from '@/lib/data-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { ContactStatusBadge } from '@/components/status-badge';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Calendar,
  User,
  FileText,
  History,
} from 'lucide-react';
import Link from 'next/link';

export default function SeniorDetailPage() {
  const params = useParams();
  const seniorId = params.id as string;

  const { seniorsWithStatus, visits, volunteers, isLoading } = useData();

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  const senior = seniorsWithStatus.find((s) => s.id === seniorId);

  if (!senior) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Senior not found</p>
            <Link href="/dashboard" className="mt-4 inline-block">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get all visits for this senior, sorted by date (most recent first)
  const seniorVisits = visits
    .filter((v) => v.seniorId === seniorId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getVolunteerName = (volunteerId: string) => {
    const volunteer = volunteers.find((v) => v.id === volunteerId);
    return volunteer?.name ?? 'Unknown';
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'scheduled':
        return 'Scheduled';
      case 'no-contact':
        return 'No Contact';
      default:
        return status;
    }
  };

  const getMoodEmoji = (mood: string | undefined) => {
    switch (mood) {
      case 'good':
        return '🙂';
      case 'average':
        return '😐';
      case 'poor':
        return '🙁';
      default:
        return '';
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{senior.name}</h1>
            <p className="mt-1 text-muted-foreground">Senior Profile</p>
          </div>
          <ContactStatusBadge
            status={senior.contactStatus}
            daysSinceContact={senior.daysSinceContact}
          />
        </div>
      </div>

      {/* Contact Information Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="h-4 w-4" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Address</p>
              <p className="text-sm text-muted-foreground">{senior.address}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="mt-0.5 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Phone</p>
              <a
                href={`tel:${senior.phone}`}
                className="text-sm text-primary hover:underline"
              >
                {senior.phone}
              </a>
            </div>
          </div>
          {senior.lastVisitDate && (
            <div className="flex items-start gap-3">
              <Calendar className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Last Visit</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(senior.lastVisitDate).toLocaleDateString('pl-PL', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                  <span className="ml-2 text-xs">
                    ({senior.daysSinceContact} days ago)
                  </span>
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notes Card */}
      {senior.notes && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-4 w-4" />
              Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{senior.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Visit History Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <History className="h-4 w-4" />
            Visit History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {seniorVisits.length === 0 ? (
            <p className="text-sm text-muted-foreground">No visits recorded.</p>
          ) : (
            <div className="space-y-4">
              {seniorVisits.map((visit) => (
                <div
                  key={visit.id}
                  className="flex flex-col gap-2 rounded-lg border p-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">
                        {new Date(visit.date).toLocaleDateString('pl-PL', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Volunteer: {getVolunteerName(visit.volunteerId)}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        visit.status === 'completed'
                          ? 'bg-status-good/10 text-status-good'
                          : visit.status === 'scheduled'
                            ? 'bg-primary/10 text-primary'
                            : 'bg-status-warning/10 text-status-warning'
                      }`}
                    >
                      {getStatusLabel(visit.status)}
                    </span>
                  </div>

                  {visit.checkin && (
                    <div className="mt-2 rounded-md bg-muted/50 p-3">
                      <div className="flex items-center gap-4 text-sm">
                        {visit.checkin.visitOccurred ? (
                          <>
                            <span className="flex items-center gap-1">
                              Mood: {getMoodEmoji(visit.checkin.mood)}{' '}
                              {visit.checkin.mood}
                            </span>
                            {visit.checkin.needsHelp && (
                              <span className="text-status-warning">
                                Needs help
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-status-warning">
                            Visit did not occur
                          </span>
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
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
