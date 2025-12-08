/**
 * User Data Hook
 * 
 * Concept: Custom Hook - Encapsulating stateful logic for reuse
 * Concept: React Query - Server state management with caching
 * Concept: Separation of Concerns - Data fetching isolated from UI
 * 
 * This hook provides:
 * - Automatic data fetching with caching
 * - Loading and error states
 * - Mutation functions for updates
 * - Optimistic updates for better UX
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMe, fetchDashboard, updateUserProfile, queryKeys } from '@/lib/api';
import { useCustomAuth } from './useCustomAuth';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

/**
 * Hook for fetching current user profile and preferences
 * Concept: Query Hook - Declarative data fetching
 */
export function useUserProfile() {
  const { user: customUser } = useCustomAuth();
  const { user: oAuthUser } = useAuth();
  const isAuthenticated = !!(customUser || oAuthUser);

  return useQuery({
    queryKey: queryKeys.me,
    queryFn: fetchMe,
    // Only fetch if user is authenticated with custom auth
    enabled: !!customUser,
    // Cache for 5 minutes
    staleTime: 5 * 60 * 1000,
    // Keep data for 30 minutes
    gcTime: 30 * 60 * 1000,
    // Retry failed requests
    retry: 2,
    // Retry delay with exponential backoff
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for fetching dashboard data
 * Concept: Dashboard Data Hook - Aggregated metrics
 */
export function useDashboardData() {
  const { user: customUser } = useCustomAuth();

  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: fetchDashboard,
    enabled: !!customUser,
    // Dashboard data is relatively stable, cache for 2 minutes
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
}

/**
 * Hook for updating user profile
 * Concept: Mutation Hook - Data modification with side effects
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserProfile,
    // Optimistic update
    // Concept: Optimistic Updates - Update UI before server response
    onMutate: async (newData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.me });

      // Snapshot previous value
      const previousData = queryClient.getQueryData(queryKeys.me);

      // Optimistically update to the new value
      queryClient.setQueryData(queryKeys.me, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          user: {
            ...old.user,
            fullName: newData.fullName ?? old.user.fullName,
          },
          preferences: {
            ...old.preferences,
            ...newData.preferences,
          },
        };
      });

      return { previousData };
    },
    // If mutation fails, roll back
    onError: (err, newData, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKeys.me, context.previousData);
      }
      toast.error('Failed to update profile');
    },
    // Always refetch after success or error
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.me });
    },
    onSuccess: () => {
      toast.success('Profile updated successfully');
    },
  });
}

/**
 * Hook for combined auth state from both providers
 * Concept: Unified Auth State - Single source of truth for auth
 */
export function useCombinedAuth() {
  const customAuth = useCustomAuth();
  const oAuth = useAuth();

  const isAuthenticated = !!(customAuth.user || oAuth.user);
  const isLoading = customAuth.loading || oAuth.loading;
  const user = customAuth.user || oAuth.user;

  const signOut = async () => {
    if (customAuth.user) {
      await customAuth.signOut();
    } else if (oAuth.user) {
      await oAuth.signOut();
    }
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    customUser: customAuth.user,
    oAuthUser: oAuth.user,
    signOut,
    sessionToken: customAuth.sessionToken,
  };
}

/**
 * Hook for prefetching dashboard data
 * Concept: Prefetching - Load data before navigation for instant UX
 */
export function usePrefetchDashboard() {
  const queryClient = useQueryClient();
  const { user: customUser } = useCustomAuth();

  const prefetch = () => {
    if (customUser) {
      queryClient.prefetchQuery({
        queryKey: queryKeys.dashboard,
        queryFn: fetchDashboard,
        staleTime: 2 * 60 * 1000,
      });
    }
  };

  return prefetch;
}
