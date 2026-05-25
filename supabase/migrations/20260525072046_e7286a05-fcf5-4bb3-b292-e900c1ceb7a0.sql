
-- ============= ALARMS =============
CREATE TABLE public.alarms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label TEXT NOT NULL DEFAULT 'New Alarm',
  hour INT NOT NULL DEFAULT 8 CHECK (hour BETWEEN 0 AND 23),
  minute INT NOT NULL DEFAULT 0 CHECK (minute BETWEEN 0 AND 59),
  buffer INT NOT NULL DEFAULT 60,
  enabled BOOLEAN NOT NULL DEFAULT true,
  days TEXT[] NOT NULL DEFAULT '{}',
  sync_with TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.alarms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "alarms_select_own" ON public.alarms FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "alarms_insert_own" ON public.alarms FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "alarms_update_own" ON public.alarms FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "alarms_delete_own" ON public.alarms FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER alarms_updated_at BEFORE UPDATE ON public.alarms FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_alarms_user ON public.alarms(user_id);

-- ============= FRIENDSHIPS =============
CREATE TABLE public.friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  friend_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, friend_user_id),
  CHECK (user_id <> friend_user_id)
);
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "friendships_select_own" ON public.friendships FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = friend_user_id);
CREATE POLICY "friendships_insert_own" ON public.friendships FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "friendships_update_involving" ON public.friendships FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = friend_user_id);
CREATE POLICY "friendships_delete_own" ON public.friendships FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER friendships_updated_at BEFORE UPDATE ON public.friendships FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_friendships_user ON public.friendships(user_id);
CREATE INDEX idx_friendships_friend ON public.friendships(friend_user_id);

-- ============= STUDY GROUPS =============
CREATE TABLE public.study_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  subject TEXT,
  multiplier NUMERIC NOT NULL DEFAULT 1.0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.study_groups ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER study_groups_updated_at BEFORE UPDATE ON public.study_groups FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.study_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (group_id, user_id)
);
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_group_members_group ON public.group_members(group_id);
CREATE INDEX idx_group_members_user ON public.group_members(user_id);

-- Helper: is the given user a member of the given group? (security definer avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.is_group_member(_gid UUID, _uid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.group_members WHERE group_id = _gid AND user_id = _uid);
$$;

CREATE POLICY "study_groups_select_visible" ON public.study_groups FOR SELECT TO authenticated
  USING (owner_id = auth.uid() OR public.is_group_member(id, auth.uid()));
CREATE POLICY "study_groups_insert_owner" ON public.study_groups FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid());
CREATE POLICY "study_groups_update_owner" ON public.study_groups FOR UPDATE TO authenticated USING (owner_id = auth.uid());
CREATE POLICY "study_groups_delete_owner" ON public.study_groups FOR DELETE TO authenticated USING (owner_id = auth.uid());

CREATE POLICY "group_members_select_self_or_co_member" ON public.group_members FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_group_member(group_id, auth.uid()));
CREATE POLICY "group_members_insert_self" ON public.group_members FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "group_members_delete_self" ON public.group_members FOR DELETE TO authenticated USING (user_id = auth.uid());

-- ============= DAILY STATUS =============
CREATE TABLE public.user_daily_status (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_day INT NOT NULL DEFAULT 1 CHECK (reward_day BETWEEN 1 AND 7),
  last_reward_claim_date DATE,
  last_quest_reset_date DATE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.user_daily_status ENABLE ROW LEVEL SECURITY;
CREATE POLICY "uds_select_own" ON public.user_daily_status FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "uds_insert_own" ON public.user_daily_status FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "uds_update_own" ON public.user_daily_status FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER uds_updated_at BEFORE UPDATE ON public.user_daily_status FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============= QUEST PROGRESS =============
CREATE TABLE public.user_quest_progress (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quest_id TEXT NOT NULL,
  progress NUMERIC NOT NULL DEFAULT 0,
  claimed BOOLEAN NOT NULL DEFAULT false,
  reset_on DATE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, quest_id)
);
ALTER TABLE public.user_quest_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "uqp_select_own" ON public.user_quest_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "uqp_insert_own" ON public.user_quest_progress FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "uqp_update_own" ON public.user_quest_progress FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "uqp_delete_own" ON public.user_quest_progress FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER uqp_updated_at BEFORE UPDATE ON public.user_quest_progress FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============= EXTEND SIGNUP TRIGGER =============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, friend_code, current_streak, purchased_accessories)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    public.generate_friend_code(),
    0,
    '{}'::jsonb
  );
  INSERT INTO public.user_daily_status (user_id, reward_day)
  VALUES (NEW.id, 1)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Ensure the trigger is attached to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill daily status for existing profiles
INSERT INTO public.user_daily_status (user_id, reward_day)
SELECT id, 1 FROM public.profiles
ON CONFLICT (user_id) DO NOTHING;
