/**
 * API: GET /api/dashboard - Returns dashboard data (achievements, stats, activity)
 * 
 * Concept: Dashboard Data Aggregation - Combining multiple data sources
 * Concept: Edge Function - Serverless function for data aggregation
 * Concept: Performance Optimization - Parallel data fetching
 * 
 * This endpoint demonstrates:
 * - Efficient parallel data fetching with Promise.all
 * - Data transformation for frontend consumption
 * - Caching considerations for dashboard data
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

// Concept: CORS Configuration - Allowing cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

/**
 * Verify session and extract user
 * Concept: DRY Principle - Reusable authentication function
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

  return { user: session.custom_users, error: null };
}

/**
 * Get recent achievements/badges
 * Concept: Gamification - User engagement through achievements
 */
async function getRecentAchievements(userId: string, supabase: any) {
  const { data } = await supabase
    .from('user_badges')
    .select('*')
    .eq('user_id', userId)
    .order('earned_at', { ascending: false })
    .limit(5);

  return data || [];
}

/**
 * Get learning progress overview
 * Concept: Progress Tracking - User learning journey data
 */
async function getLearningProgress(userId: string, supabase: any) {
  const { data: progress } = await supabase
    .from('user_progress')
    .select(`
      *,
      courses (
        id,
        title,
        category,
        total_lessons
      )
    `)
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(10);

  return progress || [];
}

/**
 * Get activity timeline
 * Concept: Activity Feed - Chronological user actions
 */
async function getActivityTimeline(userId: string, supabase: any) {
  // Combine different activity types
  const [blogs, bookmarks, courseProgress] = await Promise.all([
    // Recent blog posts
    supabase
      .from('blogs')
      .select('id, title, created_at')
      .eq('author_id', userId)
      .order('created_at', { ascending: false })
      .limit(5),
    
    // Recent bookmarks
    supabase
      .from('bookmarks')
      .select('id, created_at, blogs(title)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5),
    
    // Recent course progress
    supabase
      .from('user_progress')
      .select('id, completed, updated_at, courses(title)')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(5),
  ]);

  // Transform into unified activity format
  // Concept: Data Normalization - Consistent data structure
  const activities = [
    ...(blogs.data || []).map((b: any) => ({
      type: 'blog_post',
      title: `Published: ${b.title}`,
      timestamp: b.created_at,
    })),
    ...(bookmarks.data || []).map((b: any) => ({
      type: 'bookmark',
      title: `Bookmarked: ${b.blogs?.title || 'Article'}`,
      timestamp: b.created_at,
    })),
    ...(courseProgress.data || []).map((p: any) => ({
      type: p.completed ? 'course_completed' : 'course_progress',
      title: p.completed 
        ? `Completed: ${p.courses?.title || 'Course'}`
        : `Progress: ${p.courses?.title || 'Course'}`,
      timestamp: p.updated_at,
    })),
  ];

  // Sort by timestamp
  return activities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);
}

/**
 * Get AI recommendations for user
 * Concept: Personalization - AI-driven content suggestions
 */
async function getRecommendations(userId: string, supabase: any) {
  const { data } = await supabase
    .from('ai_recommendations')
    .select('*')
    .eq('user_id', userId)
    .order('confidence_score', { ascending: false })
    .limit(5);

  return data || [];
}

/**
 * Calculate overall statistics
 * Concept: Metrics Dashboard - Key performance indicators
 */
async function getOverallStats(userId: string, supabase: any) {
  const [
    { count: totalCourses },
    { count: completedCourses },
    { count: totalBadges },
    { count: totalBlogs },
    { count: totalBookmarks },
  ] = await Promise.all([
    supabase.from('user_progress').select('*', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('user_progress').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('completed', true),
    supabase.from('user_badges').select('*', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('blogs').select('*', { count: 'exact', head: true }).eq('author_id', userId),
    supabase.from('bookmarks').select('*', { count: 'exact', head: true }).eq('user_id', userId),
  ]);

  // Calculate completion rate
  const completionRate = totalCourses > 0 
    ? Math.round((completedCourses / totalCourses) * 100) 
    : 0;

  return {
    totalCourses: totalCourses || 0,
    completedCourses: completedCourses || 0,
    completionRate,
    totalBadges: totalBadges || 0,
    totalBlogs: totalBlogs || 0,
    totalBookmarks: totalBookmarks || 0,
    // Mock streak data - could be calculated from activity logs
    currentStreak: 7,
    longestStreak: 21,
  };
}

/**
 * Main request handler
 * Concept: Request Handler Pattern - Processing HTTP requests
 */
Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Initialize Supabase with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify authorization
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
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

    // Fetch all dashboard data in parallel
    // Concept: Promise.all - Parallel async operations for performance
    const [achievements, learningProgress, activity, recommendations, stats] = await Promise.all([
      getRecentAchievements(user.id, supabase),
      getLearningProgress(user.id, supabase),
      getActivityTimeline(user.id, supabase),
      getRecommendations(user.id, supabase),
      getOverallStats(user.id, supabase),
    ]);

    // Return aggregated dashboard data
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          user: {
            id: user.id,
            fullName: user.full_name,
            email: user.email,
          },
          stats,
          achievements,
          learningProgress,
          activity,
          recommendations,
          // Metadata
          generatedAt: new Date().toISOString(),
        },
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Dashboard API error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
