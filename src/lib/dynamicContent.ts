// Dynamic Content System - Provides fresh copy on each visit

export interface DynamicContentVariant {
  id: string;
  content: string;
}

// Content pools for dynamic text
const contentPools = {
  heroTagline: [
    'Elevate your skills, transform your career',
    'Unlock your potential, rise above limits',
    'Your journey to excellence starts here',
    'Build your aura, amplify your impact',
    'Master skills that matter, grow without bounds',
  ],
  heroSubheading: [
    'Comprehensive learning platform designed to help you master new skills and advance your professional journey.',
    'Join thousands of learners transforming their careers with expert-led courses and hands-on projects.',
    'Discover personalized learning paths that adapt to your goals and accelerate your growth.',
    'Experience the future of education with AI-powered insights and real-world applications.',
  ],
  ctaPrimary: [
    'Get Started Free',
    'Start Learning Now',
    'Begin Your Journey',
    'Unlock Your Potential',
    'Join AuraUp Today',
  ],
  ctaSecondary: [
    'Watch Demo',
    'Explore Courses',
    'See How It Works',
    'Take a Tour',
    'Learn More',
  ],
  logoTagline: [
    'Rise to Your Potential',
    'Elevate Your Future',
    'Unlock Your Aura',
    'Transform & Transcend',
    'Learn. Grow. Shine.',
  ],
  featureHeadline: [
    'Everything You Need to Succeed',
    'Tools for Your Growth',
    'Your Complete Learning Suite',
    'Powerful Features, Real Results',
  ],
  socialProof: [
    'Trusted by 10,000+ learners worldwide',
    'Join our growing community of achievers',
    'Learn from industry-leading experts',
    'Rated 4.9/5 by our community',
  ],
  welcomeBack: [
    'Welcome back to AuraUp',
    'Ready to continue learning?',
    'Great to see you again',
    'Pick up where you left off',
  ],
};

// Store last used variants to avoid repetition
const getLastUsed = (key: string): string | null => {
  try {
    return localStorage.getItem(`auraup-last-${key}`);
  } catch {
    return null;
  }
};

const setLastUsed = (key: string, id: string): void => {
  try {
    localStorage.setItem(`auraup-last-${key}`, id);
  } catch {
    // localStorage unavailable
  }
};

// Get a random item, avoiding the last used one
function getRandomContent(pool: string[], key: string): string {
  const lastUsed = getLastUsed(key);
  const filteredPool = lastUsed 
    ? pool.filter(item => item !== lastUsed) 
    : pool;
  
  const selected = filteredPool[Math.floor(Math.random() * filteredPool.length)] || pool[0];
  setLastUsed(key, selected);
  return selected;
}

// Main API for getting dynamic text
export function getDynamicText(
  key: keyof typeof contentPools,
  options?: { forceNew?: boolean }
): string {
  const pool = contentPools[key];
  if (!pool || pool.length === 0) {
    return '';
  }
  
  if (options?.forceNew) {
    // Clear last used and get new
    try {
      localStorage.removeItem(`auraup-last-${key}`);
    } catch {}
  }
  
  return getRandomContent(pool, key);
}

// Get all dynamic content for a page load (consistent within session)
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
    },
    social: {
      proof: getDynamicText('socialProof'),
    },
  };
}

// Hook for React components
import { useState, useEffect } from 'react';

export function useDynamicContent() {
  const [content, setContent] = useState(() => getDynamicPageContent());
  
  const refresh = () => {
    setContent(getDynamicPageContent());
  };
  
  return { content, refresh };
}
