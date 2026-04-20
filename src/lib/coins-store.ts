import { useSyncExternalStore } from "react";

interface CoinsState {
  points: number;
}

let state: CoinsState = { points: 1250 };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const coinsStore = {
  getState: () => state,
  set: (n: number) => {
    state = { points: Math.max(0, Math.round(n)) };
    emit();
  },
  add: (n: number) => {
    state = { points: Math.max(0, state.points + Math.round(n)) };
    emit();
  },
  spend: (n: number): boolean => {
    if (state.points < n) return false;
    state = { points: state.points - Math.round(n) };
    emit();
    return true;
  },
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export const useCoins = () =>
  useSyncExternalStore(coinsStore.subscribe, coinsStore.getState, coinsStore.getState);
