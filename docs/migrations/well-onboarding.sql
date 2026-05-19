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
