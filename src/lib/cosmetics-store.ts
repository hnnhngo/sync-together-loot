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

/** Animal shapes that ignore the `color` prop (their look is hardcoded). */
export const FIXED_COLOR_SHAPES: BlobShape[] = ["capybara", "frog", "chick", "panda"];
export const shapeHasColorVariants = (shape: BlobShape) => !FIXED_COLOR_SHAPES.includes(shape);

export interface CosmeticsState {
  shape: BlobShape;
  color: BlobColor;
  hat: HatKey;
  outfit: OutfitKey;
  glasses: GlassesKey;
  streakColor: StreakColorKey;
  /** Owned counts per accessory key (used for duplicate→coin logic). */
  ownedHats: Partial<Record<HatKey, number>>;
  ownedOutfits: Partial<Record<OutfitKey, number>>;
  ownedGlasses: Partial<Record<GlassesKey, number>>;
  ownedStreaks: Partial<Record<StreakColorKey, number>>;
  /** Owned alternate color variants per hat/outfit/glasses. */
  ownedVariants: Record<string, true>;
  /** Currently equipped variant id per slot (or undefined for default). */
  equippedHatVariant?: string;
  equippedOutfitVariant?: string;
  equippedGlassesVariant?: string;
}

const initial: CosmeticsState = {
  shape: "capybara",
  color: "blue",
  hat: "none",
  outfit: "none",
  glasses: "none",
  streakColor: "ember",
  ownedHats: { crown: 1, beanie: 1, flowerCrown: 1, halo: 1 },
  ownedOutfits: { scarf: 1, cape: 1, bowtie: 1 },
  ownedGlasses: { round: 1, shades: 1 },
  ownedStreaks: { ember: 1, rose: 1 },
  ownedVariants: {},
};

let state: CosmeticsState = initial;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());

export const cosmeticsStore = {
  getState: () => state,
  set: (patch: Partial<CosmeticsState>) => {
    state = { ...state, ...patch };
    emit();
  },
  /** Reset all equipped accessories (keeps inventory & shape/color). */
  resetEquipped: () => {
    state = {
      ...state,
      hat: "none",
      outfit: "none",
      glasses: "none",
      equippedHatVariant: undefined,
      equippedOutfitVariant: undefined,
      equippedGlassesVariant: undefined,
    };
    emit();
  },
  /**
   * Add an accessory to inventory. Returns true if it was new, false if duplicate.
   */
  addAccessory: (
    slot: "hat" | "outfit" | "glasses" | "streakColor",
    key: string,
  ): boolean => {
    const next = { ...state };
    if (slot === "hat") {
      const k = key as HatKey;
      const existing = next.ownedHats[k] ?? 0;
      next.ownedHats = { ...next.ownedHats, [k]: existing + 1 };
      state = next;
      emit();
      return existing === 0;
    }
    if (slot === "outfit") {
      const k = key as OutfitKey;
      const existing = next.ownedOutfits[k] ?? 0;
      next.ownedOutfits = { ...next.ownedOutfits, [k]: existing + 1 };
      state = next;
      emit();
      return existing === 0;
    }
    if (slot === "glasses") {
      const k = key as GlassesKey;
      const existing = next.ownedGlasses[k] ?? 0;
      next.ownedGlasses = { ...next.ownedGlasses, [k]: existing + 1 };
      state = next;
      emit();
      return existing === 0;
    }
    if (slot === "streakColor") {
      const k = key as StreakColorKey;
      const existing = next.ownedStreaks[k] ?? 0;
      next.ownedStreaks = { ...next.ownedStreaks, [k]: existing + 1 };
      state = next;
      emit();
      return existing === 0;
    }
    return false;
  },
  addVariant: (variantId: string) => {
    state = { ...state, ownedVariants: { ...state.ownedVariants, [variantId]: true } };
    emit();
  },
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export const useCosmetics = () =>
  useSyncExternalStore(cosmeticsStore.subscribe, cosmeticsStore.getState, cosmeticsStore.getState);
