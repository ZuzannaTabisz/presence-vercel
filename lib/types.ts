export type VisitStatus = 'scheduled' | 'completed' | 'no-contact';
export type Mood = 'good' | 'average' | 'poor';
export type ContactStatus = 'good' | 'warning' | 'urgent';

export interface Senior {
  id: string;
  name: string;
  address: string;
  phone: string;
  notes?: string;
}

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Visit {
  id: string;
  seniorId: string;
  volunteerId: string;
  date: string; // ISO date string
  status: VisitStatus;
  checkin?: CheckIn;
}

export interface CheckIn {
  visitOccurred: boolean;
  mood?: Mood;
  needsHelp: boolean;
  helpDescription?: string;
  completedAt: string; // ISO date string
}

export interface SeniorWithStatus extends Senior {
  lastVisitDate?: string;
  contactStatus: ContactStatus;
  daysSinceContact: number;
}
