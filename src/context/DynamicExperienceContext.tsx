import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Theme variants
const themeVariants = [
  {
    id: 'aura-glow',
    name: 'Aura Glow',
    primary: '220 100% 60%',
    accent: '200 100% 55%',
    gradient: 'linear-gradient(135deg, hsl(220 100% 60%), hsl(200 100% 55%))',
  },
  {
    id: 'neo-purple',
    name: 'Neo Purple',
    primary: '270 80% 60%',
    accent: '300 85% 60%',
    gradient: 'linear-gradient(135deg, hsl(270 80% 60%), hsl(300 85% 60%))',
  },
  {
    id: 'sunset-warm',
    name: 'Sunset Warm',
    primary: '25 95% 55%',
    accent: '350 85% 55%',
    gradient: 'linear-gradient(135deg, hsl(25 95% 55%), hsl(350 85% 55%))',
  },
  {
    id: 'ocean-deep',
    name: 'Ocean Deep',
    primary: '195 85% 45%',
    accent: '220 90% 55%',
    gradient: 'linear-gradient(135deg, hsl(195 85% 45%), hsl(220 90% 55%))',
  },
  {
    id: 'forest-calm',
    name: 'Forest Calm',
    primary: '150 60% 40%',
    accent: '170 70% 45%',
    gradient: 'linear-gradient(135deg, hsl(150 60% 40%), hsl(170 70% 45%))',
  },
];

// Layout variants
const layoutVariants = [
  { id: 'classic', heroAlign: 'center', gridCols: 3, spacing: 'normal' },
  { id: 'asymmetric', heroAlign: 'left', gridCols: 2, spacing: 'wide' },
  { id: 'compact', heroAlign: 'center', gridCols: 4, spacing: 'tight' },
  { id: 'editorial', heroAlign: 'right', gridCols: 3, spacing: 'wide' },
];

// Animation presets
const animationPresets = [
  {
    id: 'calm',
    duration: 0.8,
    stagger: 0.15,
    ease: 'power2.out',
    type: 'fade',
    intensity: 0.6,
  },
  {
    id: 'energetic',
    duration: 0.5,
    stagger: 0.08,
    ease: 'power3.out',
    type: 'slide',
    intensity: 1.2,
  },
  {
    id: 'subtle',
    duration: 1.0,
    stagger: 0.2,
    ease: 'power1.out',
    type: 'fade',
    intensity: 0.4,
  },
  {
    id: 'expressive',
    duration: 0.6,
    stagger: 0.1,
    ease: 'elastic.out(1, 0.5)',
    type: 'scale',
    intensity: 1.5,
  },
];

// Tagline variants
const taglineVariants = [
  'Elevate your skills, transform your career',
  'Unlock your potential, rise above limits',
  'Your journey to excellence starts here',
  'Build your aura, amplify your impact',
];

interface DynamicExperienceState {
  theme: typeof themeVariants[0];
  layout: typeof layoutVariants[0];
  animation: typeof animationPresets[0];
  tagline: string;
  isReduced: boolean;
}

interface DynamicExperienceContextType extends DynamicExperienceState {
  regenerate: () => void;
  setThemeById: (id: string) => void;
  setAnimationPreset: (id: string) => void;
  setLayoutVariant: (id: string) => void;
  themes: typeof themeVariants;
  layouts: typeof layoutVariants;
  animations: typeof animationPresets;
}

const DynamicExperienceContext = createContext<DynamicExperienceContextType | null>(null);

function getRandomItem<T>(array: T[], exclude?: T): T {
  const filtered = exclude ? array.filter(item => item !== exclude) : array;
  return filtered[Math.floor(Math.random() * filtered.length)];
}

export function DynamicExperienceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DynamicExperienceState>(() => {
    // Check for reduced motion preference
    const isReduced = typeof window !== 'undefined' 
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
      : false;

    // Get last used variants from storage to avoid repetition
    const lastThemeId = localStorage.getItem('auraup-last-theme');
    const lastLayoutId = localStorage.getItem('auraup-last-layout');
    const lastAnimationId = localStorage.getItem('auraup-last-animation');

    const lastTheme = themeVariants.find(t => t.id === lastThemeId);
    const lastLayout = layoutVariants.find(l => l.id === lastLayoutId);
    const lastAnimation = animationPresets.find(a => a.id === lastAnimationId);

    const newTheme = getRandomItem(themeVariants, lastTheme);
    const newLayout = getRandomItem(layoutVariants, lastLayout);
    const newAnimation = isReduced 
      ? animationPresets.find(a => a.id === 'subtle') || animationPresets[2]
      : getRandomItem(animationPresets, lastAnimation);
    const newTagline = getRandomItem(taglineVariants);

    // Store new selections
    localStorage.setItem('auraup-last-theme', newTheme.id);
    localStorage.setItem('auraup-last-layout', newLayout.id);
    localStorage.setItem('auraup-last-animation', newAnimation.id);

    return {
      theme: newTheme,
      layout: newLayout,
      animation: newAnimation,
      tagline: newTagline,
      isReduced,
    };
  });

  // Apply theme CSS variables
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--dynamic-primary', state.theme.primary);
    root.style.setProperty('--dynamic-accent', state.theme.accent);
    root.style.setProperty('--dynamic-gradient', state.theme.gradient);
    root.style.setProperty('--dynamic-animation-duration', `${state.animation.duration}s`);
    root.style.setProperty('--dynamic-animation-intensity', `${state.animation.intensity}`);
  }, [state.theme, state.animation]);

  // Listen for reduced motion changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => {
      setState(prev => ({
        ...prev,
        isReduced: e.matches,
        animation: e.matches 
          ? animationPresets.find(a => a.id === 'subtle') || animationPresets[2]
          : prev.animation,
      }));
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const regenerate = () => {
    const newTheme = getRandomItem(themeVariants, state.theme);
    const newLayout = getRandomItem(layoutVariants, state.layout);
    const newAnimation = state.isReduced 
      ? state.animation 
      : getRandomItem(animationPresets, state.animation);
    const newTagline = getRandomItem(taglineVariants, state.tagline);

    localStorage.setItem('auraup-last-theme', newTheme.id);
    localStorage.setItem('auraup-last-layout', newLayout.id);
    localStorage.setItem('auraup-last-animation', newAnimation.id);

    setState(prev => ({
      ...prev,
      theme: newTheme,
      layout: newLayout,
      animation: newAnimation,
      tagline: newTagline,
    }));
  };

  const setThemeById = (id: string) => {
    const theme = themeVariants.find(t => t.id === id);
    if (theme) {
      setState(prev => ({ ...prev, theme }));
      localStorage.setItem('auraup-last-theme', id);
    }
  };

  const setAnimationPreset = (id: string) => {
    const animation = animationPresets.find(a => a.id === id);
    if (animation) {
      setState(prev => ({ ...prev, animation }));
      localStorage.setItem('auraup-last-animation', id);
    }
  };

  const setLayoutVariant = (id: string) => {
    const layout = layoutVariants.find(l => l.id === id);
    if (layout) {
      setState(prev => ({ ...prev, layout }));
      localStorage.setItem('auraup-last-layout', id);
    }
  };

  return (
    <DynamicExperienceContext.Provider
      value={{
        ...state,
        regenerate,
        setThemeById,
        setAnimationPreset,
        setLayoutVariant,
        themes: themeVariants,
        layouts: layoutVariants,
        animations: animationPresets,
      }}
    >
      {children}
    </DynamicExperienceContext.Provider>
  );
}

export function useDynamicExperience() {
  const context = useContext(DynamicExperienceContext);
  if (!context) {
    throw new Error('useDynamicExperience must be used within DynamicExperienceProvider');
  }
  return context;
}
