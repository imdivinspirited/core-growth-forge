import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { mobileNumber, countryCode = '+1', otpCode, newPassword } = await req.json();

    if (!mobileNumber || !otpCode || !newPassword) {
      return new Response(
        JSON.stringify({ error: 'Mobile number, OTP code, and new password are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (newPassword.length < 8) {
      return new Response(
        JSON.stringify({ error: 'Password must be at least 8 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Optional: get user email for notification
    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    // Find valid OTP
    const { data: otpRecord, error: otpError } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('mobile_number', mobileNumber)
      .eq('otp_code', otpCode)
      .eq('otp_type', 'password_reset')
      .is('used_at', null)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (otpError || !otpRecord) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired OTP code' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Mark OTP as used
    await supabase
      .from('otp_codes')
      .update({ used_at: new Date().toISOString() })
      .eq('id', otpRecord.id);

    // Hash new password
    const encoder = new TextEncoder();
    const data = encoder.encode(newPassword);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const passwordHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Update password
    const { error: updateError } = await supabase
      .from('custom_users')
      .update({ 
        password_hash: passwordHash,
        updated_at: new Date().toISOString()
      })
      .eq('id', otpRecord.user_id);

    if (updateError) {
      console.error('Error updating password:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update password' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Invalidate all existing sessions for security
    await supabase
      .from('user_sessions')
      .delete()
      .eq('user_id', otpRecord.user_id);

    // Send security email notification if email available
    if (resendApiKey) {
      const { data: userData } = await supabase
        .from('custom_users')
        .select('email, full_name')
        .eq('id', otpRecord.user_id)
        .maybeSingle();

      if (userData?.email) {
        try {
          const { Resend } = await import('npm:resend@4.0.0');
          const resend = new Resend(resendApiKey);
          await resend.emails.send({
            from: 'Security <no-reply@resend.dev>',
            to: [userData.email],
            subject: 'Your password was changed',
            html: `<p>Hello${userData.full_name ? ' ' + userData.full_name : ''},</p>
                   <p>Your password was just changed. If this wasn't you, please reset your password immediately and contact support.</p>
                   <p>Time: ${new Date().toISOString()}</p>`
          });
        } catch (e) {
          console.error('Failed to send security email', e);
        }
      }
    }

    return new Response(
      JSON.stringify({
        message: 'Password reset successfully. Please sign in with your new password.',
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in auth-reset-password:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
