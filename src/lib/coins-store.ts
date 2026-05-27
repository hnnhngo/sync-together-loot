import { useSyncExternalStore } from "react";
import { supabase } from "@/integrations/supabase/client";

interface CoinsState {
  points: number;
}

let state: CoinsState = { points: 0 };
let currentUserId: string | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

const persist = async (next: number) => {
  if (!currentUserId) return;
  await supabase.from("profiles").update({ coins: next }).eq("id", currentUserId);
};

export const coinsStore = {
  getState: () => state,
  /** Called by ProfileSync after profile loads. Does NOT push to DB. */
  hydrate: (userId: string | null, points: number) => {
    currentUserId = userId;
    state = { points: Math.max(0, Math.round(points)) };
    emit();
  },
  set: (n: number) => {
    state = { points: Math.max(0, Math.round(n)) };
    emit();
    void persist(state.points);
  },
  add: (n: number) => {
    state = { points: Math.max(0, state.points + Math.round(n)) };
    emit();
    void persist(state.points);
  },
  spend: (n: number): boolean => {
    if (state.points < n) return false;
    state = { points: state.points - Math.round(n) };
    emit();
    void persist(state.points);
    return true;
  },
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export const useCoins = () =>
  useSyncExternalStore(coinsStore.subscribe, coinsStore.getState, coinsStore.getState);
