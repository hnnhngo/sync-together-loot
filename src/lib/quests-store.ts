import { useSyncExternalStore } from "react";
import { coinsStore } from "@/lib/coins-store";
import { cosmeticsStore } from "@/lib/cosmetics-store";
import type { HatKey, OutfitKey, GlassesKey } from "@/components/BlobChar";

export type QuestKind = "daily" | "permanent";
export type QuestMetric = "studyHours" | "assignments" | "alarmsKept" | "nudgesSent" | "streakDays";

export type QuestRewardKind = "coins" | "accessory";

export interface QuestReward {
  kind: QuestRewardKind;
  /** coin amount (when kind === "coins") */
  amount?: number;
  /** accessory slot + key (when kind === "accessory") */
  slot?: "hat" | "outfit" | "glasses";
  accessoryKey?: HatKey | OutfitKey | GlassesKey;
  /** Friendly label for the reward chip */
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
  /** emoji shown on the card */
  icon: string;
}

export interface QuestProgressEntry {
  progress: number;
  claimed: boolean;
  /** ISO date (YYYY-MM-DD) the daily progress is anchored to. */
  resetOn?: string;
}

export interface QuestsState {
  /** Live counters that quests read from. */
  studyHours: number;
  assignments: number;
  alarmsKept: number;
  nudgesSent: number;
  streakDays: number;
  /** Per-quest progress + claim state. */
  progress: Record<string, QuestProgressEntry>;
}

export const QUESTS: Quest[] = [
  // ---------- DAILY ----------
  {
    id: "daily-study-2h",
    kind: "daily",
    title: "Focused Two",
    description: "Study for 2 hours today.",
    metric: "studyHours",
    goal: 2,
    icon: "📚",
    reward: { kind: "coins", amount: 50, label: "+50 coins" },
  },
  {
    id: "daily-assignments-3",
    kind: "daily",
    title: "Knock 'em Out",
    description: "Finish 3 assignments today.",
    metric: "assignments",
    goal: 3,
    icon: "✅",
    reward: { kind: "coins", amount: 75, label: "+75 coins" },
  },
  {
    id: "daily-nudges-2",
    kind: "daily",
    title: "Friendly Pings",
    description: "Send 2 nudges to the crew.",
    metric: "nudgesSent",
    goal: 2,
    icon: "💌",
    reward: { kind: "coins", amount: 30, label: "+30 coins" },
  },
  {
    id: "daily-alarms-1",
    kind: "daily",
    title: "Up & At It",
    description: "Keep 1 alarm on schedule.",
    metric: "alarmsKept",
    goal: 1,
    icon: "⏰",
    reward: { kind: "coins", amount: 25, label: "+25 coins" },
  },

  // ---------- PERMANENT ----------
  {
    id: "perm-study-25",
    kind: "permanent",
    title: "Quarter Century",
    description: "Log 25 total study hours.",
    metric: "studyHours",
    goal: 25,
    icon: "🎓",
    reward: { kind: "accessory", slot: "hat", accessoryKey: "halo", label: "Scholar Halo" },
  },
  {
    id: "perm-study-100",
    kind: "permanent",
    title: "Centurion",
    description: "Log 100 total study hours.",
    metric: "studyHours",
    goal: 100,
    icon: "🏛️",
    reward: { kind: "accessory", slot: "outfit", accessoryKey: "cape", label: "Sage Cape" },
  },
  {
    id: "perm-assignments-50",
    kind: "permanent",
    title: "Task Slayer",
    description: "Complete 50 assignments.",
    metric: "assignments",
    goal: 50,
    icon: "⚔️",
    reward: { kind: "coins", amount: 500, label: "+500 coins" },
  },
  {
    id: "perm-streak-30",
    kind: "permanent",
    title: "Iron Will",
    description: "Reach a 30-day streak.",
    metric: "streakDays",
    goal: 30,
    icon: "🔥",
    reward: { kind: "accessory", slot: "glasses", accessoryKey: "shades", label: "Legend Shades" },
  },
];

const todayKey = () => new Date().toISOString().slice(0, 10);

const STORAGE_KEY = "syn.quests.progress.v1";

const buildInitialProgress = (): Record<string, QuestProgressEntry> => {
  const today = todayKey();
  const out: Record<string, QuestProgressEntry> = {};
  for (const q of QUESTS) {
    out[q.id] = { progress: 0, claimed: false, resetOn: q.kind === "daily" ? today : undefined };
  }
  return out;
};

/**
 * Load persisted progress from localStorage and merge with defaults.
 * Daily quests whose `resetOn` is not today have their `claimed` flag reset.
 * Permanent quests keep their claimed state forever.
 */
const loadPersistedProgress = (): Record<string, QuestProgressEntry> => {
  const base = buildInitialProgress();
  if (typeof window === "undefined") return base;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return base;
    const saved = JSON.parse(raw) as Record<string, QuestProgressEntry>;
    const today = todayKey();
    for (const q of QUESTS) {
      const s = saved[q.id];
      if (!s) continue;
      if (q.kind === "daily") {
        if (s.resetOn === today) {
          base[q.id] = { ...s, resetOn: today };
        } else {
          // new day — reset claimed/progress for daily quests
          base[q.id] = { progress: 0, claimed: false, resetOn: today };
        }
      } else {
        // permanent quests retain claimed state
        base[q.id] = { progress: s.progress ?? 0, claimed: !!s.claimed };
      }
    }
  } catch {
    // ignore corrupt storage
  }
  return base;
};

const persistProgress = (progress: Record<string, QuestProgressEntry>) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // ignore quota / privacy errors
  }
};

let state: QuestsState = {
  studyHours: 1.5,
  assignments: 1,
  alarmsKept: 0,
  nudgesSent: 1,
  streakDays: 3,
  progress: loadPersistedProgress(),
};

// seed initial progress to match the live counters above so the demo feels alive
// (but DO NOT overwrite a persisted `claimed` flag — claims are once-per-day)
for (const q of QUESTS) {
  const cur = state[q.metric];
  const prev = state.progress[q.id];
  state.progress[q.id] = { ...prev, progress: Math.min(cur, q.goal) };
}

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

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
    return () => listeners.delete(l);
  },
  /** Increment any underlying metric. Pass negative numbers to decrement. */
  bump: (metric: QuestMetric, delta: number) => {
    state = { ...state, [metric]: Math.max(0, state[metric] + delta) };
    recomputeProgress();
    emit();
  },
  /** Sync the streakDays metric from the home page. */
  setStreak: (n: number) => {
    state = { ...state, streakDays: Math.max(0, Math.round(n)) };
    recomputeProgress();
    emit();
  },
  /** Claim the reward if quest is complete and not yet claimed. */
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
    emit();
    return { ok: true, message: `Reward claimed: ${q.reward.label}` };
  },
};

export const useQuests = () =>
  useSyncExternalStore(questsStore.subscribe, questsStore.getState, questsStore.getState);
