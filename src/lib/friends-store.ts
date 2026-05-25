import { useSyncExternalStore } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface FriendEntry {
  id: string; // friendship row id
  friendUserId: string;
  displayName: string;
  friendCode: string | null;
  status: "pending" | "accepted";
  incoming: boolean;
}

interface State {
  loading: boolean;
  friends: FriendEntry[];
}

let state: State = { loading: false, friends: [] };
let currentUserId: string | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const friendsStore = {
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
      state = { loading: false, friends: [] };
      emit();
      return;
    }
    state = { ...state, loading: true };
    emit();
    const { data: rows } = await supabase
      .from("friendships")
      .select("id, user_id, friend_user_id, status")
      .or(`user_id.eq.${userId},friend_user_id.eq.${userId}`);
    if (!rows) {
      state = { loading: false, friends: [] };
      emit();
      return;
    }
    const otherIds = Array.from(
      new Set(rows.map((r) => (r.user_id === userId ? r.friend_user_id : r.user_id))),
    );
    const profiles = otherIds.length
      ? (
          await supabase
            .from("profiles")
            .select("id, display_name, friend_code")
            .in("id", otherIds)
        ).data ?? []
      : [];
    const byId = new Map(profiles.map((p) => [p.id, p]));
    const friends: FriendEntry[] = rows.map((r) => {
      const otherId = r.user_id === userId ? r.friend_user_id : r.user_id;
      const p = byId.get(otherId);
      return {
        id: r.id,
        friendUserId: otherId,
        displayName: p?.display_name ?? "Friend",
        friendCode: p?.friend_code ?? null,
        status: r.status as "pending" | "accepted",
        incoming: r.friend_user_id === userId && r.status === "pending",
      };
    });
    state = { loading: false, friends };
    emit();
  },

  async addByCode(code: string): Promise<{ ok: boolean; message: string }> {
    if (!currentUserId) return { ok: false, message: "Not signed in" };
    const normalized = code.trim().toUpperCase();
    if (!normalized) return { ok: false, message: "Enter a code" };
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, display_name, friend_code")
      .eq("friend_code", normalized)
      .maybeSingle();
    if (!profile) return { ok: false, message: "No user with that code" };
    if (profile.id === currentUserId) return { ok: false, message: "That's your own code!" };
    const { error } = await supabase
      .from("friendships")
      .insert({ user_id: currentUserId, friend_user_id: profile.id, status: "pending" });
    if (error) {
      if (error.code === "23505") return { ok: false, message: "Already added" };
      return { ok: false, message: error.message };
    }
    await this.loadForUser(currentUserId);
    return { ok: true, message: `Request sent to ${profile.display_name ?? "friend"}` };
  },

  async accept(friendshipId: string) {
    await supabase.from("friendships").update({ status: "accepted" }).eq("id", friendshipId);
    if (currentUserId) await this.loadForUser(currentUserId);
  },

  async remove(friendshipId: string) {
    await supabase.from("friendships").delete().eq("id", friendshipId);
    if (currentUserId) await this.loadForUser(currentUserId);
  },
};

export const useFriends = () =>
  useSyncExternalStore(friendsStore.subscribe, friendsStore.getState, friendsStore.getState);
