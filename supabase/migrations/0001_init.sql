-- Ostello del Convento di Sant'Antonio — schema iniziale.
-- RLS (da CLAUDE.md): lettura pubblica solo su rooms attive; insert pubblico
-- su booking_requests; tutto il resto solo per utenti autenticati (admin).

-- Enum -----------------------------------------------------------------------
create type room_type as enum ('dorm', 'private', 'accessible');
create type booking_status as enum ('pending', 'confirmed', 'declined');

-- Tabelle --------------------------------------------------------------------
create table rooms (
  id uuid primary key default gen_random_uuid(),
  name_it text not null,
  name_en text not null,
  description_it text not null default '',
  description_en text not null default '',
  type room_type not null default 'dorm',
  capacity int not null default 1 check (capacity > 0),
  beds int not null default 1 check (beds > 0),
  price_per_night numeric(10, 2) not null default 0 check (price_per_night >= 0),
  is_accessible boolean not null default false,
  images text[] not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table availability_blocks (
  id uuid primary key default gen_random_uuid(),
  -- room_id null = blocco generale (tutta la struttura)
  room_id uuid references rooms (id) on delete cascade,
  start_date date not null,
  end_date date not null,
  reason text,
  created_at timestamptz not null default now(),
  check (end_date >= start_date)
);

create table booking_requests (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references rooms (id) on delete set null,
  guest_name text not null,
  guest_email text not null,
  guest_phone text,
  check_in date not null,
  check_out date not null,
  num_guests int not null default 1 check (num_guests > 0),
  message text,
  status booking_status not null default 'pending',
  locale text not null default 'it',
  created_at timestamptz not null default now(),
  check (check_out > check_in)
);

create table site_settings (
  key text primary key,
  value text
);

-- Indici ---------------------------------------------------------------------
create index rooms_active_idx on rooms (is_active);
create index availability_room_idx on availability_blocks (room_id);
create index booking_status_idx on booking_requests (status);

-- Row Level Security ---------------------------------------------------------
alter table rooms enable row level security;
alter table availability_blocks enable row level security;
alter table booking_requests enable row level security;
alter table site_settings enable row level security;

-- rooms: chiunque legge solo le attive; admin (authenticated) gestisce tutto.
create policy "rooms_public_read_active" on rooms
  for select using (is_active = true);
create policy "rooms_admin_all" on rooms
  for all to authenticated using (true) with check (true);

-- booking_requests: insert pubblico; lettura/gestione solo admin.
create policy "booking_public_insert" on booking_requests
  for insert to anon, authenticated with check (true);
create policy "booking_admin_read" on booking_requests
  for select to authenticated using (true);
create policy "booking_admin_update" on booking_requests
  for update to authenticated using (true) with check (true);
create policy "booking_admin_delete" on booking_requests
  for delete to authenticated using (true);

-- availability_blocks: solo admin (la disponibilità pubblica si calcola lato
-- server con la service_role). Nessun accesso anon.
create policy "availability_admin_all" on availability_blocks
  for all to authenticated using (true) with check (true);

-- site_settings: solo admin (letto lato server dove serve).
create policy "settings_admin_all" on site_settings
  for all to authenticated using (true) with check (true);
