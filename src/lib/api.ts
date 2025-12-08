/**
 * API Client Module
 * 
 * Concept: API Abstraction Layer - Centralized HTTP request handling
 * Concept: Singleton Pattern - Single instance for consistent behavior
 * Concept: Error Handling - Standardized error responses
 * 
 * This module provides:
 * - Type-safe API calls with TypeScript generics
 * - Automatic token injection for authenticated requests
 * - Consistent error handling and response parsing
 * - Request/response logging for debugging
 */

import { supabase } from '@/integrations/supabase/client';

// API Response Types
// Concept: TypeScript Generics - Reusable type definitions
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface UserProfile {
  id: string;
  email: string | null;
  fullName: string | null;
  mobileNumber: string | null;
  countryCode: string | null;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
}

interface UserPreferences {
  theme_preference: string;
  language_preference: string;
  privacy_profile: string;
}

interface UserStats {
  coursesInProgress: number;
  coursesCompleted: number;
  badgesEarned: number;
  blogPosts: number;
}

interface MeResponse {
  user: UserProfile;
  preferences: UserPreferences;
  roles: string[];
  stats: UserStats;
}

interface DashboardStats {
  totalCourses: number;
  completedCourses: number;
  completionRate: number;
  totalBadges: number;
  totalBlogs: number;
  totalBookmarks: number;
  currentStreak: number;
  longestStreak: number;
}

interface Achievement {
  id: string;
  badge_name: string;
  badge_description: string | null;
  badge_icon: string | null;
  category: string | null;
  earned_at: string;
}

interface Activity {
  type: string;
  title: string;
  timestamp: string;
}

interface DashboardResponse {
  user: {
    id: string;
    fullName: string | null;
    email: string | null;
  };
  stats: DashboardStats;
  achievements: Achievement[];
  learningProgress: any[];
  activity: Activity[];
  recommendations: any[];
  generatedAt: string;
}

/**
 * Get session token from localStorage
 * Concept: Token Management - Secure token retrieval
 */
function getSessionToken(): string | null {
  return localStorage.getItem('custom_session_token');
}

/**
 * Make authenticated API request to edge function
 * Concept: Higher-Order Function - Generic request wrapper
 */
async function apiRequest<T>(
  functionName: string,
  options: {
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
    body?: any;
  } = {}
): Promise<ApiResponse<T>> {
  const { method = 'GET', body } = options;
  const sessionToken = getSessionToken();

  if (!sessionToken) {
    return { success: false, error: 'Not authenticated' };
  }

  try {
    const { data, error } = await supabase.functions.invoke(functionName, {
      body: method === 'GET' ? undefined : body,
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });

    if (error) {
      console.error(`API ${functionName} error:`, error);
      return { success: false, error: error.message };
    }

    return data as ApiResponse<T>;
  } catch (err: any) {
    console.error(`API ${functionName} exception:`, err);
    return { success: false, error: err.message || 'Request failed' };
  }
}

/**
 * API Methods
 * Concept: Facade Pattern - Simplified interface for complex operations
 */
export const api = {
  /**
   * Get current user profile and preferences
   * GET /api/me
   */
  async getMe(): Promise<ApiResponse<MeResponse>> {
    return apiRequest<MeResponse>('api-me', { method: 'GET' });
  },

  /**
   * Update user profile
   * PATCH /api/me
   */
  async updateMe(updates: {
    fullName?: string;
    preferences?: Partial<UserPreferences>;
  }): Promise<ApiResponse<{ message: string }>> {
    return apiRequest<{ message: string }>('api-me', {
      method: 'PATCH',
      body: updates,
    });
  },

  /**
   * Get dashboard data
   * GET /api/dashboard
   */
  async getDashboard(): Promise<ApiResponse<DashboardResponse>> {
    return apiRequest<DashboardResponse>('api-dashboard', { method: 'GET' });
  },
};

/**
 * React Query keys for cache management
 * Concept: Query Keys - Unique identifiers for cached data
 */
export const queryKeys = {
  me: ['user', 'me'] as const,
  dashboard: ['user', 'dashboard'] as const,
  profile: (userId: string) => ['user', 'profile', userId] as const,
};

/**
 * Hook-friendly API functions with error handling
 * Concept: Custom Hooks Preparation - Functions designed for React Query
 */
export async function fetchMe() {
  const response = await api.getMe();
  if (!response.success || !response.data) {
    throw new Error(response.error || 'Failed to fetch user data');
  }
  return response.data;
}

export async function fetchDashboard() {
  const response = await api.getDashboard();
  if (!response.success || !response.data) {
    throw new Error(response.error || 'Failed to fetch dashboard data');
  }
  return response.data;
}

export async function updateUserProfile(updates: Parameters<typeof api.updateMe>[0]) {
  const response = await api.updateMe(updates);
  if (!response.success) {
    throw new Error(response.error || 'Failed to update profile');
  }
  return response.data;
}
