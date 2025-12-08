/**
 * API: GET /api/me - Returns current user profile & preferences
 * API: PATCH /api/me - Update user data
 * 
 * Concept: Edge Function - Serverless function running at the edge
 * Concept: JWT Verification - Secure token-based authentication
 * Concept: RESTful API Design - Proper HTTP methods and status codes
 * 
 * This endpoint demonstrates:
 * - Clean controller/service pattern in serverless
 * - Proper error handling with meaningful messages
 * - Token verification middleware pattern
 * - Role-based access control preparation
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

// Concept: CORS Headers - Cross-Origin Resource Sharing for browser security
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, PATCH, OPTIONS',
};

/**
 * Verify session token and return user
 * Concept: Middleware Pattern - Reusable authentication logic
 */
async function verifySession(sessionToken: string, supabase: any) {
  const { data: session, error } = await supabase
    .from('user_sessions')
    .select('*, custom_users(*)')
    .eq('session_token', sessionToken)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle();

  if (error || !session) {
    return { user: null, error: 'Invalid or expired session' };
  }

  // Update last activity timestamp
  // Concept: Session Activity Tracking - Security best practice
  await supabase
    .from('user_sessions')
    .update({ last_activity_at: new Date().toISOString() })
    .eq('id', session.id);

  return { user: session.custom_users, session, error: null };
}

/**
 * Get user preferences from profile
 * Concept: Data Aggregation - Combining data from multiple tables
 */
async function getUserPreferences(userId: string, supabase: any) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('theme_preference, language_preference, privacy_profile')
    .eq('user_id', userId)
    .maybeSingle();

  return profile || {
    theme_preference: 'system',
    language_preference: 'en',
    privacy_profile: 'public',
  };
}

/**
 * Get user roles
 * Concept: Role-Based Access Control (RBAC) - Authorization pattern
 */
async function getUserRoles(userId: string, supabase: any) {
  const { data: roles } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId);

  return roles?.map((r: any) => r.role) || ['user'];
}

/**
 * Get user statistics for dashboard
 * Concept: Aggregated Metrics - Computing user activity stats
 */
async function getUserStats(userId: string, supabase: any) {
  // Get course progress count
  const { count: coursesInProgress } = await supabase
    .from('user_progress')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('completed', false);

  // Get completed courses count
  const { count: coursesCompleted } = await supabase
    .from('user_progress')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('completed', true);

  // Get badges count
  const { count: badgesEarned } = await supabase
    .from('user_badges')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  // Get blog posts count
  const { count: blogPosts } = await supabase
    .from('blogs')
    .select('*', { count: 'exact', head: true })
    .eq('author_id', userId);

  return {
    coursesInProgress: coursesInProgress || 0,
    coursesCompleted: coursesCompleted || 0,
    badgesEarned: badgesEarned || 0,
    blogPosts: blogPosts || 0,
  };
}

/**
 * Main request handler
 * Concept: Request Router - Handling different HTTP methods
 */
Deno.serve(async (req) => {
  // Handle preflight CORS requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role for admin access
    // Concept: Service Role Key - Full database access for server operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Extract session token from Authorization header
    // Concept: Bearer Token Authentication - Standard auth header pattern
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const sessionToken = authHeader.replace('Bearer ', '');
    const { user, error: authError } = await verifySession(sessionToken, supabase);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: authError || 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle GET request - Return user profile
    if (req.method === 'GET') {
      const [preferences, roles, stats] = await Promise.all([
        getUserPreferences(user.id, supabase),
        getUserRoles(user.id, supabase),
        getUserStats(user.id, supabase),
      ]);

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            user: {
              id: user.id,
              email: user.email,
              fullName: user.full_name,
              mobileNumber: user.mobile_number,
              countryCode: user.country_code,
              isVerified: user.is_verified,
              isActive: user.is_active,
              createdAt: user.created_at,
              lastLoginAt: user.last_login_at,
            },
            preferences,
            roles,
            stats,
          },
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle PATCH request - Update user data
    if (req.method === 'PATCH') {
      const body = await req.json();
      const { fullName, preferences: newPreferences } = body;

      // Update user profile
      if (fullName !== undefined) {
        await supabase
          .from('custom_users')
          .update({ full_name: fullName, updated_at: new Date().toISOString() })
          .eq('id', user.id);
      }

      // Update preferences in profiles table
      if (newPreferences) {
        const { theme_preference, language_preference, privacy_profile } = newPreferences;
        const profileUpdates: any = {};
        
        if (theme_preference) profileUpdates.theme_preference = theme_preference;
        if (language_preference) profileUpdates.language_preference = language_preference;
        if (privacy_profile) profileUpdates.privacy_profile = privacy_profile;

        if (Object.keys(profileUpdates).length > 0) {
          // Upsert profile if it doesn't exist
          await supabase
            .from('profiles')
            .upsert({
              user_id: user.id,
              ...profileUpdates,
              updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id' });
        }
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Profile updated successfully' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Method not allowed
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('API /me error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
