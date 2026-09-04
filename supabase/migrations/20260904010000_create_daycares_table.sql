create table public.daycares (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.daycares enable row level security;

create policy "Admins can CRUD their own daycares"
  on public.daycares for all
  using (auth.uid() = created_by)
  with check (auth.uid() = created_by);

insert into public.daycares (name) values
  ('Guardería Sala Soles'),
  ('Guardería Los Pequeñitos'),
  ('Guardería Estrellitas'),
  ('Guardería Mi Jardín');
