create or replace function public.current_user_daycare_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select daycare_id
  from public.users
  where id = auth.uid()
$$;

drop policy "Users can read own profile or same daycare" on public.users;
drop policy "Users can insert own profile or same daycare" on public.users;

create policy "Users can read own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can insert own profile or same daycare"
  on public.users for insert
  with check (auth.uid() = id or daycare_id = public.current_user_daycare_id());