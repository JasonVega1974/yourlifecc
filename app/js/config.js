/* =============================================================
   config.js — Supabase config, global state vars
============================================================= */

// ── SUPABASE CONFIG ───────────────────────────────────────────
const SUPA_URL = 'https://hrohgwcbfgywkpnvqxhk.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhyb2hnd2NiZmd5d2twbnZxeGhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MjcxNDYsImV4cCI6MjA4ODQwMzE0Nn0.PuWtBpiMw2DiCLp26ZP_Rd9BwzFvWT0sNZrDUNdULyo';

let _supa = null;
let _supaUser = null;

function getSupabase(){
  if(!_supa && window.supabase){
    _supa = window.supabase.createClient(SUPA_URL, SUPA_KEY);
  }
  return _supa;
}
