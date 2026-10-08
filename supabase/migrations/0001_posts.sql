-- ============================================================
-- CodelyDev — 0001_posts.sql
-- Posts table, admin gate and row-level security.
--
-- RUN ONCE (Supabase Dashboard → SQL Editor → New query → Run):
--   1. Run this file.
--   2. Authentication → Users → "Add user" (email + password).
--      This is your site admin — sign-up is disabled on /admin/login.
--   3. Copy the new user's UUID and run:
--        insert into public.admins (user_id) values ('<PASTE-UUID>');
--   4. Run supabase/seed.sql to import the starter posts.
-- ============================================================

create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- Posts
-- ------------------------------------------------------------
create table if not exists public.posts (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  title       text not null,
  excerpt     text not null default '',
  content     text not null default '',      -- markdown body (no frontmatter)
  tags        text[] not null default '{}',
  author      text not null default 'CodelyDev Team',
  cover       text not null default 'navy',  -- one of: cyan teal navy ocean glacier mint
  featured    boolean not null default false,
  published   boolean not null default false,
  date        date not null default current_date,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists posts_published_date_idx
  on public.posts (published desc, date desc);

create index if not exists posts_tags_idx
  on public.posts using gin (tags);

-- ------------------------------------------------------------
-- Admin gate — only rows in this table may write posts
-- ------------------------------------------------------------
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins a where a.user_id = auth.uid()
  );
$$;

-- ------------------------------------------------------------
-- updated_at maintenance
-- ------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_touch on public.posts;
create trigger posts_touch
  before update on public.posts
  for each row execute function public.touch_updated_at();

-- ------------------------------------------------------------
-- Row level security
-- ------------------------------------------------------------
alter table public.posts enable row level security;
alter table public.admins enable row level security;

drop policy if exists "posts_select_published" on public.posts;
-- Everyone (anon included) can read published posts; admins also read drafts.
create policy "posts_select_published"
  on public.posts for select
  to anon, authenticated
  using (published or public.is_admin());

drop policy if exists "posts_insert_admin" on public.posts;
create policy "posts_insert_admin"
  on public.posts for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "posts_update_admin" on public.posts;
create policy "posts_update_admin"
  on public.posts for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "posts_delete_admin" on public.posts;
create policy "posts_delete_admin"
  on public.posts for delete
  to authenticated
  using (public.is_admin());

-- Admins can see their own row (nothing sensitive, keeps is_admin usable client-side).
drop policy if exists "admins_select_self" on public.admins;
create policy "admins_select_self"
  on public.admins for select
  to authenticated
  using (user_id = auth.uid());
