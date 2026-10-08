-- ============================================================
-- CodelyDev — 0002_cover_image.sql
-- Run AFTER 0001_posts.sql in the Supabase SQL Editor.
-- Adds an optional custom (uploaded) cover image per post.
-- ============================================================

alter table public.posts
  add column if not exists cover_image text;
