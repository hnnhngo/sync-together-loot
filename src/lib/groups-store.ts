import { useSyncExternalStore } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface GroupEntry {
  id: string;
  name: string;
  subject: string | null;
  multiplier: number;
  ownerId: string;
  memberIds: string[];
  memberCount: number;
}

interface State {
  loading: boolean;
  groups: GroupEntry[];
}

let state: State = { loading: false, groups: [] };
let currentUserId: string | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const groupsStore = {
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
      state = { loading: false, groups: [] };
      emit();
      return;
    }
    state = { ...state, loading: true };
    emit();
    // Groups the user belongs to (RLS allows reading via membership).
    const { data: mine } = await supabase
      .from("group_members")
      .select("group_id")
      .eq("user_id", userId);
    const ids = (mine ?? []).map((m) => m.group_id);
    if (!ids.length) {
      state = { loading: false, groups: [] };
      emit();
      return;
    }
    const { data: groups } = await supabase
      .from("study_groups")
      .select("id, name, subject, multiplier, owner_id")
      .in("id", ids);
    const { data: members } = await supabase
      .from("group_members")
      .select("group_id, user_id")
      .in("group_id", ids);
    const memberMap = new Map<string, string[]>();
    (members ?? []).forEach((m) => {
      const arr = memberMap.get(m.group_id) ?? [];
      arr.push(m.user_id);
      memberMap.set(m.group_id, arr);
    });
    const result: GroupEntry[] = (groups ?? []).map((g) => {
      const ms = memberMap.get(g.id) ?? [];
      return {
        id: g.id,
        name: g.name,
        subject: g.subject,
        multiplier: Number(g.multiplier ?? 1),
        ownerId: g.owner_id,
        memberIds: ms,
        memberCount: ms.length,
      };
    });
    state = { loading: false, groups: result };
    emit();
  },

  async create(name: string, subject: string): Promise<{ ok: boolean; message: string }> {
    if (!currentUserId) return { ok: false, message: "Not signed in" };
    if (!name.trim()) return { ok: false, message: "Name required" };
    const { data: group, error } = await supabase
      .from("study_groups")
      .insert({ owner_id: currentUserId, name: name.trim(), subject: subject.trim() || null, multiplier: 1 })
      .select()
      .single();
    if (error || !group) return { ok: false, message: error?.message ?? "Failed" };
    await supabase
      .from("group_members")
      .insert({ group_id: group.id, user_id: currentUserId });
    await this.loadForUser(currentUserId);
    return { ok: true, message: "Group created" };
  },

  async leave(groupId: string) {
    if (!currentUserId) return;
    await supabase
      .from("group_members")
      .delete()
      .eq("group_id", groupId)
      .eq("user_id", currentUserId);
    await this.loadForUser(currentUserId);
  },
};

export const useGroups = () =>
  useSyncExternalStore(groupsStore.subscribe, groupsStore.getState, groupsStore.getState);
