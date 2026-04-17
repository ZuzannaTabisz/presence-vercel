import type { Senior, Volunteer, Visit } from '@/lib/types';

export const seniors: Senior[] = [
  {
    id: 's1',
    name: 'Maria Kowalska',
    address: 'ul. Kwiatowa 15/3, Warszawa',
    phone: '+48 600 111 222',
    notes: 'Loves talking about gardening. Has a cat named Mruczek.',
  },
  {
    id: 's2',
    name: 'Jan Nowak',
    address: 'ul. Parkowa 8, Warszawa',
    phone: '+48 600 333 444',
    notes: 'Former teacher. Enjoys chess and classical music.',
  },
  {
    id: 's3',
    name: 'Helena Wiśniewska',
    address: 'ul. Słoneczna 22/10, Warszawa',
    phone: '+48 600 555 666',
    notes: 'Mobility issues. Needs help with groceries.',
  },
  {
    id: 's4',
    name: 'Stanisław Kamiński',
    address: 'ul. Lipowa 5, Warszawa',
    phone: '+48 600 777 888',
    notes: 'Lives alone since wife passed. Appreciates company.',
  },
  {
    id: 's5',
    name: 'Zofia Lewandowska',
    address: 'ul. Brzozowa 12/4, Warszawa',
    phone: '+48 600 999 000',
    notes: 'Hard of hearing. Speak clearly and slowly.',
  },
  {
    id: 's6',
    name: 'Tadeusz Mazur',
    address: 'ul. Ogrodowa 30, Warszawa',
    phone: '+48 601 111 222',
    notes: 'Diabetic. Check if he has taken his medication.',
  },
];

export const volunteers: Volunteer[] = [
  {
    id: 'v1',
    name: 'Anna Młoda',
    email: 'anna.mloda@email.com',
    phone: '+48 700 111 222',
  },
  {
    id: 'v2',
    name: 'Piotr Pomocny',
    email: 'piotr.pomocny@email.com',
    phone: '+48 700 333 444',
  },
  {
    id: 'v3',
    name: 'Katarzyna Dobra',
    email: 'kasia.dobra@email.com',
    phone: '+48 700 555 666',
  },
];

// Generate dates relative to today
const today = new Date();
const daysAgo = (days: number): string => {
  const date = new Date(today);
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
};

const daysFromNow = (days: number): string => {
  const date = new Date(today);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

export const initialVisits: Visit[] = [
  // Recent completed visits
  {
    id: 'vis1',
    seniorId: 's1',
    volunteerId: 'v1',
    date: daysAgo(2),
    status: 'completed',
    checkin: {
      visitOccurred: true,
      mood: 'good',
      needsHelp: false,
      completedAt: daysAgo(2),
    },
  },
  {
    id: 'vis2',
    seniorId: 's2',
    volunteerId: 'v2',
    date: daysAgo(5),
    status: 'completed',
    checkin: {
      visitOccurred: true,
      mood: 'average',
      needsHelp: true,
      helpDescription: 'Needs help with grocery shopping next week.',
      completedAt: daysAgo(5),
    },
  },
  // Warning status - 10 days ago
  {
    id: 'vis3',
    seniorId: 's3',
    volunteerId: 'v3',
    date: daysAgo(10),
    status: 'completed',
    checkin: {
      visitOccurred: true,
      mood: 'poor',
      needsHelp: true,
      helpDescription: 'Feeling lonely. Would like more frequent visits.',
      completedAt: daysAgo(10),
    },
  },
  // Urgent status - 16 days ago
  {
    id: 'vis4',
    seniorId: 's4',
    volunteerId: 'v1',
    date: daysAgo(16),
    status: 'completed',
    checkin: {
      visitOccurred: true,
      mood: 'average',
      needsHelp: false,
      completedAt: daysAgo(16),
    },
  },
  // No contact visit
  {
    id: 'vis5',
    seniorId: 's5',
    volunteerId: 'v2',
    date: daysAgo(8),
    status: 'no-contact',
  },
  // Urgent - 20 days ago
  {
    id: 'vis6',
    seniorId: 's6',
    volunteerId: 'v3',
    date: daysAgo(20),
    status: 'completed',
    checkin: {
      visitOccurred: true,
      mood: 'good',
      needsHelp: false,
      completedAt: daysAgo(20),
    },
  },
  // Scheduled visits
  {
    id: 'vis7',
    seniorId: 's1',
    volunteerId: 'v1',
    date: daysFromNow(2),
    status: 'scheduled',
  },
  {
    id: 'vis8',
    seniorId: 's3',
    volunteerId: 'v2',
    date: daysFromNow(1),
    status: 'scheduled',
  },
  {
    id: 'vis9',
    seniorId: 's4',
    volunteerId: 'v3',
    date: daysFromNow(0), // Today
    status: 'scheduled',
  },
  {
    id: 'vis10',
    seniorId: 's5',
    volunteerId: 'v1',
    date: daysFromNow(3),
    status: 'scheduled',
  },
  {
    id: 'vis11',
    seniorId: 's6',
    volunteerId: 'v2',
    date: daysFromNow(0), // Today
    status: 'scheduled',
  },
];
