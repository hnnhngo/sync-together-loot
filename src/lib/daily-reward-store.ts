import { useSyncExternalStore } from "react";
import { supabase } from "@/integrations/supabase/client";
import { coinsStore } from "@/lib/coins-store";

export const DAILY_REWARDS = [
  { day: 1, coins: 10 },
  { day: 2, coins: 15 },
  { day: 3, coins: 20 },
  { day: 4, coins: 30 },
  { day: 5, coins: 50 },
  { day: 6, coins: 75 },
  { day: 7, coins: 150 },
];

interface State {
  loading: boolean;
  rewardDay: number; // 1-7, current day awaiting claim
  lastClaimDate: string | null; // ISO YYYY-MM-DD
}

let state: State = { loading: false, rewardDay: 1, lastClaimDate: null };
let currentUserId: string | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

const todayStr = () => new Date().toISOString().slice(0, 10);

export const dailyRewardStore = {
  getState: () => state,
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
  canClaim: () => state.lastClaimDate !== todayStr(),

  async loadForUser(userId: string | null) {
    currentUserId = userId;
    if (!userId) {
      state = { loading: false, rewardDay: 1, lastClaimDate: null };
      emit();
      return;
    }
    state = { ...state, loading: true };
    emit();
    let { data } = await supabase
      .from("user_daily_status")
      .select("reward_day, last_reward_claim_date")
      .eq("user_id", userId)
      .maybeSingle();
    if (!data) {
      // Safety net for legacy rows
      await supabase
        .from("user_daily_status")
        .insert({ user_id: userId, reward_day: 1 });
      data = { reward_day: 1, last_reward_claim_date: null };
    }
    state = {
      loading: false,
      rewardDay: data.reward_day ?? 1,
      lastClaimDate: data.last_reward_claim_date ?? null,
    };
    emit();
  },

  async claim(): Promise<{ ok: boolean; coins?: number }> {
    if (!currentUserId) return { ok: false };
    if (!this.canClaim()) return { ok: false };
    const today = todayStr();
    const day = state.rewardDay;
    const reward = DAILY_REWARDS[day - 1];
    if (!reward) return { ok: false };
    coinsStore.add(reward.coins);
    const nextDay = (day % 7) + 1;
    state = { ...state, rewardDay: nextDay, lastClaimDate: today };
    emit();
    await supabase
      .from("user_daily_status")
      .update({ reward_day: nextDay, last_reward_claim_date: today })
      .eq("user_id", currentUserId);
    return { ok: true, coins: reward.coins };
  },
};

export const useDailyReward = () =>
  useSyncExternalStore(dailyRewardStore.subscribe, dailyRewardStore.getState, dailyRewardStore.getState);
