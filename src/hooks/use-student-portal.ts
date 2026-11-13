"use client";

import { useMemo, useSyncExternalStore } from "react";

import { getSupportResources } from "@/data/support-resources";
import { todayISO } from "@/lib/dates";
import {
  getPersistFailedServerSnapshot,
  getPersistFailedSnapshot,
  getServerSnapshot,
  getSnapshot,
  studentActions,
  subscribe,
} from "@/lib/storage/student-store";
import type { DateOnlyString, StudentData, SupportResource } from "@/types";

const noopSubscribe = () => () => {};

/** Today's local date. Null on the server so nothing time-based is prerendered. */
export function useToday(): DateOnlyString | null {
  return useSyncExternalStore(noopSubscribe, todayISO, () => null);
}

export interface StudentPortal {
  data: StudentData;
  today: DateOnlyString;
  /** Support catalog. Fictional demo data until Supabase supplies a real one. */
  resources: SupportResource[];
  actions: typeof studentActions;
  /** True when the browser refused to save (changes last only this session). */
  persistFailed: boolean;
}

/**
 * Everything a student-portal screen needs. Returns null until the browser
 * has loaded (server render and first paint), so callers show a skeleton.
 */
export function useStudentPortal(): StudentPortal | null {
  const data = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const persistFailed = useSyncExternalStore(
    subscribe,
    getPersistFailedSnapshot,
    getPersistFailedServerSnapshot,
  );
  const today = useToday();
  const resources = useMemo(
    () => (today ? getSupportResources(today) : []),
    [today],
  );

  if (!data || !today) return null;
  return { data, today, resources, actions: studentActions, persistFailed };
}
