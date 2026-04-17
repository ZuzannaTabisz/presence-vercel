'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type {
  Senior,
  Volunteer,
  Visit,
  CheckIn,
  SeniorWithStatus,
  ContactStatus,
} from './types';
import {
  seniors as mockSeniors,
  volunteers as mockVolunteers,
  initialVisits,
} from '@/data/mock-data';

const STORAGE_KEY = 'presence-plus-visits';

interface DataContextValue {
  seniors: Senior[];
  volunteers: Volunteer[];
  visits: Visit[];
  seniorsWithStatus: SeniorWithStatus[];
  getVisit: (id: string) => Visit | undefined;
  getSenior: (id: string) => Senior | undefined;
  getVolunteer: (id: string) => Volunteer | undefined;
  updateVisitStatus: (visitId: string, status: Visit['status']) => void;
  completeCheckin: (visitId: string, checkin: CheckIn) => void;
  isLoading: boolean;
}

const DataContext = createContext<DataContextValue | null>(null);

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

function calculateContactStatus(daysSinceContact: number): ContactStatus {
  if (daysSinceContact <= 7) return 'good';
  if (daysSinceContact <= 14) return 'warning';
  return 'urgent';
}

function calculateDaysSinceContact(lastVisitDate: string | undefined): number {
  if (!lastVisitDate) return Infinity;
  const today = new Date();
  const lastVisit = new Date(lastVisitDate);
  const diffTime = today.getTime() - lastVisit.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load visits from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setVisits(JSON.parse(stored));
      } catch {
        setVisits(initialVisits);
      }
    } else {
      setVisits(initialVisits);
    }
    setIsLoading(false);
  }, []);

  // Save visits to localStorage on change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(visits));
    }
  }, [visits, isLoading]);

  const getVisit = useCallback(
    (id: string) => visits.find((v) => v.id === id),
    [visits]
  );

  const getSenior = useCallback(
    (id: string) => mockSeniors.find((s) => s.id === id),
    []
  );

  const getVolunteer = useCallback(
    (id: string) => mockVolunteers.find((v) => v.id === id),
    []
  );

  const updateVisitStatus = useCallback(
    (visitId: string, status: Visit['status']) => {
      setVisits((prev) =>
        prev.map((v) => (v.id === visitId ? { ...v, status } : v))
      );
    },
    []
  );

  const completeCheckin = useCallback((visitId: string, checkin: CheckIn) => {
    setVisits((prev) =>
      prev.map((v) =>
        v.id === visitId ? { ...v, status: 'completed' as const, checkin } : v
      )
    );
  }, []);

  // Calculate seniors with their contact status
  const seniorsWithStatus: SeniorWithStatus[] = mockSeniors.map((senior) => {
    // Find the most recent completed visit with a successful check-in
    const seniorVisits = visits
      .filter(
        (v) =>
          v.seniorId === senior.id &&
          v.status === 'completed' &&
          v.checkin?.visitOccurred
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const lastVisitDate = seniorVisits[0]?.date;
    const daysSinceContact = calculateDaysSinceContact(lastVisitDate);
    const contactStatus = calculateContactStatus(daysSinceContact);

    return {
      ...senior,
      lastVisitDate,
      contactStatus,
      daysSinceContact:
        daysSinceContact === Infinity ? 999 : daysSinceContact,
    };
  });

  return (
    <DataContext.Provider
      value={{
        seniors: mockSeniors,
        volunteers: mockVolunteers,
        visits,
        seniorsWithStatus,
        getVisit,
        getSenior,
        getVolunteer,
        updateVisitStatus,
        completeCheckin,
        isLoading,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
