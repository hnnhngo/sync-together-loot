import { useSyncExternalStore } from "react";
import { supabase } from "@/integrations/supabase/client";

export type DayId = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export interface Alarm {
  id: string;
  label: string;
  hour: number;
  minute: number;
  buffer: number;
  enabled: boolean;
  days: DayId[];
  sync_with: string | null;
}

interface State {
  loading: boolean;
  alarms: Alarm[];
}

let state: State = { loading: false, alarms: [] };
let currentUserId: string | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

const rowToAlarm = (r: any): Alarm => ({
  id: r.id,
  label: r.label,
  hour: r.hour,
  minute: r.minute,
  buffer: r.buffer,
  enabled: r.enabled,
  days: (r.days ?? []) as DayId[],
  sync_with: r.sync_with ?? null,
});

export const alarmsStore = {
  getState: () => state,
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },

  async loadForUser(userId: string | null) {
    currentUserId = userId;
    if (!userId) {
      state = { loading: false, alarms: [] };
      emit();
      return;
    }
    state = { ...state, loading: true };
    emit();
    const { data, error } = await supabase
      .from("alarms")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });
    state = { loading: false, alarms: error || !data ? [] : data.map(rowToAlarm) };
    emit();
  },

  async add(): Promise<Alarm | null> {
    if (!currentUserId) return null;
    const draft = {
      user_id: currentUserId,
      label: "New Alarm",
      hour: 12,
      minute: 0,
      buffer: 60,
      enabled: true,
      days: [] as string[],
      sync_with: null as string | null,
    };
    const { data, error } = await supabase.from("alarms").insert(draft).select().single();
    if (error || !data) return null;
    const alarm = rowToAlarm(data);
    state = { ...state, alarms: [...state.alarms, alarm] };
    emit();
    return alarm;
  },

  async update(id: string, patch: Partial<Omit<Alarm, "id">>) {
    state = {
      ...state,
      alarms: state.alarms.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    };
    emit();
    if (!currentUserId) return;
    await supabase.from("alarms").update(patch as any).eq("id", id);
  },

  async remove(id: string) {
    state = { ...state, alarms: state.alarms.filter((a) => a.id !== id) };
    emit();
    if (!currentUserId) return;
    await supabase.from("alarms").delete().eq("id", id);
  },
};

export const useAlarms = () =>
  useSyncExternalStore(alarmsStore.subscribe, alarmsStore.getState, alarmsStore.getState);
