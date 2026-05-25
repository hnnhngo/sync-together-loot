import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { profileStore } from "@/lib/profile-store";
import { alarmsStore } from "@/lib/alarms-store";
import { dailyRewardStore } from "@/lib/daily-reward-store";
import { friendsStore } from "@/lib/friends-store";
import { groupsStore } from "@/lib/groups-store";
import { questsStore } from "@/lib/quests-store";

/** Loads all per-user stores whenever auth changes. */
const ProfileSync = () => {
  const { user } = useAuth();
  useEffect(() => {
    const uid = user?.id ?? null;
    profileStore.loadForUser(uid);
    alarmsStore.loadForUser(uid);
    dailyRewardStore.loadForUser(uid);
    friendsStore.loadForUser(uid);
    groupsStore.loadForUser(uid);
    questsStore.loadForUser(uid);
  }, [user?.id]);
  return null;
};

export default ProfileSync;
