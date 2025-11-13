import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';
import { authenticator } from 'npm:otplib@12.0.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionToken } = await req.json();
    if (!sessionToken) {
      return new Response(JSON.stringify({ error: 'sessionToken is required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Resolve session -> user
    const { data: session } = await supabase
      .from('user_sessions')
      .select('user_id')
      .eq('session_token', sessionToken)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (!session?.user_id) {
      return new Response(JSON.stringify({ error: 'Invalid session' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Generate new secret and store (enabled=false until verified)
    const secret = authenticator.generateSecret();

    const { data: existing } = await supabase
      .from('two_factor_settings')
      .select('id')
      .eq('user_id', session.user_id)
      .maybeSingle();

    if (existing) {
      await supabase.from('two_factor_settings').update({ secret, enabled: false }).eq('id', existing.id);
    } else {
      await supabase.from('two_factor_settings').insert({ user_id: session.user_id, secret, enabled: false });
    }

    // Build otpauth URL (label prefers email, fallback to mobile)
    const { data: user } = await supabase
      .from('custom_users')
      .select('email, mobile_number')
      .eq('id', session.user_id)
      .maybeSingle();

    const label = user?.email ?? (user?.mobile_number ? `+${user.mobile_number}` : 'user');
    const issuer = 'OvaBoe App';
    const otpauth = authenticator.keyuri(label, issuer, secret);

    return new Response(JSON.stringify({ otpauth }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error: any) {
    console.error('twofactor-generate error', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
