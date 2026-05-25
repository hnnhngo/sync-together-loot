import { useSyncExternalStore } from "react";
import { supabase } from "@/integrations/supabase/client";
import { coinsStore } from "@/lib/coins-store";
import { cosmeticsStore } from "@/lib/cosmetics-store";
import type { HatKey, OutfitKey, GlassesKey } from "@/components/BlobChar";

export type QuestKind = "daily" | "permanent";
export type QuestMetric = "studyHours" | "assignments" | "alarmsKept" | "nudgesSent" | "streakDays";

export type QuestRewardKind = "coins" | "accessory";

export interface QuestReward {
  kind: QuestRewardKind;
  amount?: number;
  slot?: "hat" | "outfit" | "glasses";
  accessoryKey?: HatKey | OutfitKey | GlassesKey;
  label: string;
}

export interface Quest {
  id: string;
  kind: QuestKind;
  title: string;
  description: string;
  metric: QuestMetric;
  goal: number;
  reward: QuestReward;
  icon: string;
}

export interface QuestProgressEntry {
  progress: number;
  claimed: boolean;
  resetOn?: string;
}

export interface QuestsState {
  studyHours: number;
  assignments: number;
  alarmsKept: number;
  nudgesSent: number;
  streakDays: number;
  progress: Record<string, QuestProgressEntry>;
}

export const QUESTS: Quest[] = [
  // ---------- DAILY ----------
  { id: "daily-study-2h", kind: "daily", title: "Focused Two", description: "Study for 2 hours today.", metric: "studyHours", goal: 2, icon: "📚", reward: { kind: "coins", amount: 50, label: "+50 coins" } },
  { id: "daily-assignments-3", kind: "daily", title: "Knock 'em Out", description: "Finish 3 assignments today.", metric: "assignments", goal: 3, icon: "✅", reward: { kind: "coins", amount: 75, label: "+75 coins" } },
  { id: "daily-nudges-2", kind: "daily", title: "Friendly Pings", description: "Send 2 nudges to the crew.", metric: "nudgesSent", goal: 2, icon: "💌", reward: { kind: "coins", amount: 30, label: "+30 coins" } },
  { id: "daily-alarms-1", kind: "daily", title: "Up & At It", description: "Keep 1 alarm on schedule.", metric: "alarmsKept", goal: 1, icon: "⏰", reward: { kind: "coins", amount: 25, label: "+25 coins" } },
  // ---------- PERMANENT ----------
  { id: "perm-study-25", kind: "permanent", title: "Quarter Century", description: "Log 25 total study hours.", metric: "studyHours", goal: 25, icon: "🎓", reward: { kind: "accessory", slot: "hat", accessoryKey: "halo", label: "Scholar Halo" } },
  { id: "perm-study-100", kind: "permanent", title: "Centurion", description: "Log 100 total study hours.", metric: "studyHours", goal: 100, icon: "🏛️", reward: { kind: "accessory", slot: "outfit", accessoryKey: "cape", label: "Sage Cape" } },
  { id: "perm-assignments-50", kind: "permanent", title: "Task Slayer", description: "Complete 50 assignments.", metric: "assignments", goal: 50, icon: "⚔️", reward: { kind: "coins", amount: 500, label: "+500 coins" } },
  { id: "perm-streak-30", kind: "permanent", title: "Iron Will", description: "Reach a 30-day streak.", metric: "streakDays", goal: 30, icon: "🔥", reward: { kind: "accessory", slot: "glasses", accessoryKey: "shades", label: "Legend Shades" } },
];

const todayKey = () => new Date().toISOString().slice(0, 10);

const buildInitialProgress = (): Record<string, QuestProgressEntry> => {
  const today = todayKey();
  const out: Record<string, QuestProgressEntry> = {};
  for (const q of QUESTS) {
    out[q.id] = { progress: 0, claimed: false, resetOn: q.kind === "daily" ? today : undefined };
  }
  return out;
};

let state: QuestsState = {
  studyHours: 1.5,
  assignments: 1,
  alarmsKept: 0,
  nudgesSent: 1,
  streakDays: 3,
  progress: buildInitialProgress(),
};

let currentUserId: string | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

// Debounced per-quest upserts to DB
const pendingPush = new Set<string>();
let pushTimer: ReturnType<typeof setTimeout> | null = null;
const schedulePush = (questId: string) => {
  if (!currentUserId) return;
  pendingPush.add(questId);
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(async () => {
    const ids = Array.from(pendingPush);
    pendingPush.clear();
    if (!currentUserId) return;
    const rows = ids
      .map((id) => {
        const q = QUESTS.find((x) => x.id === id);
        const entry = state.progress[id];
        if (!q || !entry) return null;
        return {
          user_id: currentUserId,
          quest_id: id,
          progress: entry.progress,
          claimed: entry.claimed,
          reset_on: q.kind === "daily" ? todayKey() : null,
        };
      })
      .filter(Boolean);
    if (rows.length) {
      await supabase.from("user_quest_progress").upsert(rows as any, { onConflict: "user_id,quest_id" });
    }
  }, 500);
};

const recomputeProgress = () => {
  const today = todayKey();
  const next: Record<string, QuestProgressEntry> = { ...state.progress };
  for (const q of QUESTS) {
    const prev = next[q.id] ?? { progress: 0, claimed: false };
    if (q.kind === "daily" && prev.resetOn !== today) {
      next[q.id] = { progress: Math.min(state[q.metric], q.goal), claimed: false, resetOn: today };
    } else {
      next[q.id] = {
        ...prev,
        progress: Math.min(state[q.metric], q.goal),
        resetOn: q.kind === "daily" ? today : undefined,
      };
    }
  }
  state = { ...state, progress: next };
};

export const questsStore = {
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
      state = { ...state, progress: buildInitialProgress() };
      emit();
      return;
    }

    const today = todayKey();

    // Check user_daily_status for last quest reset date
    const { data: status } = await supabase
      .from("user_daily_status")
      .select("last_quest_reset_date")
      .eq("user_id", userId)
      .maybeSingle();

    const needsDailyReset = !status || status.last_quest_reset_date !== today;

    if (needsDailyReset) {
      // Hard reset: delete daily quest rows (regardless of claim status) — they will be re-created on bump/claim.
      const dailyIds = QUESTS.filter((q) => q.kind === "daily").map((q) => q.id);
      await supabase
        .from("user_quest_progress")
        .delete()
        .eq("user_id", userId)
        .in("quest_id", dailyIds);
      await supabase
        .from("user_daily_status")
        .upsert(
          { user_id: userId, last_quest_reset_date: today },
          { onConflict: "user_id" },
        );
    }

    // Load remaining progress
    const { data: rows } = await supabase
      .from("user_quest_progress")
      .select("quest_id, progress, claimed, reset_on")
      .eq("user_id", userId);

    const progress = buildInitialProgress();
    (rows ?? []).forEach((r) => {
      const q = QUESTS.find((x) => x.id === r.quest_id);
      if (!q) return;
      progress[r.quest_id] = {
        progress: Number(r.progress) || 0,
        claimed: !!r.claimed,
        resetOn: q.kind === "daily" ? (r.reset_on as string | null) ?? today : undefined,
      };
    });

    state = { ...state, progress };
    recomputeProgress();
    emit();
  },

  bump: (metric: QuestMetric, delta: number) => {
    state = { ...state, [metric]: Math.max(0, state[metric] + delta) };
    const before = { ...state.progress };
    recomputeProgress();
    // Push any quest whose progress actually changed
    for (const q of QUESTS) {
      if (state.progress[q.id]?.progress !== before[q.id]?.progress) schedulePush(q.id);
    }
    emit();
  },

  setStreak: (n: number) => {
    state = { ...state, streakDays: Math.max(0, Math.round(n)) };
    const before = { ...state.progress };
    recomputeProgress();
    for (const q of QUESTS) {
      if (state.progress[q.id]?.progress !== before[q.id]?.progress) schedulePush(q.id);
    }
    emit();
  },

  claim: (questId: string): { ok: boolean; message: string } => {
    const q = QUESTS.find((x) => x.id === questId);
    if (!q) return { ok: false, message: "Quest not found" };
    const entry = state.progress[questId];
    if (!entry || entry.claimed) return { ok: false, message: "Already claimed" };
    if (entry.progress < q.goal) return { ok: false, message: "Not complete yet" };

    if (q.reward.kind === "coins" && q.reward.amount) {
      coinsStore.add(q.reward.amount);
    } else if (q.reward.kind === "accessory" && q.reward.slot && q.reward.accessoryKey) {
      cosmeticsStore.addAccessory(q.reward.slot, q.reward.accessoryKey as string);
    }
    state = {
      ...state,
      progress: { ...state.progress, [questId]: { ...entry, claimed: true } },
    };
    schedulePush(questId);
    emit();
    return { ok: true, message: `Reward claimed: ${q.reward.label}` };
  },
};

export const useQuests = () =>
  useSyncExternalStore(questsStore.subscribe, questsStore.getState, questsStore.getState);
