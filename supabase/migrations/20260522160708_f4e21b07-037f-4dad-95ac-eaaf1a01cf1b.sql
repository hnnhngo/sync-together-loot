
-- 1) Add columns
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS friend_code text,
  ADD COLUMN IF NOT EXISTS current_streak integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS purchased_accessories jsonb NOT NULL DEFAULT '{}'::jsonb;

-- Unique index for friend_code
CREATE UNIQUE INDEX IF NOT EXISTS profiles_friend_code_key
  ON public.profiles (friend_code)
  WHERE friend_code IS NOT NULL;

-- 2) Friend code generator
CREATE OR REPLACE FUNCTION public.generate_friend_code()
RETURNS text
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  alphabet text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  code text;
  i integer;
  attempts integer := 0;
BEGIN
  LOOP
    code := 'SYN-';
    FOR i IN 1..4 LOOP
      code := code || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
    END LOOP;
    code := code || '-';
    FOR i IN 1..4 LOOP
      code := code || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
    END LOOP;
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.profiles WHERE friend_code = code);
    attempts := attempts + 1;
    IF attempts > 12 THEN
      EXIT;
    END IF;
  END LOOP;
  RETURN code;
END;
$$;

-- 3) Update signup trigger function to include defaults + friend code
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
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
  RETURN NEW;
END;
$$;

-- Ensure trigger exists on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4) Backfill friend codes for any existing rows
UPDATE public.profiles
  SET friend_code = public.generate_friend_code()
  WHERE friend_code IS NULL;

-- 5) Tighten profiles SELECT policy so users only see their own profile
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.profiles;
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);
