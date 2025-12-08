/**
 * Dynamic Content System - AuraUp
 * 
 * Concept: Strategy Pattern + Content Variant Pool
 * This module provides fresh, engaging copy on each visit to keep
 * the user experience dynamic and interesting.
 * 
 * Key Features:
 * - Avoids repetition by tracking last-used variants in localStorage
 * - Provides consistent content within a session
 * - Supports forced refresh for testing
 * 
 * Real-world usage: SaaS platforms often A/B test copy variations.
 * This system provides built-in variation without external tools.
 */

import { useState, useEffect } from 'react';

export interface DynamicContentVariant {
  id: string;
  content: string;
}

// ============================================
// CONTENT POOLS - Curated variant collections
// ============================================

const contentPools = {
  // Hero Section Taglines
  heroTagline: [
    'Elevate your skills, transform your career',
    'Unlock your potential, rise above limits',
    'Your journey to excellence starts here',
    'Build your aura, amplify your impact',
    'Master skills that matter, grow without bounds',
    'Where ambition meets achievement',
    'Level up your life, one skill at a time',
    'Ignite your potential, embrace your growth',
  ],

  // Hero Subheadings
  heroSubheading: [
    'Comprehensive learning platform designed to help you master new skills and advance your professional journey.',
    'Join thousands of learners transforming their careers with expert-led courses and hands-on projects.',
    'Discover personalized learning paths that adapt to your goals and accelerate your growth.',
    'Experience the future of education with AI-powered insights and real-world applications.',
    'Build real-world skills through interactive courses, projects, and a supportive community.',
    'Your personal growth companion for mastering skills that matter in today\'s digital world.',
  ],

  // Primary CTA Buttons
  ctaPrimary: [
    'Get Started Free',
    'Start Learning Now',
    'Begin Your Journey',
    'Unlock Your Potential',
    'Join AuraUp Today',
    'Start Your Growth',
    'Dive In Free',
    'Launch Your Path',
  ],

  // Secondary CTA Buttons
  ctaSecondary: [
    'Watch Demo',
    'Explore Courses',
    'See How It Works',
    'Take a Tour',
    'Learn More',
    'Browse Features',
    'View Success Stories',
    'Discover More',
  ],

  // Logo Taglines
  logoTagline: [
    'Rise to Your Potential',
    'Elevate Your Future',
    'Unlock Your Aura',
    'Transform & Transcend',
    'Learn. Grow. Shine.',
    'Your Growth, Amplified',
    'Ascend Beyond Limits',
    'Where Skills Flourish',
  ],

  // Feature Section Headlines
  featureHeadline: [
    'Everything You Need to Succeed',
    'Tools for Your Growth',
    'Your Complete Learning Suite',
    'Powerful Features, Real Results',
    'Built for Your Success',
    'Features That Accelerate Growth',
    'Your Learning Powerhouse',
  ],

  // Feature Section Descriptions
  featureDescription: [
    'Discover a comprehensive suite of tools designed to accelerate your learning and career growth.',
    'Access everything you need to build skills, track progress, and achieve your goals.',
    'From interactive courses to real-time feedback, we\'ve got your growth covered.',
    'Unlock powerful features that make learning engaging, effective, and enjoyable.',
  ],

  // Social Proof Statements
  socialProof: [
    'Trusted by 10,000+ learners worldwide',
    'Join our growing community of achievers',
    'Learn from industry-leading experts',
    'Rated 4.9/5 by our community',
    'Empowering learners in 50+ countries',
    'Over 500+ expert-crafted courses',
    '95% of users report skill improvement',
    'Award-winning learning platform',
  ],

  // Welcome Back Messages (for returning users)
  welcomeBack: [
    'Welcome back to AuraUp',
    'Ready to continue learning?',
    'Great to see you again',
    'Pick up where you left off',
    'Let\'s keep building your skills',
    'Your journey continues here',
    'Ready for your next achievement?',
  ],

  // Testimonial Headlines
  testimonialHeadline: [
    'What Our Learners Say',
    'Success Stories',
    'Voices of Achievement',
    'Community Testimonials',
    'Real Results, Real People',
    'From Our Growing Community',
  ],

  // Testimonial Quotes (can be paired with fictional names)
  testimonialQuotes: [
    'AuraUp transformed how I approach learning. The interactive courses are exactly what I needed.',
    'Finally, a platform that adapts to my pace. I\'ve grown more in 3 months than in 3 years.',
    'The community here is incredible. I\'ve made connections that accelerated my career.',
    'Clean interface, powerful features, and courses that actually teach real skills.',
    'From zero to job-ready in 6 months. AuraUp made it possible.',
    'The best investment I\'ve made in my professional development.',
    'I love how the platform keeps things fresh and engaging every time I log in.',
    'The coding challenges are addictive, and I\'m actually retaining what I learn.',
  ],

  // Course Card CTAs
  courseCardCTA: [
    'Start Learning',
    'Enroll Now',
    'Begin Course',
    'Dive In',
    'Get Started',
    'Start Today',
  ],

  // Dashboard Welcome Messages
  dashboardWelcome: [
    'Welcome to your learning hub',
    'Your progress at a glance',
    'Here\'s how you\'re doing',
    'Your achievement center',
    'Track your growth',
  ],

  // Achievement Celebrations
  achievementCelebration: [
    'Amazing work! Keep pushing forward.',
    'You\'re on fire! Great progress.',
    'Excellent! Your dedication shows.',
    'Fantastic achievement unlocked!',
    'Keep it up! You\'re unstoppable.',
  ],

  // Empty State Messages
  emptyStateMessage: [
    'Ready to start something new?',
    'Your next achievement awaits',
    'Begin your learning adventure',
    'Time to discover something great',
  ],

  // Footer CTAs
  footerCTA: [
    'Ready to level up?',
    'Start your journey today',
    'Join thousands of learners',
    'Your growth starts here',
  ],

  // Blog/ThinkSpace Headlines
  blogHeadline: [
    'Insights & Ideas',
    'Learn. Share. Grow.',
    'Knowledge Hub',
    'Fresh Perspectives',
    'Explore Ideas',
  ],

  // Services Section Headlines
  servicesHeadline: [
    'How We Help You Grow',
    'Our Solutions',
    'Services Built for You',
    'What We Offer',
  ],

  // Services Section Descriptions
  servicesDescription: [
    'Comprehensive solutions designed to accelerate your professional development.',
    'From learning to implementation, we\'re with you every step of the way.',
    'Discover services tailored to your growth goals and career aspirations.',
  ],

  // Loading Messages (shown during async operations)
  loadingMessages: [
    'Preparing your experience...',
    'Loading something great...',
    'Just a moment...',
    'Almost there...',
  ],
};

// ============================================
// PERSISTENCE LAYER
// Concept: LocalStorage as lightweight cache
// ============================================

/**
 * Retrieves the last used content variant for a given key.
 * Uses try-catch for SSR safety and localStorage unavailability.
 */
const getLastUsed = (key: string): string | null => {
  try {
    return localStorage.getItem(`auraup-last-${key}`);
  } catch {
    return null;
  }
};

/**
 * Stores the last used content variant to avoid repetition.
 */
const setLastUsed = (key: string, id: string): void => {
  try {
    localStorage.setItem(`auraup-last-${key}`, id);
  } catch {
    // localStorage unavailable (SSR or privacy mode)
  }
};

// ============================================
// SELECTION ALGORITHM
// Concept: Weighted random with exclusion
// ============================================

/**
 * Selects a random item from the pool, excluding the last used item
 * to provide variety across visits.
 */
function getRandomContent(pool: string[], key: string): string {
  const lastUsed = getLastUsed(key);
  
  // Filter out the last used variant if possible
  const filteredPool = lastUsed 
    ? pool.filter(item => item !== lastUsed) 
    : pool;
  
  // Select from filtered pool, fallback to first item if empty
  const selected = filteredPool[Math.floor(Math.random() * filteredPool.length)] || pool[0];
  
  // Store selection for next visit
  setLastUsed(key, selected);
  
  return selected;
}

// ============================================
// PUBLIC API
// ============================================

/**
 * Main API for retrieving dynamic text content.
 * 
 * @param key - The content category to fetch from
 * @param options - Configuration options
 * @returns A randomly selected content string
 * 
 * Usage:
 * ```tsx
 * const cta = getDynamicText('ctaPrimary');
 * const tagline = getDynamicText('heroTagline', { forceNew: true });
 * ```
 */
export function getDynamicText(
  key: keyof typeof contentPools,
  options?: { forceNew?: boolean }
): string {
  const pool = contentPools[key];
  
  if (!pool || pool.length === 0) {
    console.warn(`[DynamicContent] No content pool found for key: ${key}`);
    return '';
  }
  
  // Force new selection by clearing last used
  if (options?.forceNew) {
    try {
      localStorage.removeItem(`auraup-last-${key}`);
    } catch {}
  }
  
  return getRandomContent(pool, key);
}

/**
 * Gets multiple random items from a content pool.
 * Useful for testimonials, feature lists, etc.
 * 
 * @param key - The content category
 * @param count - Number of items to retrieve
 * @returns Array of unique content strings
 */
export function getDynamicTextMultiple(
  key: keyof typeof contentPools,
  count: number
): string[] {
  const pool = contentPools[key];
  
  if (!pool || pool.length === 0) {
    return [];
  }
  
  // Shuffle and take first N items
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, pool.length));
}

/**
 * Retrieves a complete set of dynamic content for a page load.
 * All content is selected once and remains consistent within the session.
 * 
 * Concept: Facade Pattern - Provides a simplified interface to the
 * content selection system.
 */
export function getDynamicPageContent() {
  return {
    hero: {
      tagline: getDynamicText('heroTagline'),
      subheading: getDynamicText('heroSubheading'),
      ctaPrimary: getDynamicText('ctaPrimary'),
      ctaSecondary: getDynamicText('ctaSecondary'),
    },
    logo: {
      tagline: getDynamicText('logoTagline'),
    },
    features: {
      headline: getDynamicText('featureHeadline'),
      description: getDynamicText('featureDescription'),
    },
    social: {
      proof: getDynamicText('socialProof'),
    },
    testimonials: {
      headline: getDynamicText('testimonialHeadline'),
      quotes: getDynamicTextMultiple('testimonialQuotes', 3),
    },
    services: {
      headline: getDynamicText('servicesHeadline'),
      description: getDynamicText('servicesDescription'),
    },
    blog: {
      headline: getDynamicText('blogHeadline'),
    },
    footer: {
      cta: getDynamicText('footerCTA'),
    },
    dashboard: {
      welcome: getDynamicText('dashboardWelcome'),
    },
    course: {
      cta: getDynamicText('courseCardCTA'),
    },
    empty: {
      message: getDynamicText('emptyStateMessage'),
    },
  };
}

// ============================================
// REACT INTEGRATION
// Concept: Custom Hook Pattern
// ============================================

/**
 * React hook for accessing dynamic content with refresh capability.
 * 
 * Usage:
 * ```tsx
 * function HeroSection() {
 *   const { content, refresh } = useDynamicContent();
 *   
 *   return (
 *     <h1>{content.hero.tagline}</h1>
 *   );
 * }
 * ```
 */
export function useDynamicContent() {
  // Initialize with dynamic content on first render
  const [content, setContent] = useState(() => getDynamicPageContent());
  
  /**
   * Manually refresh all dynamic content.
   * Useful for testing or providing "shuffle" functionality.
   */
  const refresh = () => {
    // Clear all cached selections first
    Object.keys(contentPools).forEach(key => {
      try {
        localStorage.removeItem(`auraup-last-${key}`);
      } catch {}
    });
    
    // Generate new content
    setContent(getDynamicPageContent());
  };
  
  return { content, refresh };
}

/**
 * Hook for single content key access with auto-refresh.
 * 
 * Usage:
 * ```tsx
 * const tagline = useDynamicText('heroTagline');
 * ```
 */
export function useDynamicText(key: keyof typeof contentPools): string {
  const [text, setText] = useState(() => getDynamicText(key));
  
  return text;
}

// Export content pool keys for TypeScript support
export type ContentPoolKey = keyof typeof contentPools;
