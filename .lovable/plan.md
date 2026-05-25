
## Goal

Move all remaining per-user data into Supabase with RLS, fix daily reward progression to require manual claim, and reset daily quests every 24h regardless of claim status.

## Database (single migration)

New tables, all with `user_id uuid references auth.users on delete cascade`, RLS on, policies `auth.uid() = user_id` for select/insert/update/delete:

- **`alarms`** — `id`, `user_id`, `label`, `hour`, `minute`, `buffer`, `enabled`, `days text[]`, `sync_with`, timestamps. Replaces the in-memory list on AlarmPage.
- **`friendships`** — `id`, `user_id` (owner), `friend_user_id`, `status` (`pending`/`accepted`), timestamps; unique on (user_id, friend_user_id). "Add by code" looks up profile by `friend_code` and inserts a row.
- **`study_groups`** — `id`, `owner_id`, `name`, `subject`, `multiplier`, timestamps.
- **`group_members`** — `id`, `group_id`, `user_id`, `joined_at`; unique on (group_id, user_id). Member visibility allowed only if `user_id = auth.uid()` OR group has another row where the auth user is a member (use SECURITY DEFINER `is_group_member(_gid, _uid)` to avoid recursion).
- **`user_daily_status`** — one row per user: `user_id pk`, `reward_day int default 1`, `last_reward_claim_date date`, `last_quest_reset_date date`. Trigger on `auth.users` insert (extend `handle_new_user`) seeds this row.

## Daily Reward logic (HomePage + new `daily-reward-store`)

- Read `reward_day` and `last_reward_claim_date` from `user_daily_status`.
- `canClaim = last_reward_claim_date !== today`.
- On claim: grant `dailyRewards[reward_day - 1].coins`, then `reward_day = (reward_day % 7) + 1`, `last_reward_claim_date = today`. **No auto-advance** if the user skips a day — `reward_day` stays put.
- UI: highlight `dailyRewards[reward_day - 1]` as the current day; days before it shown as claimed only if they were claimed in this cycle (use a simple visual: current = highlighted, others = neutral).

## Daily Quests (rewrite `quests-store` to be account-scoped)

- New table **`user_quest_progress`** (`user_id`, `quest_id`, `progress`, `claimed`, `reset_on date`, pk on `(user_id, quest_id)`).
- On store load for a user: if `last_quest_reset_date < today`, delete (or reset) all rows where the matching quest is `daily`, then update `last_quest_reset_date = today`. Permanent quests retained.
- All `bump`/`claim` calls write to DB (debounced upsert).
- Counters (`studyHours`, etc.) stay in-memory for the session; only quest progress/claim state persists.

## Pages

- **AlarmPage** — replace `useState(initialAlarms)` with a `useAlarms()` hook that loads from `alarms` table on mount and writes through on add/toggle/edit/delete. Show empty state when none.
- **CrewPage** — keep the existing hardcoded demo `friends` list visible (so the UI isn't empty for new accounts) but layer real data on top: load accepted `friendships` joined to `profiles`, append to the list. "Add by code" performs the real lookup + insert. Groups tab loads the user's `group_members` joined to `study_groups`; "Create Study Group" inserts a new row with the current user as owner+member. Invites/requests UI kept but wired to `friendships.status`.
- **HomePage** — daily reward block reads from the new store; claim button calls it.

## Files

Create:
- `supabase/migrations/<new>.sql`
- `src/lib/alarms-store.ts`
- `src/lib/daily-reward-store.ts`
- `src/lib/friends-store.ts`
- `src/lib/groups-store.ts`

Edit:
- `src/components/ProfileSync.tsx` — also kick off alarms/friends/groups/daily/quests loaders when user changes.
- `src/lib/quests-store.ts` — DB-backed per-user persistence + 24h reset.
- `src/pages/AlarmPage.tsx`, `src/pages/CrewPage.tsx`, `src/pages/HomePage.tsx`.

## Scope notes

- Friends/Groups: the hardcoded demo blobs (Alex, Jordan, Math Squad, etc.) are kept as visual seed content so existing users don't see an empty crew on first login; only real DB-backed friends/groups are persistent. Tell me if you'd rather wipe the demo data entirely.
- No realtime subscriptions — data is fetched on mount and updated optimistically.

Confirm and I'll build it.
