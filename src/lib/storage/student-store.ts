import {
  createDemoOpportunities,
  DEMO_PROFILE,
  DEMO_SAVED_RESOURCE_IDS,
} from "@/data/demo-opportunities";
import { createEmptyStudentData, EMPTY_PROFILE } from "@/lib/gap/factory";
import { newId } from "@/lib/id";
import type {
  DateOnlyString,
  OpportunityStatus,
  StudentData,
  StudentProfile,
  StudentSettings,
  SupportClaim,
  TrackedOpportunity,
} from "@/types";

import { sanitizeStudentData } from "./sanitize";

/**
 * Client-side student data store.
 *
 * Until Supabase tables exist, a student's portal data lives in this browser's
 * localStorage. This module is the ONLY place that touches storage: when the
 * Supabase schema lands, replace the read/write functions here (and keep the
 * `studentActions` signatures) and no page or component needs to change.
 *
 * It is shaped for React's useSyncExternalStore: `getSnapshot` returns a
 * stable object until data changes, and `getServerSnapshot` returns null so
 * server rendering and first hydration never depend on browser storage.
 */

const STORAGE_KEY = "bridgefund:student-portal:v1";

let cache: StudentData | null = null;
let persistFailed = false;
const listeners = new Set<() => void>();
let storageListenerAttached = false;

function notify() {
  for (const listener of listeners) listener();
}

function readFromStorage(): StudentData {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? sanitizeStudentData(JSON.parse(raw)) : createEmptyStudentData();
  } catch {
    // Unavailable (private mode, blocked) or corrupt JSON: start empty.
    return createEmptyStudentData();
  }
}

function writeToStorage(data: StudentData) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    if (persistFailed) {
      persistFailed = false;
    }
  } catch {
    persistFailed = true;
  }
}

function commit(next: StudentData) {
  cache = next;
  writeToStorage(next);
  notify();
}

function update(fn: (data: StudentData) => StudentData) {
  commit(fn(getSnapshot() ?? createEmptyStudentData()));
}

/* ----------------------- useSyncExternalStore wiring ---------------------- */

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  if (!storageListenerAttached) {
    storageListenerAttached = true;
    // Keep multiple tabs in sync.
    window.addEventListener("storage", (event) => {
      if (event.key === STORAGE_KEY || event.key === null) {
        cache = null;
        notify();
      }
    });
  }
  return () => listeners.delete(listener);
}

export function getSnapshot(): StudentData | null {
  if (typeof window === "undefined") return null;
  cache ??= readFromStorage();
  return cache;
}

export function getServerSnapshot(): null {
  return null;
}

export function getPersistFailedSnapshot(): boolean {
  return persistFailed;
}

export function getPersistFailedServerSnapshot(): boolean {
  return false;
}

/* --------------------------------- Actions -------------------------------- */

const nowISO = () => new Date().toISOString();

export const studentActions = {
  /** Create or replace an opportunity. Assigns an id on first save. */
  upsertOpportunity(opportunity: TrackedOpportunity): TrackedOpportunity {
    const now = nowISO();
    const saved: TrackedOpportunity = {
      ...opportunity,
      id: opportunity.id || newId(),
      createdAt: opportunity.createdAt || now,
      updatedAt: now,
    };
    update((data) => ({
      ...data,
      opportunities: data.opportunities.some((o) => o.id === saved.id)
        ? data.opportunities.map((o) => (o.id === saved.id ? saved : o))
        : [saved, ...data.opportunities],
    }));
    return saved;
  },

  deleteOpportunity(id: string) {
    update((data) => ({
      ...data,
      opportunities: data.opportunities.filter((o) => o.id !== id),
    }));
  },

  setOpportunityStatus(id: string, status: OpportunityStatus) {
    update((data) => ({
      ...data,
      opportunities: data.opportunities.map((o) =>
        o.id === id ? { ...o, status, updatedAt: nowISO() } : o,
      ),
    }));
  },

  updateClaim(
    opportunityId: string,
    claimId: string,
    fn: (claim: SupportClaim) => SupportClaim,
  ) {
    update((data) => ({
      ...data,
      opportunities: data.opportunities.map((o) =>
        o.id === opportunityId
          ? {
              ...o,
              updatedAt: nowISO(),
              claims: o.claims.map((c) => (c.id === claimId ? fn(c) : c)),
            }
          : o,
      ),
    }));
  },

  toggleSavedResource(resourceId: string) {
    update((data) => ({
      ...data,
      savedResourceIds: data.savedResourceIds.includes(resourceId)
        ? data.savedResourceIds.filter((id) => id !== resourceId)
        : [...data.savedResourceIds, resourceId],
    }));
  },

  updateProfile(profile: StudentProfile) {
    update((data) => ({ ...data, profile }));
  },

  updateSettings(settings: StudentSettings) {
    update((data) => ({ ...data, settings }));
  },

  /** Add the fictional demo opportunities (once). */
  loadDemo(today: DateOnlyString) {
    update((data) => {
      if (data.opportunities.some((o) => o.isDemo)) return data;
      const profileIsEmpty =
        JSON.stringify(data.profile) === JSON.stringify(EMPTY_PROFILE);
      return {
        ...data,
        profile: profileIsEmpty ? DEMO_PROFILE : data.profile,
        opportunities: [...createDemoOpportunities(today), ...data.opportunities],
        savedResourceIds: [
          ...new Set([...data.savedResourceIds, ...DEMO_SAVED_RESOURCE_IDS]),
        ],
      };
    });
  },

  removeDemoData() {
    update((data) => ({
      ...data,
      opportunities: data.opportunities.filter((o) => !o.isDemo),
    }));
  },

  /** Erase everything this browser holds for the student portal. */
  resetAll() {
    commit(createEmptyStudentData());
  },
};
