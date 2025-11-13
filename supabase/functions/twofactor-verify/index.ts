import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';
import { authenticator } from 'npm:otplib@12.0.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function hash(text: string) {
  const encoder = new TextEncoder();
  return crypto.subtle.digest('SHA-256', encoder.encode(text)).then(buf =>
    Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
  );
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionToken, token } = await req.json();
    if (!sessionToken || !token) {
      return new Response(JSON.stringify({ error: 'sessionToken and token are required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: session } = await supabase
      .from('user_sessions')
      .select('user_id')
      .eq('session_token', sessionToken)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (!session?.user_id) {
      return new Response(JSON.stringify({ error: 'Invalid session' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { data: settings } = await supabase
      .from('two_factor_settings')
      .select('id, secret')
      .eq('user_id', session.user_id)
      .maybeSingle();

    if (!settings?.secret) {
      return new Response(JSON.stringify({ error: '2FA not initialized' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const isValid = authenticator.verify({ token, secret: settings.secret });
    if (!isValid) {
      return new Response(JSON.stringify({ error: 'Invalid 2FA code' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Enable and generate 10 recovery codes
    await supabase
      .from('two_factor_settings')
      .update({ enabled: true, last_verified_at: new Date().toISOString() })
      .eq('id', settings.id);

    const codes: string[] = [];
    for (let i = 0; i < 10; i++) {
      const code = crypto.randomUUID().replace(/-/g, '').slice(0, 10).toUpperCase();
      codes.push(code);
    }

    const hashed = await Promise.all(codes.map(c => hash(c)));
    await supabase.from('two_factor_recovery_codes').delete().eq('user_id', session.user_id);
    await supabase.from('two_factor_recovery_codes').insert(
      hashed.map(h => ({ user_id: session.user_id, code_hash: h }))
    );

    return new Response(JSON.stringify({ recoveryCodes: codes }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error: any) {
    console.error('twofactor-verify error', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
