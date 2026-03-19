import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify the user is authenticated
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body
    const { birth_year } = await req.json()

    // Validate birth_year is a number
    if (!birth_year || typeof birth_year !== 'number') {
      return new Response(
        JSON.stringify({ valid: false, error: 'Invalid birth year provided.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Server-side age calculation — cannot be spoofed
    const currentYear = new Date().getFullYear()
    const age = currentYear - birth_year

    // Sanity check — birth year must be realistic
    if (birth_year < 1920 || birth_year > currentYear) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Invalid birth year.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (age < 18) {
      return new Response(
        JSON.stringify({ valid: false, error: 'You must be 18 or older to create an account.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Age check passed — optionally store verification in user metadata
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user from JWT
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)

    if (userError || !user) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Could not verify user session.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Log verification (optional audit record)
    await supabase.from('age_verifications').upsert({
      user_id: user.id,
      birth_year,
      verified_at: new Date().toISOString(),
      ip_hash: null // add hashed IP here if needed for audit
    }).select()

    return new Response(
      JSON.stringify({ valid: true, age }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (err) {
    return new Response(
      JSON.stringify({ valid: false, error: 'Server error. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
