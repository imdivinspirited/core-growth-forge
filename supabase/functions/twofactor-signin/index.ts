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
    const { sessionToken, token, isRecoveryCode } = await req.json();

    if (!sessionToken || !token) {
      return new Response(
        JSON.stringify({ error: 'sessionToken and token are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get session
    const { data: session } = await supabase
      .from('user_sessions')
      .select('user_id')
      .eq('session_token', sessionToken)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (!session?.user_id) {
      return new Response(
        JSON.stringify({ error: 'Invalid session' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get 2FA settings
    const { data: settings } = await supabase
      .from('two_factor_settings')
      .select('id, secret, enabled')
      .eq('user_id', session.user_id)
      .maybeSingle();

    if (!settings?.enabled) {
      return new Response(
        JSON.stringify({ error: '2FA not enabled' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let isValid = false;

    if (isRecoveryCode) {
      // Verify recovery code
      const { data: recoveryCodes } = await supabase
        .from('two_factor_recovery_codes')
        .select('id, code_hash')
        .eq('user_id', session.user_id)
        .is('used_at', null);

      if (!recoveryCodes || recoveryCodes.length === 0) {
        return new Response(
          JSON.stringify({ error: 'No recovery codes available' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const tokenHash = await hash(token);
      const matchingCode = recoveryCodes.find(rc => rc.code_hash === tokenHash);

      if (matchingCode) {
        isValid = true;
        // Mark recovery code as used
        await supabase
          .from('two_factor_recovery_codes')
          .update({ used_at: new Date().toISOString() })
          .eq('id', matchingCode.id);
      }
    } else {
      // Verify TOTP
      isValid = authenticator.verify({ token, secret: settings.secret });
    }

    if (!isValid) {
      return new Response(
        JSON.stringify({ error: 'Invalid 2FA code' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update last verified
    await supabase
      .from('two_factor_settings')
      .update({ last_verified_at: new Date().toISOString() })
      .eq('id', settings.id);

    // Get user info
    const { data: user } = await supabase
      .from('custom_users')
      .select('id, mobile_number, country_code, full_name, is_verified, is_active')
      .eq('id', session.user_id)
      .single();

    return new Response(
      JSON.stringify({
        message: '2FA verified successfully',
        session: {
          token: sessionToken,
        },
        user: {
          id: user.id,
          mobileNumber: user.mobile_number,
          countryCode: user.country_code,
          fullName: user.full_name,
          isVerified: user.is_verified,
          isActive: user.is_active,
        },
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('twofactor-signin error', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
