-- Supabase SQL Editor에서 실행

-- 1. sessions 테이블
create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  visitor_name text,
  page text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. messages 테이블
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  sender text not null check (sender in ('visitor', 'owner')),
  content text not null,
  created_at timestamptz default now()
);

-- 3. 인덱스
create index idx_messages_session_id on public.messages(session_id);
create index idx_messages_created_at on public.messages(created_at);
create index idx_sessions_is_active on public.sessions(is_active);

-- 4. RLS (Row Level Security)
alter table public.sessions enable row level security;
alter table public.messages enable row level security;

create policy "Anyone can create sessions"
  on public.sessions for insert
  to anon with check (true);

create policy "Anyone can read sessions"
  on public.sessions for select
  to anon using (true);

create policy "Anyone can read messages"
  on public.messages for select
  to anon using (true);

create policy "Service role can insert messages"
  on public.messages for insert
  to service_role with check (true);

-- 5. Realtime 활성화
alter publication supabase_realtime add table public.messages;

-- 6. updated_at 자동 갱신 트리거
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger sessions_updated_at
  before update on public.sessions
  for each row execute function update_updated_at();
