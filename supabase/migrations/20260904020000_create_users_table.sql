create type public.user_role as enum ('staff', 'parent', 'admin');
create type public.user_status as enum ('pending', 'active');

create table public.users (
  id         uuid primary key references auth.users(id) on delete cascade,
  daycare_id uuid references public.daycares(id),
  role       public.user_role not null,
  status     public.user_status not null default 'active',
  full_name  text not null,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.users enable row level security;

create policy "Users can read own profile or same daycare"
  on public.users for select
  using (auth.uid() = id or daycare_id in (
    select daycare_id from public.users where id = auth.uid()
  ));

create policy "Users can insert own profile or same daycare"
  on public.users for insert
  with check (auth.uid() = id or daycare_id in (
    select daycare_id from public.users where id = auth.uid()
  ));

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

create policy "Users can delete own profile"
  on public.users for delete
  using (auth.uid() = id);