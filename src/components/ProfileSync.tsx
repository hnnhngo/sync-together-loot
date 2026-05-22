import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { profileStore } from "@/lib/profile-store";

/** Loads the current user's profile into the profile store whenever auth changes. */
const ProfileSync = () => {
  const { user } = useAuth();
  useEffect(() => {
    profileStore.loadForUser(user?.id ?? null);
  }, [user?.id]);
  return null;
};

export default ProfileSync;
