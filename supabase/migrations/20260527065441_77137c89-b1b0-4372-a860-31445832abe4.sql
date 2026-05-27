
-- 1) Add new columns to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS coins integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS has_completed_tutorial boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS wins integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS level integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS score integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tasks_done integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS study_hours numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS crew_rank integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS nudges_sent integer NOT NULL DEFAULT 0;

-- 2) Unique index on friend_code (case-insensitive) for safe lookups
CREATE UNIQUE INDEX IF NOT EXISTS profiles_friend_code_unique_ci
  ON public.profiles (lower(friend_code));

-- 3) Allow authenticated users to read minimal profile rows (needed for friend-code lookup
--    and to render friends' display names). All sensitive mutation is still restricted
--    by the existing UPDATE/INSERT/DELETE policies (auth.uid() = id).
DROP POLICY IF EXISTS "Authenticated can view profiles for friend lookup" ON public.profiles;
CREATE POLICY "Authenticated can view profiles for friend lookup"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- 4) RPC: finish tutorial atomically -> mark flag + grant beginner 500 coins (idempotent)
CREATE OR REPLACE FUNCTION public.complete_tutorial()
RETURNS TABLE (coins integer, has_completed_tutorial boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  UPDATE public.profiles
     SET has_completed_tutorial = true,
         coins = coins + CASE WHEN has_completed_tutorial THEN 0 ELSE 500 END,
         updated_at = now()
   WHERE id = uid;

  RETURN QUERY
    SELECT p.coins, p.has_completed_tutorial
      FROM public.profiles p
     WHERE p.id = uid;
END;
$$;

REVOKE ALL ON FUNCTION public.complete_tutorial() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.complete_tutorial() TO authenticated;

-- 5) Update handle_new_user to also seed defaults explicitly (defensive)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, email, display_name, friend_code,
    current_streak, purchased_accessories,
    coins, has_completed_tutorial,
    wins, level, score, tasks_done, study_hours, crew_rank, nudges_sent
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    public.generate_friend_code(),
    0,
    '{}'::jsonb,
    0, false,
    0, 1, 0, 0, 0, 0, 0
  );

  INSERT INTO public.user_daily_status (user_id, reward_day)
  VALUES (NEW.id, 1)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;
