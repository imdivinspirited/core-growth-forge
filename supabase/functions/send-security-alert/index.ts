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
    const { userId, ipAddress, userAgent, alertType } = await req.json();

    if (!userId || !alertType) {
      return new Response(
        JSON.stringify({ error: 'userId and alertType are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user email
    const { data: user } = await supabase
      .from('custom_users')
      .select('email, full_name, mobile_number')
      .eq('id', userId)
      .maybeSingle();

    if (!user?.email) {
      console.log('No email found for user, skipping alert');
      return new Response(
        JSON.stringify({ message: 'No email configured' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!resendApiKey) {
      console.log('Resend not configured, skipping email alert');
      return new Response(
        JSON.stringify({ message: 'Email service not configured' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build email content based on alert type
    let subject = '';
    let htmlContent = '';
    const timestamp = new Date().toLocaleString('en-US', { 
      dateStyle: 'full', 
      timeStyle: 'long' 
    });

    switch (alertType) {
      case 'new_device_signin':
        subject = 'New Device Sign-in Detected';
        htmlContent = `
          <h2>New Device Sign-in</h2>
          <p>Hello${user.full_name ? ' ' + user.full_name : ''},</p>
          <p>We detected a sign-in to your account from a new device or location.</p>
          <h3>Sign-in Details:</h3>
          <ul>
            <li><strong>Time:</strong> ${timestamp}</li>
            <li><strong>IP Address:</strong> ${ipAddress || 'Unknown'}</li>
            <li><strong>Device:</strong> ${userAgent || 'Unknown'}</li>
          </ul>
          <p>If this was you, no action is needed. If you don't recognize this activity, please:</p>
          <ol>
            <li>Change your password immediately</li>
            <li>Enable two-factor authentication</li>
            <li>Review your recent account activity</li>
          </ol>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            This is an automated security alert from OvaBoe App.
          </p>
        `;
        break;

      case 'password_changed':
        subject = 'Your Password Was Changed';
        htmlContent = `
          <h2>Password Changed</h2>
          <p>Hello${user.full_name ? ' ' + user.full_name : ''},</p>
          <p>Your password was successfully changed.</p>
          <h3>Change Details:</h3>
          <ul>
            <li><strong>Time:</strong> ${timestamp}</li>
            <li><strong>IP Address:</strong> ${ipAddress || 'Unknown'}</li>
          </ul>
          <p>If you didn't make this change, please contact support immediately.</p>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            This is an automated security alert from OvaBoe App.
          </p>
        `;
        break;

      case '2fa_enabled':
        subject = 'Two-Factor Authentication Enabled';
        htmlContent = `
          <h2>Two-Factor Authentication Enabled</h2>
          <p>Hello${user.full_name ? ' ' + user.full_name : ''},</p>
          <p>Two-factor authentication has been successfully enabled on your account.</p>
          <h3>Activation Details:</h3>
          <ul>
            <li><strong>Time:</strong> ${timestamp}</li>
            <li><strong>IP Address:</strong> ${ipAddress || 'Unknown'}</li>
          </ul>
          <p>Your account is now more secure. Keep your recovery codes in a safe place.</p>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            This is an automated security alert from OvaBoe App.
          </p>
        `;
        break;

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid alert type' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    // Send email via Resend
    const { Resend } = await import('npm:resend@4.0.0');
    const resend = new Resend(resendApiKey);

    const { error: emailError } = await resend.emails.send({
      from: 'Security Alert <security@resend.dev>',
      to: [user.email],
      subject,
      html: htmlContent,
    });

    if (emailError) {
      console.error('Failed to send security alert:', emailError);
      return new Response(
        JSON.stringify({ error: 'Failed to send email' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Security alert sent to ${user.email}: ${alertType}`);

    return new Response(
      JSON.stringify({ message: 'Security alert sent successfully' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in send-security-alert:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
