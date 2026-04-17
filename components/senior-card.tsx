import type { SeniorWithStatus } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { ContactStatusBadge } from './status-badge';
import { MapPin, Phone } from 'lucide-react';

interface SeniorCardProps {
  senior: SeniorWithStatus;
}

export function SeniorCard({ senior }: SeniorCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-foreground">
              {senior.name}
            </h3>
            <div className="mt-2 space-y-1">
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{senior.address}</span>
              </p>
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Phone className="h-3.5 w-3.5 shrink-0" />
                <span>{senior.phone}</span>
              </p>
            </div>
            {senior.notes && (
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {senior.notes}
              </p>
            )}
          </div>
          <ContactStatusBadge
            status={senior.contactStatus}
            daysSinceContact={senior.daysSinceContact}
          />
        </div>
        {senior.lastVisitDate && (
          <p className="mt-3 text-xs text-muted-foreground">
            Last visit:{' '}
            {new Date(senior.lastVisitDate).toLocaleDateString('pl-PL', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
