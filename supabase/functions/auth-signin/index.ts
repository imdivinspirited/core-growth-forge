import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function sendSMS(to: string, message: string) {
  const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
  const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
  const twilioPhone = Deno.env.get('TWILIO_PHONE_NUMBER');

  if (!accountSid || !authToken || !twilioPhone) {
    console.log('SMS not configured. OTP:', message);
    return { success: false, error: 'SMS service not configured' };
  }

  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: to,
          From: twilioPhone,
          Body: message,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Twilio error:', error);
      return { success: false, error: 'Failed to send SMS' };
    }

    return { success: true };
  } catch (error) {
    console.error('SMS sending error:', error);
    return { success: false, error: 'Failed to send SMS' };
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { mobileNumber, countryCode = '+1', password } = await req.json();

    if (!mobileNumber || !password) {
      return new Response(
        JSON.stringify({ error: 'Mobile number and password are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Rate limiting: max 5 OTPs per hour and 1 per 60 seconds per mobile for signin
    const ONE_HOUR_AGO = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count: hourCount } = await supabase
      .from('otp_codes')
      .select('id', { count: 'exact', head: true })
      .eq('mobile_number', mobileNumber)
      .eq('country_code', countryCode)
      .eq('otp_type', 'signin')
      .gte('created_at', ONE_HOUR_AGO);

    if ((hourCount || 0) >= 5) {
      return new Response(
        JSON.stringify({ error: 'Too many OTP requests. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: lastOtp } = await supabase
      .from('otp_codes')
      .select('created_at')
      .eq('mobile_number', mobileNumber)
      .eq('country_code', countryCode)
      .eq('otp_type', 'signin')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (lastOtp && new Date().getTime() - new Date(lastOtp.created_at).getTime() < 60 * 1000) {
      return new Response(
        JSON.stringify({ error: 'Please wait at least 60 seconds before requesting another OTP.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Hash password
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const passwordHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Find user
    const { data: user, error: userError } = await supabase
      .from('custom_users')
      .select('*')
      .eq('mobile_number', mobileNumber)
      .eq('country_code', countryCode)
      .eq('password_hash', passwordHash)
      .maybeSingle();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid mobile number or password' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!user.is_active) {
      return new Response(
        JSON.stringify({ error: 'Account is deactivated. Please contact support.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!user.is_verified) {
      return new Response(
        JSON.stringify({ 
          error: 'Mobile number not verified. Please complete signup verification first.',
          needsVerification: true,
          mobileNumber: user.mobile_number,
          countryCode: user.country_code
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate OTP for signin
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Store OTP
    const { error: otpError } = await supabase.from('otp_codes').insert({
      user_id: user.id,
      mobile_number: user.mobile_number,
      otp_code: otpCode,
      otp_type: 'signin',
      expires_at: expiresAt,
    });

    if (otpError) {
      console.error('Error creating OTP:', otpError);
      return new Response(
        JSON.stringify({ error: 'Failed to generate OTP' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send SMS
    const fullNumber = `${user.country_code}${user.mobile_number}`;
    const smsResult = await sendSMS(
      fullNumber,
      `Your login OTP is: ${otpCode}. Valid for 10 minutes.`
    );

    return new Response(
      JSON.stringify({
        message: smsResult.success 
          ? 'OTP sent to your mobile number' 
          : 'SMS service not configured. Please contact support.',
        mobileNumber: user.mobile_number,
        countryCode: user.country_code,
        requiresOtp: true,
        smsSent: smsResult.success,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in auth-signin:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});