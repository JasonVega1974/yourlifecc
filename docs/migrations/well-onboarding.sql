-- ═══════════════════════════════════════════════════════════════
-- Well Onboarding (Phase 2A)
-- Adds well_onboarded flag to profiles — true once the 3-screen
-- intro overlay has been completed or skipped.
-- ═══════════════════════════════════════════════════════════════
--
-- Run this in the Supabase SQL editor (project: hrohgwcbfgywkpnvqxhk)
-- before deploying the init.js changes.
--
-- Reversibility:
--   alter table profiles drop column if exists well_onboarded;
-- ═══════════════════════════════════════════════════════════════

alter table profiles
  add column if not exists well_onboarded boolean default false;

-- ── Oct 30 2026 compliance note (added 2026-05-27) ──
-- This migration only adds COLUMNS to the existing `profiles` table —
-- no new tables are created. Data API exposure grants on `profiles`
-- already exist from its original migration; ALTER TABLE inherits
-- them. No GRANT statements are required here. See
-- docs/migrations/template.sql for the canonical pattern when a new
-- CREATE TABLE migration is needed.
