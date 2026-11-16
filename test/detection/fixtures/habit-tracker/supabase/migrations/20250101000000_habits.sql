create table public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

alter table public.habits enable row level security;

create policy "Owners read their habits" on public.habits
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "Owners write their habits" on public.habits
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
