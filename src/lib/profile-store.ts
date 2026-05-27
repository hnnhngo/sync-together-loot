import { useSyncExternalStore } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cosmeticsStore, type CosmeticsState } from "@/lib/cosmetics-store";
import { coinsStore } from "@/lib/coins-store";

export interface ProfileData {
  id: string;
  friend_code: string | null;
  current_streak: number;
  purchased_accessories: Record<string, unknown>;
  display_name: string | null;
  email: string | null;
  coins: number;
  has_completed_tutorial: boolean;
  wins: number;
  level: number;
  score: number;
  tasks_done: number;
  study_hours: number;
  crew_rank: number;
  nudges_sent: number;
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

const PROFILE_COLUMNS =
  "id, friend_code, current_streak, purchased_accessories, display_name, email, coins, has_completed_tutorial, wins, level, score, tasks_done, study_hours, crew_rank, nudges_sent";

const rowToProfile = (data: Record<string, unknown>): ProfileData => ({
  id: data.id as string,
  friend_code: (data.friend_code as string | null) ?? null,
  current_streak: (data.current_streak as number) ?? 0,
  purchased_accessories:
    (data.purchased_accessories as Record<string, unknown> | null) ?? {},
  display_name: (data.display_name as string | null) ?? null,
  email: (data.email as string | null) ?? null,
  coins: (data.coins as number) ?? 0,
  has_completed_tutorial: (data.has_completed_tutorial as boolean) ?? false,
  wins: (data.wins as number) ?? 0,
  level: (data.level as number) ?? 1,
  score: (data.score as number) ?? 0,
  tasks_done: (data.tasks_done as number) ?? 0,
  study_hours: Number(data.study_hours ?? 0),
  crew_rank: (data.crew_rank as number) ?? 0,
  nudges_sent: (data.nudges_sent as number) ?? 0,
});

export const profileStore = {
  getState: () => state,
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },

  async loadForUser(userId: string | null) {
    if (unsubCosmetics) {
      unsubCosmetics();
      unsubCosmetics = null;
    }
    currentUserId = userId;

    if (!userId) {
      state = { loading: false, profile: null };
      coinsStore.hydrate(null, 0);
      emit();
      return;
    }

    state = { ...state, loading: true };
    emit();

    const { data, error } = await supabase
      .from("profiles")
      .select(PROFILE_COLUMNS)
      .eq("id", userId)
      .maybeSingle();

    if (error || !data) {
      state = { loading: false, profile: null };
      emit();
      return;
    }

    let profile = rowToProfile(data as Record<string, unknown>);

    if (!profile.friend_code) {
      const code = await ensureFriendCode(userId);
      profile = { ...profile, friend_code: code };
    }

    // Hydrate dependent stores.
    coinsStore.hydrate(userId, profile.coins);

    suppressPush = true;
    const snap = profile.purchased_accessories as Partial<CosmeticsState>;
    if (snap && Object.keys(snap).length > 0) {
      cosmeticsStore.set(snap);
    }
    suppressPush = false;
    unsubCosmetics = cosmeticsStore.subscribe(schedulePushAccessories);

    state = { loading: false, profile };
    emit();
  },

  /** Refresh profile from DB (used after server-side mutations like RPCs). */
  async refresh() {
    if (!currentUserId) return;
    const { data } = await supabase
      .from("profiles")
      .select(PROFILE_COLUMNS)
      .eq("id", currentUserId)
      .maybeSingle();
    if (!data) return;
    const profile = rowToProfile(data as Record<string, unknown>);
    coinsStore.hydrate(currentUserId, profile.coins);
    state = { ...state, profile };
    emit();
  },

  async setStreak(value: number) {
    if (!currentUserId || !state.profile) return;
    state = { ...state, profile: { ...state.profile, current_streak: value } };
    emit();
    await supabase.from("profiles").update({ current_streak: value }).eq("id", currentUserId);
  },

  /** Update any homepage stat field for the current user. */
  async updateStats(patch: Partial<Pick<ProfileData, "wins" | "level" | "score" | "tasks_done" | "study_hours" | "crew_rank" | "nudges_sent">>) {
    if (!currentUserId || !state.profile) return;
    state = { ...state, profile: { ...state.profile, ...patch } };
    emit();
    await supabase.from("profiles").update(patch).eq("id", currentUserId);
  },

  /** One-time tutorial completion: flips flag + grants +500 coins (server-side, idempotent). */
  async completeTutorial(): Promise<{ ok: boolean; granted: boolean }> {
    if (!currentUserId || !state.profile) return { ok: false, granted: false };
    if (state.profile.has_completed_tutorial) return { ok: true, granted: false };
    const { data, error } = await supabase.rpc("complete_tutorial");
    if (error) return { ok: false, granted: false };
    const row = Array.isArray(data) ? data[0] : data;
    if (row) {
      const newCoins = (row as { coins: number }).coins;
      coinsStore.hydrate(currentUserId, newCoins);
      state = {
        ...state,
        profile: { ...state.profile, has_completed_tutorial: true, coins: newCoins },
      };
      emit();
    }
    return { ok: true, granted: true };
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
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const rand = (n: number) =>
    Array.from({ length: n }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
  return `SYN-${rand(4)}-${rand(4)}`;
}

export const useProfile = () =>
  useSyncExternalStore(profileStore.subscribe, profileStore.getState, profileStore.getState);
