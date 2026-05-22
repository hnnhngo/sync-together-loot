import { useSyncExternalStore } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cosmeticsStore, type CosmeticsState } from "@/lib/cosmetics-store";

export interface ProfileData {
  id: string;
  friend_code: string | null;
  current_streak: number;
  purchased_accessories: Record<string, unknown>;
  display_name: string | null;
  email: string | null;
}

interface ProfileStoreState {
  loading: boolean;
  profile: ProfileData | null;
}

let state: ProfileStoreState = { loading: false, profile: null };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

// Slice of cosmetics state we persist to DB
const cosmeticsSnapshot = (c: CosmeticsState) => ({
  shape: c.shape,
  color: c.color,
  hat: c.hat,
  outfit: c.outfit,
  glasses: c.glasses,
  streakColor: c.streakColor,
  randomStreakDaily: c.randomStreakDaily,
  ownedHats: c.ownedHats,
  ownedOutfits: c.ownedOutfits,
  ownedGlasses: c.ownedGlasses,
  ownedStreaks: c.ownedStreaks,
  ownedShapes: c.ownedShapes,
  ownedVariants: c.ownedVariants,
  equippedHatVariant: c.equippedHatVariant,
  equippedOutfitVariant: c.equippedOutfitVariant,
  equippedGlassesVariant: c.equippedGlassesVariant,
});

let pushTimer: ReturnType<typeof setTimeout> | null = null;
let suppressPush = false;
let unsubCosmetics: (() => void) | null = null;
let currentUserId: string | null = null;

const schedulePushAccessories = () => {
  if (suppressPush || !currentUserId) return;
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(async () => {
    const snap = cosmeticsSnapshot(cosmeticsStore.getState());
    await supabase
      .from("profiles")
      .update({ purchased_accessories: snap })
      .eq("id", currentUserId!);
  }, 600);
};

export const profileStore = {
  getState: () => state,
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },

  /** Called by ProfileSync when the auth user changes. */
  async loadForUser(userId: string | null) {
    // Cleanup existing subscription
    if (unsubCosmetics) {
      unsubCosmetics();
      unsubCosmetics = null;
    }
    currentUserId = userId;

    if (!userId) {
      state = { loading: false, profile: null };
      emit();
      return;
    }

    state = { ...state, loading: true };
    emit();

    const { data, error } = await supabase
      .from("profiles")
      .select("id, friend_code, current_streak, purchased_accessories, display_name, email")
      .eq("id", userId)
      .maybeSingle();

    if (error || !data) {
      state = { loading: false, profile: null };
      emit();
      return;
    }

    // Ensure friend code exists (legacy rows safety net)
    let friendCode = data.friend_code;
    if (!friendCode) {
      friendCode = await ensureFriendCode(userId);
    }

    const profile: ProfileData = {
      id: data.id,
      friend_code: friendCode,
      current_streak: data.current_streak ?? 0,
      purchased_accessories:
        (data.purchased_accessories as Record<string, unknown> | null) ?? {},
      display_name: data.display_name,
      email: data.email,
    };

    // Hydrate cosmetics store from DB snapshot (without re-pushing).
    suppressPush = true;
    const snap = profile.purchased_accessories as Partial<CosmeticsState>;
    if (snap && Object.keys(snap).length > 0) {
      cosmeticsStore.set(snap);
    }
    suppressPush = false;

    // Subscribe cosmetics changes -> push to DB
    unsubCosmetics = cosmeticsStore.subscribe(schedulePushAccessories);

    state = { loading: false, profile };
    emit();
  },

  async setStreak(value: number) {
    if (!currentUserId || !state.profile) return;
    state = {
      ...state,
      profile: { ...state.profile, current_streak: value },
    };
    emit();
    await supabase
      .from("profiles")
      .update({ current_streak: value })
      .eq("id", currentUserId);
  },

  async regenerateFriendCode() {
    if (!currentUserId) return null;
    const newCode = await generateLocalFriendCode();
    const { error } = await supabase
      .from("profiles")
      .update({ friend_code: newCode })
      .eq("id", currentUserId);
    if (error) return null;
    if (state.profile) {
      state = { ...state, profile: { ...state.profile, friend_code: newCode } };
      emit();
    }
    return newCode;
  },
};

async function ensureFriendCode(userId: string): Promise<string> {
  const code = await generateLocalFriendCode();
  await supabase.from("profiles").update({ friend_code: code }).eq("id", userId);
  return code;
}

async function generateLocalFriendCode(): Promise<string> {
  // Client-side generator; uniqueness enforced by DB unique index — retry on conflict.
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const rand = (n: number) =>
    Array.from({ length: n }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
  return `SYN-${rand(4)}-${rand(4)}`;
}

export const useProfile = () =>
  useSyncExternalStore(profileStore.subscribe, profileStore.getState, profileStore.getState);
