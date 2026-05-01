-- Enable pgcrypto for gen_random_bytes
create extension if not exists pgcrypto;

create table if not exists saved_itineraries (
  id              uuid default gen_random_uuid() primary key,
  user_id         uuid references auth.users(id) on delete cascade not null,
  destination     text not null,
  country_code    text,
  travel_dates    jsonb not null,
  preferences     jsonb not null,
  itinerary_data  jsonb not null,
  public_token    text unique default encode(gen_random_bytes(16), 'hex') not null,
  created_at      timestamptz default now() not null,
  updated_at      timestamptz default now() not null
);

alter table saved_itineraries enable row level security;

-- Owner can read/write their own itineraries
create policy "owner_full_access" on saved_itineraries
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Anyone (including unauthenticated) can read by public_token
create policy "public_share_read" on saved_itineraries
  for select
  using (public_token is not null);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger saved_itineraries_updated_at
  before update on saved_itineraries
  for each row execute procedure update_updated_at();
