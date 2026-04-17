import { useSyncExternalStore } from "react";
import type { BlobShape, BlobColor, HatKey, OutfitKey, GlassesKey } from "@/components/BlobChar";

export type StreakColorKey = "ember" | "rose" | "violet" | "sky" | "emerald" | "gold";

export interface StreakColor {
  key: StreakColorKey;
  name: string;
  rarity: "Common" | "Rare" | "Legendary";
  /** Tailwind classes for flame icon */
  flameClass: string;
  /** Hex/HSL gradient stops used inline */
  from: string;
  to: string;
  /** Soft background tint class */
  tintClass: string;
}

export const STREAK_COLORS: Record<StreakColorKey, StreakColor> = {
  ember:   { key: "ember",   name: "Ember",   rarity: "Common",    flameClass: "text-coral",      from: "hsl(20 90% 65%)",  to: "hsl(0 80% 55%)",   tintClass: "bg-blob-coral/30" },
  rose:    { key: "rose",    name: "Rose",    rarity: "Common",    flameClass: "text-primary",    from: "hsl(340 80% 75%)", to: "hsl(320 70% 60%)", tintClass: "bg-blob-pink/30" },
  violet:  { key: "violet",  name: "Violet",  rarity: "Rare",      flameClass: "text-primary",    from: "hsl(265 80% 75%)", to: "hsl(280 70% 55%)", tintClass: "bg-blob-lavender/35" },
  sky:     { key: "sky",     name: "Sky",     rarity: "Rare",      flameClass: "text-secondary",  from: "hsl(205 85% 75%)", to: "hsl(220 70% 55%)", tintClass: "bg-blob-blue/30" },
  emerald: { key: "emerald", name: "Emerald", rarity: "Legendary", flameClass: "text-blob-sage",  from: "hsl(160 70% 70%)", to: "hsl(150 65% 45%)", tintClass: "bg-blob-mint/35" },
  gold:    { key: "gold",    name: "Gold",    rarity: "Legendary", flameClass: "text-warm-gold",  from: "hsl(45 95% 70%)",  to: "hsl(30 85% 55%)",  tintClass: "bg-blob-yellow/40" },
};

export interface CosmeticsState {
  shape: BlobShape;
  color: BlobColor;
  hat: HatKey;
  outfit: OutfitKey;
  glasses: GlassesKey;
  streakColor: StreakColorKey;
}

const initial: CosmeticsState = {
  shape: "capybara",
  color: "blue",
  hat: "none",
  outfit: "none",
  glasses: "none",
  streakColor: "ember",
};

let state: CosmeticsState = initial;
const listeners = new Set<() => void>();

export const cosmeticsStore = {
  getState: () => state,
  set: (patch: Partial<CosmeticsState>) => {
    state = { ...state, ...patch };
    listeners.forEach((l) => l());
  },
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export const useCosmetics = () =>
  useSyncExternalStore(cosmeticsStore.subscribe, cosmeticsStore.getState, cosmeticsStore.getState);
