import React from 'npm:react@18.3.1';
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0';
import { Resend } from 'npm:resend@4.0.0';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import { VerificationEmail } from './_templates/verification-email.tsx';

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string);
const hookSecret = Deno.env.get('AUTH_EMAIL_HOOK_SECRET') as string;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const payload = await req.text();
    const headers = Object.fromEntries(req.headers);
    
    console.log('Received auth email webhook request');
    
    // Verify webhook signature if secret is set
    if (hookSecret) {
      const wh = new Webhook(hookSecret);
      try {
        wh.verify(payload, headers);
      } catch (error) {
        console.error('Webhook verification failed:', error);
        return new Response(
          JSON.stringify({ error: 'Invalid webhook signature' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    const data = JSON.parse(payload);
    const {
      user,
      email_data: { token, token_hash, redirect_to, email_action_type },
    } = data;

    console.log(`Processing ${email_action_type} email for user: ${user.email}`);

    // Build verification URL
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const verificationUrl = `${supabaseUrl}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`;

    // Render the email template
    const html = await renderAsync(
      React.createElement(VerificationEmail, {
        verificationUrl,
        userEmail: user.email,
      })
    );

    // Send email via Resend  
    const fromAddress = Deno.env.get('RESEND_FROM') || 'Lovable App <onboarding@resend.dev>';
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: fromAddress,
      to: [user.email],
      subject: email_action_type === 'signup' 
        ? '🎉 Welcome — Verify Your Email'
        : email_action_type === 'recovery'
        ? '🔐 Reset Your Password'
        : email_action_type === 'email_change'
        ? '📧 Confirm Your Email Change'
        : '✉️ Verify Your Email',
      html,
    });

    if (emailError) {
      console.error('Resend error:', emailError);
      throw emailError;
    }

    console.log('Email sent successfully:', emailData);

    return new Response(
      JSON.stringify({ success: true, emailId: emailData?.id }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in send-auth-email function:', error);
    return new Response(
      JSON.stringify({
        error: {
          message: error.message,
          code: error.code || 'UNKNOWN_ERROR',
        },
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
