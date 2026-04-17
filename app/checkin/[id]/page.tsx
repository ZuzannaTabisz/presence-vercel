'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useData } from '@/lib/data-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import type { Mood, CheckIn } from '@/lib/types';
import { ArrowLeft, Calendar, User, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';

const moodOptions: { value: Mood; emoji: string; label: string }[] = [
  { value: 'good', emoji: '🙂', label: 'Good' },
  { value: 'average', emoji: '😐', label: 'Average' },
  { value: 'poor', emoji: '🙁', label: 'Poor' },
];

export default function CheckinPage() {
  const params = useParams();
  const router = useRouter();
  const visitId = params.id as string;

  const { getVisit, getSenior, getVolunteer, completeCheckin, isLoading } =
    useData();

  const [visitOccurred, setVisitOccurred] = useState<boolean | null>(null);
  const [mood, setMood] = useState<Mood | null>(null);
  const [needsHelp, setNeedsHelp] = useState(false);
  const [helpDescription, setHelpDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const visit = getVisit(visitId);
  const senior = visit ? getSenior(visit.seniorId) : undefined;
  const volunteer = visit ? getVolunteer(visit.volunteerId) : undefined;

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!visit) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Visit not found</p>
            <Link href="/visits" className="mt-4 inline-block">
              <Button variant="outline">Back to Visits</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (visit.status === 'completed') {
    return (
      <div className="mx-auto max-w-2xl px-4 py-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              This visit has already been completed.
            </p>
            <Link href="/visits" className="mt-4 inline-block">
              <Button variant="outline">Back to Visits</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (visitOccurred === null) return;

    setIsSubmitting(true);

    const checkin: CheckIn = {
      visitOccurred,
      mood: visitOccurred ? mood ?? undefined : undefined,
      needsHelp,
      helpDescription: needsHelp ? helpDescription : undefined,
      completedAt: new Date().toISOString(),
    };

    // Simulate a brief delay for UX
    await new Promise((resolve) => setTimeout(resolve, 300));

    completeCheckin(visitId, checkin);
    router.push('/visits');
  };

  const isValid = visitOccurred !== null && (!visitOccurred || mood !== null);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/visits"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Visits
        </Link>
        <h1 className="text-2xl font-bold text-foreground">
          Post-Visit Check-in
        </h1>
        <p className="mt-1 text-muted-foreground">
          Complete this form after your visit
        </p>
      </div>

      {/* Visit Info Card */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Visit Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{senior?.name}</span>
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {senior?.address}
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4" />
              {senior?.phone}
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {new Date(visit.date).toLocaleDateString('pl-PL', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
            {senior?.notes && (
              <p className="mt-2 rounded-md bg-muted/50 p-2 text-muted-foreground">
                Notes: {senior.notes}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Check-in Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Check-in Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Visit Occurred */}
            <div className="space-y-3">
              <Label className="text-base">
                Did the visit actually take place?
              </Label>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant={visitOccurred === true ? 'default' : 'outline'}
                  onClick={() => setVisitOccurred(true)}
                  className="flex-1"
                >
                  Yes
                </Button>
                <Button
                  type="button"
                  variant={visitOccurred === false ? 'default' : 'outline'}
                  onClick={() => {
                    setVisitOccurred(false);
                    setMood(null);
                  }}
                  className="flex-1"
                >
                  No
                </Button>
              </div>
            </div>

            {/* Mood Selection - Only show if visit occurred */}
            {visitOccurred === true && (
              <div className="space-y-3">
                <Label className="text-base">
                  How was the senior&apos;s mood?
                </Label>
                <div className="flex gap-3">
                  {moodOptions.map((option) => (
                    <Button
                      key={option.value}
                      type="button"
                      variant={mood === option.value ? 'default' : 'outline'}
                      onClick={() => setMood(option.value)}
                      className="flex-1 flex-col gap-1 py-4"
                    >
                      <span className="text-2xl">{option.emoji}</span>
                      <span className="text-xs">{option.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Needs Help */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="needsHelp"
                  checked={needsHelp}
                  onCheckedChange={(checked) => setNeedsHelp(checked === true)}
                />
                <Label htmlFor="needsHelp" className="cursor-pointer">
                  Senior needs additional help or attention
                </Label>
              </div>

              {needsHelp && (
                <Textarea
                  placeholder="Please describe what help is needed..."
                  value={helpDescription}
                  onChange={(e) => setHelpDescription(e.target.value)}
                  className="min-h-24"
                />
              )}
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-4">
              <Link href="/visits" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Saving...
                  </>
                ) : (
                  'Complete Check-in'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
