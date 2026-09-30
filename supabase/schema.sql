create table stories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  story text not null,
  topic text,
  published boolean default true,
  created_at timestamptz default now()
);
alter table stories enable row level security;
create policy "public read" on stories for select using (published = true);

create table rate_limits (
  id bigint generated always as identity primary key,
  ip text not null,
  created_at timestamptz default now()
);
create index on rate_limits (ip, created_at);
alter table rate_limits enable row level security; -- no policies: service role only
